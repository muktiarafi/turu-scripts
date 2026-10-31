/*
name: null
description: null
tags: null
*/
// Port of Scripts/Army/CoreArmyLite.cs.
//
// Turu: the army's sync log is `bot.army`'s shared log (C# writes a file in Skua's options folder),
// the aggro packet loops are `bot.handlers` timers (C# runs them on Task.Run), `doForAll` logs in
// the accounts of Army > Accounts with their keychain passwords (C# reads Skua Manager's
// settings), and `getRoomNr` is `bot.army.roomNumber()`. Not ported: the Butler's files that tell
// the leader to write its locked map (C# `commFile`, CoreBots `ButlerOnMe`); `lockedMaps` searches
// the maps as C# does when that file is missing.

import { bot, type EventMap, type Monster, option, type PlayerInfo } from "turu";
import { ClassType, configOr, Core, formatForCompare, randomInt, rethrowIfStopped } from "../core/CoreBots";
import { CoreFarms } from "../core/CoreFarms";

const Farm = new CoreFarms();
/** C# `ArmyLogging`: the army's sync log, shared by every client (`bot.army`'s log). */
export class ArmyLogging {
    private logName = "";
    message = "";

    setLogName(fileName: string): void {
        this.logName = fileName;
    }

    registerMessage(msg: string): void {
        this.message = msg;
    }

    isEmpty(): boolean {
        return bot.army.readLog(this.logName).length === 0;
    }

    isAlreadyInLog(playersList: string[]): boolean {
        try {
            const joinedString = this.readLog().join("\n");
            for (const pl of playersList) {
                if (!joinedString.includes(`${pl.toLowerCase()}:done:${this.message}`)) {
                    return false;
                }
            }
            return true;
        } catch (error) {
            rethrowIfStopped(error);

            return false;
        }
    }

    writeLog(logMessage: string): void {
        bot.army.appendLog(this.logName, logMessage);
    }

    readLog(): string[] {
        return bot.army.readLog(this.logName);
    }

    clearLogFile(): void {
        bot.army.clearLog(this.logName);
    }
}

const armyLogging = new ArmyLogging();

/** C#'s `new PlayerInfo()`: an empty player. */
function emptyPlayer(): PlayerInfo {
    return {
        name: "",
        hp: 0,
        maxHp: 0,
        mp: 0,
        afk: false,
        entId: 0,
        level: 0,
        cell: "",
        pad: "",
        x: 0,
        y: 0,
        state: 0,
    };
}

export class CoreArmyLite {
    cellToAggro: string[] = [];

    //#region Army Logging

    setLogName(name: string): void {
        armyLogging.setLogName(name);
    }

    registerMessage(message: string, delPrevMsg = true): void {
        armyLogging.registerMessage(message);
        if (delPrevMsg) {
            const player1 = configOr("player1", "");
            if (!!player1 && player1.toLowerCase() === Core.username().toLowerCase()) {
                Core.logger("Clearing log");
                armyLogging.clearLogFile();
            }
        }
    }

    clearLogFile(): void {
        const player1 = configOr("player1", "");
        if (!!player1 && player1.toLowerCase() === Core.username().toLowerCase()) {
            Core.logger("Clearing log");
            armyLogging.clearLogFile();
        }
    }

    isEmpty(): boolean {
        return armyLogging.isEmpty();
    }

    isAlreadyInLog(playersList: string[]): boolean {
        return armyLogging.isAlreadyInLog(playersList);
    }

    sendDone(tryCount = 1): boolean {
        let attempts = 0;
        while (attempts < tryCount) {
            try {
                if (!armyLogging.isAlreadyInLog(this.players())) {
                    armyLogging.writeLog(`${Core.username().toLowerCase()}:done:${armyLogging.message}`);
                    return true;
                }
                attempts++;
            } catch (error) {
                rethrowIfStopped(error);

                attempts++;
            }
            Core.sleep();
        }
        return false;
    }

    isDone(tryCount = 1, players: string[] | null = null): boolean {
        let attempts = 0;
        while (attempts < tryCount) {
            try {
                const playerArray = players ?? this.players();
                if (armyLogging.isAlreadyInLog(playerArray)) {
                    return true;
                }
            } catch (error) {
                rethrowIfStopped(error);
            }
            attempts++;
            Core.sleep();
        }
        return false;
    }
    //#endregion Army Logging
    //#region Aggro Mon
    // #nullable enable
    //
    //
    aggroMonPacketDelay: number = 500;

    /** Starts the AggroMon. Jumps to the specified map and starts sending the AggroPacket. */
    aggroIfAnyPlayers(): void {
        const GetMapIDs = (monsterData: Monster[]): number[] => {
            return monsterData.map((m) => m.mapId);
        };
        const AddMapIDs = (MMIDs: number[]): void => {
            for (const ID of MMIDs) {
                if (!AggroMonMapIDs.includes(ID)) {
                    AggroMonMapIDs.push(ID);
                }
            }
        };
        if (this.aggroRunning) {
            this.aggroMonStop();
        }

        const players = this.players();
        const AggroMonMapIDs = this._AggroMonMIDs;
        for (const player of players) {
            if (player.toLowerCase() !== Core.username().toLowerCase()) {
                let playerObject: PlayerInfo | null = null;
                (playerObject = bot.map.getPlayer(player)) != null;
                if (playerObject != null) {
                    AddMapIDs(GetMapIDs(bot.monsters.getMonstersByCell(playerObject.cell)));
                }
            }
        }

        // C# sends the packet every AggroMonPacketDelay ms on a Task.Run; here a handler does.
        this.aggroRunning = true;
        bot.handlers.register("AggroMon", this.aggroMonPacketDelay, () => {
            if (AggroMonMapIDs.length > 0) {
                bot.send.packet(this.aggroMonPacket(...AggroMonMapIDs));
            }
        });
    }

    aggroMonStart(map: string | null = null, _cell: string | null = null, _pad: string | null = null): void {
        const PopulateAggroMonMapIDs = (): void => {
            for (const cell of this._AggroMonCells) {
                for (const id of bot.monsters.getMonstersByCell(cell).map((m) => m.mapId)) {
                    AggroMonMapIDs.add(id);
                }
            }

            for (const name of this._AggroMonNames) {
                for (const id of bot.monsters.mapMonsters.filter((m) => m.name === name).map((m) => m.mapId)) {
                    AggroMonMapIDs.add(id);
                }
            }

            for (const id of this._AggroMonIDs) {
                for (const mapId of bot.monsters.mapMonsters
                    .filter((m) => m.id === id || m.mapId === id)
                    .map((m) => m.mapId)) {
                    AggroMonMapIDs.add(mapId);
                }
            }

            for (const mapID of this._AggroMonMIDs) {
                AggroMonMapIDs.add(mapID);
            }
        };
        if (this.aggroRunning) {
            this.aggroMonStop();
        }

        Core.privateRooms = true;
        Core.privateRoomNumber = this.getRoomNr();

        bot.map.join(`${map}-${Core.privateRoomNumber}`, "Enter", "Spawn", undefined, false);
        if (map != null) {
            bot.wait.forMapLoad(map);
        }

        bot.map.jump(_cell ?? "Enter", _pad ?? "Spawn", false);
        bot.wait.forCellChange(_cell ?? "Enter");

        // Retrieve player configurations
        for (let i = 1; i <= 10; i++) {
            configOr(`player${i}`, "");
        }

        Core.logger(`Party Size: ${this.partySize()}`);

        if (map != null) {
            this.waitForPartyCell(_cell ?? bot.player.cell, _pad ?? bot.player.pad, this.partySize());
        }

        // Use HashSet to prevent duplicate MapIDs
        const AggroMonMapIDs: Set<number> = new Set();

        PopulateAggroMonMapIDs();

        // Start aggro task (C# Task.Run; a handler here)
        this.aggroRunning = true;
        bot.handlers.register("AggroMon", this.aggroMonPacketDelay, () => {
            // C# compares with `_cell` itself, so with no cell (SmartAggroMonStart) it never sent
            // the packet; the player is in `_cell ?? "Enter"` after the jump above.
            if (bot.player.alive && bot.player.cell === (_cell ?? "Enter")) {
                bot.send.packet(this.aggroMonPacket(...AggroMonMapIDs));
            }
        });
    }

    /** Whether the aggro handler runs (C#'s `aggroCTS` is set). */
    private aggroRunning = false;

    /** Stops/Pauses the Aggro Mon Task. Clear will clear the stored settings like AggroMonClear so you can set a new one. */
    aggroMonStop(clear = false): void {
        bot.options.attackWithoutTarget = false;
        // C# cancels the task and waits for it to end (retrying); removing the handler ends it.
        bot.handlers.remove("AggroMon");
        this.aggroRunning = false;
        if (clear) {
            this.aggroMonClear();
        }
        Core.jump(bot.player.cell, bot.player.pad);
    }

    /** Set the AggroMon using Cells. Aggros everything in the Cell. */
    aggroMonCells(...cells: string[]): void {
        this._AggroMonCells = [...cells];
    }

    /** Set the AggroMon using Monster Names. Aggros everything with the specified name. */
    aggroMonNames(...names: string[]): void {
        this._AggroMonNames = [...names];
    }

    /** Set the AggroMon using Monster IDs. Aggros everything using the specified ID. */
    aggroMonIDs(...monsterIDs: number[]): void {
        this._AggroMonIDs = [...monsterIDs];
    }

    /** Set the AggroMon using Monster Map IDs. Aggros everything using the specified Map ID. */
    aggroMonMIDs(...monsterMapIDs: number[]): void {
        this._AggroMonMIDs = [...monsterMapIDs];
    }

    private get _AggroMonCells(): string[] {
        return (this.__AggroMonCells ??= []);
    }
    private set _AggroMonCells(value: string[]) {
        this.__AggroMonCells = value;
    }
    private __AggroMonCells: string[] = [];

    private get _AggroMonNames(): string[] {
        return (this.__AggroMonNames ??= []);
    }
    private set _AggroMonNames(value: string[]) {
        this.__AggroMonNames = value;
    }
    private __AggroMonNames: string[] = [];

    private get _AggroMonIDs(): number[] {
        return (this.__AggroMonIDs ??= []);
    }
    private set _AggroMonIDs(value: number[]) {
        this.__AggroMonIDs = value;
    }
    private __AggroMonIDs: number[] = [];

    private get _AggroMonMIDs(): number[] {
        return (this.__AggroMonMIDs ??= []);
    }
    private set _AggroMonMIDs(value: number[]) {
        this.__AggroMonMIDs = value;
    }
    private __AggroMonMIDs: number[] = [];

    /** Clears the stored Monster Cells/Names/IDs so you can set another AggroMon. */
    aggroMonClear(): void {
        this._AggroMonCells.splice(0);
        this._AggroMonNames.splice(0);
        this._AggroMonIDs.splice(0);
        this._AggroMonMIDs.splice(0);
        this._SmartAggroMonCells.splice(0);
    }

    aggroMonPacket(...MonsterMapIDs: number[]): string {
        return `%xt%zm%aggroMon%${bot.map.roomId}%${MonsterMapIDs.join("%")}%`;
    }

    smartAggroMonStart(map: string, ...monsters: (string | null)[]): void {
        Core.privateRooms = true;
        Core.privateRoomNumber = this.getRoomNr();
        bot.map.join(`${map}-${Core.privateRoomNumber}`, undefined, undefined, undefined, false);
        bot.wait.forMapLoad(map);

        //Devining variables
        const _monsters = bot.monsters.mapMonsters.filter((m) => !!m.name && monsters.some((name) => name === m.name));
        const cellComparison = new Map<string, number>();

        //Prioritizing monsters of which fewer excist
        for (const m of _monsters) {
            if (!cellComparison.has(m.cell)) {
                cellComparison.set(m.cell, _monsters.filter((t) => t.name === m.name).length);
            }
        }
        const SortedDict = [
            ...new Map(
                [...cellComparison]
                    .sort((a, b) => compare(((kvp) => kvp[1])(a), ((kvp) => kvp[1])(b)))
                    .map((x) => [((pair) => pair[0])(x), ((pair) => pair[1])(x)]),
            ).keys(),
        ];

        //Special option on DivideOnCells, which will have it store all cells that it divides people to
        this._getCellsForSmartAggroMon = true;
        this.divideOnCells(...SortedDict);
        this._getCellsForSmartAggroMon = false;

        this.aggroMonCells(...[...this._SmartAggroMonCells]);
        //leaving this here incase... somethings broke?
        // AggroMonCells(Core.ButlerOnMe() ? new[] { Bot.Player.Cell } : _SmartAggroMonCells.ToArray());
        this.aggroMonStart(map);
    }

    private _getCellsForSmartAggroMon = false;
    private get _SmartAggroMonCells(): string[] {
        return (this.__SmartAggroMonCells ??= []);
    }
    private set _SmartAggroMonCells(value: string[]) {
        this.__SmartAggroMonCells = value;
    }
    private __SmartAggroMonCells: string[] = [];

    runGeneratedAggroMon(
        map: string,
        monNames: string[],
        questIDs: number[],
        classtype: ClassType,
        drops: string[] | null = null,
    ): void {
        if (classtype !== ClassType.None) {
            Core.equipClass(classtype);
        }

        if (questIDs.length > 0) {
            Core.registerQuests(...[...questIDs]);
        }

        if (drops == null || drops.length === 0 || drops.every((x) => !x)) {
            bot.drops.stop();
        } else {
            Core.addDrop(...[...drops]);
        }

        this.smartAggroMonStart(map, ...[...monNames]);

        while (!bot.shouldExit) {
            monNames.forEach((monName) => {
                bot.combat.attack(monName);
                Core.sleep(500);
            });
        }
        this.aggroMonStop(true);

        if (questIDs.length > 0) {
            Core.cancelRegisteredQuests();
        }
    }

    //#region Script Options
    player1 = option.text("player1", "Account #1", "Name of one of your accounts.", "");
    player2 = option.text("player2", "Account #2", "Name of one of your accounts.", "");
    player3 = option.text("player3", "Account #3", "Name of one of your accounts.", "");
    player4 = option.text("player4", "Account #4", "Name of one of your accounts.", "");
    player5 = option.text("player5", "Account #5", "Name of one of your accounts.", "");
    player6 = option.text("player6", "Account #6", "Name of one of your accounts.", "");
    player7 = option.text("player7", "Account #7", "Name of one of your accounts.", "");
    player8 = option.text("player8", "Account #8", "Name of one of your accounts.", "");
    player9 = option.text("player9", "Account #9", "Name of one of your accounts.", "");
    player10 = option.text("player10", "Account #10", "Name of one of your accounts.", "");
    player11 = option.text("player11", "Account #11", "Name of one of your accounts.", "");
    player12 = option.text("player12", "Account #12", "Name of one of your accounts.", "");
    player13 = option.text("player13", "Account #13", "Name of one of your accounts.", "");
    player14 = option.text("player14", "Account #14", "Name of one of your accounts.", "");
    player15 = option.text("player15", "Account #15", "Name of one of your accounts.", "");
    player16 = option.text("player16", "Account #16", "Name of one of your accounts.", "");
    player17 = option.text("player17", "Account #17", "Name of one of your accounts.", "");
    player18 = option.text("player18", "Account #18", "Name of one of your accounts.", "");
    player19 = option.text("player19", "Account #19", "Name of one of your accounts.", "");
    player20 = option.text("player20", "Account #20", "Name of one of your accounts.", "");

    packetDelay = option.int(
        "PacketDelay",
        "Delay for Packet Spam",
        "Sets the delay for the Packet Spam\n" +
            "Increase if spamming too much - Decrease if missing kills\n" +
            "Recommended setting: 500 or 1000)",
        500,
    );

    //#endregion
    //#endregion
    //#region Party Management
    partyInvite(Name: string): void {
        bot.send.packet(`%xt%zm%gp%1%pi%${Name}%`);
    }

    private partyAccept(partyID: number): void {
        bot.send.packet(`%xt%zm%gp%1%pa%${partyID}%`);
    }

    partyKick(Name: string): void {
        bot.send.packet(`%xt%zm%gp%1%pk%${Name}%`);
    }

    partyLeave(): void {
        bot.send.packet(`%xt%zm%gp%1%pl%`);
    }

    partySummon(Name: string): void {
        bot.send.packet(`%xt%zm%gp%1%ps%${Name}%`);
    }

    partySummonAccept(): void {
        bot.send.packet("%xt%zm%gp%1%psa%");
    }

    partyPromote(Name: string): void {
        bot.send.packet(`%xt%zm%gp%1%pp%${Name}%`);
    }

    partyOn(): void {
        bot.send.packet("%xt%zm%cmd%1%partyon%");
    }

    partyMemberArray(): string[] | null {
        const members = bot.flash.get<string[] | null>("world.partyMembers");
        return members ? [...members, Core.username().toLowerCase()] : null;
    }

    getPartyLeader(): string | null {
        return bot.flash.get<string>("world.partyOwner");
    }

    isPartyLeader(): boolean {
        return Core.username().toLowerCase() === (this.getPartyLeader() ?? "").toLowerCase();
    }

    getPartyID(): number {
        return bot.flash.get<number>("world.partyID");
    }

    partyManagement(packet: any): void {
        const type = packet["params"].type;
        const data = packet["params"].dataObj;
        if (type === "json") {
            const cmd = data.cmd;
            switch (cmd) {
                //When being invited for a party, accept
                case "pi": {
                    //string sender = data.owner;
                    const partyID = data.pid;
                    //if (sender.ToLower() == PartyLeader)
                    //{
                    this.partyAccept(partyID);
                    Core.logger(`Joined the party`);
                    Core.sleep();
                    bot.map.jump(bot.player.cell, bot.player.pad);
                    //}
                    break;
                }
                //When being summoned by someone, accept
                case "ps":
                    this.partySummonAccept();
                    Core.logger(`Accepted the summon`);
                    break;
                //When someone leaves the party (stopped their bot), stop the bot
                case "pr": {
                    // C# checks `stopping` (always false), so it never stopped.
                    if (!bot.shouldExit && !this.stopping) {
                        this.stopping = true;
                        Core.logger(`A member has left the party, stopping the bot`);
                        bot.stop();
                    }
                    break;
                }
            }
        }
    }

    private stopping = false;

    //#endregion
    //#region Utility
    monsterAvail(monsterList: string[]): boolean {
        for (let i = 0; i < monsterList.length; i++) {
            if (this.isMonsterAlive(monsterList[i])) {
                return true;
            }
        }
        return false;
    }

    doPriorityAttack(monsterList: string[]): void {
        for (let i = 0; i < monsterList.length; i++) {
            if (this.isMonsterAlive(monsterList[i])) {
                if (/^\s*[+-]?\d+\s*$/.test(monsterList[i])) {
                    bot.combat.attack(parseInt(monsterList[i]));
                    return;
                }
            }
        }
    }

    isMonsterAlive(monster: string): boolean {
        try {
            const jsonData = bot.flash.call("availableMonsters");
            if (!jsonData) {
                // Core.Logger("Failed to retrieve available monsters data.");
                return false;
            }
            const monsters = JSON.parse(jsonData);

            if (monsters.length === 0) {
                return false;
            }

            if (monster === "*") {
                for (const mon of monsters) {
                    const intState = mon["intState"]?.toString();
                    if (!intState || intState === "1" || intState === "2") {
                        return true;
                    }
                }
                return false;
            }

            const isByMapID = monster.startsWith("id-");
            const identifier = isByMapID ? monster.substring(3) : monster;

            for (const mon of monsters) {
                const match = isByMapID
                    ? mon["MonMapID"]?.toString() === identifier
                    : mon["strMonName"]?.toString() === identifier;

                if (match) {
                    const intState = mon["intState"]?.toString();
                    if (!intState || intState === "1" || intState === "2") {
                        return true;
                    } else if (intState === "0") {
                        return false;
                    }
                }
            }

            return true;
        } catch (error) {
            rethrowIfStopped(error);

            return true;
        }
    }

    startFarm(item: string, quant: number): void {
        let needSendDone = true;
        let countCheck = 0;
        while (!bot.shouldExit) {
            if (Core.checkInventory(item, quant) && needSendDone) {
                if (this.sendDone()) {
                    needSendDone = false;
                }
            }
            if (!needSendDone && this.isDone() && countCheck === 10) {
                break;
            }
            countCheck++;
            if (countCheck > 10) {
                countCheck = 0;
            }

            // killing monster
            if (this.isMonsterAlive("*")) {
                bot.combat.attack("*");
            }

            bot.sleep(100);
        }
    }

    startFarmRep(faction: string, rank: number): void {
        let needSendDone = true;
        let countCheck = 0;
        while (!bot.shouldExit) {
            if (Farm.factionRank(faction) >= rank && needSendDone) {
                if (this.sendDone()) {
                    needSendDone = false;
                }
            }
            if (!needSendDone && this.isDone() && countCheck === 10) {
                break;
            }
            countCheck++;
            if (countCheck > 10) {
                countCheck = 0;
            }

            if (this.isMonsterAlive("*")) {
                bot.combat.attack("*");
            }

            bot.sleep(100);
        }
    }

    startFarmGold(quant: number): void {
        let needSendDone = true;
        let countCheck = 0;
        while (!bot.shouldExit) {
            if (bot.player.gold >= quant && needSendDone) {
                if (this.sendDone()) {
                    needSendDone = false;
                }
            }
            if (!needSendDone && this.isDone() && countCheck === 10) {
                break;
            }
            countCheck++;
            if (countCheck > 10) {
                countCheck = 0;
            }

            if (this.isMonsterAlive("*")) {
                bot.combat.attack("*");
            }

            bot.sleep(100);
        }
    }

    /**
     * Generates a unique 5-digit room number based on the machine name,
     * username, and the current date and time (with a 5-hour offset). The
     * output is deterministic for a given machine and user, ensuring no
     * leading zeros in the returned integer.
     *
     * @returns A unique 5-digit integer room number that does not start
     * with a zero.
     */
    getRoomNr(): number {
        // C# hashes the machine name, user name and the hour; Turu's engine does the same with
        // its data folder in place of the machine name.
        return bot.army.roomNumber();
    }

    /**
     * Spreads players around the input cells, if no cells are set - will spread to any cell that has a monster in it.
     * If player count is more than cell count, will add players to the cells listed in order. Example: c1: P1 + P4, c2: P2, c3: P3
     */
    divideOnCells(...cells: string[]): void {
        // Parsing all the player names from an unspecified amount of player name options
        const _players = this.players();

        // If no paramaters are given, select all cells that have monsters in them
        if (cells == null || cells.length === 0) {
            const monsters = bot.monsters.mapMonsters;
            if (monsters == null || monsters.length === 0) {
                return;
            }

            const _cells: string[] = [];
            for (const cell of monsters.map((m) => m.cell)) {
                if (!_cells.includes(cell)) {
                    _cells.push(cell);
                }
            }
            cells = [...[..._cells].sort((a, b) => compare(((x) => x)(a), ((x) => x)(b)))];
        }

        //Dividing the players amongst the cells
        let cellCount = 0;
        const username = Core.username().toLowerCase();
        for (const p of _players) {
            const cell = cells[cellCount];
            if (this._getCellsForSmartAggroMon && !this._SmartAggroMonCells.includes(cell)) {
                this._SmartAggroMonCells.push(cell);
            }

            if (username === p) {
                bot.map.jump(cell, "Left", false);
                bot.wait.forCellChange(cell);
                bot.player.setSpawnPoint();
            }
            cellCount = cellCount === cells.length - 1 ? 0 : cellCount + 1;
        }
    }

    divideOnCellsPriority(
        cells: string[],
        priorityCell: string,
        setAggro = false,
        log = false,
        equipClass = false,
    ): void {
        // Parsing all the player names from an unspecified amount of player name options
        const _players = this.players();
        if (log) {
            Core.logger(`divide on cells: ${cells.join(",")}. priority cell: ${priorityCell}`);
        }

        if (setAggro) {
            this.cellToAggro.splice(0);
            const playerCount = _players.length;
            const _cellCount = cells.length;
            const aggroCell = playerCount > _cellCount ? _cellCount : playerCount;
            for (let i = 0; i < aggroCell; i++) {
                this.cellToAggro.push(cells[i]);
            }
            this.aggroMonCells(...[...this.cellToAggro]);
        }

        if (!priorityCell) {
            let cellCount = 0;
            const username = Core.username().toLowerCase();
            for (const p of _players) {
                const cell = cells[cellCount];
                if (username === p) {
                    Core.logger(`i am on cell: ${cell}`);
                    Core.jump(cell, "Left");
                }
                cellCount = cellCount === cells.length - 1 ? 0 : cellCount + 1;
            }
        } else {
            const playersCount = _players.length;
            const username = Core.username().toLowerCase();
            // Username of the player running this method
            for (let i = 0; i < playersCount; i++) {
                const p = _players[i];
                const cell = cells.length > 0 && i < cells.length ? cells[i] : priorityCell;
                // Get the cell for the current player

                if (username === p) {
                    Core.logger(`i am on cell: ${cell}`);
                    if (equipClass) {
                        if (cell === priorityCell) {
                            Core.equipClass(ClassType.Solo);
                        } else {
                            Core.equipClass(ClassType.Farm);
                        }
                    }
                    Core.jump(cell, "Left");
                }
            }
        }
    }

    waitForSignal(message: string, players: string[] | null = null, delPrevMsg = false): void {
        this.registerMessage(message, delPrevMsg);
        while (!bot.shouldExit) {
            this.sendDone(10);
            if (this.isAlreadyInLog([Core.username().toLowerCase()])) {
                break;
            }
            bot.sleep(500);
        }
        while (!bot.shouldExit) {
            if (players == null ? this.isDone(10) : this.isDone(10, players)) {
                break;
            }
            bot.sleep(500);
        }
    }

    /**
     * Waits for the party members to join the specified cell in the game.
     * If no cell is specified, it checks the current cell for the required
     * player count. Logs the final list of players and monitors until all
     * expected players are present, a timeout occurs, or the bot exits.
     *
     * @param cell The cell to jump to. If null, the current cell is used.
     * @param pad The direction to pad when jumping; defaults to "Left".
     * @param playerCount The expected number of players; defaults to the party size.
     * @param timeoutSeconds Optional timeout in seconds; defaults to 60s.
     */
    waitForPartyCell(
        cell: string | null = null,
        pad: string | null = null,
        playerCount: number | null = null,
        timeoutSeconds = 60,
    ): void {
        // Jump to the specified cell if provided
        if (!!cell) {
            bot.map.jump(cell, pad ?? "Left", false);
            bot.wait.forCellChange(cell);
        }

        // Normalize expected player names
        const expectedPlayers = this.players()
            .filter((p) => !!p?.trim())
            .map((p) => p.trim().toLowerCase());

        const requiredCount = playerCount ?? this.partySize();

        Core.logger(`Waiting for players: ${expectedPlayers.join(", ")}`);

        const startTime = Date.now();

        while (!bot.shouldExit && bot.map.playerNames != null) {
            // Timeout check
            if ((Date.now() - startTime) / 1000 > timeoutSeconds) {
                Core.logger("Timeout reached. Lobby may be bugged or some players are missing.");
                break;
            }

            // Normalize current map player names
            const currentPlayers = new Set(
                bot.map.playerNames.filter((x) => !!x?.trim()).map((x) => x.trim().toLowerCase()),
            );

            // Determine missing players
            const missing = expectedPlayers.filter((p) => !currentPlayers.has(p));

            if (!(missing.length > 0) && currentPlayers.size >= requiredCount) {
                Core.logger("All players found!");
                break;
            }

            if (missing.length > 0) {
                Core.logger(`Missing: ${missing.join(", ")}`);
            }

            Core.sleep(1000);
        }
    }

    players(): string[] {
        const players: string[] = [];
        let index = 1;

        while (!bot.shouldExit && index <= 20) {
            if (bot.config == null) {
                Core.logger("Configuration is null.");
                break;
            }

            // Retrieve player names from the configuration
            // C#'s Config.Get is null for an option the script lacks; Turu's get throws.
            const playerName = configOr(`player${index}`, "");

            // If the player name is null or empty, continue to the next index
            if (!playerName) {
                index++;
                // Skip to the next player index
                continue;
                // Continue to the next loop iteration
            }

            // Add the player's name to the list and log it
            players.push(playerName.toLowerCase().trim());

            index++;
            // Increment the index after processing
        }

        return [...players];
    }

    partySize(): number {
        return this.players() == null ? 0 : this.players().filter((x) => !!x).length;
    }

    // public void waitForParty(string map, string? item = null, int playerMax = -1)
    // {
    //     Bot.Events.PlayerAFK += PlayerAFK;
    //     string[] players = Players();
    //     int partySize = players.Length;
    //     List<string> playersWhoHaveBeenHere = new() { Core.Username() };
    //     int playerCount = 1;

    //     int logCount = 0;
    //     int butlerTimer = 0;
    //     bool hasWaited = false;

    //     Core.Join(map);
    //     int dynamicPartySize = playerMax == -1 ? partySize : playerMax;

    //     while (playerCount < dynamicPartySize)
    //     {
    //         if (Bot.Map.PlayerNames != null)
    //             foreach (var name in Bot.Map.PlayerNames)
    //                 if (!playersWhoHaveBeenHere.Contains(name) && players.Select(x => x.ToLower().Trim()).Contains(name.ToLower()))
    //                     playersWhoHaveBeenHere.Add(name);
    //         playerCount = playersWhoHaveBeenHere.Count;

    //         logCount++;
    //         if (logCount == 15)
    //         {
    //             Core.Logger($"Waiting for the party{(item == null ? string.Empty : (" to farm " + item))} [{playerCount}/{dynamicPartySize}]");
    //             hasWaited = true;
    //             logCount = 0;
    //         }
    //         Core.Sleep(1000);

    //         if (playersWhoHaveBeenHere.Count == (dynamicPartySize - 1))
    //             butlerTimer++;
    //         if (butlerTimer >= 30)
    //         {
    //             b_breakOnMap = Bot.Map.Name;
    //             string toFollow = players.First(p => !playersWhoHaveBeenHere.Any(n => n.ToLower() == p.ToLower().Trim()));
    //             Core.Logger($"Missing {toFollow}, initiating Butler.cs");
    //             Core.Logger("Butler active until in map /" + b_breakOnMap);
    //             Butler(toFollow, roomNr: getRoomNr());
    //             Core.Logger($"{toFollow} has joined {b_breakOnMap}. continuing");
    //             Bot.Events.PlayerAFK -= PlayerAFK;
    //             break;
    //         }
    //     }
    //     if (hasWaited)
    //         Core.Logger($"Party complete [{partySize}/{partySize}]");
    //     Core.Sleep(3500); //To make sure everyone attack at the same time, to avoid deaths

    //     void PlayerAFK()
    //     {
    //         Core.Logger("Anti-AFK engaged");
    //         Core.Sleep(1500);
    //         Bot.Send.Packet("%xt%zm%afk%1%false%");
    //     }
    // }

    /**
     * Waits until all expected party members are present in the specified map.
     * Tracks players, logs progress, and uses Butler.cs to fetch missing players
     * if they fail to join within the given wait time. Also engages anti-AFK.
     *
     * @param map The map name to join and wait in.
     * @param item Optional: Item name for contextual logging (e.g., farming target).
     * @param playerMax The expected number of players in the party.
     * If -1 (default), uses {@link PartySize}.
     */
    waitForParty(map: string, item: string | null = null, playerMax: number = -1): void {
        const TrackPlayers = (expected: string[], seen: Set<string>): void => {
            if (bot.map.playerNames == null) {
                return;
            }

            for (const name of bot.map.playerNames) {
                if (expected.includes(name)) {
                    seen.add(name);
                }
            }
        };
        const HandleMissingPlayer = (missing: string, seen: Set<string>, currentMap: string): void => {
            this.b_breakOnMap = bot.map.name;

            Core.logger(`Missing ${missing}, initiating Butler.cs`);
            Core.logger(`Butler active until in map /${currentMap}`);

            this.butler(missing, undefined, undefined, undefined, undefined, this.getRoomNr());

            Core.logger(`${missing} has rejoined ${this.b_breakOnMap}. Continuing...`);
            seen.add(missing);
        };
        const PlayerAFK = (): void => {
            Core.logger("Anti-AFK engaged");
            Core.sleep(1500);
            bot.send.packet("%xt%zm%afk%1%false%");
        };
        bot.events.on("playerAFK", PlayerAFK);

        const allPlayers = this.players();
        const targetPartySize = playerMax > 0 ? playerMax : this.partySize();

        const playersHere = new Set([Core.username()]);

        Core.join(map, "Enter", "Spawn");
        bot.wait.forMapLoad(map);

        let logCount = 0;
        let butlerTimer = 0;
        let hasWaited = false;

        while (playersHere.size < targetPartySize && !bot.shouldExit) {
            TrackPlayers(allPlayers, playersHere);

            if (++logCount >= 15) {
                Core.logger(
                    `Waiting for the party${item == null ? "" : ` to farm ${item}`} [${playersHere.size}/${targetPartySize}]`,
                );
                hasWaited = true;
                logCount = 0;
            }

            Core.sleep(1000);

            if (playersHere.size < targetPartySize && ++butlerTimer >= 30) {
                const missingPlayers = allPlayers.filter((p) => !playersHere.has(p));
                for (const missing of missingPlayers) {
                    HandleMissingPlayer(missing, playersHere, map);
                }

                // Reset timers
                butlerTimer = 0;
                logCount = 0;
            }
        }

        if (hasWaited) {
            Core.logger(`Party complete [${targetPartySize}/${targetPartySize}]`);
        }

        Core.sleep(3500);

        // --- Helpers ---
    }

    sellToSync(item: string | null, quant: number): boolean {
        if (Core.checkInventory(item, quant) || item == null) {
            return true;
        }
        if (this.sellToSyncOn) {
            Core.sellItem(item, undefined, { all: true });
        }
        return false;
    }

    sellToSyncOn = false;
    //#endregion
    //#region OneClient
    doForAll(): boolean {
        if (bot.shouldExit || this._doForAllIndex >= (this.doForAllAccountDetails ??= this.readManager())?.length) {
            return false;
        }
        bot.options.autoRelogin = false;
        bot.options.autoReloginAny = false;
        // Pick current account safely
        if (this.doForAllAccountDetails == null || this._doForAllIndex >= this.doForAllAccountDetails.length) {
            return false;
        }
        const name = this.doForAllAccountDetails[this._doForAllIndex++];
        // Login if necessary
        if (!(Core.username()?.toLowerCase() === name?.toLowerCase())) {
            if (bot.player.loggedIn) {
                bot.servers.logout();
                bot.wait.forTrue(() => !bot.player.loggedIn, 20);
            }
            // C# logs in with the password Skua Manager saved; Turu reads it from the keychain.
            if (!bot.army.login(name)) {
                Core.logger(`${name} has no saved password in Army > Accounts, skipping it.`, "AccountManager");
                return this.doForAll();
            }
            bot.wait.forTrue(() => bot.player.loggedIn, 20);
            bot.wait.forTrue(() => bot.player.loaded, 20);
        }
        Core.isMember = bot.player.isMember;

        // Connect to Twilly or Twig
        const targetServer = randomInt(0, 2) === 0 ? "Twilly" : "Twig";
        bot.servers.connect(targetServer);
        bot.wait.forTrue(() => bot.player.loaded, 30);
        bot.wait.forMapLoad("battleon");

        // Enter house or whitemap
        if (bot.house?.items?.some((i) => i?.equipped === true) === true) {
            bot.send.packet(`%xt%zm%house%1%${bot.player.username}%`);
            bot.wait.forMapLoad("house");
            Core.sleep();
        } else {
            Core.join("whitemap");
        }
        // Open bank if not already
        if (bot.flash?.get("ui.mcPopup.currentLabel") !== '"Bank"') {
            bot.bank?.open();
        }
        bot.bank?.load();
        Core.readCbo();
        return true;
    }
    /** The accounts of Army > Accounts (C# reads Skua Manager's `skua.settings.json`). */
    private readManager(): string[] {
        const toReturn = bot.army.accounts();

        if (toReturn.length <= 0) {
            Core.logger("No valid accounts found. Add accounts in Army > Accounts.", "AccountManager", {
                messageBox: true,
            });
            bot.stop();
        }

        return toReturn;
    }
    private _doForAllIndex = 0;
    /** The usernames `doForAll` goes through (C# keeps their passwords too). */
    doForAllAccountDetails: string[] | null = null;
    readonly blacklistedServers: string[] = [
        "artix",
        "sir ver",
        "yorumi",
        "gravelyn",
        "galanoth",
        "class test realm",
        // C#'s `$"{null}"` is ""
        "",
    ];
    //#endregion
    //#region Butler
    butler(
        playerName: string,
        LockedMaps = true,
        LockedMapsList: string | null = null,
        classType: ClassType = ClassType.Farm,
        CopyWalk = false,
        roomNr = 1,
        rejectDrops = true,
        attackPriority: string | null = null,
        hibernateTimer = 0,
    ): void {
        bot.events.on("playerAFK", this.playerAFK);

        //#region Initialization and Setup
        if (!playerName || playerName === "Insert Name") {
            Core.logger("No name was inserted, stopping the bot.", undefined, { messageBox: true, stopBot: true });
        }

        if (roomNr <= 0) {
            roomNr = Core.privateRoomNumber;
        }

        playerName = playerName.trim().toLowerCase();
        this.b_playerName = playerName;

        // Setup parameters
        this.b_doLockedMaps = LockedMaps;
        this.b_doCopyWalk = CopyWalk;
        this.b_hibernationTimer = hibernateTimer;
        this.b_shouldHibernate = this.b_hibernationTimer > 0;

        if (!!attackPriority) {
            this._attackPriority.push(...attackPriority.split(","));
        }

        if (!!LockedMapsList) {
            this._LockedMapsList.push(...LockedMapsList.split(","));
        }

        // C# creates its communication file for the player here (not ported, see the top).

        // Setting up private room if needed
        if (roomNr !== 999999 && roomNr >= 1000) {
            Core.privateRooms = true;
            Core.privateRoomNumber = roomNr;
        }

        const bypasses = [598, 3004, 3008, 3484, 3799, 4616, 8107, 9126, 5915, 9814, 7522];
        bot.quests.load(...bypasses);
        for (const questId of bypasses) {
            bot.quests.updateQuest(questId);
        }
        Core.setAchievement(18);
        // doomvaultb
        if (bot.player.level < 100) {
            bot.send.clientPacket(
                '{"t":"xt","b":{"r":-1,"o":{"cmd":"levelUp","intExpToLevel":"0","intLevel":100}}}',
                "json",
            );
        }
        // level bypass
        //#endregion
        const retryLimit = 5;
        // Set retry limit
        let retryCount = 0;
        // Track number of retries
        let playerObject: PlayerInfo | null = emptyPlayer();
        // Initialize player object

        while (!bot.shouldExit) {
            //#region Ignore me
            // Try to /goto the player with retry logic
            while (
                !this.tryGoto(playerName, roomNr) &&
                (playerObject = this.gotoPlayer) != null &&
                retryCount < retryLimit
            ) {
                // Increment retry count and log the attempt
                retryCount++;
                Core.logger(`Attempt ${retryCount} to find ${playerName} failed. Retrying...`);

                // Handle combat disengagement and fallback
                // ExitCombat();

                // Join fallback map if /goto fails
                if (bot.house.items.some((h) => h.equipped)) {
                    const modifyPacket = (packet: EventMap["extensionPacket"]): void => {
                        const type = packet["params"].type;
                        const data = packet["params"].dataObj;
                        if (type != null && type === "json" && data.houseData != null) {
                            toSend = `{"t":"xt","b":{"r":-1,"o":{"cmd":"moveToArea","areaName":"house","uoBranch":${JSON.stringify(data.uoBranch)},"strMapFileName":"${data.strMapFileName}","intType":"1","monBranch":[],"houseData":${JSON.stringify(data.houseData).replace(new RegExp(Core.username().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), "Skua user")},"sExtra":"","areaId":${data.areaId},"strMapName":"house"}}}`;
                            bot.events.off("extensionPacket", modifyPacket);
                        }
                    };
                    let toSend: string | null = null;
                    bot.events.on("extensionPacket", modifyPacket);
                    bot.send.packet(`%xt%zm%house%1%${Core.username()}%`);
                    bot.wait.forMapLoad("house");
                    // C# finishes on a Task.Run; scripts are single-threaded, so it runs here.
                    bot.wait.forMapLoad("house");
                    if (bot.wait.forTrue(() => toSend != null, 20)) {
                        bot.send.clientPacket(toSend!, "json");
                    }
                    bot.events.off("extensionPacket", modifyPacket);
                    for (let i = 0; i < 7; i++) {
                        bot.send.clientServer(" ", "");
                    }
                } else {
                    bot.send.packet(`%xt%zm%cmd%1%tfer%${Core.username()}%whitemap-${Core.privateRoomNumber}%`);
                }

                Core.logger(`Could not find ${playerName}. Ensure they are on the same server.`, "tryGoto");

                if (this.b_shouldHibernate) {
                    Core.logger(`Bot will hibernate and retry every ${hibernateTimer} seconds.`, "tryGoto");
                }

                //#region Hybernation
                let elapsedMinutes = 0;

                // Enter hibernation retry loop
                while (!bot.shouldExit) {
                    if (this.b_shouldHibernate) {
                        // Sleep for the hibernate period
                        for (let t = 0; t < hibernateTimer; t++) {
                            Core.sleep(1000);
                            if (bot.shouldExit) {
                                break;
                            }
                        }
                    }

                    // Retry /goto after hibernation
                    if (this.tryGoto(playerName, roomNr) && (playerObject = this.gotoPlayer) != null) {
                        break;
                    }

                    // Increment elapsed minutes and log every 5 minutes
                    elapsedMinutes += hibernateTimer;
                    if (elapsedMinutes >= 300) {
                        Core.logger(`Bot has been hibernating for ${elapsedMinutes / 60} minutes.`);
                        elapsedMinutes = 0;
                    }
                }

                // After several failed retries, consider adding a dynamic fallback strategy
                if (retryCount >= retryLimit) {
                    Core.logger(
                        `Unable to locate ${playerName} after ${retryLimit} attempts, performing alternative action.`,
                    );
                    // e.g., join a specific map or wait before retrying
                    Core.join("whitemap");
                }
                if (this.tryGoto(playerName, roomNr) && (playerObject = this.gotoPlayer) != null) {
                    Core.logger(`${playerName} found!`);
                    break;
                }
                //#endregion Hybernation
            }

            if (retryCount >= retryLimit) {
                break;
                // Exit Butler method after retry limit reached
            }

            // Check for break on specific map
            if (this.b_breakOnMap != null && this.b_breakOnMap === bot.map.name) {
                this.b_breakOnMap = null;
                break;
            }
            //#endregion Ignore me
            //#region Combat Area
            // Check if there are monsters in the same cell
            while (!bot.shouldExit) {
                // Exit early if {playerName} is not in the map
                if (
                    bot.map.playerNames != null &&
                    bot.map.playerNames.length > 0 &&
                    !bot.map.playerNames.includes(playerName)
                ) {
                    Core.logger(`${playerName} is not in the map`);
                    break;
                }

                //#region ignore this
                // Handle combat based on attack priority or attack all
                while (!bot.shouldExit && !bot.player.alive) {
                    Core.sleep();
                }

                if (!!attackPriority) {
                    const Mons: string[] = [];
                    if (!!attackPriority) {
                        const attackPriorityItems = attackPriority.split(",");
                        Mons.push(...attackPriorityItems);
                    }
                    if (!bot.combat.stopAttacking) {
                        this.priorityAttack(Mons);
                    }
                } else {
                    if (!bot.combat.stopAttacking) {
                        bot.combat.attack("*");
                        // Attack any monster if no priority exists
                        Core.sleep();
                        // Pause to avoid busy waiting
                    }
                }

                // Ensure player is in the same cell
                if (
                    (playerObject = bot.map.getPlayer(playerName)) != null &&
                    playerObject != null &&
                    playerObject?.cell !== bot.player.cell
                ) {
                    bot.map.jump(playerObject?.cell ?? bot.player.cell, playerObject?.pad ?? bot.player.pad, false);
                    bot.wait.forCellChange(playerObject?.cell ?? bot.player.cell);
                    Core.sleep();
                    bot.player.setSpawnPoint();
                }
            }
            //#endregion Combat Area
            //itll get here if the player isnt in the map
        }

        this.butlerStop();
    }

    playerAFK = (): void => {
        Core.logger("Anti-AFK engaged");
        Core.sleep(1500);
        bot.send.packet("%xt%zm%afk%1%false%");
    };

    b_playerName: string | null = null;
    b_doLockedMaps = true;
    b_doCopyWalk = false;
    b_hibernationTimer = 0;
    b_shouldHibernate = true;
    get _attackPriority(): string[] {
        return (this.__attackPriority ??= []);
    }
    set _attackPriority(value: string[]) {
        this.__attackPriority = value;
    }
    __attackPriority: string[] = [];

    get _LockedMapsList(): string[] {
        return (this.__LockedMapsList ??= []);
    }
    set _LockedMapsList(value: string[]) {
        this.__LockedMapsList = value;
    }
    __LockedMapsList: string[] = [];

    /**
     * Goes to `userName` (and their cell); handles locked maps. C#'s `out this.gotoPlayer` is
     * {@link gotoPlayer} after the call.
     */
    tryGoto(userName: string, roomNumber: number): boolean {
        this.gotoPlayer = emptyPlayer();

        if (!userName?.trim()) {
            Core.logger("Invalid username.");
            return false;
        }

        let retry = 0;

        // Handle locked zones by subscribing to the event if necessary
        if (this.b_doLockedMaps) {
            bot.events.on("extensionPacket", this.lockedZoneListener);
        }

        while (!bot.shouldExit) {
            if (
                (this.gotoPlayer = bot.map.getPlayer(userName)) != null &&
                this.gotoPlayer != null &&
                this.gotoPlayer.cell === bot.player.cell
            ) {
                return true;
            }
            Core.jumpWait();
            Core.sleep();
            bot.player.goto(userName);
            Core.sleep();
            this.gotoPlayer =
                (this.gotoPlayer = bot.map.getPlayer(userName)) != null && this.gotoPlayer != null
                    ? this.gotoPlayer
                    : null;
            if ((this.gotoPlayer = bot.map.getPlayer(userName)) != null && this.gotoPlayer != null) {
                if (this.gotoPlayer != null && this.gotoPlayer?.cell === bot.player.cell) {
                    return true;
                }

                const targetCell = this.gotoPlayer?.cell ?? bot.player.cell;
                const targetPad = this.gotoPlayer?.pad ?? bot.player.pad;

                bot.map.jump(targetCell, targetPad, false);
                bot.wait.forCellChange(targetCell);
                Core.sleep();
                this.gotoPlayer =
                    (this.gotoPlayer = bot.map.getPlayer(userName)) != null && this.gotoPlayer != null
                        ? this.gotoPlayer
                        : null;

                if (this.gotoPlayer != null && this.gotoPlayer?.cell === bot.player.cell) {
                    return true;
                }
            }

            if (this.gotoPlayer != null && this.gotoPlayer.cell === bot.player.cell) {
                return true;
            }
            // Check for locked zone warning and handle it accordingly
            if (this.lockedZoneWarning) {
                break;
            }

            if (++retry >= 5) {
                break;
            }
            Core.sleep(1000);
        }

        // Handle locked zone scenario
        if (this.b_doLockedMaps && this.lockedZoneWarning && !this.insideLockedMaps) {
            this.lockedZoneWarning = false;
            this.lockedMaps(userName, false, roomNumber);
            // Handle the locked zone logic
            Core.toggleAggro(true);
            bot.events.off("extensionPacket", this.lockedZoneListener);
            return true;
        }

        // Unsubscribe from event once done
        bot.events.off("extensionPacket", this.lockedZoneListener);

        return false;
    }

    /** The player `tryGoto` last looked up (C#'s `out PlayerInfo? playerObject`). */
    gotoPlayer: PlayerInfo | null = null;

    exitCombat(): void {
        bot.options.attackWithoutTarget = false;
        bot.options.aggroAllMonsters = false;
        bot.options.aggroMonsters = false;

        const targetCell =
            bot.map.cells
                .filter(
                    (c) =>
                        !Core.blackListedJumptoCells.includes(c) &&
                        !bot.monsters.mapMonsters.some((m) => m != null && m.cell === c),
                )
                .find(
                    (c) => bot.map.cells.filter((cell) => cell.includes("Enter")).length > 1 || !c.includes("Enter"),
                ) ?? "Enter";

        bot.map.jump(targetCell, targetCell === "Enter" ? "Spawn" : "Left");
        bot.wait.forCellChange(targetCell);
        Core.sleep();
        Core.jumpWait();
    }

    lockedZoneWarning = false;
    mapUnavailable = false;
    insideLockedMaps = false;

    lockedZoneListener = (packet: EventMap["extensionPacket"]): void => {
        const type = packet["params"].type;
        const data = packet["params"].dataObj;

        if (type != null && type === "str") {
            const cmd = data[0];
            switch (cmd) {
                case "warning": {
                    const LockerZonePacket = JSON.stringify(packet);
                    if (LockerZonePacket.includes("a Locked zone.") || LockerZonePacket.includes("is not available.")) {
                        this.lockedZoneWarning = true;
                    }
                    break;
                }
            }
        }
    };

    lockedMaps(Pname: string, Cancel = false, RoomNumber = 100000, LockedMapList: string[] | null = null): void {
        LockedMapList ??= [];
        LockedMapList.push(...this._LockedMapsList);
        if (Cancel || bot.map.playerExists(Pname)) {
            Core.logger(`Already at ${Pname} or Cancel is true, stopping LockedMaps.`, "LockedMaps");
            return;
        }

        // Flatten any comma-separated entries
        LockedMapList = [...LockedMapList.flatMap((entry) => entry.split(","))];

        this._LockedMapsList.push(...LockedMapList.filter((map) => !this._LockedMapsList.includes(map)));

        if (this._LockedMapsList.length > 0) {
            Core.logger(`Custom locked maps added: ${LockedMapList.join(", ")}`);
        }

        if (Pname != null) {
            this.b_playerName = Pname;
        }

        // C# first tries the map the player's CoreBots wrote to its Butler file (not ported,
        // see the top), then searches the maps below.

        const NonMemMaps = [
            "tercessuinotlim",
            "doomvaultb",
            "doomvault",
            "shadowrealmpast",
            "battlegrounda",
            "battlegroundb",
            "battlegroundc",
            "battlegroundd",
            "battlegrounde",
            "battlegroundf",
            "doomwood",
            "shadowrealm",
            "confrontation",
            "darkoviaforest",
            "ledgermayne",
            "hollowdeep",
            "hyperium",
            "willowcreek",
            "voidflibbi",
            "voidnightbane",
            "championdrakath",
            "ultraezrajal",
            "ultrawarden",
            "ultraengineer",
            "ultradage",
            "ultratyndarius",
            "ultranulgath",
            "ultradrago",
            "ultradarkon",
            "ultraspeaker",
        ];
        const MemMaps = ["shadowlordpast", "binky", "superlowe"];
        const EventMaps: string[] = [];

        // Map and quests to use to see the boss without doing the story
        const UpdateQuest: [Map: string, QuestUpdate: number][] = [
            ["ultradrakath", 3879],
            ["bocklincastle", 102520],
            ["bocklingrove", 10239],
        ];

        const levelLockedMaps = [
            { map: "icestormunder", levelRequired: 75 },
            { map: "icewing", levelRequired: 75 },
            { map: "battlegrounde", levelRequired: 61 },
            { map: "voidxyfrag", levelRequired: 80 },
            { map: "voidnerfkitten", levelRequired: 80 },
        ];

        let maptry = 1;
        const mapCount =
            LockedMapList.length === 0
                ? Core.isMember
                    ? NonMemMaps.length + MemMaps.length + EventMaps.length + levelLockedMaps.length
                    : NonMemMaps.length + EventMaps.length + levelLockedMaps.length
                : LockedMapList.length;

        if (LockedMapList.length === 0) {
            for (const map of EventMaps) {
                if (bot.shouldExit) {
                    return;
                }

                if (!Core.isSeasonalMapActive(map)) {
                    continue;
                }

                Core.logger(
                    `[${this._LockedMapsList.length > 9 ? `${String(maptry).padStart(2, "0")}/${String(mapCount).padStart(2, "0")}` : `${maptry}/${mapCount}`}] Searching /${map}`,
                    "LockedZoneHandler => LockedMapList",
                );

                if (bot.map.name !== map) {
                    bot.map.join(`${map}-${RoomNumber}`, "Enter", "Spawn", undefined, false);
                    bot.wait.forMapLoad(map);
                }

                Core.sleep();

                if (
                    this.b_playerName != null &&
                    bot.map.playerNames != null &&
                    bot.map.playerNames.includes(this.b_playerName)
                ) {
                    Core.logger(`Found ${this.b_playerName} in /${map}`);
                    return;
                } else {
                    continue;
                }
            }

            for (const mapInfo of levelLockedMaps) {
                if (bot.shouldExit) {
                    return;
                }

                if (bot.player.level < mapInfo.levelRequired) {
                    Core.logger(
                        `Level too low for /${mapInfo.map} (required: ${mapInfo.levelRequired}, current: ${bot.player.level})`,
                    );
                    continue;
                }

                Core.logger(
                    `[${String(maptry++).padStart(2, "0")}/${String(mapCount).padStart(2, "0")}] Searching /${mapInfo.map}`,
                    "LockedZoneHandler =>  !LockedMapList",
                );

                if (bot.map.name !== mapInfo.map) {
                    bot.map.join(`${mapInfo.map}-${RoomNumber}`, "Enter", "Spawn", undefined, false);
                    bot.wait.forMapLoad(mapInfo.map);
                }

                Core.sleep();

                if (
                    this.b_playerName != null &&
                    bot.map.playerNames != null &&
                    bot.map.playerNames.includes(this.b_playerName)
                ) {
                    Core.logger(`Found ${this.b_playerName} in /${mapInfo.map}`);
                    return;
                } else {
                    continue;
                }
            }

            for (const map of NonMemMaps) {
                if (bot.shouldExit) {
                    return;
                }

                Core.logger(
                    `[${this._LockedMapsList.length > 9 ? `${String(maptry).padStart(2, "0")}/${String(mapCount).padStart(2, "0")}` : `${maptry}/${mapCount}`}] Searching /${map}`,
                    "LockedZoneHandler => LockedMapList",
                );

                bot.map.join(`${map}-${RoomNumber}`, "Enter", "Spawn", undefined, false);
                bot.wait.forMapLoad(map);

                Core.sleep(1500);

                if (
                    !!this.b_playerName &&
                    bot.map.playerNames?.length > 1 &&
                    bot.map.playerNames.includes(this.b_playerName)
                ) {
                    Core.logger(`Found ${this.b_playerName} in /${map}`);
                    return;
                } else {
                    continue;
                }
            }

            if (Core.isMember) {
                for (const map of MemMaps) {
                    if (bot.shouldExit) {
                        return;
                    }

                    Core.logger(
                        `[${this._LockedMapsList.length > 9 ? `${String(maptry).padStart(2, "0")}/${String(mapCount).padStart(2, "0")}` : `${maptry}/${mapCount}`}] Searching /${map}`,
                        "LockedZoneHandler => LockedMapList",
                    );

                    if (bot.map.name !== map) {
                        bot.map.join(`${map}-${RoomNumber}`, "Enter", "Spawn", undefined, false);
                        bot.wait.forMapLoad(map);
                    }

                    Core.sleep();

                    if (
                        this.b_playerName != null &&
                        bot.map.playerNames != null &&
                        bot.map.playerNames.includes(this.b_playerName)
                    ) {
                        Core.logger(`Found ${this.b_playerName} in /${map}`);
                        return;
                    } else {
                        continue;
                    }
                }
            }
        } else {
            for (const [Map, QuestUpdate] of UpdateQuest) {
                if (bot.shouldExit) {
                    return;
                }

                if (bot.map.name !== Map) {
                    bot.map.join(`${Map}-${RoomNumber}`, "Enter", "Spawn", undefined, false);
                    bot.wait.forMapLoad(Map);
                }

                Core.sleep();

                if (QuestUpdate > 0) {
                    bot.quests.updateQuest(QuestUpdate);
                }

                if (
                    this.b_playerName != null &&
                    bot.map.playerNames != null &&
                    bot.map.playerNames.includes(this.b_playerName)
                ) {
                    Core.logger(`Found ${this.b_playerName} in /${Map}`);
                    return;
                }
                maptry++;
            }

            for (const map of this._LockedMapsList) {
                if (bot.shouldExit || LockedMapList.length <= 0) {
                    return;
                }

                Core.logger(
                    `[${this._LockedMapsList.length > 9 ? `${String(maptry).padStart(2, "0")}/${String(mapCount).padStart(2, "0")}` : `${maptry}/${mapCount}`}] Searching /${map}`,
                    "LockedZoneHandler => Custom LockedMapList",
                );

                if (bot.map.name !== map) {
                    bot.map.join(`${map}-${RoomNumber}`, "Enter", "Spawn", undefined, false);
                    bot.wait.forMapLoad(map);
                }

                Core.sleep();

                if (
                    this.b_playerName != null &&
                    bot.map.playerNames != null &&
                    bot.map.playerNames.includes(this.b_playerName)
                ) {
                    Core.logger(`Found ${this.b_playerName} in /${map}`);
                    return;
                } else {
                    continue;
                }
            }
        }

        if (
            !(
                this.b_playerName != null &&
                bot.map.playerNames != null &&
                bot.map.playerNames.includes(this.b_playerName)
            )
        ) {
            Core.join(`whitemap-${RoomNumber}`);
            Core.logger(`Could not find ${this.b_playerName} in any of the maps.`, "LockedZoneHandler");
        }

        if (!this.b_shouldHibernate) {
            return;
        }

        Core.logger(
            `Bot will now hibernate and try to /goto ${this.b_playerName} every ${this.b_hibernationTimer} seconds`,
            "LockedZoneHandler",
        );

        let min = 0;
        while (!bot.shouldExit) {
            for (let t = 0; t < this.b_hibernationTimer; t++) {
                Core.sleep(1000);
                if (bot.shouldExit) {
                    return;
                }
            }

            if (
                this.b_playerName != null &&
                bot.map.playerNames != null &&
                bot.map.playerNames.includes(this.b_playerName)
            ) {
                Core.logger(`${this.b_playerName} found!`);
                break;
            }

            min += this.b_hibernationTimer;
            if (min >= 300) {
                Core.logger(`Bot has been hibernating for ${min / 60} minutes.`);
                min = 0;
            }
        }
    }

    priorityAttack(mons: string[] | null = null): void {
        if (this._attackPriority != null) {
            mons ??= [];
            mons.push(...this._attackPriority);
        }

        if (mons != null && mons.length > 0) {
            for (const mon of mons) {
                const priorityMonster =
                    bot.monsters.currentMonsters.find(
                        (m) => formatForCompare(m.name) === formatForCompare(mon) && m.cell === bot.player.cell,
                    ) ?? null;

                if (priorityMonster != null) {
                    bot.kill.monster(priorityMonster.mapId);
                } else {
                    bot.kill.monster("*");
                }
            }
        } else {
            bot.combat.attack("*");
        }
    }

    private mapNumberParses = ({ map }: EventMap["mapChanged"]): void => {
        // Wait untill the full name I.E. "battleon-12345" is set
        if (!bot.map.fullName) {
            for (let a = 0; a < 10; a++) {
                if (!!bot.map.fullName) {
                    break;
                }
                bot.sleep(Core.actionDelay);
                if (a === 9) {
                    return;
                }
            }
        }

        const roomPart = bot.map.fullName.split("-").at(-1) ?? "";
        if (
            !/^\s*[+-]?\d+\s*$/.test(roomPart) ||
            map === this.b_prevRoom ||
            !bot.map.playerExists(this.b_playerName!)
        ) {
            return;
        }
        const mapNr = parseInt(roomPart);

        // If the number is the same number as on the previous map
        if (this.b_allocRoomNr === mapNr) {
            // If the set private room number wasn't correct
            if (Core.privateRoomNumber !== mapNr) {
                Core.logger("Static room number detected. PrivateRoomNumber is now " + mapNr);
                Core.privateRoomNumber = mapNr;
            }
            Core.privateRooms = mapNr >= 1000;
            bot.events.off("mapChanged", this.mapNumberParses);
            return;
        }

        this.b_prevRoom = map;
        this.b_allocRoomNr = mapNr;
    };

    private b_allocRoomNr = 0;
    private b_prevRoom: string | null = null;

    private copyWalkListener = (packet: EventMap["extensionPacket"]): void => {
        const type = packet["params"].type;
        const data = packet["params"].dataObj;
        if (type != null && type === "str") {
            const cmd = data[0];
            switch (cmd) {
                //movement in the same cell || From server: %xt%uotls%-1%{playerName}%sp:8,tx:181,ty:358,strFrame:Bigger%
                //movement to another cell || From server: %xt%uotls%-1%{playerName}%mvts:-1,px:500,py:375,strPad:Left,bResting:false,mvtd:0,tx:0,ty:0,strFrame:Bigger%
                case "uotls": {
                    const WalkPacket = JSON.stringify(packet);
                    if (!WalkPacket.includes(this.b_playerName!)) {
                        break;
                    }
                    for (const str of WalkPacket.split(",")) {
                        let spl = "";
                        if (str.includes(":")) {
                            spl = str.split(":")[1];
                        }

                        switch (str.split(":")[0]) {
                            // Setting X cordinate
                            case "tx":
                                this.moveX = parseInt(spl);
                                break;
                            // Setting Y cordinate
                            case "ty":
                                this.moveY = parseInt(spl);
                                break;
                            // Setting speed
                            case "sp":
                                this.moveSpeed = parseInt(spl);
                                break;
                        }
                    }
                    if (this.moveX !== 0 || this.moveY !== 0) {
                        bot.flash.call("walkTo", this.moveX, this.moveY, this.moveSpeed);
                    }
                    break;
                }
            }
        }
    };

    private moveX = 0;
    private moveY = 0;
    private moveSpeed = 0;

    // C# ScriptStopping: never registered, left out.

    private butlerStop(): void {
        // Removing listeners
        bot.events.off("mapChanged", this.mapNumberParses);
        bot.events.off("extensionPacket", this.lockedZoneListener);
        bot.events.off("extensionPacket", this.copyWalkListener);

        // C# deletes its communication file here (not ported, see the top).
        bot.events.off("playerAFK", this.playerAFK);
    }

    b_breakOnMap: string | null = null;
    //#endregion
}

export class DateTimeExtensions {
    static toUnixTimeSeconds(dateTime: number): number {
        return Math.trunc((dateTime - new Date(1970, 1 - 1, 1, 0, 0, 0).getTime()) / 1000);
    }
}

function compare(a: any, b: any): number {
    return a < b ? -1 : a > b ? 1 : 0;
}
