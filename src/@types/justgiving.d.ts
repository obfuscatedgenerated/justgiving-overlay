interface CharityDetails {
    name: string;
    description: string;
    registrationNumber: string;
    logoAbsoluteUrl: string;
}

interface FundraiserDetails {
    // only partial, for what we need

    charity: CharityDetails;

    pageShortName: string;

    owner: string;
    ownerProfileImageUrls: {
        OriginalSize: string;
        Size150x150Face: string;
    };

    image: {
        absoluteUrl: string;
    }

    branding: {
        buttonColour: string;
        buttonTextColour: string;
        thermometerFillColour: string;
    }

    eventName: string;
    title: string;

    currencySymbol: string;

    fundraisingTarget: number;
    grandTotalRaisedExcludingGiftAid: number;
}