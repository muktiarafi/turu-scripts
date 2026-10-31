/*
name: Armywarmap
description: Levels the players acc using an arnmy on /CarcossaCourt with 3 selectable areas
tags: war, army, leveling, CarcossaCourt
*/
// Port of Scripts/Army/Farm/ArmyWarMap.cs.
// The Ultras' CoreEngine (C#'s `Core`) and CoreUltra are army/CoreArmySync's CoreArmyEngine and CoreArmySync.

import { bot, choices, defineScriptOptions, option } from "turu";
import { CoreArmyLite } from "../CoreArmyLite";
import { ClassType, configEnum, Core } from "../../core/CoreBots";
import { CoreArmyEngine, CoreArmySync } from "../CoreArmySync";

const Engine = new CoreArmyEngine();
const Ultra = new CoreArmySync();
const sArmy = new CoreArmyLite();

export enum LevelType {
    LowtoMidLevel = "LowtoMidLevel",
    HighLevel = "HighLevel",
    SmallBoss = "SmallBoss",
    BigBoss = "BigBoss",
}

export class ArmyWarMap {
    leveling(): void {
        const Solo = bot.config!.get<boolean>("Solo");
        const Endless = bot.config!.get<boolean>("Endless");
        const levelType = bot.config.get<LevelType>("LevelingArea");
        const classType = configEnum("ClassType", ClassType, ClassType.Solo);
        if (!Solo) {
            if (sArmy.players().length <= 0) {
                Core.logger(
                    "Players empty, please add players to the options (scripts button > edit scripts option > insert account names exactly as is)",
                );
                return;
            }
        }
        const quest = Core.initializeWithRetries(() => bot.quests.ensureLoad(10778));
        if (quest == null) {
            Core.logger("Failed to load quest 10778. Please check your connection or the server status.");
            return;
        }
        // C# reads the quest's Gold and XP; Turu's quest objects don't carry them: read the quest tree.
        const reward = (key: string): number => Number(bot.flash.get(`world.questTree.10778.${key}`) ?? 0);
        const QuestNerfed = reward("iGold") < 2500 || reward("iExp") < 6000;
        if (QuestNerfed) {
            if (
                bot.showMessageBox("\"CarcossaCourt's war quests have been nerfed, continue?", "War Nerfed", true) ===
                false
            ) {
                return;
            }
        }

        const map = "carcossacourt";

        const syncPath = Ultra.resolveSyncPath("ArmyBool.sync");
        Ultra.clearSyncFile(syncPath);
        const [cell, pad] = ArmyWarMap.getCellPad(levelType);

        bot.sleep(2500);

        Core.logger("Players in Current Army: " + (Solo ? "Yourself" : `${sArmy.players().length}`));

        const questMap = new Map([
            [LevelType.LowtoMidLevel, [10778, 10779]],
            [LevelType.HighLevel, [10778, 10779, 10780, 10781]],
            [LevelType.SmallBoss, [10778, 10779, 10784]],
            [LevelType.BigBoss, [10778, 10779, 10785]],
        ]);
        Core.equipClass(classType);
        Core.addDrop("A Revelation");
        Core.registerQuests(...questMap.get(levelType)!);
        Engine.join(map);
        Core.jump(cell, pad);

        if (!Solo) {
            if (sArmy.players().length > 1) {
                Ultra.waitForArmy(sArmy.players().length - 1, "ArmyWarMap.sync");
            }
        }

        bot.player.setSpawnPoint();
        bot.sleep(1500);

        bot.options.aggroMonsters = true;

        Core.savedState(true, map);
        while (!bot.shouldExit) {
            if (Core.checkSaveState()) {
                Core.executeSaveState();
            }

            if (
                !Endless &&
                ((Solo && bot.player != null && bot.player.level >= 100) ||
                    Ultra.checkArmyProgressBool(() => bot.player != null && bot.player.level >= 100, syncPath))
            ) {
                bot.options.aggroMonsters = false;
                Core.jumpWait();
                Core.logger("All players finished farm.");
                break;
            }

            if (bot.player != null && !bot.player.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);
                continue;
            }

            if (bot.player?.cell !== cell) {
                bot.map.jump(cell, pad, false);
                bot.wait.forCellChange(cell);
            }

            bot.combat.attack("*");
            bot.sleep(500);
        }
    }

    static getCellPad(type: LevelType): [cell: string, pad: string] {
        return type === LevelType.LowtoMidLevel
            ? ["Enter", "Spawn"]
            : type === LevelType.HighLevel
              ? ["r5", "Left"]
              : type === LevelType.SmallBoss
                ? ["r8", "Left"]
                : type === LevelType.BigBoss
                  ? ["r9", "Center"]
                  : ["Enter", "Spawn"];
    }
}

export const scriptOptions = defineScriptOptions(
    "ArmyWar",
    [
        option.bool("Solo", "Solo Farm", "Use just 1 account"),
        option.bool("Endless", "Endless Farm", "Disregard the Level check, and run till *YOU* stop it."),
        option.choice(
            "ClassType",
            "ClassType to use",
            "What Classtype to use (high hp classes work well, as you'll get hit around 1k~ without buffs)",
            choices(ClassType),
        ),
        option.choice(
            "LevelingArea",
            "Leveling Area",
            "Area to do the leveling in:\n" +
                "LowtoMidLevel = 'Enter' cell with 3 mobs (~10k HP each)\n" +
                "HighLevel = 'r5' cell with 3 mobs (~25k HP each)\n" +
                "Boss = Dryden (smaller boss for now)",
            choices(LevelType),
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
    const script = new ArmyWarMap();
    Core.setOptions(undefined, { disableClassSwap: true });

    script.leveling();

    Core.setOptions(false);
}
