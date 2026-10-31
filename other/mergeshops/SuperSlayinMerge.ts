/*
name: Super Slayin Merge
description: This bot will farm the items belonging to the selected mode for the Super Slayin Merge [2321] in /superslayin
tags: super, slayin, merge, superslayin, enchanted, martial, artists, gi, ryokus, masters, ryoku, morph, squoglin, pet, bulba, moglin, charmoglin
*/
// Port of Scripts/Other/MergeShops/SuperSlayinMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class SuperSlayinMerge {
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
                case "Martial Artist's Gi":

                case "Ryoku's Spikes":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("dragonkoi", "Ryoku", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Fatal Lily":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("superslayin", "Newb Cybot", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Pockey Ball":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("superslayin", "Charidon", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Dragon Orb":

                case "Master's Gi":

                case "Super Ryoku Morph":

                case "Super Ryoku Spikes":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("superslayin", "Super Ryoku", req.name, quant, { isTemp: false, log: false });
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("superslayin", 2321, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "79174",
            "Enchanted Martial Artist's Gi",
            'Mode: [select] only\nShould the bot buy "Enchanted Martial Artist\'s Gi" ?',
            false,
        ),
        option.bool(
            "79175",
            "Enchanted Ryoku's Spikes",
            'Mode: [select] only\nShould the bot buy "Enchanted Ryoku\'s Spikes" ?',
            false,
        ),
        option.bool(
            "79176",
            "Enchanted Master's Gi",
            'Mode: [select] only\nShould the bot buy "Enchanted Master\'s Gi" ?',
            false,
        ),
        option.bool(
            "79177",
            "Enchanted Super Ryoku Morph",
            'Mode: [select] only\nShould the bot buy "Enchanted Super Ryoku Morph" ?',
            false,
        ),
        option.bool(
            "79311",
            "Enchanted Super Ryoku Spikes",
            'Mode: [select] only\nShould the bot buy "Enchanted Super Ryoku Spikes" ?',
            false,
        ),
        option.bool("94228", "Squoglin Pet", 'Mode: [select] only\nShould the bot buy "Squoglin Pet" ?', false),
        option.bool("94229", "Bulba Moglin", 'Mode: [select] only\nShould the bot buy "Bulba Moglin" ?', false),
        option.bool("94230", "Charmoglin Pet", 'Mode: [select] only\nShould the bot buy "Charmoglin Pet" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: SuperSlayinMerge.select,
});

export default function main(): void {
    const script = new SuperSlayinMerge();
    Core.bankingBlackList.push(
        "Martial Artist's Gi",
        "Fatal Lily",
        "Pockey Ball",
        "Dragon Orb",
        "Ryoku's Spikes",
        "Master's Gi",
        "Super Ryoku Morph",
        "Super Ryoku Spikes",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
