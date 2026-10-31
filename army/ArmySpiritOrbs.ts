/*
name: Army Spirit Orbs
description: null
tags: null
*/
// Port of Scripts/Army/ArmySpiritOrbs.cs.
// The Ultras' CoreEngine (C#'s `Core`) and CoreUltra are army/CoreArmySync's CoreArmyEngine and CoreArmySync.

import { bot, defineScriptOptions } from "turu";
import { CoreArmyLite } from "./CoreArmyLite";
import { Core } from "../core/CoreBots";
import { CoreArmyEngine, CoreArmySync } from "./CoreArmySync";

const Engine = new CoreArmyEngine();
const Ultra = new CoreArmySync();
const sArmy = new CoreArmyLite();

export class ArmySpiritOrbs {
    getSO(quant = 10000): void {
        if (sArmy.players().length <= 0) {
            Core.logger(
                "Players empty, please add players to the options ( scripts botton > edit scripts option > insert account names exactly as is)",
            );
            return;
        }
        const map = "necroproject";
        const syncPath = Ultra.resolveSyncPath("UltraItemCheck.sync");
        Ultra.clearSyncFile(syncPath);
        bot.sleep(2500);
        Core.logger(`Players in Curreny Army: ${sArmy.players().length}`);
        bot.quests.updateQuest(9901);
        Core.addDrop("Spirit Orb", "Bone Dust");
        Core.registerQuests(2083);
        Engine.join(map);
        Core.jump("r5", "Left");
        if (sArmy.players().length > 1) {
            Ultra.waitForArmy(sArmy.players().length - 1, "ArmySpiritOrbs.sync");
        }
        bot.player.setSpawnPoint();
        bot.sleep(1500);
        bot.options.aggroMonsters = true;
        while (!bot.shouldExit) {
            if (Ultra.checkArmyProgress("Spirit Orb", 65000, false, syncPath)) {
                bot.options.aggroMonsters = false;
                Core.jump("Enter", "Spawn");
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
}

export const scriptOptions = defineScriptOptions(
    "Army_Gold",
    [
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
    const script = new ArmySpiritOrbs();
    Core.bankingBlackList.push("Spirit Orb", "Bone Dust");
    Core.setOptions(undefined, { disableClassSwap: true });

    script.getSO();

    Core.setOptions(false);
}
