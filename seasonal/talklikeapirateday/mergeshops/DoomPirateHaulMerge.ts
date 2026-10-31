/*
name: DoomPirate Haul Merge
description: This bot will farm the items belonging to the selected mode for the DoomPirate Haul Merge [2330] in /doompirate
tags: doompirate, haul, merge, doompirate, shadowscythe, admiral, empire, fleet, admirals, flintlock, flintlocks, doomtech, doomknight, shadowspace, crewman, crew, woman, aerated, cloak, serrated, cutlass, cutlasses, dark, crimson
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/MergeShops/DoomPirateHaulMerge.cs.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { DoomPirate } from "../DoomPirateStory";

const Adv = new CoreAdvanced();
const DP = new DoomPirate();

export class DoomPirateHaulMerge {
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
                case "Gallaeon's Piece of Eight": {
                    Core.farmingLogger(req.name, req.quantity);
                    Core.registerQuests(9355);
                    Core.equipClass(ClassType.Solo);
                    Core.join("doompirate", "r5", "Left");
                    let restartKills = false;
                    RestartKills: while (!bot.shouldExit && !Core.checkInventory(req.name, req.quantity)) {
                        if (restartKills) {
                            restartKills = false;

                            Core.logger("Send player to house to reset map");
                            bot.send.packet(`%xt%zm%house%1%${Core.username()}%`);
                            bot.wait.forMapLoad("house");

                            Core.logger("Rejoin map to reset mobs");
                            Core.join("doompirate", "r5", "Left");
                            bot.wait.forMapLoad("doompirate");
                        }

                        for (const mobId of [5, 4, 7, 6, 9, 8, 11, 10]) {
                            while (!bot.shouldExit) {
                                if (!bot.player.alive) {
                                    Core.logger("Death - Resetting");
                                    while (!bot.shouldExit && !bot.player.alive) {
                                        bot.sleep(1000);
                                    }
                                    restartKills = true;
                                    continue RestartKills;
                                }

                                if (bot.player.cell !== "r5") {
                                    Core.jump("r5", "Left");
                                    Core.sleep();
                                }

                                const mon =
                                    bot.monsters.currentAvailableMonsters.find((x) => x != null && x.mapId === mobId) ??
                                    null;
                                if (mon == null) {
                                    Core.logger(`Skipping mob ${mobId}, not found.`);
                                    continue;
                                }

                                if (!bot.player.hasTarget) {
                                    bot.combat.attack(mobId);
                                }

                                bot.sleep(1500);

                                if (Core.getMonsterHP(String(mobId)) <= 0) {
                                    bot.combat.cancelTarget();
                                    break;
                                }
                            }
                        }

                        bot.kill.monster(12);
                    }
                    break;
                }
                case "Doom Doubloon":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(9354);
                    Core.huntMonsterMapID("doompirate", 3, req.name, quant, { log: false });
                    bot.wait.forPickup(req.name);
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        DP.storyline();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("doompirate", 2330, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "79592",
            "Shadowscythe Admiral",
            'Mode: [select] only\nShould the bot buy "Shadowscythe Admiral" ?',
            false,
        ),
        option.bool(
            "79593",
            "Empire Fleet Admiral's Hat",
            'Mode: [select] only\nShould the bot buy "Empire Fleet Admiral\'s Hat" ?',
            false,
        ),
        option.bool(
            "79594",
            "Empire Fleet Admiral's Locks",
            'Mode: [select] only\nShould the bot buy "Empire Fleet Admiral\'s Locks" ?',
            false,
        ),
        option.bool(
            "79595",
            "Empire Fleet Flintlock",
            'Mode: [select] only\nShould the bot buy "Empire Fleet Flintlock" ?',
            false,
        ),
        option.bool(
            "79596",
            "Empire Fleet Flintlocks",
            'Mode: [select] only\nShould the bot buy "Empire Fleet Flintlocks" ?',
            false,
        ),
        option.bool(
            "79599",
            "DoomTech DoomKnight",
            'Mode: [select] only\nShould the bot buy "DoomTech DoomKnight" ?',
            false,
        ),
        option.bool(
            "73749",
            "Shadowspace Crewman",
            'Mode: [select] only\nShould the bot buy "Shadowspace Crewman" ?',
            false,
        ),
        option.bool(
            "73750",
            "Shadowspace Crewman Hair",
            'Mode: [select] only\nShould the bot buy "Shadowspace Crewman Hair" ?',
            false,
        ),
        option.bool(
            "73751",
            "Shadowspace Crew Woman Locks",
            'Mode: [select] only\nShould the bot buy "Shadowspace Crew Woman Locks" ?',
            false,
        ),
        option.bool("73752", "Aerated Cloak", 'Mode: [select] only\nShould the bot buy "Aerated Cloak" ?', false),
        option.bool("73753", "Serrated Cutlass", 'Mode: [select] only\nShould the bot buy "Serrated Cutlass" ?', false),
        option.bool(
            "73754",
            "Serrated Cutlasses",
            'Mode: [select] only\nShould the bot buy "Serrated Cutlasses" ?',
            false,
        ),
        option.bool(
            "79600",
            "Shadowspace Empire Crewman",
            'Mode: [select] only\nShould the bot buy "Shadowspace Empire Crewman" ?',
            false,
        ),
        option.bool(
            "79601",
            "Dark Aerated Cloak",
            'Mode: [select] only\nShould the bot buy "Dark Aerated Cloak" ?',
            false,
        ),
        option.bool(
            "79602",
            "Serrated Crimson Cutlass",
            'Mode: [select] only\nShould the bot buy "Serrated Crimson Cutlass" ?',
            false,
        ),
        option.bool(
            "79603",
            "Serrated Crimson Cutlasses",
            'Mode: [select] only\nShould the bot buy "Serrated Crimson Cutlasses" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DoomPirateHaulMerge.select,
});

export default function main(): void {
    const script = new DoomPirateHaulMerge();
    Core.bankingBlackList.push("Doom Doubloon", "Gallaeon's Piece of Eight");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
