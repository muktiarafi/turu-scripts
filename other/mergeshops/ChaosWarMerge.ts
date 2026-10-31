/*
name: ChaosWarMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/ChaosWarMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class ChaosWarMerge {
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
                case "Chaos Eye":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("chaoswar", "r2", "Spawn", "*", req.name, quant, {
                            isTemp: false,
                            log: false,
                        });
                    }
                    break;
                case "Chaos Tentacle":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("chaoswar", "r13", "Left", "*", req.name, quant, {
                            isTemp: false,
                            log: false,
                        });
                    }
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("chaoswar", 642, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("17839", "Chaos Destroyer", 'Mode: [select] only\nShould the bot buy "Chaos Destroyer" ?', false),
        option.bool(
            "17840",
            "Chaos Destroyer Helmet",
            'Mode: [select] only\nShould the bot buy "Chaos Destroyer Helmet" ?',
            false,
        ),
        option.bool(
            "17841",
            "Chaos Destroyer Cloak",
            'Mode: [select] only\nShould the bot buy "Chaos Destroyer Cloak" ?',
            false,
        ),
        option.bool("17559", "Chaoaxe", 'Mode: [select] only\nShould the bot buy "Chaoaxe" ?', false),
        option.bool("17842", "DESTROY CHAOS", 'Mode: [select] only\nShould the bot buy "DESTROY CHAOS" ?', false),
        option.bool(
            "17551",
            "Maul of the Mauler",
            'Mode: [select] only\nShould the bot buy "Maul of the Mauler" ?',
            false,
        ),
        option.bool(
            "18630",
            "Ebon Chaos Longbow",
            'Mode: [select] only\nShould the bot buy "Ebon Chaos Longbow" ?',
            false,
        ),
        option.bool(
            "18629",
            "Ebon Chaos Shotgun",
            'Mode: [select] only\nShould the bot buy "Ebon Chaos Shotgun" ?',
            false,
        ),
        option.bool(
            "18632",
            "Ebon Chaos Katanas",
            'Mode: [select] only\nShould the bot buy "Ebon Chaos Katanas" ?',
            false,
        ),
        option.bool(
            "18633",
            "Ebon Chaos Revolvers",
            'Mode: [select] only\nShould the bot buy "Ebon Chaos Revolvers" ?',
            false,
        ),
        option.bool(
            "17932",
            "Chaorrupter Unlocked",
            'Mode: [select] only\nShould the bot buy "Chaorrupter Unlocked" ?',
            false,
        ),
        option.bool(
            "17873",
            "Chaorrupter Unlocked",
            'Mode: [select] only\nShould the bot buy "Chaorrupter Unlocked" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ChaosWarMerge.select,
});

export default function main(): void {
    const script = new ChaosWarMerge();
    Core.bankingBlackList.push("Chaos Eye", "Chaos Tentacle ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
