/*
name: WorldCoreMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/WorldCoreMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class WorldCoreMerge {
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
                case "Guardian Shard":
                    Core.equipClass(ClassType.Farm);
                    Core.killMonster("worldsoul", "r4", "Left", "*", req.name, quant, { isTemp: false });
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("worldsoul", 1572, findIngredients, undefined, { itemBlackList: ["Core Guardian Bank"] });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("43212", "Samurai Seraph", 'Mode: [select] only\nShould the bot buy "Samurai Seraph" ?', false),
        option.bool(
            "43216",
            "Sheathed Seraph Katanas",
            'Mode: [select] only\nShould the bot buy "Sheathed Seraph Katanas" ?',
            false,
        ),
        option.bool(
            "43214",
            "Samurai Seraph Backblade",
            'Mode: [select] only\nShould the bot buy "Samurai Seraph Backblade" ?',
            false,
        ),
        option.bool(
            "43215",
            "Samurai Seraph's Katana",
            'Mode: [select] only\nShould the bot buy "Samurai Seraph\'s Katana" ?',
            false,
        ),
        option.bool(
            "43197",
            "Weaponized Dark Shard",
            'Mode: [select] only\nShould the bot buy "Weaponized Dark Shard" ?',
            false,
        ),
        option.bool(
            "43196",
            "Celestial Light Daggers",
            'Mode: [select] only\nShould the bot buy "Celestial Light Daggers" ?',
            false,
        ),
        option.bool(
            "43221",
            "Core Guardian Bank",
            'Mode: [select] only\nShould the bot buy "Core Guardian Bank" ?',
            false,
        ),
        option.bool(
            "43213",
            "Samurai Seraph's Hat + Mask",
            'Mode: [select] only\nShould the bot buy "Samurai Seraph\'s Hat + Mask" ?',
            false,
        ),
        option.bool(
            "43222",
            "Samurai Seraph's Hat",
            'Mode: [select] only\nShould the bot buy "Samurai Seraph\'s Hat" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: WorldCoreMerge.select,
});

export default function main(): void {
    const script = new WorldCoreMerge();
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
