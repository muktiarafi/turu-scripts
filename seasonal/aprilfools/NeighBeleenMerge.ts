/*
name: NeighBeleen Merge
description: This script farms all the materials needed for NeighBeleen Merge in magicmeaderp.
tags: seasonal, april fools, magicmeaderp, neighbeleen, merge
*/
// Port of Scripts/Seasonal/AprilFools/NeighBeleenMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { Magicmeadow } from "./Magicmeadow";

const Adv = new CoreAdvanced();
const MM = new Magicmeadow();

export class NeighBeleenMerge {
    // [Can Change] This should only be changed by the author.
    //              If true, it will not stop the script if the default case triggers and the user chose to only get mats
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
            const quant = Adv.externalQuant;
            if (req == null) {
                Core.logger("req is NULL");
                return;
            }

            switch (req.name) {
                default: {
                    const shouldStop = !Adv.matsOnly || !this.dontStopMissingIng;
                    Core.logger(
                        `The bot hasn't been taught how to get ${req.name}.` +
                            (shouldStop ? " Please report the issue." : " Skipping"),
                        undefined,
                        { messageBox: shouldStop, stopBot: shouldStop },
                    );
                    break;
                }
                //#endregion
                case "Furry Ticket":

                case "Slobber Ticket":

                case "Floofy Ticket":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(9185);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.getMapItem(11466, undefined, "magicmeaderp");
                        Core.getMapItem(11467, undefined, "magicmeaderp");
                        Core.getMapItem(11468, undefined, "magicmeaderp");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Fancy Ticket":

                case "Hoppy Ticket":

                case "Mushy Ticket":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(9186);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.getMapItem(11469, undefined, "magicmeaderp");
                        Core.getMapItem(11470, undefined, "magicmeaderp");
                        Core.getMapItem(11471, undefined, "magicmeaderp");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Pwny Ticket":

                case "Bony Ticket":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(9187);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.getMapItem(11472, undefined, "magicmeaderp");
                        Core.getMapItem(11473, undefined, "magicmeaderp");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        MM.completeStory();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("magicmeaderp", 2251, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "77251",
            "Derpy Bubblegum Kitteh Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Bubblegum Kitteh Pet" ?',
            false,
        ),
        option.bool(
            "77252",
            "Derpy Citrus Kitteh Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Citrus Kitteh Pet" ?',
            false,
        ),
        option.bool(
            "77253",
            "Derpy Lime Kitteh Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Lime Kitteh Pet" ?',
            false,
        ),
        option.bool(
            "77254",
            "Derpy Icy Kitteh Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Icy Kitteh Pet" ?',
            false,
        ),
        option.bool(
            "77255",
            "Derpy Berry Kitteh Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Berry Kitteh Pet" ?',
            false,
        ),
        option.bool(
            "77256",
            "Derpy Prism Kitteh Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Prism Kitteh Pet" ?',
            false,
        ),
        option.bool(
            "77257",
            "Derpy Bubblegum Foxx Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Bubblegum Foxx Pet" ?',
            false,
        ),
        option.bool(
            "77258",
            "Derpy Citrus Foxx Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Citrus Foxx Pet" ?',
            false,
        ),
        option.bool(
            "77259",
            "Derpy Lime Foxx Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Lime Foxx Pet" ?',
            false,
        ),
        option.bool(
            "77260",
            "Derpy Icy Foxx Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Icy Foxx Pet" ?',
            false,
        ),
        option.bool(
            "77261",
            "Derpy Berry Foxx Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Berry Foxx Pet" ?',
            false,
        ),
        option.bool(
            "77262",
            "Derpy Prism Foxx Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Prism Foxx Pet" ?',
            false,
        ),
        option.bool(
            "77263",
            "Derpy Bubblegum Birb Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Bubblegum Birb Pet" ?',
            false,
        ),
        option.bool(
            "77264",
            "Derpy Citrus Birb Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Citrus Birb Pet" ?',
            false,
        ),
        option.bool(
            "77265",
            "Derpy Lime Birb Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Lime Birb Pet" ?',
            false,
        ),
        option.bool(
            "77266",
            "Derpy Icy Birb Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Icy Birb Pet" ?',
            false,
        ),
        option.bool(
            "77267",
            "Derpy Berry Birb Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Berry Birb Pet" ?',
            false,
        ),
        option.bool(
            "77268",
            "Derpy Prism Birb Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Prism Birb Pet" ?',
            false,
        ),
        option.bool(
            "77269",
            "Derpy Bubblegum Bunbun Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Bubblegum Bunbun Pet" ?',
            false,
        ),
        option.bool(
            "77270",
            "Derpy Citrus Bunbun Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Citrus Bunbun Pet" ?',
            false,
        ),
        option.bool(
            "77271",
            "Derpy Lime Bunbun Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Lime Bunbun Pet" ?',
            false,
        ),
        option.bool(
            "77272",
            "Derpy Icy Bunbun Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Icy Bunbun Pet" ?',
            false,
        ),
        option.bool(
            "77273",
            "Derpy Berry Bunbun Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Berry Bunbun Pet" ?',
            false,
        ),
        option.bool(
            "77274",
            "Derpy Prism Bunbun Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Prism Bunbun Pet" ?',
            false,
        ),
        option.bool(
            "77275",
            "Derpy Bubblegum ShrOoOm Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Bubblegum ShrOoOm Pet" ?',
            false,
        ),
        option.bool(
            "77276",
            "Derpy Citrus ShrOoOm Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Citrus ShrOoOm Pet" ?',
            false,
        ),
        option.bool(
            "77277",
            "Derpy Lime ShrOoOm Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Lime ShrOoOm Pet" ?',
            false,
        ),
        option.bool(
            "77278",
            "Derpy Icy ShrOoOm Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Icy ShrOoOm Pet" ?',
            false,
        ),
        option.bool(
            "77279",
            "Derpy Berry ShrOoOm Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Berry ShrOoOm Pet" ?',
            false,
        ),
        option.bool(
            "77280",
            "Derpy Prism ShrOoOm Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Prism ShrOoOm Pet" ?',
            false,
        ),
        option.bool(
            "77345",
            "Derpy Bubblegum Pupper Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Bubblegum Pupper Pet" ?',
            false,
        ),
        option.bool(
            "77346",
            "Derpy Citrus Pupper Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Citrus Pupper Pet" ?',
            false,
        ),
        option.bool(
            "77347",
            "Derpy Lime Pupper Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Lime Pupper Pet" ?',
            false,
        ),
        option.bool(
            "77348",
            "Derpy Icy Pupper Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Icy Pupper Pet" ?',
            false,
        ),
        option.bool(
            "77349",
            "Derpy Berry Pupper Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Berry Pupper Pet" ?',
            false,
        ),
        option.bool(
            "77350",
            "Derpy Prism Pupper Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Prism Pupper Pet" ?',
            false,
        ),
        option.bool(
            "77281",
            "Derpy Anger Birb Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Anger Birb Pet" ?',
            false,
        ),
        option.bool(
            "77282",
            "Derpy Blepper Kitteh Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Blepper Kitteh Pet" ?',
            false,
        ),
        option.bool(
            "77288",
            "Derpy Smol Floofer Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Smol Floofer Pet" ?',
            false,
        ),
        option.bool(
            "77289",
            "Derpy Heckin Woofer Pet",
            'Mode: [select] only\nShould the bot buy "Derpy Heckin Woofer Pet" ?',
            false,
        ),
        option.bool(
            "77290",
            "Hurrpa Bubblegum Kitteh Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Bubblegum Kitteh Cape" ?',
            false,
        ),
        option.bool(
            "77291",
            "Hurrpa Citrus Kitteh Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Citrus Kitteh Cape" ?',
            false,
        ),
        option.bool(
            "77292",
            "Hurrpa Lime Kitteh Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Lime Kitteh Cape" ?',
            false,
        ),
        option.bool(
            "77293",
            "Hurrpa Icy Kitteh Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Icy Kitteh Cape" ?',
            false,
        ),
        option.bool(
            "77294",
            "Hurrpa Berry Kitteh Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Berry Kitteh Cape" ?',
            false,
        ),
        option.bool(
            "77295",
            "Hurrpa Prism Kitteh Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Prism Kitteh Cape" ?',
            false,
        ),
        option.bool(
            "77296",
            "Hurrpa Bubblegum Foxx Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Bubblegum Foxx Cape" ?',
            false,
        ),
        option.bool(
            "77297",
            "Hurrpa Citrus Foxx Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Citrus Foxx Cape" ?',
            false,
        ),
        option.bool(
            "77298",
            "Hurrpa Lime Foxx Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Lime Foxx Cape" ?',
            false,
        ),
        option.bool(
            "77299",
            "Hurrpa Icy Foxx Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Icy Foxx Cape" ?',
            false,
        ),
        option.bool(
            "77300",
            "Hurrpa Berry Foxx Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Berry Foxx Cape" ?',
            false,
        ),
        option.bool(
            "77301",
            "Hurrpa Prism Foxx Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Prism Foxx Cape" ?',
            false,
        ),
        option.bool(
            "77302",
            "Hurrpa Bubblegum Birb Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Bubblegum Birb Cape" ?',
            false,
        ),
        option.bool(
            "77303",
            "Hurrpa Citrus Birb Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Citrus Birb Cape" ?',
            false,
        ),
        option.bool(
            "77304",
            "Hurrpa Lime Birb Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Lime Birb Cape" ?',
            false,
        ),
        option.bool(
            "77305",
            "Hurrpa Icy Birb Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Icy Birb Cape" ?',
            false,
        ),
        option.bool(
            "77306",
            "Hurrpa Berry Birb Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Berry Birb Cape" ?',
            false,
        ),
        option.bool(
            "77307",
            "Hurrpa Prism Birb Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Prism Birb Cape" ?',
            false,
        ),
        option.bool(
            "77308",
            "Hurrpa Bubblegum Bunbun Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Bubblegum Bunbun Cape" ?',
            false,
        ),
        option.bool(
            "77309",
            "Hurrpa Citrus Bunbun Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Citrus Bunbun Cape" ?',
            false,
        ),
        option.bool(
            "77310",
            "Hurrpa Lime Bunbun Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Lime Bunbun Cape" ?',
            false,
        ),
        option.bool(
            "77311",
            "Hurrpa Icy Bunbun Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Icy Bunbun Cape" ?',
            false,
        ),
        option.bool(
            "77312",
            "Hurrpa Berry Bunbun Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Berry Bunbun Cape" ?',
            false,
        ),
        option.bool(
            "77313",
            "Hurrpa Prism Bunbun Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Prism Bunbun Cape" ?',
            false,
        ),
        option.bool(
            "77314",
            "Hurrpa Bubblegum ShrOoOm Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Bubblegum ShrOoOm Cape" ?',
            false,
        ),
        option.bool(
            "77315",
            "Hurrpa Citrus ShrOoOm Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Citrus ShrOoOm Cape" ?',
            false,
        ),
        option.bool(
            "77316",
            "Hurrpa Lime ShrOoOm Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Lime ShrOoOm Cape" ?',
            false,
        ),
        option.bool(
            "77317",
            "Hurrpa Icy ShrOoOm Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Icy ShrOoOm Cape" ?',
            false,
        ),
        option.bool(
            "77318",
            "Hurrpa Berry ShrOoOm Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Berry ShrOoOm Cape" ?',
            false,
        ),
        option.bool(
            "77319",
            "Hurrpa Prism ShrOoOm Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Prism ShrOoOm Cape" ?',
            false,
        ),
        option.bool(
            "77351",
            "Hurrpa Bubblegum Pupper Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Bubblegum Pupper Cape" ?',
            false,
        ),
        option.bool(
            "77352",
            "Hurrpa Citrus Pupper Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Citrus Pupper Cape" ?',
            false,
        ),
        option.bool(
            "77353",
            "Hurrpa Lime Pupper Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Lime Pupper Cape" ?',
            false,
        ),
        option.bool(
            "77354",
            "Hurrpa Icy Pupper Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Icy Pupper Cape" ?',
            false,
        ),
        option.bool(
            "77355",
            "Hurrpa Berry Pupper Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Berry Pupper Cape" ?',
            false,
        ),
        option.bool(
            "77356",
            "Hurrpa Prism Pupper Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Prism Pupper Cape" ?',
            false,
        ),
        option.bool(
            "77320",
            "Hurrpa Anger Birb Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Anger Birb Cape" ?',
            false,
        ),
        option.bool(
            "77321",
            "Hurrpa Blepper Kitteh Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Blepper Kitteh Cape" ?',
            false,
        ),
        option.bool(
            "77327",
            "Hurrpa Smol Floofer Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Smol Floofer Cape" ?',
            false,
        ),
        option.bool(
            "77328",
            "Hurrpa Heckin Woofer Cape",
            'Mode: [select] only\nShould the bot buy "Hurrpa Heckin Woofer Cape" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: NeighBeleenMerge.select,
});

export default function main(): void {
    const script = new NeighBeleenMerge();
    Core.bankingBlackList.push(
        "Furry Ticket",
        "Floofy Ticket",
        "Fancy Ticket",
        "Hoppy Ticket",
        "Mushy Ticket",
        "Pwny Ticket",
        "Slobber Ticket",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
