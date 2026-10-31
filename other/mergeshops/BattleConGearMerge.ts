/*
name: BattleConGearMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/BattleConGearMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class BattleConGearMerge {
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
                case "DeadMog LED":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(4576);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("arena", "Deadmoglinster", "DeadMoglinster Defeated");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("arena", 1162, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "31649",
            "Scarf of Ambition",
            'Mode: [select] only\nShould the bot buy "Scarf of Ambition" ?',
            false,
        ),
        option.bool("31647", "Scarf of Wisdom", 'Mode: [select] only\nShould the bot buy "Scarf of Wisdom" ?', false),
        option.bool(
            "31650",
            "Scarf of Dedication",
            'Mode: [select] only\nShould the bot buy "Scarf of Dedication" ?',
            false,
        ),
        option.bool("31648", "Scarf of Bravery", 'Mode: [select] only\nShould the bot buy "Scarf of Bravery" ?', false),
        option.bool("31646", "Ambitious Ferret", 'Mode: [select] only\nShould the bot buy "Ambitious Ferret" ?', false),
        option.bool("31671", "Dead Moglinster", 'Mode: [select] only\nShould the bot buy "Dead Moglinster" ?', false),
        option.bool(
            "31652",
            "Magenta StarBlade",
            'Mode: [select] only\nShould the bot buy "Magenta StarBlade" ?',
            false,
        ),
        option.bool("31653", "Azure StarBlade", 'Mode: [select] only\nShould the bot buy "Azure StarBlade" ?', false),
        option.bool("31654", "Flame StarBlade", 'Mode: [select] only\nShould the bot buy "Flame StarBlade" ?', false),
        option.bool("31655", "Verde StarBlade", 'Mode: [select] only\nShould the bot buy "Verde StarBlade" ?', false),
        option.bool("31736", "Fairy Tail", 'Mode: [select] only\nShould the bot buy "Fairy Tail" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: BattleConGearMerge.select,
});

export default function main(): void {
    const script = new BattleConGearMerge();
    Core.bankingBlackList.push("DeadMog LED ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
