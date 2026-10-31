/*
name: LichwarGoldXP
description: Levels/farms gold using aggroing on cell: "r11" of /LichWar. - all accounts *Must* be members
tags: army, gold, exp, member, upgrade
*/
// Port of Scripts/Army/Farm/ArmyLichWarGoldXp[Mem].cs.
// The Ultras' CoreEngine (C#'s `Core`) and CoreUltra are army/CoreArmySync's CoreArmyEngine and CoreArmySync.

import { BoostType, bot, choices, defineScriptOptions, option } from "turu";
import { CoreArmyLite } from "../CoreArmyLite";
import { configEnum, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreArmyEngine, CoreArmySync } from "../CoreArmySync";

const Engine = new CoreArmyEngine();
const Ultra = new CoreArmySync();
const sArmy = new CoreArmyLite();
const Farm = new CoreFarms();

export enum FarmType {
    Gold = 1,
    Exp = 2,
    Both = 3,
}

export class ArmyLichWarMem {
    leveling(): void {
        if (sArmy.players().length <= 0) {
            Core.logger(
                "Players empty, please add players to the options ( scripts botton > edit scripts option > insert account names exactly as is)",
            );
            return;
        }

        const WTFweDOING = configEnum("Gold or EXP", FarmType, FarmType.Gold);

        const WeDoingThis =
            WTFweDOING === FarmType.Both
                ? bot.player.gold >= 100000000 && bot.player.level >= 100
                : WTFweDOING === FarmType.Gold
                  ? bot.player.gold >= 100000000
                  : WTFweDOING === FarmType.Exp
                    ? bot.player.level >= 100
                    : false;

        if (!WeDoingThis) {
            if (WTFweDOING === FarmType.Both || WTFweDOING === FarmType.Exp) {
                Farm.toggleBoost(BoostType.Experience);
            }

            if (WTFweDOING === FarmType.Both || WTFweDOING === FarmType.Gold) {
                Farm.toggleBoost(BoostType.Gold);
            }
        }

        const map = "lichwar";
        const syncPath = Ultra.resolveSyncPath("ArmyBool.sync");
        Ultra.clearSyncFile(syncPath);
        bot.sleep(2500);
        Core.logger(`Players in Curreny Army: ${sArmy.players().length}`);
        Core.registerQuests(10282, 10283);
        Engine.join(map);
        Core.jump("r6", "Right");
        if (sArmy.players().length > 1) {
            Ultra.waitForArmy(sArmy.players().length - 1, "ArmyLeveling.sync");
        }
        bot.player.setSpawnPoint();
        bot.sleep(1500);
        bot.options.aggroMonsters = true;
        while (!bot.shouldExit) {
            if (Ultra.checkArmyProgressBool(() => WeDoingThis, syncPath)) {
                bot.options.aggroMonsters = false;
                Core.jumpWait();
                Core.logger("All players finished farm.");
                Farm.toggleBoost(BoostType.Gold, false);
                Farm.toggleBoost(BoostType.Experience, false);
                break;
            }

            // Dead → wait for respawn
            if (!bot.player.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);
                continue;
            }

            bot.combat.attack("*");
            bot.sleep(200);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "ArmyLeveling2",
    [
        option.choice(
            "Gold or EXP",
            "Gold or EXP",
            "Are we Maxing Gold, EXP, or Both",
            choices(FarmType),
            FarmType[FarmType.Both],
        ),
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
    const script = new ArmyLichWarMem();
    Core.setOptions(undefined, { disableClassSwap: true });

    script.leveling();

    Core.setOptions(false);
}
