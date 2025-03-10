import {get_fundraiser_details, set_app_id} from "./api";

const event_name = document.querySelector("#event-name") as HTMLParagraphElement;
const progress_bar = document.querySelector("#progress-bar") as HTMLProgressElement;

const raised_text = document.querySelector("#raised-text") as HTMLSpanElement;
const goal_text = document.querySelector("#goal-text") as HTMLSpanElement;
const percent_text = document.querySelector("#percent-text") as HTMLSpanElement;

enum CurrencyDropDecimals {
    Never,
    IfWhole,
    Always
}

const main = async () => {
    const query = new URLSearchParams(window.location.search);

    const app_id = query.get("app_id");
    const fundraiser_slug = query.get("fundraiser_slug");

    if (!app_id || !fundraiser_slug) {
        document.body.innerText = `Missing url parameters: ${app_id ? "" : "app_id"} ${fundraiser_slug ? "" : "fundraiser_slug"}`;
    }

    set_app_id(app_id!);

    const fundraiser = await get_fundraiser_details(fundraiser_slug!);

    event_name.innerText = fundraiser.eventName;

    progress_bar.value = fundraiser.grandTotalRaisedExcludingGiftAid;
    progress_bar.max = fundraiser.fundraisingTarget;

    const as_currency = (amount: number, drop_decimals = CurrencyDropDecimals.Never) => {
        const places = drop_decimals ? 0 : 2;
        return `${fundraiser.currencySymbol}${amount.toFixed(places)}`;
    }

    const percentage = (fundraiser.grandTotalRaisedExcludingGiftAid / fundraiser.fundraisingTarget) * 100;

    raised_text.innerText = as_currency(fundraiser.grandTotalRaisedExcludingGiftAid, CurrencyDropDecimals.IfWhole);
    goal_text.innerText = as_currency(fundraiser.fundraisingTarget, CurrencyDropDecimals.IfWhole);
    percent_text.innerText = `${percentage.toFixed(1)}`;
}

main();

// TODO: refresh on interval
// TODO: styling
// TODO: recent donor list
