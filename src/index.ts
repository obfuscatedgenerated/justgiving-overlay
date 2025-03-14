import "@fontsource-variable/open-sans";
import "./index.css";

import {get_donations, get_fundraiser_details, set_app_id} from "./api";
import {update_whole_ui} from "./ui";
import {load_sfx_bank, play_sfx, play_tts} from "./sfx";

const REFRESH_INTERVAL = 15 * 1000;

let use_sfx = false;
let last_donation_id: number | null = null;

const main = async () => {
    const query = new URLSearchParams(window.location.search);

    const app_id = query.get("app_id");
    const fundraiser_slug = query.get("fundraiser_slug");

    use_sfx = (load_sfx_bank().length > 0) || query.has("tts");

    if (!app_id || !fundraiser_slug) {
        document.body.innerText = `Missing url parameters: ${app_id ? "" : "app_id"} ${fundraiser_slug ? "" : "fundraiser_slug"}`;
        return;
    }

    set_app_id(app_id!);

    const fundraiser = await get_fundraiser_details(fundraiser_slug!);

    // check if document already loaded
    if (document.readyState === "complete") {
        loaded(fundraiser);
        return;
    }

    // wait for document to load otherwise
    document.addEventListener("DOMContentLoaded", () => loaded(fundraiser));
}

const loaded = async (init_fundraiser: FundraiserDetails) => {
    // delete privacy policy overlay (ollieg.codes)
    const overlay = document.querySelector(".zaraz-privacy");

    if (overlay) {
        overlay.remove();
    }

    if (use_sfx) {
        // get the newest donation id so we don't play through all the old ones
        const donations = await get_donations(init_fundraiser.pageShortName);

        if (donations.length > 0) {
            last_donation_id = donations[0].id;
            console.log("Last donation id:", last_donation_id);
        }
    }

    await update_whole_ui(init_fundraiser);

    const slug = init_fundraiser.pageShortName;

    let prev_raised = init_fundraiser.grandTotalRaisedExcludingGiftAid;

    setInterval(async () => {
        console.log("Refreshing...");
        const fundraiser = await get_fundraiser_details(slug);

        if (fundraiser.grandTotalRaisedExcludingGiftAid < prev_raised) {
            console.log("Raised amount decreased (cache issue), ignoring...");
            return;
        }

        // save dono details to pass to ui function conditionally, so we don't have to fetch it again if showing donations
        let donation_details: DonationDetails[] | undefined;
        if (use_sfx) {
            donation_details = await get_donations(slug);
            enqueue_all_sfx(donation_details);
        }

        prev_raised = fundraiser.grandTotalRaisedExcludingGiftAid;

        update_whole_ui(fundraiser, donation_details);

        // could get just donation details and only update that part of the UI
        // could also reuse that to show recent donations in real time
    }, REFRESH_INTERVAL);
}

let sfx_queue: DonationDetails[] = [];
let queue_playing = false;

const enqueue_all_sfx = async (donations: DonationDetails[]) => {
    // plays all sfx for any new donations recieved in order

    const actual_donations: DonationDetails[] = [];

    for (const donation of donations) {
        // if we've seen this donation before, anything past this is old
        if (donation.id === last_donation_id) {
            break;
        }

        last_donation_id = donation.id;
        actual_donations.push(donation);
    }

    // reverse so we play the oldest donation first
    actual_donations.reverse();

    // add to queue
    sfx_queue.push(...actual_donations);
    console.log("Queue:", sfx_queue);

    // if not already playing, start playing
    if (!queue_playing) {
        console.log("Starting queue...");
        queue_playing = true;
        sfx_dequeuer(sfx_queue[0]);
    }
}

const sfx_dequeuer = async (donation: DonationDetails) => {
    console.log("Playing sfx for donation:", donation);
    await play_sfx(donation.amount);

    if (donation.message) {
        // TODO: optional minimum price for TTS
        await play_tts(donation.message);
    }

    // remove from queue
    sfx_queue.shift();

    // recursively call to play next sfx in queue
    if (sfx_queue.length > 0) {
        sfx_dequeuer(sfx_queue[0]);
    } else {
        queue_playing = false;
        console.log("Queue finished");
    }
}

main();
