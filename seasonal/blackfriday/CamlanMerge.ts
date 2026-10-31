/*
name: Camlan Merge
description: This bot will farm the items belonging to the selected mode for the Camlan Merge [2349] in /camlan
tags: camlan, merge, camlan, dark, tithe, chevalier, armet, chevaliers, long, cloak, starbane, lance, fallen, star, shield, apocryphal, shadow, executioner, retribution, eons, broadsword, awakened, carnage, maw, cleaver
*/
// Port of Scripts/Seasonal/BlackFriday/CamlanMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, type Monster, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreShadowofDoom } from "./shadowofdoom/CoreShadowofDoom";

const Adv = new CoreAdvanced();
const CoreSoD = new CoreShadowofDoom();

export class CamlanMerge {
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
                case "Ouroboros Scale": {
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    let bellona: Monster | null;
                    let sleih: Monster | null;
                    Core.registerQuests(9443);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, req.quantity)) {
                        if (bot.map.name !== "camlan") {
                            Core.join("camlan");
                        }

                        if (bot.player.cell !== "r9") {
                            Core.jump("r9", "Let");
                        }

                        bellona =
                            bot.monsters.currentAvailableMonsters?.find(
                                (m) => (m?.hp > 0 && m?.state > 0) === true && m.mapId === 22,
                            ) ?? null;
                        sleih =
                            bot.monsters.currentAvailableMonsters?.find(
                                (m) => (m?.hp > 0 && m?.state > 0) === true && m.mapId === 23,
                            ) ?? null;

                        // Priority: missing drop
                        if (bot.tempInv.contains("Bellona's Edict of War") && bellona != null) {
                            bot.combat.attack(22);
                        } else if (bot.tempInv.contains("Sleih's Changeling Records") && sleih != null) {
                            bot.combat.attack(23);
                        } else if (bellona != null) {
                            bot.combat.attack(22);
                        } else if (sleih != null) {
                            bot.combat.attack(23);
                        }

                        bot.sleep(200);

                        // Hunt maw if the other 2 items are collected already.
                        if (
                            bot.tempInv.contains("Bellona's Edict of War") &&
                            bot.tempInv.contains("Sleih's Changeling Records")
                        ) {
                            Core.huntMonster("camlan", "Metamorphosis Maw", "Alchemic Snake Scale", undefined, {
                                log: false,
                            });
                        }
                        bot.wait.forQuestComplete(9443);
                        bot.wait.forPickup(req.id);
                    }
                    bot.wait.forPickup(req.name);
                    Core.cancelRegisteredQuests();
                    break;
                }
                case "Advent Darkness Axe":

                case "Advent Darkness Blade":

                case "Shrouded Carnage Maw Cleaver":

                case "Dark Eons Sword":

                case "Dark Eons Broadsword":
                    Core.equipClass(ClassType.Solo);
                    Core.farmingLogger(req.name, quant);
                    Core.huntMonster("camlan", "Metamorphosis Maw", req.name, quant, { isTemp: req.temp });
                    break;
            }
        };
        CoreSoD.doAll(true);
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("camlan", 2349, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "78484",
            "Dark Tithe Chevalier",
            'Mode: [select] only\nShould the bot buy "Dark Tithe Chevalier" ?',
            false,
        ),
        option.bool("78485", "Dark Tithe Armet", 'Mode: [select] only\nShould the bot buy "Dark Tithe Armet" ?', false),
        option.bool(
            "78486",
            "Dark Chevalier's Long Cloak",
            'Mode: [select] only\nShould the bot buy "Dark Chevalier\'s Long Cloak" ?',
            false,
        ),
        option.bool("78487", "Starbane Lance", 'Mode: [select] only\nShould the bot buy "Starbane Lance" ?', false),
        option.bool(
            "78488",
            "Fallen Star Shield",
            'Mode: [select] only\nShould the bot buy "Fallen Star Shield" ?',
            false,
        ),
        option.bool(
            "66487",
            "Apocryphal Shadow Executioner",
            'Mode: [select] only\nShould the bot buy "Apocryphal Shadow Executioner" ?',
            false,
        ),
        option.bool(
            "66488",
            "Apocryphal Retribution Blade",
            'Mode: [select] only\nShould the bot buy "Apocryphal Retribution Blade" ?',
            false,
        ),
        option.bool(
            "66489",
            "Apocryphal Eons Broadsword",
            'Mode: [select] only\nShould the bot buy "Apocryphal Eons Broadsword" ?',
            false,
        ),
        option.bool(
            "66490",
            "Apocryphal Eons Sword",
            'Mode: [select] only\nShould the bot buy "Apocryphal Eons Sword" ?',
            false,
        ),
        option.bool(
            "66492",
            "Awakened Carnage Maw Cleaver",
            'Mode: [select] only\nShould the bot buy "Awakened Carnage Maw Cleaver" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: CamlanMerge.select,
});

export default function main(): void {
    const script = new CamlanMerge();
    Core.bankingBlackList.push(
        "Ouroboros Scale",
        "Advent Darkness Axe",
        "Advent Darkness Blade",
        "Dark Eons Broadsword",
        "Dark Eons Sword",
        "Shrouded Carnage Maw Cleaver",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
