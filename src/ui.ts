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

    name.innerText = charity.name;
    description.innerText = charity.description;

    if (charity.registrationNumber) {
        number.innerText = `Registered charity number: ${charity.registrationNumber}`;
    }
}

export const update_progress = (raised: number, goal: number) => {
    const progress_bar = $("#progress-bar") as HTMLProgressElement;

    const raised_text = $("#raised-text") as HTMLElement;
    const goal_text = $("#goal-text") as HTMLElement;
    const percent_text = $("#percent-text") as HTMLElement

    progress_bar.value = raised;
    progress_bar.max = goal;

    const percentage = (raised / goal) * 100;

    raised_text.innerText = as_currency(raised, CurrencyDropDecimals.IfWhole);
    goal_text.innerText = as_currency(goal, CurrencyDropDecimals.IfWhole);
    percent_text.innerText = `${percentage.toFixed(1)}`;
}


export const update_whole_ui = (fundraiser: FundraiserDetails) => {
    set_currency_symbol(fundraiser.currencySymbol);

    update_owner_avatar(fundraiser.owner, fundraiser.ownerProfileImageUrls.Size150x150Face);

    update_event_name(fundraiser.eventName);

    if (fundraiser.charity) {
        update_charity_details(fundraiser.charity);
    }

    update_progress(fundraiser.grandTotalRaisedExcludingGiftAid, fundraiser.fundraisingTarget);
}
