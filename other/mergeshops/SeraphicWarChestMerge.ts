/*
name: Seraphic War Chest Merge
description: This bot will farm the items belonging to the selected mode for the Seraphic War Chest Merge [1573] in /seraphicwardage
tags: seraphic, war, chest, merge, seraphicwardage, ada, statue, laken, blood, legion, warrior, undead, seraph, seraphs, lakens, personal, paladin
*/
// Port of Scripts/Other/MergeShops/SeraphicWarChestMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { SeraphicWar_Story } from "../../story/legion/SeraphicWar";

const Adv = new CoreAdvanced();
const SW = new SeraphicWar_Story();

export class SeraphicWarChestMerge {
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
                case "Blood Token":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(6246, 6247);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("seraphicwarlaken", "Enter", "Spawn", "*", undefined, undefined, {
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Dark Token":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(6248, 6249);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("seraphicwardage", "Enter", "Spawn", "*", undefined, undefined, {
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Seraphic Paladin Shield":

                case "Seraphic Paladin Wings":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("seraphicwardage", "Supercharged Laken", req.name, quant, {
                        isTemp: false,
                        log: false,
                    });
                    break;
            }
        };
        SW.seraphicWar_Questline();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("seraphicwardage", 1573, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("43235", "Ada Statue", 'Mode: [select] only\nShould the bot buy "Ada Statue" ?', false),
        option.bool("43236", "Laken Statue", 'Mode: [select] only\nShould the bot buy "Laken Statue" ?', false),
        option.bool(
            "43252",
            "Blood Legion Warrior",
            'Mode: [select] only\nShould the bot buy "Blood Legion Warrior" ?',
            false,
        ),
        option.bool(
            "43253",
            "Blood Legion Helmet",
            'Mode: [select] only\nShould the bot buy "Blood Legion Helmet" ?',
            false,
        ),
        option.bool(
            "43256",
            "Undead Seraph Warrior",
            'Mode: [select] only\nShould the bot buy "Undead Seraph Warrior" ?',
            false,
        ),
        option.bool(
            "43258",
            "Undead Seraph's Helm",
            'Mode: [select] only\nShould the bot buy "Undead Seraph\'s Helm" ?',
            false,
        ),
        option.bool(
            "43211",
            "Laken's Personal Armor",
            'Mode: [select] only\nShould the bot buy "Laken\'s Personal Armor" ?',
            false,
        ),
        option.bool(
            "43273",
            "Laken the Seraphic Paladin",
            'Mode: [select] only\nShould the bot buy "Laken the Seraphic Paladin" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: SeraphicWarChestMerge.select,
});

export default function main(): void {
    const script = new SeraphicWarChestMerge();
    Core.bankingBlackList.push("Blood Token", "Dark Token", "Seraphic Paladin Shield", "Seraphic Paladin Wings");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
