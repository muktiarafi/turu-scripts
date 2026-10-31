/*
name: Army Seven Circles War
description: Levels an army in /sevencircleswar while farming War Medals and Mega War Medals.
tags: army, leveling, seven-circles, war-medals, mega-war-medals
*/
// Port of Scripts/Army/Farm/ArmySevenCirclesWar.cs.
// The Ultras' CoreEngine (C#'s `Core`) and CoreUltra are army/CoreArmySync's CoreArmyEngine and CoreArmySync.

import { BoostType, bot, choices, defineScriptOptions, option } from "turu";
import { CoreArmyLite } from "../CoreArmyLite";
import { ClassType, configEnum, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { SevenCircles } from "../../story/legion/SevenCircles(War)";
import { CoreArmyEngine, CoreArmySync } from "../CoreArmySync";

const Engine = new CoreArmyEngine();
const Ultra = new CoreArmySync();
const Farm = new CoreFarms();
const Army = new CoreArmyLite();
const SC = new SevenCircles();

export class ArmySevenCirclesWar {
    /** Levels the configured army in Seven Circles War while farming War Medals and Mega War Medals. */
    leveling(): void {
        const solo = bot.config?.get<boolean>("Solo") ?? false;
        const endless = bot.config?.get<boolean>("Endless") ?? false;
        const classType = configEnum("ClassType", ClassType, ClassType.Solo) ?? ClassType.Farm;
        const players = Army.players();

        if (!solo && players.length === 0) {
            Core.logger("Players empty. Add account names in the script options or enable Solo Farm.");
            return;
        }

        const map = "sevencircleswar";
        const cell = "Enter";
        const pad = "Spawn";
        const syncPath = Ultra.resolveSyncPath("ArmyBool.sync");
        Ultra.clearSyncFile(syncPath);

        Core.privateRooms = true;
        Core.privateRoomNumber = Army.getRoomNr();
        Farm.toggleBoost(BoostType.Experience);
        Farm.toggleBoost(BoostType.Gold);
        Core.equipClass(classType);
        Core.registerQuests(7980, 7981);

        bot.sleep(2500);
        Core.logger("Players in Current Army: " + (solo ? "Yourself" : String(players.length)));

        Engine.join(map);
        Core.jump(cell, pad);

        if (!solo && players.length > 1) {
            Ultra.waitForArmy(players.length - 1, "ArmySevenCirclesWar.sync");
        }

        bot.player.setSpawnPoint();
        bot.sleep(1500);
        bot.options.aggroMonsters = true;

        try {
            while (!bot.shouldExit) {
                if (
                    !endless &&
                    ((solo && bot.player.level >= 100) ||
                        Ultra.checkArmyProgressBool(() => bot.player.level >= 100, syncPath))
                ) {
                    bot.options.aggroMonsters = false;
                    Core.jumpWait();
                    Core.logger("All players finished farm.");
                    break;
                }

                if (!bot.player.alive) {
                    bot.wait.forTrue(() => bot.player.alive, 20);
                    continue;
                }

                if (bot.player.cell !== cell) {
                    bot.map.jump(cell, pad);
                    bot.wait.forCellChange(cell);
                }

                bot.combat.attack("*");
                bot.sleep(500);
            }
        } finally {
            bot.options.aggroMonsters = false;
            Core.cancelRegisteredQuests();
            Farm.toggleBoost(BoostType.Experience, false);
            Farm.toggleBoost(BoostType.Gold, false);
            Core.jumpWait();
            Army.waitForParty("whitemap");
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "ArmySevenCirclesWar",
    [
        option.bool("Solo", "Solo Farm", "Use just 1 account"),
        option.bool("Endless", "Endless Farm", "Ignore the level check and continue until manually stopped."),
        option.choice("ClassType", "ClassType to use", "Class to equip while farming.", choices(ClassType)),
        Army.player1,
        Army.player2,
        Army.player3,
        Army.player4,
        Army.player5,
        Army.player6,
        Army.player7,
        Army.packetDelay,
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new ArmySevenCirclesWar();
    Core.setOptions(undefined, { disableClassSwap: true });
    bot.lite.reacceptQuest = true;

    try {
        SC.circles();
        if (!bot.shouldExit) {
            script.leveling();
        }
    } finally {
        bot.options.aggroMonsters = false;
        bot.lite.reacceptQuest = false;
        Core.cancelRegisteredQuests();
        Core.setOptions(false);
    }
}
