interface CharityDetails {
    name: string;
    description: string;
    registrationNumber: string;
    logoAbsoluteUrl: string;
}

interface FundraiserDetails {
    // only partial, for what we need

    charity: CharityDetails;

    owner: string;
    ownerProfileImageUrls: {
        OriginalSize: string;
        Size150x150Face: string;
    };

    image: {
        absoluteUrl: string;
    }

    eventName: string;

    currencySymbol: string;

    fundraisingTarget: number;
    grandTotalRaisedExcludingGiftAid: number;
}