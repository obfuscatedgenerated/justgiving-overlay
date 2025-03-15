import Color from "color";
import {get_donations} from "./api";

// config from search params
const params = new URLSearchParams(window.location.search);
const no_event_name = params.has("no_event_name") || false;
const no_charity_name = params.has("no_charity_name") || false;
const no_charity_description = params.has("no_charity_description") || false;
const no_charity_number = params.has("no_charity_number") || false;
const charity_details_row = params.has("charity_details_row") || false;
const no_charity_details = params.has("no_charity_details") || false;
const no_background = params.has("no_background") || false;
const no_avatar = params.has("no_avatar") || false;

const widget = params.get("widget") || "progress";

// a little convenience function to give a shorter, cacheable way to get elements to reduce searching the DOM
const elements_cache: { [selector: string]: Element | null } = {};
const $ = (selector: string) => {
    if (!elements_cache[selector]) {
        elements_cache[selector] = document.querySelector(selector);
    }
    return elements_cache[selector];
}


let currency_symbol = "£";
export const set_currency_symbol = (symbol: string) => {
    currency_symbol = symbol;
}


enum CurrencyDropDecimals {
    Never,
    IfWhole,
    Always
}

// convenience function to format currency a specific way using the stored currency symbol
export const as_currency = (amount: number, drop_decimals = CurrencyDropDecimals.Never) => {
    const places = drop_decimals ? 0 : 2;
    return `${currency_symbol}${amount.toFixed(places)}`;
}


export const update_owner_avatar = (owner_name: string, avatar_small_url: string) => {
    const owner_avatar = $("#owner-avatar") as HTMLImageElement;

    owner_avatar.src = avatar_small_url;
    owner_avatar.alt = `Avatar for ${owner_name}`;
}

export const update_event_name = (name: string) => {
    const event_name = $("#event-name") as HTMLElement;
    event_name.innerText = name;
}

export const update_charity_details = (charity: CharityDetails) => {
    const logo = $("#charity-logo") as HTMLImageElement;
    const name = $("#charity-name") as HTMLElement;
    const description = $("#charity-desc") as HTMLElement;
    const number = $("#charity-number") as HTMLElement;

    logo.src = charity.logoAbsoluteUrl;
    logo.alt = `Logo for ${charity.name}`;

    if (no_charity_name) {
        if (name) {
            name.remove();
        }
    } else {
        name.innerText = charity.name;
    }

    if (no_charity_description) {
        if (description) {
            description.remove();
        }
    } else {
        description.innerText = charity.description;
    }

    if (!no_charity_number && charity.registrationNumber) {
        number.innerText = `Registered charity number: ${charity.registrationNumber}`;
    } else {
        number.remove();
    }

    if (charity_details_row) {
        const details = $("#charity-details") as HTMLElement;
        details.style.flexDirection = "row";
        details.style.justifyContent = "space-between";
    }
}

export const update_progress = (raised: number, goal: number, colour: string) => {
    const progress_bar = $("#progress-bar") as HTMLProgressElement;

    const raised_text = $("#raised-text") as HTMLElement;
    const goal_text = $("#goal-text") as HTMLElement;
    const percent_text = $("#percent-text") as HTMLElement;

    document.documentElement.style.setProperty("--progress-color", colour);

    progress_bar.value = raised;
    progress_bar.max = goal;

    const percentage = (raised / goal) * 100;

    raised_text.innerText = as_currency(raised, CurrencyDropDecimals.IfWhole);
    goal_text.innerText = as_currency(goal, CurrencyDropDecimals.IfWhole);
    percent_text.innerText = `${percentage.toFixed(1)}`;

    if (percentage >= 100) {
        progress_bar.classList.add("complete");
    }
}

export const update_donations = (donations: DonationDetails[]) => {
    // could be faster to only get new donos?

    // donations should only be latest page so should be only latest 25
    const donation_list = $("#donation-list") as HTMLElement;

    donation_list.innerHTML = "";

    for (let donation of donations) {
        const donation_item = document.createElement("li");
        donation_item.classList.add("donation");

        const donation_top = document.createElement("div");
        donation_top.classList.add("donation-top");

        const donor_name = document.createElement("span");
        donor_name.classList.add("donor-name");
        donor_name.innerText = donation.donorDisplayName;
        donation_top.appendChild(donor_name);

        const donation_amount = document.createElement("span");
        donation_amount.classList.add("donation-amount");

        if (donation.amount) {
            donation_amount.innerText = as_currency(donation.amount);
        } else {
            donation_amount.innerHTML = "<i>(hidden)</i>";
        }

        donation_top.appendChild(donation_amount);

        donation_item.appendChild(donation_top);

        if (donation.message) {
            const donation_message = document.createElement("p");
            donation_message.classList.add("donation-message");
            donation_message.innerText = donation.message;

            donation_item.appendChild(donation_message);
        }

        donation_list.appendChild(donation_item);

        // check if the donation list is breaking out the window
        if (donation_list.scrollHeight > window.innerHeight) {
            // only showing whole boxes, remove last one and break out of loop
            donation_item.remove();
            break;
        }
    }
}

export const update_background_image = (url?: string) => {
    const bg = $("#bg-container") as HTMLElement;
    const main = $("main") as HTMLElement;

    if (!url) {
        bg.style.backgroundImage = "none";
        main.style.backdropFilter = "";
        return;
    }

    bg.style.backgroundImage = `url(${url})`;
    main.style.backdropFilter = "blur(5px) brightness(0.7)";
}

let newest_donation_date: Date | null = null;

export const update_whole_ui = async (fundraiser: FundraiserDetails, donations?: DonationDetails[]) => {
    set_currency_symbol(fundraiser.currencySymbol);

    if (!no_avatar) {
        update_owner_avatar(fundraiser.owner, fundraiser.ownerProfileImageUrls.Size150x150Face);
    } else {
        const avatar = $("#owner-avatar") as HTMLElement;
        avatar.remove();
    }

    update_background_image(no_background ? undefined : params.get("bg_url") || fundraiser.image.absoluteUrl);

    if (!no_event_name) {
        update_event_name(fundraiser.eventName || fundraiser.title);
    } else {
        const event_name = $("#event-name") as HTMLElement;
        event_name.remove();
    }

    if (!no_charity_details && fundraiser.charity) {
        update_charity_details(fundraiser.charity);
    } else {
        const charity = $("#charity-details") as HTMLElement;
        charity.remove();
    }

    // prefer url param progress_colour over thermometerFillColour over buttonColour over buttonTextColour over a default white
    let fundraiser_colour = fundraiser.branding.thermometerFillColour || fundraiser.branding.buttonColour || fundraiser.branding.buttonTextColour || "#fff";


    let fundraiser_colour_parse = Color(fundraiser_colour);

    // force saturation of at least 75%
    if (fundraiser_colour_parse.saturationl() < 0.75) {
        fundraiser_colour_parse = fundraiser_colour_parse.saturate(0.75);
    }

    // if fundraiser colour is low luminosity, increase it
    const fundraiser_colour_luminosity = fundraiser_colour_parse.luminosity();
    if (fundraiser_colour_luminosity < 0.4) {
        fundraiser_colour_parse = fundraiser_colour_parse.lighten(0.8 - fundraiser_colour_luminosity);
    }

    fundraiser_colour = fundraiser_colour_parse.hex();

    // if a progress_colour is set, it overrides the fundraiser colour generated above
    let progress_colour = params.get("progress_colour") || fundraiser_colour;

    if (!progress_colour.startsWith("#")) {
        progress_colour = `#${progress_colour}`;
    }

    const progress_colour_parse = Color(progress_colour);

    // generate the background colour based on the progress colour
    const bg_colour = progress_colour_parse.darken(0.75).hex();
    document.documentElement.style.setProperty("--progress-bg-color", bg_colour);

    if (widget === "progress" && no_background) {
        // generate the text colour based on the progress colour
        const text_colour = progress_colour_parse.darken(0.2).saturate(0.85);

        document.documentElement.style.setProperty("--text-color", text_colour.hex());

        // and the text shadow colour to add a neon effect without being too harsh
        const text_shadow_colour = text_colour.darken(0.5).alpha(0.6).hexa();
        document.documentElement.style.setProperty("--text-shadow-color", text_shadow_colour);
    } else {
        console.log("No background or using donations widget, keeping text white");
        // if there will be background or using donations widget, dont do text color, keep it white and the backdrop filter will make it readable
        document.documentElement.style.setProperty("--text-color", "#fff");
        document.documentElement.style.setProperty("--text-shadow-color", "transparent");
    }

    const progress_details = $("#progress-details") as HTMLElement;
    const donation_details = $("#donation-details") as HTMLElement;
    const main = $("main") as HTMLElement;

    switch (widget.toLowerCase()) {
        case "progress":
            donation_details.remove();
            update_progress(fundraiser.grandTotalRaisedExcludingGiftAid, fundraiser.fundraisingTarget, progress_colour);
            break;
        case "donations":
            progress_details.remove();

            // make body background fit screen
            main.style.height = "100vh";
            main.style.width = "100vw";

            // remove padding from main
            main.style.padding = "0";

            if (!donations) {
                // if we didn't get passed donations, fetch them
                donations = await get_donations(fundraiser.pageShortName);
            }

            // make sure that there are new donations
            // sometimes the api returns new donations, then the next call will be cached and not return new ones, its a weird bug
            // TODO: unite this with seen_ids in index.ts, could make it part of api.ts
            let latest_date_of_donations = donations[0].donationDate;
            if (newest_donation_date && latest_date_of_donations <= newest_donation_date) {
                console.log("No new donations (prevent cache issue), ignoring...");
                return;
            }

            newest_donation_date = latest_date_of_donations;
            update_donations(donations);
            break;
        default:
            console.error(`Unknown widget type: ${widget}`);
            break;
    }

}
