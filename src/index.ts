import "@fontsource-variable/open-sans";
import "./index.css";

import {get_fundraiser_details, set_app_id} from "./api";
import {update_whole_ui} from "./ui";

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
        update_whole_ui(fundraiser);
        return;
    }

    // wait for document to load otherwise
    document.addEventListener("DOMContentLoaded", () => {
        update_whole_ui(fundraiser);
    });
}

main();

// TODO: refresh on interval
// TODO: styling
// TODO: recent donor list
