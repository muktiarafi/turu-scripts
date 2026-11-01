/*
name: AllUltras
description: null
tags: null
*/
// Port of Scripts/Ultrasv3/DoAllUltras.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { Core, rethrowIfStopped } from "../core/CoreBots";
import { CoreEnginev3 } from "./dependenciesultras/CoreEnginev3";
import { CoreUltrav3, lineTime, nowSeconds, syncFileAgeMinutes } from "./dependenciesultras/CoreUltrav3";
import { PrerequisitesChecker } from "./dependenciesultras/PrerequisitesChecker";
import { UltraGeneral } from "./dependenciesultras/UltraGeneral";
import { UltraQueue } from "./dependenciesultras/UltraQueue";
import { UltraSpeakerv3 } from "./individualultras/10UltraSpeakerv3";
import { UltraGramielv3 } from "./individualultras/11UltraGramielv3";
import { UltraEzrajalv3 } from "./individualultras/1UltraEzrajalv3";
import { UltraWardenv3 } from "./individualultras/2UltraWardenv3";
import { UltraEngineerv3 } from "./individualultras/3UltraEngineerv3";
import { UltraAvatarTyndariusv3 } from "./individualultras/4UltraAvatarTyndariusv3";
import { ChampionDrakathv3 } from "./individualultras/5ChampionDrakathv3";
import { UltraNulgathv3 } from "./individualultras/6UltraNulgathv3";
import { UltraDragov3 } from "./individualultras/7UltraDragov3";
import { UltraDarkonv3 } from "./individualultras/8UltraDarkonv3";
import { UltraDagev3 } from "./individualultras/9UltraDagev3";

const Engine = CoreEnginev3.instance;
const Ultra = new CoreUltrav3();

export class DoAllUltras {
    private static readonly bossParticipantSyncFile = "ultrasv3_participants.sync";
    private static readonly bossSyncFile = "ultrasv3_bosses.sync";

    runAll(): void {
        if (bot.config!.get<boolean>("UsePrerequisitesChecker")) {
            if (!new PrerequisitesChecker().prerequisiteSyncGate(4)) {
                return;
            }
        }

        const allBosses = [
            "UltraEzrajal",
            "UltraWarden",
            "UltraEngineer",
            "UltraAvatarTyndarius",
            "ChampionDrakath",
            "UltraNulgath",
            "UltraDrago",
            "UltraDarkon",
            "UltraDage",
            "UltraSpeaker",
            "UltraGramiel",
        ];

        let pass = 1;
        while (true) {
            const pending = this.getSharedBossQueue(allBosses);
            if (!(pending.length > 0)) {
                break;
            }

            if (pass > 1) {
                Core.logger(
                    `[AllUltras-v3] Re-run pass #${pass}: ${pending.length} boss(es) still pending for some accounts.`,
                    "Info",
                );
            }

            this.runBossQueue(pending);
            pass++;
        }

        Core.logger("[AllUltras-v3] All Bosses Complete.");
    }

    private runBossQueue(bosses: string[]): void {
        for (const boss of bosses) {
            switch (boss) {
                case "UltraEzrajal":
                    new UltraEzrajalv3().runBoss();
                    break;
                case "UltraWarden":
                    new UltraWardenv3().runBoss();
                    break;
                case "UltraEngineer":
                    new UltraEngineerv3().runBoss();
                    break;
                case "UltraAvatarTyndarius":
                    new UltraAvatarTyndariusv3().runBoss();
                    break;
                case "ChampionDrakath":
                    new ChampionDrakathv3().runBoss();
                    break;
                case "UltraNulgath":
                    new UltraNulgathv3().runBoss();
                    break;
                case "UltraDrago":
                    new UltraDragov3().runBoss();
                    break;
                case "UltraDarkon":
                    new UltraDarkonv3().runBoss();
                    break;
                case "UltraDage":
                    new UltraDagev3().runBoss();
                    break;
                case "UltraSpeaker":
                    new UltraSpeakerv3().runBoss();
                    break;
                case "UltraGramiel":
                    new UltraGramielv3().runBoss();
                    break;
                default:
                    Core.logger(`Unknown Ultra boss in queue: ${boss}`, "Error", { messageBox: true, stopBot: true });
                    break;
            }
        }
    }

    private getSharedBossQueue(bosses: string[]): string[] {
        return UltraQueue.getSharedBossQueue(
            Ultra,
            bot,
            Core,
            bosses,
            DoAllUltras.bossSyncFile,
            DoAllUltras.bossParticipantSyncFile,
            this.isBossComplete.bind(this),
        );
    }

    private isBossComplete(boss: string): boolean {
        const [id, name] =
            boss === "UltraEzrajal"
                ? [8152, "Ultra Ezrajal"]
                : boss === "UltraWarden"
                  ? [8153, "Ultra Warden"]
                  : boss === "UltraEngineer"
                    ? [8154, "Ultra Engineer"]
                    : boss === "UltraAvatarTyndarius"
                      ? [8245, "Ultra Avatar Tyndarius"]
                      : boss === "ChampionDrakath"
                        ? [8300, "Champion Drakath"]
                        : boss === "UltraNulgath"
                          ? [8692, "Nulgath the Archfiend"]
                          : boss === "UltraDrago"
                            ? [8397, "King Drago"]
                            : boss === "UltraDarkon"
                              ? [8746, "Darkon the Conductor"]
                              : boss === "UltraDage"
                                ? [8547, "Dage the Dark Lord"]
                                : boss === "UltraSpeaker"
                                  ? [9173, "The First Speaker"]
                                  : boss === "UltraGramiel"
                                    ? [10301, "Gramiel the Graceful"]
                                    : [0, ""];

        if (id === 0) {
            return false;
        }

        const complete = UltraGeneral.isQuestComplete(bot, id);
        this.logBossQuestStatus(name, id, complete);
        return complete;
    }

    private logBossQuestStatus(name: string, questId: number, complete: boolean): void {
        const quest = bot.quests.ensureLoad(questId);
        const slot = quest?.slot ?? 0;
        const value = quest?.value ?? 0;
        const active = quest != null && quest.status != null;
        const questValue = slot > 0 ? bot.flash.callGameFunction<number>("world.getQuestValue", slot) : 0;

        Core.logger(
            `${name} [${questId}] complete=${complete} ` +
                `daily=${bot.quests.isDailyComplete(questId)} ` +
                `progress=${bot.quests.isInProgress(questId)} ` +
                `active=${active} ` +
                `everCompleted=${bot.quests.hasBeenCompleted(questId)} ` +
                `slot=${slot} value=${value} questValue=${questValue}`,
            "Info",
        );
    }

    // C# keeps these two copies of UltraQueue's helpers, unused.
    shouldClearParticipantSync(path: string): boolean {
        try {
            const age = syncFileAgeMinutes(Ultra, path);
            if (age == null) return true;

            return age > 10;
        } catch (error) {
            rethrowIfStopped(error);
            return false;
        }
    }

    cleanupStaleParticipants(path: string): void {
        try {
            const lines = Ultra.readLines(path);
            if (lines.length === 0) return;

            const now = nowSeconds();
            const staleThreshold = 600;
            const freshLines: string[] = [];

            for (const line of lines) {
                if (!line.trim()) continue;

                const parts = line.split(":");
                if (parts.length < 3) continue;

                const ts = lineTime(parts);
                if (ts == null) continue;

                if (now - ts <= staleThreshold) freshLines.push(line);
            }

            if (freshLines.length === 0) {
                Ultra.clearSyncFile(path);
                return;
            }

            if (freshLines.length !== lines.length) {
                bot.army.writeLog(path, freshLines);
                Core.logger(`[AllUltras-v3] Cleaned stale participant entries; ${freshLines.length} remain.`, "Info");
            }
        } catch (ex) {
            rethrowIfStopped(ex);
            Core.logger(
                `[AllUltras-v3] Failed to cleanup participant sync: ${ex instanceof Error ? ex.message : String(ex)}`,
                "Warning",
            );
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "DoAllUltras",
    [
        option.bool(
            "UsePrerequisitesChecker",
            "Use Prerequisites Checker",
            "Enable to run the prerequisites checker before starting ultras. Disable to skip.",
            true,
        ),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new DoAllUltras();
    Core.setOptions(true);
    Engine.boot();

    script.runAll();

    Engine.disableSkills();
    Core.setOptions(false);
    bot.stop();
}
