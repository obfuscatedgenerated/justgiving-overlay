# JustGiving Overlay

A simple overlay to use with your favourite streaming software to show the progress of your JustGiving fundraiser.

## Using the hosted instance

1. Get an app ID from JustGiving by registering an app at https://developer.justgiving.com/
2. Open your streaming software and add a new browser source with the URL `https://ollieg.codes/justgiving-overlay?app_id=YOURID&fundraiser_slug=YOURSLUG
    replacing `YOURID` with the app ID you got from JustGiving and `YOURSLUG` with the slug of the fundraiser you want to track (e.g. page/MyFundraiser-12345678)
3. Adjust the width and height of the browser source to fit your stream layout

## Installation (Local)

1. Get an app ID from JustGiving by registering an app at https://developer.justgiving.com/
2. Clone this repository
3. Install the dependencies with `npm install`
4. Use webpack dev server to run the overlay with `npm start` (or use `npm dev-server` for a private server)
5. Open your streaming software and add a new browser source with the URL `http://localhost:3000?app_id=YOURID&fundraiser_slug=YOURSLUG
    replacing `YOURID` with the app ID you got from JustGiving and `YOURSLUG` with the slug of the fundraiser you want to track (e.g. page/MyFundraiser-12345678)
6. Adjust the width and height of the browser source to fit your stream layout