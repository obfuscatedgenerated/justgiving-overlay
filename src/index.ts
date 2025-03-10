import "@fontsource-variable/open-sans";
import "./index.css";

import {get_fundraiser_details, set_app_id} from "./api";
import {update_whole_ui} from "./ui";

const REFRESH_INTERVAL = 15 * 1000;

const main = async () => {
    const query = new URLSearchParams(window.location.search);

    const app_id = query.get("app_id");
    const fundraiser_slug = query.get("fundraiser_slug");

    if (!app_id || !fundraiser_slug) {
        document.body.innerText = `Missing url parameters: ${app_id ? "" : "app_id"} ${fundraiser_slug ? "" : "fundraiser_slug"}`;
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

const loaded = (init_fundraiser: FundraiserDetails) => {
    update_whole_ui(init_fundraiser);

    const slug = init_fundraiser.pageShortName;

    setInterval(async () => {
        console.log("Refreshing...");
        const fundraiser = await get_fundraiser_details(slug);
        update_whole_ui(fundraiser);

        // could get just donation details and only update that part of the UI
        // could also reuse that to show recent donations in real time
    }, REFRESH_INTERVAL);
}

main();

// TODO: recent donor list
