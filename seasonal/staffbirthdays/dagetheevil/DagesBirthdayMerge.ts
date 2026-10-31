/*
name: DagesBirthdayMerge
description: null
tags: null
*/
// Port of Scripts/Seasonal/StaffBirthdays/DageTheEvil/DagesBirthdayMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";

const Adv = new CoreAdvanced();

export class DagesBirthdayMerge {
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
                case "Shard of Armor":

                case "Helm Piece":

                case "Leg Pieces":

                case "Arm Pieces":
                    //3408 requires you to join the legion (1200acs) added a method for non-legions
                    if (Core.isCompletedBefore(793)) {
                        Core.farmingLogger(req.name, quant);
                        Core.equipClass(ClassType.Farm);
                        Core.registerQuests(3408);
                        while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                            Core.killMonster("underworld", "r8", "Left", "*", "Dread Head", 20, { log: false });
                            bot.wait.forPickup(req.name);
                        }
                        Core.cancelRegisteredQuests();
                    } else {
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("undervoid", "Conquest", req.name, quant, { isTemp: false });
                    }
                    break;
                case "Weapon Shard":

                case "Cape Piece":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("undervoid", "Conquest", req.name, quant, { isTemp: false });
                    break;
                case "Death's Scythe":
                    Core.logger(
                        "This Merge Items Reuires the 300ac version of `Death's Scythe`, buy it yourself, then rerun.",
                    );
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("undervoid")) {
            return;
        }

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("undervoid", 839, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("23071", "Spirit of War", 'Mode: [select] only\nShould the bot buy "Spirit of War" ?', false),
        option.bool("23072", "Spirit of Famine", 'Mode: [select] only\nShould the bot buy "Spirit of Famine" ?', false),
        option.bool(
            "23073",
            "Spirit of Conquest",
            'Mode: [select] only\nShould the bot buy "Spirit of Conquest" ?',
            false,
        ),
        option.bool("23074", "Spirit of Death", 'Mode: [select] only\nShould the bot buy "Spirit of Death" ?', false),
        option.bool("23102", "Death's Kamas", 'Mode: [select] only\nShould the bot buy "Death\'s Kamas" ?', false),
        option.bool("23098", "Conquest Bow", 'Mode: [select] only\nShould the bot buy "Conquest Bow" ?', false),
        option.bool(
            "23094",
            "Famine's Gilded Horns",
            'Mode: [select] only\nShould the bot buy "Famine\'s Gilded Horns" ?',
            false,
        ),
        option.bool(
            "23085",
            "Conquest's Embellished Cloak",
            'Mode: [select] only\nShould the bot buy "Conquest\'s Embellished Cloak" ?',
            false,
        ),
        option.bool(
            "23076",
            "Conquest's Hood and Crown",
            'Mode: [select] only\nShould the bot buy "Conquest\'s Hood and Crown" ?',
            false,
        ),
        option.bool(
            "23089",
            "Conquest's Cloak",
            'Mode: [select] only\nShould the bot buy "Conquest\'s Cloak" ?',
            false,
        ),
        option.bool(
            "23099",
            "Hidden Face of Conquest",
            'Mode: [select] only\nShould the bot buy "Hidden Face of Conquest" ?',
            false,
        ),
        option.bool("23101", "Conquest Polearm", 'Mode: [select] only\nShould the bot buy "Conquest Polearm" ?', false),
        option.bool("23110", "War's Cape", 'Mode: [select] only\nShould the bot buy "War\'s Cape" ?', false),
        option.bool(
            "23066",
            "Obsidian Underguard",
            'Mode: [select] only\nShould the bot buy "Obsidian Underguard" ?',
            false,
        ),
        option.bool("23117", "War's Helm", 'Mode: [select] only\nShould the bot buy "War\'s Helm" ?', false), //Requires 300acs
        // new Option<bool>("23122", "Death's Grimmer Scythe", "Mode: [select] only\nShould the bot buy \"Death's Grimmer Scythe\" ?", false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DagesBirthdayMerge.select,
});

export default function main(): void {
    const script = new DagesBirthdayMerge();
    Core.bankingBlackList.push(
        "Shard of Armor",
        "Helm Piece",
        "Leg Pieces",
        "Arm Pieces",
        "Weapon Shard",
        "Cape Piece",
        "Death's Scythe",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
