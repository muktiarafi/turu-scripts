/*
name: Flock Merge
description: This bot will farm the items belonging to the selected mode for the Flock Merge [1218] in /battlefowl
tags: flock, merge, battlefowl, chicken, morph, self, plucked, chickencow, claws, nugget, on, a, stick, chickenwing, armblades, your, head, archimoodes, house, guest
*/
// Port of Scripts/Other/MergeShops/FlockMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class FlockMerge {
    // [Can Change] This should only be changed by the author.
    //              If true, it will not stop the script if the default case triggers and the user chose to only get mats
    private dontStopMissingIng = false;

    buyAllMerge(): void {
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
                case "Golden Egg":

                case "Chickenwing ArmBlade":

                case "Golden Feather":

                case "Chicken Claw":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("battlefowl", "Chicken", undefined, undefined, { isTemp: false, log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("battlefowl", 1218, findIngredients);

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "33913",
            "Chicken Morph Helm",
            'Mode: [select] only\nShould the bot buy "Chicken Morph Helm" ?',
            false,
        ),
        option.bool("33914", "Chicken Self", 'Mode: [select] only\nShould the bot buy "Chicken Self" ?', false),
        option.bool("33915", "Plucked Chicken", 'Mode: [select] only\nShould the bot buy "Plucked Chicken" ?', false),
        option.bool(
            "33919",
            "Dual Chickencow Claws",
            'Mode: [select] only\nShould the bot buy "Dual Chickencow Claws" ?',
            false,
        ),
        option.bool(
            "33923",
            "Nugget on a Stick",
            'Mode: [select] only\nShould the bot buy "Nugget on a Stick" ?',
            false,
        ),
        option.bool(
            "33929",
            "Dual Chickenwing ArmBlades",
            'Mode: [select] only\nShould the bot buy "Dual Chickenwing ArmBlades" ?',
            false,
        ),
        option.bool(
            "33926",
            "Chicken on Your Head",
            'Mode: [select] only\nShould the bot buy "Chicken on Your Head" ?',
            false,
        ),
        option.bool(
            "33927",
            "Chicken on Your Locks",
            'Mode: [select] only\nShould the bot buy "Chicken on Your Locks" ?',
            false,
        ),
        option.bool(
            "92896",
            "Archimoodes House Guest",
            'Mode: [select] only\nShould the bot buy "Archimoodes House Guest" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: FlockMerge.select,
});

export default function main(): void {
    const script = new FlockMerge();
    Core.bankingBlackList.push("Golden Egg", "Golden Feather", "Chicken Claw", "Chickenwing ArmBlade");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
