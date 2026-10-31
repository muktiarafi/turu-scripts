/*
name: Army Leveling
description: Levles using aggroing on cell: "r11" of shadowbattleon.
tags: null
*/
// Port of Scripts/Army/Farm/ArmyLeveling.cs.
// The Ultras' CoreEngine (C#'s `Core`) and CoreUltra are army/CoreArmySync's CoreArmyEngine and CoreArmySync.

import { bot, defineScriptOptions, option } from "turu";
import { CoreArmyLite } from "../CoreArmyLite";
import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";
import { CoreArmyEngine, CoreArmySync } from "../CoreArmySync";

const Engine = new CoreArmyEngine();
const Ultra = new CoreArmySync();
const sArmy = new CoreArmyLite();
const Story = new CoreStory();

export class ArmyLeveling {
    leveling(): void {
        if (!bot.config!.get<boolean>("Solo")) {
            if (sArmy.players().length <= 0) {
                Core.logger(
                    "Players empty, please add players to the options ( scripts botton > edit scripts option > insert account names exactly as is)",
                );
                return;
            }
        }
        const map = "shadowbattleon";
        const syncPath = Ultra.resolveSyncPath("ArmyBool.sync");
        Ultra.clearSyncFile(syncPath);
        bot.sleep(2500);
        Core.logger(
            "Players in Current Army: " + (bot.config.get<boolean>("Solo") ? "Yourself" : `${sArmy.players().length}`),
        );
        Core.registerQuests(9421, 9422, 9426);
        Engine.join(map);
        Core.jump("r11", "Left");
        if (!bot.config.get<boolean>("Solo")) {
            if (sArmy.players().length > 1) {
                Ultra.waitForArmy(sArmy.players().length - 1, "ArmyLeveling.sync");
            }
        }
        bot.player.setSpawnPoint();
        bot.sleep(1500);
        bot.options.aggroMonsters = true;
        while (!bot.shouldExit) {
            if (
                (bot.config.get<boolean>("Solo") && bot.player.level >= 100) ||
                Ultra.checkArmyProgressBool(() => bot.player.level >= 100, syncPath)
            ) {
                bot.options.aggroMonsters = false;
                Core.jumpWait();
                Core.logger("All players finished farm.");
                break;
            }

            // Dead → wait for respawn
            if (!bot.player.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);
                continue;
            }

            bot.combat.attack("*");
            bot.sleep(500);
        }
    }

    prereqs(): void {
        if (Core.isCompletedBefore(9425)) {
            return;
        }

        Story.preLoad(this.prereqs);
        Core.logger('Doing "shadowbattleon" prerequisite quests');

        // Mega Shadow Hunt Medal 9422
        Story.killQuest(9422, "shadowbattleon", "Doomed Beast");

        // Early Autopsy 9423
        Story.killQuest(9423, "shadowbattleon", "Doomed Beast");

        // Given Life and Purpose 9424
        Story.killQuest(9424, "shadowbattleon", "Possessed Armor");

        // Adult Hatchling 9425
        Story.killQuest(9425, "shadowbattleon", "Ouro Spawn");

        Core.logger("Quests are done, Leaving map and rejoining to join the armies RoomNumber.");
        Core.join("whitemap-999999");
    }
}

export const scriptOptions = defineScriptOptions(
    "ArmyLeveling2",
    [
        option.bool("Solo", "Solo Farm", "Use just 1 account"),
        sArmy.player1,
        sArmy.player2,
        sArmy.player3,
        sArmy.player4,
        sArmy.player5,
        sArmy.player6,
        sArmy.player7,
        sArmy.packetDelay,
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new ArmyLeveling();
    Core.setOptions(undefined, { disableClassSwap: true });

    script.prereqs();
    script.leveling();

    Core.setOptions(false);
}
