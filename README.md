# JustGiving Overlay

A simple overlay to use with your favourite streaming software to show the progress of your JustGiving fundraiser.

Note: this is a personal project and is not affiliated with JustGiving.

[![demo image](https://github.com/user-attachments/assets/3a864967-85e9-4a89-b5a2-57fe916cde6f)](https://ollieg.codes/justgiving-overlay/?app_id=YOURID&fundraiser_slug=page/romesh2025&no_avatar&no_charity_details)

## Using the hosted instance

1. Get an app ID from JustGiving by registering an app at https://developer.justgiving.com/
2. Open your streaming software and add a new browser source with the URL `https://ollieg.codes/justgiving-overlay?app_id=YOURID&fundraiser_slug=YOURSLUG`
    replacing `YOURID` with the app ID you got from JustGiving and `YOURSLUG` with the slug of the fundraiser you want to track (e.g. page/MyFundraiser-12345678)
3. Adjust the width and height of the browser source to fit your stream layout (not the render size, best to leave that at 800x600)

## Customising

### Removal flags

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

If the overlay will be on a particular bright background, it might be a good idea to add a semi-transparent black background behind overlay to make the text more readable.

Note that I haven't tested all combinations of these flags, so some may not work as expected. Feel free to submit a PR.

I also haven't tested every window size possible.

### Background image overrude and progress bar colour

You can override the background image by passing a URL in the URL as the `bg_url` param, e.g. `https://ollieg.codes/justgiving-overlay?app_id=YOURID&fundraiser_slug=YOURSLUG&bg_url=https://example.com/image.jpg` will use the image at `https://example.com/image.jpg` as the background. Note the `no_background` flag overrules this parameter.

The colour of the progress bar will use the best colour of your fundraiser's branding, but you can force the colour by passing a hex code in the URL as the `progress_colour` param **WITH NO #**, e.g. `https://ollieg.codes/justgiving-overlay?app_id=YOURID&fundraiser_slug=YOURSLUG&progress_colour=ff0000` will make the progress bar red.

### NEW! Widget parameter

You can pass a `widget` parameter. The default is `progress` but you can also use `donations` to show the most recent donations made and their messages.

The donation widget fits the full frame so you can use any size you like. I recommend using less width than height. Make sure you set this on the properties and not crop the element to ensure the culling of donation boxes works properly.

### NEW! TTS

You can add the `tts` flag to enable TTS reading of donation messages!

Note: if you are using multiple instances of the overlay, only one should have TTS enabled to prevent overlapping speech.

### NEW! Sound effects

You can pass sound effects, with the parameters `sfx_n=url` where n is the pre-decimal value which if a donation exceeds it, the sound at url will play. Only the highest value n will play a sound

e.g.

```
...
&sfx_0=https://example.com/sound1.mp3
&sfx_5=https://example.com/sound2.mp3
&sfx_50=https://example.com/sound3.mp3
```

£1 donation will play sound1.mp3

£5 donation will play sound2.mp3

£100 donation will play sound3.mp3

Note: if you are using multiple instances of the overlay, only one should have sound effects defined to prevent overlapping sounds.

## Installation (Local)

1. Get an app ID from JustGiving by registering an app at https://developer.justgiving.com/
2. Clone this repository
3. Install the dependencies with `npm install`
4. Use webpack dev server to run the overlay with `npm start` (or use `npm dev-server` for a private server)
5. Open your streaming software and add a new browser source with the URL `http://localhost:3000?app_id=YOURID&fundraiser_slug=YOURSLUG`
    replacing `YOURID` with the app ID you got from JustGiving and `YOURSLUG` with the slug of the fundraiser you want to track (e.g. page/MyFundraiser-12345678)
6. Adjust the width and height of the browser source to fit your stream layout (not the render size, best to leave that at 800x600)
7. The server will hot reload to any changes you make to the code (with both `npm start` and `npm dev-server`)

## Deployment (repo editors only)

Changes to the hosted version must be deployed manually. To do this:

1. Follow the local installation steps and ensure everything is working as expected
2. Run `npm run deploy` to build the project and deploy it to the `gh-pages` branch
3. If you use a signing key, you will need to enter your password when prompted
4. The changes should be live at `https://ollieg.codes/justgiving-overlay?app_id=YOURID&fundraiser_slug=YOURSLUG` within a minute or two (clear your cache)
