/*
name: DoomPirate House Merge
description: This bot will farm the items belonging to the selected mode for the DoomPirate House Merge [2331] in /doompirate
tags: doompirate, house, merge, doompirate, shadowscythe, pirate, warship, commander, gallaeon, guest, statue
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/MergeShops/DoomPirateHouseMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core, rethrowIfStopped } from "../../../core/CoreBots";
import { DoomPirate } from "../DoomPirateStory";

const Adv = new CoreAdvanced();
const DP = new DoomPirate();

export class DoomPirateHouseMerge {
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
        Adv.startBuyAllMerge("doompirate", 2331, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    getMonsterHP(monMapID: string): number {
        try {
            const jsonData = bot.flash.call("availableMonsters");
            if (!jsonData?.trim()) {
                return 0;
            }

            for (const mon of JSON.parse(jsonData)) {
                if (mon?.["MonMapID"]?.toString() === monMapID) {
                    return (mon["intHP"] as number) ?? 0;
                }
            }
        } catch (error) {
            rethrowIfStopped(error);
        }

        return 0;
    }

    static readonly select = [
        option.bool(
            "79508",
            "Shadowscythe Pirate Warship",
            'Mode: [select] only\nShould the bot buy "Shadowscythe Pirate Warship" ?',
            false,
        ),
        option.bool(
            "79414",
            "Commander Gallaeon House Guest",
            'Mode: [select] only\nShould the bot buy "Commander Gallaeon House Guest" ?',
            false,
        ),
        option.bool(
            "79623",
            "Commander Gallaeon Statue",
            'Mode: [select] only\nShould the bot buy "Commander Gallaeon Statue" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DoomPirateHouseMerge.select,
});

export default function main(): void {
    const script = new DoomPirateHouseMerge();
    Core.bankingBlackList.push("Gallaeon's Piece of Eight", "Doom Doubloon");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
