/*
name: Core Temple Shrine
description: Shared party, entry, recovery, and repeat-run helpers for Temple Shrine dungeon scripts.
tags: core, temple shrine, dungeon, army
*/
// Port of Extras/TempleShrine/CoreTempleShrine.cs from UltrasLW by l0newolf12 (https://github.com/l0newolf12/UltrasLW, 8e48a9e).
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core, rethrowIfStopped } from "../../../core/CoreBots";
import { type CoreLoneWolf } from "../../CoreLoneWolf";

export enum DungeonRecoveryResult {
    Continue = "Continue",
    RejoinRoom = "RejoinRoom",
    ResetRoom = "ResetRoom",
    Stopped = "Stopped",
}

export class CoreTempleShrine {
    private static readonly partyPollDelay = 250;
    private static readonly recoveryPollDelay = 500;

    private readonly loneWolf: CoreLoneWolf | null = null;
    private get activeLoneWolf(): CoreLoneWolf {
        return this.loneWolf!;
    }

    private partyPlayers: string[] = [];
    private expectedPartyLeader: string = "";
    private recoveryScope: string = "";
    private reportedAlive: boolean | null = null;
    private readonly disabledOptionalDailyQuests: Set<number> = new Set();

    /** C#'s two constructors: without the LoneWolf core (the daily quests only) and with it. */
    constructor(loneWolf: CoreLoneWolf | null = null) {
        this.loneWolf = loneWolf;
    }

    tryAcceptOptionalDaily(questId: number): void {
        if (
            this.disabledOptionalDailyQuests.has(questId) ||
            bot.quests.isDailyComplete(questId) ||
            bot.quests.isInProgress(questId)
        ) {
            return;
        }

        if (Core.ensureAccept(questId)) {
            return;
        }

        this.disabledOptionalDailyQuests.add(questId);
        Core.logger(
            this.loneWolf?.explainFailure(
                `Optional daily quest ${questId} could not be accepted. Direct dungeon farming will continue.`,
            ) ?? `Optional daily quest ${questId} could not be accepted. Direct dungeon farming will continue.`,
            "CoreTempleShrine",
        );
    }

    tryCompleteOptionalDaily(questId: number): void {
        if (
            this.disabledOptionalDailyQuests.has(questId) ||
            bot.quests.isDailyComplete(questId) ||
            !bot.quests.isInProgress(questId) ||
            !bot.quests.canComplete(questId)
        ) {
            return;
        }

        if (Core.ensureComplete(questId)) {
            Core.logger(`Optional daily quest ${questId} completed.`, "CoreTempleShrine");
            return;
        }

        this.disabledOptionalDailyQuests.add(questId);
        Core.logger(
            this.loneWolf?.explainFailure(
                `Optional daily quest ${questId} could not be completed. Direct dungeon farming will continue.`,
            ) ?? `Optional daily quest ${questId} could not be completed. Direct dungeon farming will continue.`,
            "CoreTempleShrine",
        );
    }

    prepareParty(players: string[]): boolean {
        if (this.loneWolf == null) {
            return this.failure("CoreTempleShrine requires the active CoreLoneWolf instance.");
        }

        if (!this.validatePartyPlayers(players)) {
            return this.failure("Temple Shrine party configuration is invalid.");
        }

        this.partyPlayers = [...players.map(CoreTempleShrine.normalizeUsername)];
        this.expectedPartyLeader = this.partyPlayers[0];

        if (!this.loneWolf.syncArmy("PARTY_SETUP")) {
            return false;
        }

        if (!this.isExactParty() && this.isInParty()) {
            bot.send.packet("%xt%zm%gp%1%pl%");
            Core.logger("Left the current party.", "CoreTempleShrine");
        }

        bot.sleep(1000);
        if (bot.shouldExit) {
            return false;
        }

        const listensForInvites = !this.loneWolf.isArmyPlayer(1) && !this.isExactParty();
        if (listensForInvites && !this.loneWolf.startPacketDetector("pi", '"cmd":"pi"')) {
            return false;
        }

        try {
            this.ensurePartyInvitesEnabled();
            bot.sleep(500);
            if (bot.shouldExit) {
                return false;
            }

            if (this.loneWolf.isArmyPlayer(1) && !this.isExactParty()) {
                for (let index = 1; index < this.partyPlayers.length; index++) {
                    bot.send.packet(`%xt%zm%gp%1%pi%${this.partyPlayers[index]}%`);

                    bot.sleep(750);
                    if (bot.shouldExit) {
                        return false;
                    }
                }

                return this.waitForExactParty();
            }

            return !listensForInvites || this.waitForPartyInvitation();
        } finally {
            if (listensForInvites) {
                this.loneWolf.stopPacketDetector();
            }
        }
    }

    enterDungeon(map: string, privateRoomNumber: number): boolean {
        if (this.loneWolf == null) {
            return this.failure("CoreTempleShrine requires the active CoreLoneWolf instance.");
        }

        if (!map?.trim() || privateRoomNumber < 1001 || privateRoomNumber > 99999) {
            return this.failure("Temple Shrine dungeon entry configuration is invalid.");
        }

        const mapName = map.trim().toLowerCase();

        if (this.loneWolf.isArmyPlayer(1)) {
            bot.send.packet(`%xt%zm%dungeonQueue%${bot.map.roomId}%${mapName}-${privateRoomNumber}%`);
            Core.logger("Dungeon entry packet sent.", "CoreTempleShrine");
        }

        while (!bot.shouldExit && !(bot.map.name?.toLowerCase() === mapName?.toLowerCase())) {
            bot.sleep(CoreTempleShrine.partyPollDelay);
        }

        if (bot.shouldExit) {
            return false;
        }

        const fullName = bot.map.fullName?.trim() ?? "";
        const expectedFullName = `${mapName}-${privateRoomNumber}`;
        if (fullName.includes("-") && !(fullName?.toLowerCase() === expectedFullName?.toLowerCase())) {
            return this.failure("The Army entered the wrong dungeon instance.");
        }

        return this.loneWolf.syncArmy("DUNGEON_ARRIVED");
    }

    recoverRoomDeath(runNumber: number, roomNumber: number, roomAttempt: number): DungeonRecoveryResult {
        if (this.loneWolf == null) {
            this.failure("CoreTempleShrine requires the active CoreLoneWolf instance.");
            return DungeonRecoveryResult.Stopped;
        }

        if (runNumber <= 0 || roomNumber <= 0 || roomAttempt <= 0) {
            return DungeonRecoveryResult.Stopped;
        }

        const scope = `${runNumber}_${roomNumber}_${roomAttempt}`;
        if (!(this.recoveryScope === scope)) {
            this.recoveryScope = scope;
            this.reportedAlive = null;
        }

        const deadSignal = `ROOM_DEAD_${scope}`;
        const aliveSignal = `ROOM_ALIVE_${scope}`;
        const resetSignal = `ROOM_RESET_${scope}`;

        if (this.loneWolf.hasArmySignal(resetSignal, 1)) {
            return this.finishRoomReset(aliveSignal, scope, runNumber, roomNumber, roomAttempt);
        }

        if (bot.player.alive) {
            this.reportAliveIfNeeded(aliveSignal);
            return DungeonRecoveryResult.Continue;
        }

        this.loneWolf.stopSkillEngine();
        bot.combat.cancelTarget();
        this.reportDeadIfNeeded(deadSignal, runNumber, roomNumber, roomAttempt);

        while (!bot.shouldExit && !bot.player.alive) {
            if (
                this.loneWolf.isArmyPlayer(1) &&
                !this.loneWolf.hasArmySignal(resetSignal, 1) &&
                this.areAllPlayersDead(deadSignal, aliveSignal)
            ) {
                if (!this.loneWolf.sendArmySignal(resetSignal)) {
                    return DungeonRecoveryResult.Stopped;
                }
            }

            bot.sleep(CoreTempleShrine.recoveryPollDelay);
        }

        if (bot.shouldExit) {
            return DungeonRecoveryResult.Stopped;
        }

        this.reportAliveIfNeeded(aliveSignal);

        return this.loneWolf.hasArmySignal(resetSignal, 1)
            ? this.finishRoomReset(aliveSignal, scope, runNumber, roomNumber, roomAttempt)
            : DungeonRecoveryResult.RejoinRoom;
    }

    prepareOracle(): boolean {
        if (this.loneWolf == null) {
            return this.failure("CoreTempleShrine requires the active CoreLoneWolf instance.");
        }

        const oracleName = "Oracle";

        if (bot.inventory.contains(oracleName)) {
            return true;
        }

        if (bot.flash.get<string>("ui.mcPopup.currentLabel") !== "Bank") {
            bot.bank.open();
        }

        bot.bank.load(false);
        bot.wait.forBankLoad(20);

        if (bot.bank.contains(oracleName)) {
            if (!Core.hasSpaceFor(bot.bank.getItem(oracleName))) {
                return this.failure("Oracle could not be moved from bank because no inventory slot is available.");
            }

            bot.bank.ensureToInventory(oracleName);
            bot.wait.forTrue(() => bot.inventory.contains(oracleName), 14);

            if (!bot.inventory.contains(oracleName)) {
                return this.failure(this.activeLoneWolf.explainFailure("Oracle could not be moved from bank."));
            }

            Core.logger("Oracle moved from bank.", "CoreTempleShrine");
            return true;
        }

        if (!Core.hasSpaceFor(Core.parseShopItem(Core.getShopItems("classhalla", 759), 759, oracleName))) {
            return this.failure("Oracle could not be purchased because no inventory slot is available.");
        }

        Core.buyItem("classhalla", 759, oracleName);
        if (!bot.inventory.contains(oracleName)) {
            return this.failure(this.activeLoneWolf.explainFailure("Oracle could not be purchased."));
        }

        Core.logger("Oracle purchased.", "CoreTempleShrine");
        return true;
    }

    returnHome(): boolean {
        if (this.loneWolf == null) {
            return this.failure("CoreTempleShrine requires the active CoreLoneWolf instance.");
        }

        if (!this.activeLoneWolf.moveToHouse("CoreTempleShrine")) {
            return false;
        }

        bot.sleep(1000);
        this.activeLoneWolf.equipClass(this.activeLoneWolf.oracle());
        if (bot.shouldExit) {
            return false;
        }

        if (!(bot.player.currentClass?.toLowerCase() === "Oracle"?.toLowerCase())) {
            return this.failure(this.activeLoneWolf.explainFailure("Oracle could not be equipped.", true));
        }

        bot.sleep(1000);
        return !bot.shouldExit;
    }

    private waitForExactParty(): boolean {
        const timeoutAt = Date.now() + 30000;

        while (!bot.shouldExit && !this.isExactParty() && Date.now() < timeoutAt) {
            bot.sleep(CoreTempleShrine.partyPollDelay);
        }

        if (bot.shouldExit) {
            return false;
        }

        if (!this.isExactParty()) {
            return this.failure(
                this.activeLoneWolf.explainFailure("Exact four-player party was not formed within 30 seconds."),
            );
        }

        Core.logger("Exact four-player party confirmed.", "CoreTempleShrine");
        return true;
    }

    private ensurePartyInvitesEnabled(): void {
        if (bot.flash.get<boolean>("uoPref.bParty")) {
            return;
        }

        bot.send.packet("%xt%zm%cmd%1%uopref%bParty%true%");
        Core.logger("Party invitations enabled.", "CoreTempleShrine");
    }

    private waitForPartyInvitation(): boolean {
        let detectionNumber = 1;

        while (!bot.shouldExit) {
            if (!this.activeLoneWolf.hasPacketDetection(detectionNumber)) {
                bot.sleep(CoreTempleShrine.partyPollDelay);
                continue;
            }

            const packet = this.activeLoneWolf.getPacketDetectorPacket();
            detectionNumber++;
            if (this.tryAcceptPartyInvitation(packet)) {
                return true;
            }
        }

        return false;
    }

    private tryAcceptPartyInvitation(packet: string): boolean {
        if (!packet?.trim()) {
            return false;
        }

        let parsedPacket: any;
        try {
            parsedPacket = JSON.parse(packet);
        } catch (error) {
            rethrowIfStopped(error);

            return false;
        }

        const data = parsedPacket["params"]?.["dataObj"];
        if (!(data?.["cmd"]?.toString() === "pi")) {
            return false;
        }

        const owner = CoreTempleShrine.normalizeUsername(data?.["owner"]?.toString());
        const partyIdText = data?.["pid"]?.toString() ?? "";
        // C#'s int.TryParse: whole digits only.
        const partyId = /^-?\d+$/.test(partyIdText) ? Number(partyIdText) : 0;
        if (partyId <= 0) {
            return false;
        }

        if (!(owner?.toLowerCase() === this.expectedPartyLeader?.toLowerCase())) {
            return false;
        }

        bot.send.packet(`%xt%zm%gp%1%pa%${partyId}%`);
        Core.logger("Accepted the playerOne party invitation.", "CoreTempleShrine");
        return true;
    }

    private finishRoomReset(
        aliveSignal: string,
        scope: string,
        runNumber: number,
        roomNumber: number,
        roomAttempt: number,
    ): DungeonRecoveryResult {
        while (!bot.shouldExit && !bot.player.alive) {
            bot.sleep(CoreTempleShrine.recoveryPollDelay);
        }

        if (bot.shouldExit) {
            return DungeonRecoveryResult.Stopped;
        }

        this.reportAliveIfNeeded(aliveSignal);
        Core.logger(
            `${this.getPlayerAlias()} received the coordinated room reset in run ${runNumber}, room ${roomNumber}, attempt ${roomAttempt}.`,
            "CoreTempleShrine",
        );

        return this.activeLoneWolf.syncArmy(`ROOM_RESET_READY_${scope}`)
            ? DungeonRecoveryResult.ResetRoom
            : DungeonRecoveryResult.Stopped;
    }

    private areAllPlayersDead(deadSignal: string, aliveSignal: string): boolean {
        for (let playerNumber = 1; playerNumber <= 4; playerNumber++) {
            const deadAt = this.activeLoneWolf.getArmyTimestamp(deadSignal, playerNumber);
            const aliveAt = this.activeLoneWolf.getArmyTimestamp(aliveSignal, playerNumber);
            if (deadAt <= 0 || deadAt <= aliveAt) {
                return false;
            }
        }

        return true;
    }

    private reportDeadIfNeeded(deadSignal: string, runNumber: number, roomNumber: number, roomAttempt: number): void {
        if (this.reportedAlive === false) {
            return;
        }

        if (this.activeLoneWolf.sendArmyTimestamp(deadSignal, Date.now())) {
            this.reportedAlive = false;
            Core.logger(
                `${this.getPlayerAlias()} died in run ${runNumber}, room ${roomNumber}, attempt ${roomAttempt}.`,
                "CoreTempleShrine",
            );
        }
    }

    private reportAliveIfNeeded(aliveSignal: string): void {
        if (this.reportedAlive !== false) {
            return;
        }

        if (this.activeLoneWolf.sendArmyTimestamp(aliveSignal, Date.now())) {
            this.reportedAlive = true;
        }
    }

    private getPlayerAlias(): string {
        if (this.activeLoneWolf.isArmyPlayer(1)) {
            return "playerOne";
        }

        if (this.activeLoneWolf.isArmyPlayer(2)) {
            return "playerTwo";
        }

        if (this.activeLoneWolf.isArmyPlayer(3)) {
            return "playerThree";
        }

        return "playerFour";
    }

    private validatePartyPlayers(players: string[]): boolean {
        if (players == null || players.length !== 4) {
            return false;
        }

        const normalized = [...players.map(CoreTempleShrine.normalizeUsername)];
        return normalized.every((player) => player.length > 0) && [...new Set(normalized)].length === 4;
    }

    private isExactParty(): boolean {
        const currentParty = this.getCurrentParty();
        return (
            currentParty.length === this.partyPlayers.length &&
            this.partyPlayers.every((player) => currentParty.includes(player)) &&
            this.getPartyLeader()?.toLowerCase() === this.expectedPartyLeader?.toLowerCase()
        );
    }

    private isInParty(): boolean {
        return this.getOtherPartyMembers().length > 0 || this.getPartyLeader().length > 0;
    }

    private getCurrentParty(): string[] {
        return [
            ...new Set(
                [...this.getOtherPartyMembers(), CoreTempleShrine.normalizeUsername(Core.username())].filter(
                    (username) => username.length > 0,
                ),
            ),
        ];
    }

    private getOtherPartyMembers(): string[] {
        return (bot.flash.get<string[] | null>("world.partyMembers") ?? [])
            .map(CoreTempleShrine.normalizeUsername)
            .filter((username) => username.length > 0);
    }

    private getPartyLeader(): string {
        return CoreTempleShrine.normalizeUsername(bot.flash.get<string>("world.partyOwner"));
    }

    private failure(message: string): boolean {
        Core.logger(message, "CoreTempleShrine", { messageBox: true, stopBot: true });
        return false;
    }

    private static normalizeUsername(username: string | null): string {
        return username?.trim().toLowerCase() ?? "";
    }
}
