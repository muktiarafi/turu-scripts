/*
name: Dark War Nation Merge
description: This will complete the Dark War Nation story and farm Nation Defender Medals.
tags: story, quest, nation, dark, war, merge, staff, birthday
*/
// Port of Scripts/Seasonal/StaffBirthdays/DageTheEvil/DarkWarNationMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";

const Adv = new CoreAdvanced();

export class DarkWarNationMerge {
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
                case "Nation Defender Medal":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8578, 8579);
                    Core.killMonster("darkwarnation", "r2", "Left", "*", req.name, quant);
                    bot.wait.forPickup(req.name);
                    Core.cancelRegisteredQuests();
                    break;
                case "Nation Trophy":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8580);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("darkwarnation", "Legion DoomKnight", "Legion Doomed", 5);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Nation War Banner":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8581);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("darkwarnation", "Legion Dread Knight", "Legion's Dread", 5);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Spoils of War":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(8582);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("darkwarnation", "War", "War Defeated");
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        //Only edit the map and shopID here
        if (!Core.isSeasonalMapActive("darkwarnation")) {
            return;
        }

        Adv.startBuyAllMerge("darkwarnation", 2121, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("67464", "Fiendfang Scythe", 'Mode: [select] only\nShould the bot buy "Fiendfang Scythe" ?', false),
        option.bool("67466", "Narakan Fiend", 'Mode: [select] only\nShould the bot buy "Narakan Fiend" ?', false),
        option.bool(
            "67467",
            "Narakan Fiend's Helm",
            'Mode: [select] only\nShould the bot buy "Narakan Fiend\'s Helm" ?',
            false,
        ),
        option.bool(
            "67468",
            "Narakan Fiend's Shadow",
            'Mode: [select] only\nShould the bot buy "Narakan Fiend\'s Shadow" ?',
            false,
        ),
        option.bool(
            "67469",
            "Narakan Fiend's Spear",
            'Mode: [select] only\nShould the bot buy "Narakan Fiend\'s Spear" ?',
            false,
        ),
        option.bool(
            "67470",
            "Narakan Fiend's ArmBlade",
            'Mode: [select] only\nShould the bot buy "Narakan Fiend\'s ArmBlade" ?',
            false,
        ),
        option.bool(
            "67471",
            "Narakan Fiend's ArmBlades",
            'Mode: [select] only\nShould the bot buy "Narakan Fiend\'s ArmBlades" ?',
            false,
        ),
        option.bool("67488", "Tempest Void", 'Mode: [select] only\nShould the bot buy "Tempest Void" ?', false),
        option.bool(
            "67489",
            "Tempest Void's Shroud",
            'Mode: [select] only\nShould the bot buy "Tempest Void\'s Shroud" ?',
            false,
        ),
        option.bool(
            "67490",
            "Tempest Void's Orb",
            'Mode: [select] only\nShould the bot buy "Tempest Void\'s Orb" ?',
            false,
        ),
        option.bool(
            "67491",
            "Tempest Void's Piercers",
            'Mode: [select] only\nShould the bot buy "Tempest Void\'s Piercers" ?',
            false,
        ),
        option.bool(
            "68337",
            "Void Recruit's BackSword + Shield",
            'Mode: [select] only\nShould the bot buy "Void Recruit\'s BackSword + Shield" ?',
            false,
        ),
        option.bool(
            "68339",
            "Void Recruit's Sword",
            'Mode: [select] only\nShould the bot buy "Void Recruit\'s Sword" ?',
            false,
        ),
        option.bool(
            "68340",
            "Void Recruit's Swords",
            'Mode: [select] only\nShould the bot buy "Void Recruit\'s Swords" ?',
            false,
        ),
        option.bool(
            "68338",
            "Void Recruit's Back Shield",
            'Mode: [select] only\nShould the bot buy "Void Recruit\'s Back Shield" ?',
            false,
        ),
        option.bool(
            "67492",
            "Midnight Storm Void",
            'Mode: [select] only\nShould the bot buy "Midnight Storm Void" ?',
            false,
        ),
        option.bool(
            "67493",
            "Midnight Storm Void's Shroud",
            'Mode: [select] only\nShould the bot buy "Midnight Storm Void\'s Shroud" ?',
            false,
        ),
        option.bool(
            "67494",
            "Midnight Storm Void's Piercers",
            'Mode: [select] only\nShould the bot buy "Midnight Storm Void\'s Piercers" ?',
            false,
        ),
        option.bool(
            "68774",
            "Staff of the Archfiend",
            'Mode: [select] only\nShould the bot buy "Staff of the Archfiend" ?',
            false,
        ),
        option.bool(
            "68775",
            "Brutal Axe of the Archfiend",
            'Mode: [select] only\nShould the bot buy "Brutal Axe of the Archfiend" ?',
            false,
        ),
        option.bool(
            "68776",
            "Brutal Axes of the Archfiend",
            'Mode: [select] only\nShould the bot buy "Brutal Axes of the Archfiend" ?',
            false,
        ),
        option.bool(
            "68779",
            "Reaver of the Archfiend",
            'Mode: [select] only\nShould the bot buy "Reaver of the Archfiend" ?',
            false,
        ),
        option.bool(
            "68780",
            "Reavers of the Archfiend",
            'Mode: [select] only\nShould the bot buy "Reavers of the Archfiend" ?',
            false,
        ),
        option.bool(
            "68781",
            "Abysal BloodSpear",
            'Mode: [select] only\nShould the bot buy "Abysal BloodSpear" ?',
            false,
        ),
        option.bool(
            "68782",
            "Abysal BloodSpears",
            'Mode: [select] only\nShould the bot buy "Abysal BloodSpears" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DarkWarNationMerge.select,
});

export default function main(): void {
    const script = new DarkWarNationMerge();
    Core.bankingBlackList.push("Nation Defender Medal", "Nation Trophy", "Nation War Banner ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
