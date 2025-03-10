# JustGiving Overlay

A simple overlay to use with your favourite streaming software to show the progress of your JustGiving fundraiser.

Note: this is a personal project and is not affiliated with JustGiving.

## Using the hosted instance

1. Get an app ID from JustGiving by registering an app at https://developer.justgiving.com/
2. Open your streaming software and add a new browser source with the URL `https://ollieg.codes/justgiving-overlay?app_id=YOURID&fundraiser_slug=YOURSLUG`
    replacing `YOURID` with the app ID you got from JustGiving and `YOURSLUG` with the slug of the fundraiser you want to track (e.g. page/MyFundraiser-12345678)
3. Adjust the width and height of the browser source to fit your stream layout

## Customising

You can remove certain elements by passing flags in the URL, e.g. `https://ollieg.codes/justgiving-overlay?app_id=YOURID&fundraiser_slug=YOURSLUG&no_charity_details` will hide the charity details.

The available flags are:
- `no_charity_details`: Hides the charity details
- `no_event_name`: Hides the event name
- `no_charity_name`: Hides the charity name
- `no_charity_description`: Hides the charity description
- `no_charity_number`: Hides the charity number
- `charity_details_row`: Forces the charity details to be displayed in a row
- `no_background`: Hides the background image, making the widget transparent
- `no_avatar`: Hides the fundraiser owner's avatar

I recommend passing `no_charity_details` and `no_avatar` for a compact overlay, optionally with `no_background` for a transparent overlay.

Note that I haven't tested all combinations of these flags, so some may not work as expected. Feel free to submit a PR.

## Installation (Local)

1. Get an app ID from JustGiving by registering an app at https://developer.justgiving.com/
2. Clone this repository
3. Install the dependencies with `npm install`
4. Use webpack dev server to run the overlay with `npm start` (or use `npm dev-server` for a private server)
5. Open your streaming software and add a new browser source with the URL `http://localhost:3000?app_id=YOURID&fundraiser_slug=YOURSLUG`
    replacing `YOURID` with the app ID you got from JustGiving and `YOURSLUG` with the slug of the fundraiser you want to track (e.g. page/MyFundraiser-12345678)
6. Adjust the width and height of the browser source to fit your stream layout
7. The server will hot reload to any changes you make to the code (with both `npm start` and `npm dev-server`)

## Deployment (repo editors only)

Changes to the hosted version must be deployed manually. To do this:

1. Follow the local installation steps and ensure everything is working as expected
2. Run `npm run deploy` to build the project and deploy it to the `gh-pages` branch
3. If you use a signing key, you will need to enter your password when prompted
4. The changes should be live at `https://ollieg.codes/justgiving-overlay?app_id=YOURID&fundraiser_slug=YOURSLUG` within a minute or two (clear your cache)
