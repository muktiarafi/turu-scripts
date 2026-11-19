/*
name: Two Player PvP DoomArena
description: Player 1 challenges Player 2 to a duel, then defeats Player 2. Completes the daily quest.
tags: army, pvp, duel, doomarena, 1v1, trophy, daily, lonewolf12
*/
// Port of Scripts/Prototypes/DoomArenaPVP.cs.

import { bot, defineScriptOptions, option } from "turu";
import { Core, rethrowIfStopped } from "../core/CoreBots";

export class PvPArmy {
    private static readonly doomArenaMap = "doomarena";
    private static readonly pvPQuestID = 1063;
    private static readonly questTempItem = "Doomwood Token";
    private static readonly questTempQuantity = 10;
    private static readonly questReward = "1v1 PvP Trophy";
    private static readonly preferredClass = "Void Highlord";
    private static readonly killLimit = 10;

    static readonly player1Option = option.text(
        "player1",
        "Account #1",
        "Username of the account that sends the duel request and attacks.",
        "",
    );

    static readonly player2Option = option.text(
        "player2",
        "Account #2",
        "Username of the account that accepts the duel.",
        "",
    );

    static readonly loopForeverOption = option.bool(
        "loopForever",
        "Loop Forever",
        "Continue dueling indefinitely instead of stopping after 10 kills.",
        false,
    );

    runDuel(): void {
        const configuredPlayer1 = bot.config?.get<string>("player1");
        const configuredPlayer2 = bot.config?.get<string>("player2");

        if (!configuredPlayer1?.trim() || !configuredPlayer2?.trim()) {
            Core.logger("Player 1 and Player 2 must both be configured.");
            return;
        }

        const player1 = configuredPlayer1.toLowerCase().trim();
        const player2 = configuredPlayer2.toLowerCase().trim();
        const username = Core.username().toLowerCase().trim();
        const loopForever = bot.config?.get<boolean>("loopForever") ?? false;

        if (player1 === player2) {
            Core.logger("Player 1 and Player 2 must be different accounts.");
            return;
        }

        if (username !== player1 && username !== player2) {
            Core.logger(`This account (${Core.username()}) is not configured as Player 1 or Player 2.`);
            return;
        }

        const isPlayer1 = username === player1;

        this.enableDuelInvites();

        if (isPlayer1) {
            this.equipPreferredClass();
            Core.addDrop(PvPArmy.questReward);

            if (!bot.quests.isDailyComplete(PvPArmy.pvPQuestID)) {
                Core.ensureAccept(PvPArmy.pvPQuestID);
                this.handlePvPQuest();
            } else {
                Core.logger(`Daily quest ${PvPArmy.pvPQuestID} has already been completed today.`);
            }
        }

        const syncFile = this.getSyncFilePath(player1, player2);

        if (isPlayer1) {
            this.resetRoundSync(syncFile);
        } else {
            bot.skills.stop();
        }

        try {
            if (isPlayer1) {
                this.sendDuelRequest(player2, syncFile, 0);
            } else if (this.waitForChallengeSent(syncFile, 0)) {
                this.acceptDuelRequest(player1);
            } else {
                return;
            }

            for (let round = 1; (loopForever || round <= PvPArmy.killLimit) && !bot.shouldExit; round++) {
                if (isPlayer1) {
                    if (!this.waitForPlayer(player2)) {
                        Core.logger(`${player2} did not appear after the duel request was accepted.`);
                        return;
                    }

                    this.attackPlayerUntilDefeated(player2);
                    this.handlePvPQuest();

                    if (!loopForever && round === PvPArmy.killLimit) {
                        Core.logger(`${PvPArmy.killLimit} kills completed.`);
                        break;
                    }

                    if (bot.shouldExit || !this.waitForRoundReady(syncFile, round)) {
                        return;
                    }

                    if (!this.joinDoomArena()) {
                        return;
                    }

                    this.handlePvPQuest();
                    this.sendDuelRequest(player2, syncFile, round);
                } else {
                    if (!this.waitForDeathAndRespawn()) {
                        return;
                    }

                    if (!loopForever && round === PvPArmy.killLimit) {
                        Core.logger(`${PvPArmy.killLimit} deaths completed.`);
                        break;
                    }

                    if (!this.joinDoomArena()) {
                        return;
                    }

                    Core.logger("Player 2 reached /doomarena. Waiting 2 seconds.");
                    Core.sleep(2000);
                    this.signalRoundReady(syncFile, round);

                    if (!this.waitForChallengeSent(syncFile, round)) {
                        return;
                    }

                    this.acceptDuelRequest(player1);
                }
            }
        } finally {
            if (isPlayer1) {
                this.resetRoundSync(syncFile);
            }
        }
    }

    private equipPreferredClass(): void {
        if (bot.inventory.contains(PvPArmy.preferredClass) || bot.bank.contains(PvPArmy.preferredClass)) {
            Core.equip(PvPArmy.preferredClass);
        }
    }

    private enableDuelInvites(): void {
        if (bot.flash.get<boolean>("uoPref.bDuel")) {
            return;
        }

        Core.logger("Enabling duel invitations for the PvP script.");
        Core.sendPackets("%xt%zm%cmd%1%uopref%bDuel%true%");
    }

    private sendDuelRequest(player2: string, syncFile: string, round: number): void {
        Core.logger(`Challenging ${player2} to a duel.`);
        Core.sendPackets(`%xt%zm%duel%1%${player2}%`);
        this.writeSyncState(syncFile, `challenged:${round}`);

        // Player 2 accepts after two seconds. Allow a small amount of time
        // for the server to place both players into PvP mode.
        Core.sleep(2500);
    }

    private acceptDuelRequest(player1: string): void {
        Core.sleep(2000);
        Core.logger(`Accepting ${player1}'s duel.`);
        Core.sendPackets(`%xt%zm%da%1%${player1}%`);
    }

    private waitForDeathAndRespawn(): boolean {
        Core.logger("Waiting for Player 2 to be defeated.");

        while (!bot.shouldExit && bot.player.alive) {
            Core.sleep(250);
        }

        if (bot.shouldExit) {
            return false;
        }

        Core.logger("Player 2 was defeated. Waiting to respawn.");
        while (!bot.shouldExit && !bot.player.alive) {
            Core.sleep(250);
        }

        return !bot.shouldExit;
    }

    private joinDoomArena(): boolean {
        let currentMap = bot.map.name;

        if (!(currentMap?.toLowerCase() === PvPArmy.doomArenaMap?.toLowerCase())) {
            Core.logger(`Joining /${PvPArmy.doomArenaMap}.`);
            Core.join(PvPArmy.doomArenaMap);
        }

        const joinedDoomArena = bot.wait.forMapLoad(PvPArmy.doomArenaMap);

        if (!joinedDoomArena) {
            currentMap = bot.map.name;
            Core.logger(`Failed to reach /${PvPArmy.doomArenaMap}. Current map: /${currentMap}.`);
        }

        return joinedDoomArena && !bot.shouldExit;
    }

    private handlePvPQuest(): void {
        if (bot.quests.isDailyComplete(PvPArmy.pvPQuestID)) {
            return;
        }

        const currentMap = bot.map.name;
        if (!(currentMap?.toLowerCase() === PvPArmy.doomArenaMap?.toLowerCase())) {
            return;
        }

        if (!bot.tempInv.contains(PvPArmy.questTempItem, PvPArmy.questTempQuantity)) {
            return;
        }

        Core.logger(
            `Turning in quest ${PvPArmy.pvPQuestID} for ${PvPArmy.questReward} (${PvPArmy.questTempQuantity} ${PvPArmy.questTempItem}).`,
        );

        if (!Core.ensureCompleteChoose(PvPArmy.pvPQuestID, [PvPArmy.questReward])) {
            Core.logger(`Failed to turn in quest ${PvPArmy.pvPQuestID}.`);
            return;
        }

        Core.logger(`Daily quest ${PvPArmy.pvPQuestID} completed.`);
    }

    private waitForPlayer(playerName: string, timeoutSeconds = 20): boolean {
        let attempts = timeoutSeconds * 10;

        while (!bot.shouldExit && attempts-- > 0) {
            if (bot.map.getPlayer(playerName) != null) {
                return true;
            }

            Core.sleep(100);
        }

        return false;
    }

    /**
     * The two clients share their round state. C# writes it to a file in Skua's options folder;
     * Turu keeps it in a shared army log (`bot.army`), one line holding the state.
     */
    private getSyncFilePath(player1: string, player2: string): string {
        return `PvPArmy-${player1}-${player2}`;
    }

    private resetRoundSync(syncFile: string): void {
        try {
            bot.army.clearLog(syncFile);
        } catch (ex) {
            rethrowIfStopped(ex);

            Core.logger(`Could not reset the PvP synchronization file: ${String(ex)}`);
        }
    }

    private signalRoundReady(syncFile: string, round: number): void {
        this.writeSyncState(syncFile, `ready:${round}`);
        Core.logger(`Player 2 is ready for duel round ${round + 1}.`);
    }

    private waitForRoundReady(syncFile: string, round: number): boolean {
        Core.logger(`Waiting for Player 2 to prepare duel round ${round + 1}.`);
        return this.waitForSyncState(syncFile, `ready:${round}`);
    }

    private waitForChallengeSent(syncFile: string, round: number): boolean {
        Core.logger(`Waiting for Player 1 to send duel round ${round + 1}.`);
        return this.waitForSyncState(syncFile, `challenged:${round}`);
    }

    private writeSyncState(syncFile: string, state: string): void {
        while (!bot.shouldExit) {
            try {
                bot.army.writeLog(syncFile, [state]);
                return;
            } catch (error) {
                rethrowIfStopped(error);

                Core.sleep(250);
            }
        }
    }

    private waitForSyncState(syncFile: string, state: string): boolean {
        while (!bot.shouldExit) {
            try {
                if ((bot.army.readLog(syncFile)[0] ?? "").trim() === state) {
                    return true;
                }
            } catch (error) {
                rethrowIfStopped(error);

                // The other client may be writing the file; retry shortly.
            }

            Core.sleep(250);
        }

        return false;
    }

    private attackPlayerUntilDefeated(playerName: string): void {
        let missingAttempts = 0;
        const className = bot.player.currentClass ?? "generic";

        Core.logger(`Starting Advanced Skills for ${className}.`);
        bot.skills.startAdvanced(className, false);

        try {
            while (!bot.shouldExit) {
                const player = bot.map.getPlayer(playerName);
                if (player == null) {
                    if (++missingAttempts >= 20) {
                        Core.logger(`${playerName} is no longer in the current map.`);
                        return;
                    }

                    Core.sleep(250);
                    continue;
                }

                missingAttempts = 0;

                if (player.hp <= 0) {
                    break;
                }

                // AttackPlayer selects the PvP opponent. Once a target exists,
                // Skua's Advanced Skills timer handles the equipped class's combo.
                bot.combat.attackPlayer(playerName);
                Core.sleep();
            }
        } finally {
            bot.skills.stop();
            bot.combat.cancelTarget();
        }

        Core.logger(`${playerName} has 0 HP. Duel sequence complete.`);
    }
}

export const scriptOptions = defineScriptOptions(
    "PvPArmy",
    [PvPArmy.player1Option, PvPArmy.player2Option, PvPArmy.loopForeverOption, Core.skipOptions],
    true,
);

export default function main(): void {
    const script = new PvPArmy();
    Core.setOptions();

    script.runDuel();

    Core.setOptions(false);
}
