import {Howl} from "howler";
import {tts_url} from "./api";

// in the url parameters, we have sfx_n=url where n is the pre-decimal value which if a donation exceeds it, the sound at url will play
// only the highest value n will play a sound
// e.g.
// sfx_0=https://example.com/sound1.mp3
// sfx_5=https://example.com/sound2.mp3
// sfx_50=https://example.com/sound3.mp3
// £1 donation will play sound1.mp3
// £5 donation will play sound2.mp3
// £100 donation will play sound3.mp3

const sfx_bank = new Map<number, Howl>();
let sfx_keys: number[] = [];

export const load_sfx_bank = () => {
    const params = new URLSearchParams(window.location.search);

    for (const [key, value] of params) {
        if (key.startsWith("sfx_")) {
            const n = parseInt(key.slice(4));
            sfx_bank.set(n, new Howl({
                src: [value],
            }));
        }
    }

    // load sfx_keys with the keys in descending order for quicker lookup
    sfx_keys = Array.from(sfx_bank.keys()).sort((a, b) => b - a);

    return sfx_keys;
}

export const play_sfx = (amount: number) => {
    return new Promise<void>((resolve) => {
        // find highest key that is less than or equal to amount
        for (const key of sfx_keys) {
            if (amount >= key) {
                const sfx = sfx_bank.get(key);

                if (sfx) {
                    // check if sound load failed
                    if (sfx.state() === "unloaded") {
                        console.error("Sound failed to load for sfx_" + key);
                        resolve();
                        return;
                    }

                    sfx.once("end", () => resolve());
                    sfx.play();
                    return;
                }
            }
        }

        resolve();
    });
}

export const play_tts = async (text: string) => {
    return new Promise<void>((resolve) => {
        const url = tts_url(text);

        // will be streamed
        const sound = new Howl({
            src: [url],
            html5: true
        });

        sound.once("end", () => resolve());
        sound.play();
    });
}
