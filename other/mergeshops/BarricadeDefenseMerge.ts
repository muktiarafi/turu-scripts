/*
name: BarricadeDefenseMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/BarricadeDefenseMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreQOM } from "../../story/queenofmonsters/CoreQoM";

const Adv = new CoreAdvanced();
const QOM = new CoreQOM();

export class BarricadeDefenseMerge {
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
                case "Rift Defense Medal":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(5825);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("charredpath", "Infected Hare", "Invader Slain", 10);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        QOM.theDestroyer();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("greenguardeast", 1401, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("39202", "RiftBreaker", 'Mode: [select] only\nShould the bot buy "RiftBreaker" ?', false),
        option.bool("39203", "Riftbreaker Helm", 'Mode: [select] only\nShould the bot buy "Riftbreaker Helm" ?', false),
        option.bool(
            "39204",
            "Riftbreaker Horns",
            'Mode: [select] only\nShould the bot buy "Riftbreaker Horns" ?',
            false,
        ),
        option.bool(
            "39209",
            "Riftbreaker Sword",
            'Mode: [select] only\nShould the bot buy "Riftbreaker Sword" ?',
            false,
        ),
        option.bool(
            "39210",
            "Riftbreaker Cutlass",
            'Mode: [select] only\nShould the bot buy "Riftbreaker Cutlass" ?',
            false,
        ),
        option.bool(
            "39205",
            "Riftbreaker Wings",
            'Mode: [select] only\nShould the bot buy "Riftbreaker Wings" ?',
            false,
        ),
        option.bool("39206", "Riftbreaker Cape", 'Mode: [select] only\nShould the bot buy "Riftbreaker Cape" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: BarricadeDefenseMerge.select,
});

export default function main(): void {
    const script = new BarricadeDefenseMerge();
    Core.bankingBlackList.push("Rift Defense Medal ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
