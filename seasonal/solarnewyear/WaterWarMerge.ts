/*
name: WaterWarMerge
description: null
tags: null
*/
// Port of Scripts/Seasonal/SolarNewYear/WaterWarMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { WaterWar } from "./WaterWar";

const Adv = new CoreAdvanced();
const WW = new WaterWar();

export class WaterWarMerge {
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
                case "Water Drop":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(6814, 6816);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("WaterWar", "Solar Elemental");
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Solar Badge":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("WaterWar", "Aloe", req.name, quant, { isTemp: false });
                    break;
            }
        };
        WW.storyLine();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("waterwar", 1711, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "48097",
            "Yaksha and Kinnaree",
            'Mode: [select] only\nShould the bot buy "Yaksha and Kinnaree" ?',
            false,
        ),
        option.bool("48101", "Yaksha Hair", 'Mode: [select] only\nShould the bot buy "Yaksha Hair" ?', false),
        option.bool("48102", "Yaksha Mask", 'Mode: [select] only\nShould the bot buy "Yaksha Mask" ?', false),
        option.bool("48107", "Kinnaree Locks", 'Mode: [select] only\nShould the bot buy "Kinnaree Locks" ?', false),
        option.bool("48100", "Yaksa Tapod", 'Mode: [select] only\nShould the bot buy "Yaksa Tapod" ?', false),
        option.bool("48099", "Kinnaree Kris", 'Mode: [select] only\nShould the bot buy "Kinnaree Kris" ?', false),
        option.bool("48098", "Kinnaree Wings", 'Mode: [select] only\nShould the bot buy "Kinnaree Wings" ?', false),
        option.bool("48104", "Water War Hair", 'Mode: [select] only\nShould the bot buy "Water War Hair" ?', false),
        option.bool("48103", "Water War Locks", 'Mode: [select] only\nShould the bot buy "Water War Locks" ?', false),
        option.bool("48112", "Mud Spurter", 'Mode: [select] only\nShould the bot buy "Mud Spurter" ?', false),
        option.bool("48110", "Super Squirter", 'Mode: [select] only\nShould the bot buy "Super Squirter" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: WaterWarMerge.select,
});

export default function main(): void {
    const script = new WaterWarMerge();
    Core.bankingBlackList.push("Water Drop", "Solar Badge");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
