/*
name: AQWorldsWarZMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/AQWorldsWarZMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class AQWorldsWarZMerge {
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
                case "Angry Zombie Skull":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("doomwar", "Angry Zombie", "Angry Zombie Skull");
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("doomwar", 665, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "18326",
            "Zombie Trophyhunter",
            'Mode: [select] only\nShould the bot buy "Zombie Trophyhunter" ?',
            false,
        ),
        option.bool(
            "18292",
            "Zombie Gunslinger",
            'Mode: [select] only\nShould the bot buy "Zombie Gunslinger" ?',
            false,
        ),
        option.bool(
            "18298",
            "Crazy Eye Zombie Face",
            'Mode: [select] only\nShould the bot buy "Crazy Eye Zombie Face" ?',
            false,
        ),
        option.bool(
            "18299",
            "Scalp Wound Zombie Face",
            'Mode: [select] only\nShould the bot buy "Scalp Wound Zombie Face" ?',
            false,
        ),
        option.bool(
            "18300",
            "Baldhead McZombieface",
            'Mode: [select] only\nShould the bot buy "Baldhead McZombieface" ?',
            false,
        ),
        option.bool("18305", "Sir Scalps-a-Lot", 'Mode: [select] only\nShould the bot buy "Sir Scalps-a-Lot" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: AQWorldsWarZMerge.select,
});

export default function main(): void {
    const script = new AQWorldsWarZMerge();
    Core.bankingBlackList.push("Angry Zombie Skull ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
