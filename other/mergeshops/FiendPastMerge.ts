/*
name: FiendPastMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/FiendPastMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { FiendPast } from "../../story/nation/FiendPast";

const Adv = new CoreAdvanced();
const Fiend = new FiendPast();

export class FiendPastMerge {
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
                case "Nation Medallion":
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8495);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("fiendpast", "Proto-Legion Knight", "Legionnaire Defeated", 10);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Fiendish Outlaw Revolver":

                case "Fiendish Outlaw Bowie Knife":

                case "Fiendish Outlaw Sheathed Shotgun":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("fiendpast", "Dage the Lich", req.name, undefined, { isTemp: false });
                    break;
            }
        };
        Fiend.doAll();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("fiendpast", 2106, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "61121",
            "Vengeance of Nulgath",
            'Mode: [select] only\nShould the bot buy "Vengeance of Nulgath" ?',
            false,
        ),
        option.bool(
            "61122",
            "Vengeance of Nulgath Hair",
            'Mode: [select] only\nShould the bot buy "Vengeance of Nulgath Hair" ?',
            false,
        ),
        option.bool(
            "61123",
            "Vengeance of Nulgath Helm",
            'Mode: [select] only\nShould the bot buy "Vengeance of Nulgath Helm" ?',
            false,
        ),
        option.bool(
            "61124",
            "Vengeance of Nulgath Morph",
            'Mode: [select] only\nShould the bot buy "Vengeance of Nulgath Morph" ?',
            false,
        ),
        option.bool(
            "61125",
            "Vengeance of Nulgath Ascension Helm",
            'Mode: [select] only\nShould the bot buy "Vengeance of Nulgath Ascension Helm" ?',
            false,
        ),
        option.bool(
            "61126",
            "Vengeance of Nulgath Cape",
            'Mode: [select] only\nShould the bot buy "Vengeance of Nulgath Cape" ?',
            false,
        ),
        option.bool(
            "61127",
            "Vengeance of Nulgath Ascension Cape",
            'Mode: [select] only\nShould the bot buy "Vengeance of Nulgath Ascension Cape" ?',
            false,
        ),
        option.bool(
            "61128",
            "Vengeance of Nulgath Axe",
            'Mode: [select] only\nShould the bot buy "Vengeance of Nulgath Axe" ?',
            false,
        ),
        option.bool(
            "61129",
            "Vengeance of Nulgath Spear",
            'Mode: [select] only\nShould the bot buy "Vengeance of Nulgath Spear" ?',
            false,
        ),
        option.bool(
            "61130",
            "Fiendish Vengeance GreatSword",
            'Mode: [select] only\nShould the bot buy "Fiendish Vengeance GreatSword" ?',
            false,
        ),
        option.bool(
            "61131",
            "Nulgath's Vengeance Orb Pet",
            'Mode: [select] only\nShould the bot buy "Nulgath\'s Vengeance Orb Pet" ?',
            false,
        ),
        option.bool(
            "61132",
            "Vengeance Blade BattlePet",
            'Mode: [select] only\nShould the bot buy "Vengeance Blade BattlePet" ?',
            false,
        ),
        option.bool(
            "66991",
            "Fiendish Outlaw Battlegear",
            'Mode: [select] only\nShould the bot buy "Fiendish Outlaw Battlegear" ?',
            false,
        ),
        option.bool(
            "66992",
            "Fiendish Outlaw Quickdraw",
            'Mode: [select] only\nShould the bot buy "Fiendish Outlaw Quickdraw" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: FiendPastMerge.select,
});

export default function main(): void {
    const script = new FiendPastMerge();
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
