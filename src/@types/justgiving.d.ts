interface FundraiserDetails {
    // only partial, for what we need
    charity: {
        name: string;
        description: string;
        registrationNumber: string;
    };
    eventName: string;
    currencySymbol: string;
    fundraisingTarget: number;
    grandTotalRaisedExcludingGiftAid: number;
}
