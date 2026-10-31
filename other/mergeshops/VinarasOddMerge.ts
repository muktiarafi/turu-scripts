/*
name: Vinaras Odd Merge
description: This bot will farm the items belonging to the selected mode for the Vinaras Odd Merge [1539] in /curio
tags: vinaras, odd, merge, curio, googly, head, great, mace, ode, to, joy, scythe, gold, empty, cauldron, cursed, bards, strange, cat, face, borked, dragon, control, seraph, avenger, necrotic, dark, infernal, companion, grandpapa, golden, sneevil, morph, papa
*/
// Port of Scripts/Other/MergeShops/VinarasOddMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreDailies } from "../../core/CoreDailies";

const Adv = new CoreAdvanced();
const Daily = new CoreDailies();

export class VinarasOddMerge {
    // [Can Change] This should only be changed by the author.
    //              If true, it will not stop the script if the default case triggers and the user chose to only get mats
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
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
                case "Crypto Token":
                    Core.logger(`${req.name} is daily, make sure you have enough.`);
                    Daily.cryptoToken();
                    break;
                case "Shadowed Infernal Companion":

                case "GrandPapa the Golden Sneevil Morph":

                case "Papa the Sneevil":
                    Core.logger(`${req.name} is rare, it cannot be farmed.`);
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("curio", 1539, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("40676", "Googly Head", 'Mode: [select] only\nShould the bot buy "Googly Head" ?', false),
        option.bool("40857", "Great Mace", 'Mode: [select] only\nShould the bot buy "Great Mace" ?', false),
        option.bool(
            "42117",
            "Ode to Joy Scythe",
            'Mode: [select] only\nShould the bot buy "Ode to Joy Scythe" ?',
            false,
        ),
        option.bool("41857", "Gold Rune Staff", 'Mode: [select] only\nShould the bot buy "Gold Rune Staff" ?', false),
        option.bool(
            "41710",
            "Empty Cauldron Helm",
            'Mode: [select] only\nShould the bot buy "Empty Cauldron Helm" ?',
            false,
        ),
        option.bool(
            "33549",
            "Cursed Bard's Cape",
            'Mode: [select] only\nShould the bot buy "Cursed Bard\'s Cape" ?',
            false,
        ),
        option.bool("35246", "Strange Cat Face", 'Mode: [select] only\nShould the bot buy "Strange Cat Face" ?', false),
        option.bool(
            "29768",
            "Borked Blade of Dragon Control",
            'Mode: [select] only\nShould the bot buy "Borked Blade of Dragon Control" ?',
            false,
        ),
        option.bool("29459", "Seraph Avenger", 'Mode: [select] only\nShould the bot buy "Seraph Avenger" ?', false),
        option.bool("29458", "Necrotic Avenger", 'Mode: [select] only\nShould the bot buy "Necrotic Avenger" ?', false),
        option.bool(
            "46076",
            "Dark Infernal Companion",
            'Mode: [select] only\nShould the bot buy "Dark Infernal Companion" ?',
            false,
        ),
        option.bool(
            "48604",
            "GrandPapa the Golden Sneevil Morph",
            'Mode: [select] only\nShould the bot buy "GrandPapa the Golden Sneevil Morph" ?',
            false,
        ),
        option.bool("48606", "Papa the Sneevil", 'Mode: [select] only\nShould the bot buy "Papa the Sneevil" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: VinarasOddMerge.select,
});

export default function main(): void {
    const script = new VinarasOddMerge();
    Core.bankingBlackList.push(
        "Crypto Token",
        "Shadowed Infernal Companion",
        "GrandPapa the Golden Sneevil Morph",
        "Papa the Sneevil",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
