const API_BASE = __MODE__ === "development" ? "https://api.justgiving.com/" : "https://api.justgiving.com/";
// used to use api.sandbox.justgiving.com but it's not up anymore

let app_id = "";

export const set_app_id = (id: string) => {
    app_id = id;
}

export const from_api_base = (path: string) => {
    if (app_id === "") {
        throw new Error("app_id not set");
    }

    return `${API_BASE}${app_id}/${path}`;
}

export const get_default_headers = () => {
    return {
        "Content-Type": "application/json",
        "Accept": "application/json",
    };
}

export const get_fundraiser_details = async (fundraiser_slug: string): Promise<FundraiserDetails> => {
    const response = await fetch(from_api_base(`v1/fundraising/pages/${fundraiser_slug}`), {
        headers: get_default_headers(),
    });

    const json = await response.json();

    // cast numerical types to numbers
    json.fundraisingTarget = parseFloat(json.fundraisingTarget);
    json.grandTotalRaisedExcludingGiftAid = parseFloat(json.grandTotalRaisedExcludingGiftAid);

    return json;
}
