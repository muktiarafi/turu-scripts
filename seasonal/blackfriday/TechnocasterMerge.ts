/*
name: Technocaster Merge
description: This will get all or selected items on this merge shop.
tags: technocaster-merge, black-friday, seasonal
*/
// Port of Scripts/Seasonal/BlackFriday/TechnocasterMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class TechnocasterMerge {
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
                case "Purified Energy Core":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(7236);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("technospace", "Technocaster Rogue", "Energy Core", undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Seraphic Steel Plate":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(7235);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("technospace", "Technowolf", "Seraphic Steel", 5, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        Core.addDrop("Purified Energy Core", "Seraphic Steel Plate");
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("technospace", 1802, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "51392",
            "Seraphic Technocaster",
            'Mode: [select] only\nShould the bot buy "Seraphic Technocaster" ?',
            false,
        ),
        option.bool(
            "51393",
            "Seraphic Technocaster Locks",
            'Mode: [select] only\nShould the bot buy "Seraphic Technocaster Locks" ?',
            false,
        ),
        option.bool(
            "51394",
            "Seraphic Technocaster Locks + Helm",
            'Mode: [select] only\nShould the bot buy "Seraphic Technocaster Locks + Helm" ?',
            false,
        ),
        option.bool(
            "51395",
            "Seraphic Technocaster Locks + Scarf",
            'Mode: [select] only\nShould the bot buy "Seraphic Technocaster Locks + Scarf" ?',
            false,
        ),
        option.bool(
            "51400",
            "Seraphic Technocaster Antenna",
            'Mode: [select] only\nShould the bot buy "Seraphic Technocaster Antenna" ?',
            false,
        ),
        option.bool(
            "51399",
            "Seraphic Technocaster Collar",
            'Mode: [select] only\nShould the bot buy "Seraphic Technocaster Collar" ?',
            false,
        ),
        option.bool(
            "51396",
            "Seraphic Technocaster Hair",
            'Mode: [select] only\nShould the bot buy "Seraphic Technocaster Hair" ?',
            false,
        ),
        option.bool(
            "51397",
            "Seraphic Technocaster Helm",
            'Mode: [select] only\nShould the bot buy "Seraphic Technocaster Helm" ?',
            false,
        ),
        option.bool(
            "51398",
            "Seraphic Technocaster Visor",
            'Mode: [select] only\nShould the bot buy "Seraphic Technocaster Visor" ?',
            false,
        ),
        option.bool(
            "51401",
            "Seraphic Technocaster Scarf",
            'Mode: [select] only\nShould the bot buy "Seraphic Technocaster Scarf" ?',
            false,
        ),
        option.bool(
            "51402",
            "Seraphic Technocaster Wing",
            'Mode: [select] only\nShould the bot buy "Seraphic Technocaster Wing" ?',
            false,
        ),
        option.bool("51403", "Legacy Of Sai", 'Mode: [select] only\nShould the bot buy "Legacy Of Sai" ?', false),
        option.bool(
            "51458",
            "Technocaster House",
            'Mode: [select] only\nShould the bot buy "Technocaster House" ?',
            false,
        ),
        option.bool(
            "51538",
            "Seraphic Technocaster Locks + Visor",
            'Mode: [select] only\nShould the bot buy "Seraphic Technocaster Locks + Visor" ?',
            false,
        ),
        option.bool(
            "51539",
            "Seraphic Technocaster Locks + Antenna",
            'Mode: [select] only\nShould the bot buy "Seraphic Technocaster Locks + Antenna" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: TechnocasterMerge.select,
});

export default function main(): void {
    const script = new TechnocasterMerge();
    Core.bankingBlackList.push("Purified Energy Core", "Seraphic Steel Plate");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
