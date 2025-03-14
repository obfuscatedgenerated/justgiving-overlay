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

interface DonationDetails {
    // full donation array entry

    amount: number | null; // null if donation amount hidden
    currencyCode: string;
    donationDate: Date;
    donorDisplayName: string;
    donorLocalAmount: number;
    donorLocalCurrencyCode: string;
    donorRealName: string;
    estimatedTaxReclaim: number;
    id: number;
    image: string;
    message: string;
    source: string;
    status: string;
    thirdPartyReference: string;
    charityId: number;
}
