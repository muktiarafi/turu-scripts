/*
name: DoAllChallengeBosses
description: Runs all challenge boss dailies with shared queue — Queen Iona > Kolr > Kathool > Astral Empyrean.
tags: all, challenge, bosses, dailies, queeniona, kolr, kathool, astralempyrean
*/
// Port of Scripts/Ultrasv3/DependenciesDailies/DoAllChallengeBosses.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";
import { AstralEmpyreanNoOpv3 } from "./AstralEmpyreanNoOptionv3";
import { KathoolNoOpv3 } from "./KathoolNoOptionv3";
import { KolrNoOpv3 } from "./KolrNoOptionv3";
import { QueenIonaNoOpv3 } from "./QueenIonaNoOptionv3";
import { CoreEnginev3 } from "../dependenciesultras/CoreEnginev3";
import { CoreUltrav3 } from "../dependenciesultras/CoreUltrav3";
import { PrerequisitesChecker } from "../dependenciesultras/PrerequisitesChecker";
import { UltraQueue } from "../dependenciesultras/UltraQueue";

const Engine = CoreEnginev3.instance;
const Ultra = new CoreUltrav3();

export class DoAllChallengeBosses {
    private static readonly bossParticipantSyncFile = "challengeboss_participants.sync";
    private static readonly bossSyncFile = "challengeboss_bosses.sync";

    runAll(): void {
        if (!new PrerequisitesChecker().prerequisiteSyncGate(4)) {
            return;
        }

        const allBosses = ["QueenIona", "Kolr", "AstralEmpyrean", "Kathool"];

        let pass = 1;
        while (true) {
            const pending = this.getSharedBossQueue(allBosses);
            if (!(pending.length > 0)) {
                break;
            }

            if (pass > 1) {
                Core.logger(
                    `[DoAllChallengeBosses] Re-run pass #${pass}: ${pending.length} boss(es) still pending.`,
                    "Info",
                );
            }

            this.runBossQueue(pending);
            pass++;
        }

        Core.logger("[DoAllChallengeBosses] All Challenge Bosses Complete.");
    }

    private runBossQueue(bosses: string[]): void {
        for (const boss of bosses) {
            switch (boss) {
                case "QueenIona":
                    new QueenIonaNoOpv3().runBoss();
                    break;
                case "Kolr":
                    new KolrNoOpv3().runBoss();
                    break;
                case "Kathool":
                    new KathoolNoOpv3().runBoss();
                    break;
                case "AstralEmpyrean":
                    new AstralEmpyreanNoOpv3().runBoss();
                    break;
                default:
                    Core.logger(`Unknown challenge boss in queue: ${boss}`, "Error", {
                        messageBox: true,
                        stopBot: true,
                    });
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
            DoAllChallengeBosses.bossSyncFile,
            DoAllChallengeBosses.bossParticipantSyncFile,
            this.isBossComplete.bind(this),
        );
    }

    private isBossComplete(boss: string): boolean {
        const [id, name] =
            boss === "QueenIona"
                ? [9852, "Queen Iona"]
                : boss === "Kolr"
                  ? [10715, "Kolr, Usurper of Flames"]
                  : boss === "Kathool"
                    ? [9350, "God of the Depths"]
                    : boss === "AstralEmpyrean"
                      ? [9803, "Astral Empyrean"]
                      : [0, ""];

        if (id === 0) {
            return false;
        }

        const complete = bot.quests.isDailyComplete(id);
        Core.logger(`${name} [${id}] dailyComplete=${complete}`, "Info");
        return complete;
    }
}

export default function main(): void {
    const script = new DoAllChallengeBosses();
    Core.setOptions(true);
    Engine.boot();

    script.runAll();

    Engine.disableSkills();
    Core.setOptions(false);
    bot.stop();
}
