/*
name: ArmyLR
description: use an army strategy to aquire Legion Revenant
tags: legion, legion rev, legion revenant, revenant, army
*/
// Port of Scripts/Army/Classes/ArmyLR.cs.
// The Ultras' CoreEngine (C#'s `Core`) and CoreUltra are army/CoreArmySync's CoreArmyEngine and CoreArmySync.

import { bot, defineScriptOptions, option } from "turu";
import { CoreArmyLite } from "../CoreArmyLite";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreLegion } from "../../legion/CoreLegion";
import { CoreArmyEngine, CoreArmySync } from "../CoreArmySync";

const Adv = new CoreAdvanced();
const Engine = new CoreArmyEngine();
const Ultra = new CoreArmySync();
const CLR = new CoreLegion();
const sArmy = new CoreArmyLite();

export enum CheckType {
    Bool = 1,
    Item = 2,
    ItemID = 3,
}

export class ArmyLR {
    //#region  IgnoreME

    //#endregion

    lrMaterials: string[] = ["Exalted Crown", "Revenant's Spellscroll", "Conquest Wreath", "Legion Revenant"];
    lf1: string[] = ["Aeacus Empowered", "Tethered Soul", "Darkened Essence", "Dracolich Contract"];
    lf2: string[] = [
        "Grim Cohort Conquered",
        "Ancient Cohort Conquered",
        "Pirate Cohort Conquered",
        "Battleon Cohort Conquered",
        "Mirror Cohort Conquered",
        "Darkblood Cohort Conquered",
        "Vampire Cohort Conquered",
        "Spirit Cohort Conquered",
        "Dragon Cohort Conquered",
        "Doomwood Cohort Conquered",
    ];
    lf3: string[] = [
        "Hooded Legion Cowl",
        "Legion Token",
        "Dage's Favor",
        "Emblem of Dage",
        "Diamond Token of Dage",
        "Dark Token",
    ];

    // Add / remove players below, to get to how ever many is the map's cap... or leave it alone, doesn't matter.

    lf1Items(quant = 0): void {
        while (!bot.shouldExit) {
            if (
                Ultra.checkArmyProgressBool(
                    () => Core.checkInventory("Revenant's Spellscroll", quant),
                    "Revenants_Spellscroll.Sync",
                )
            ) {
                bot.wait.forPickup("Revenant's Spellscroll");
                bot.options.aggroMonsters = false;
                Core.jump("Enter", "Spawn");
                Core.logger("All players finished farm.");
                break;
            }

            Core.ensureAccept(6897);
            bot.quests.updateQuest(2060);
            this.armyHandler(
                "judgement",
                [],
                "judgement_items",
                "r10a",
                CheckType.Item,
                "Aeacus Empowered",
                undefined,
                50,
            );

            this.armyHandler("revenant", [], "LF1_revenant", "r2", CheckType.Item, "Tethered Soul", undefined, 300);

            this.armyHandler(
                "shadowrealmpast",
                [],
                "LF1_shadowrealmpast",
                "Enter",
                CheckType.Item,
                "Darkened Essence",
                undefined,
                500,
            );

            this.armyHandler(
                "necrodungeon",
                [],
                "LF1_necrodungeon",
                "r22",
                CheckType.Item,
                "Dracolich Contract",
                undefined,
                1000,
            );
            Core.ensureComplete(6897);
            bot.wait.forPickup("Revenant's Spellscroll");
        }
    }

    lf2Items(quant = 0): void {
        while (!bot.shouldExit) {
            if (
                Ultra.checkArmyProgressBool(() => Core.checkInventory("Conquest Wreath", quant), "Conquest_Wreath.Sync")
            ) {
                bot.wait.forPickup("Conquest Wreath");
                bot.options.aggroMonsters = false;
                Core.jump("Enter", "Spawn");
                Core.logger("All players finished farm.");
                break;
            }
            Core.ensureAccept(6898);
            this.armyHandler(
                "doomvault",
                [],
                "LF2_doomvault",
                "r1",
                CheckType.Item,
                "Grim Cohort Conquered",
                undefined,
                400,
            );

            this.armyHandler(
                "mummies",
                [],
                "LF2_mummies",
                "Enter",
                CheckType.Item,
                "Ancient Cohort Conquered",
                undefined,
                400,
            );

            this.armyHandler("wrath", [], "LF2_wrath", "r2", CheckType.Item, "Pirate Cohort Conquered", undefined, 400);

            this.armyHandler(
                "doomwar",
                [],
                "LF2_doomwar",
                "r6",
                CheckType.Item,
                "Battleon Cohort Conquered",
                undefined,
                400,
            );

            this.armyHandler(
                "overworld",
                [],
                "LF2_overworld",
                "Enter",
                CheckType.Item,
                "Mirror Cohort Conquered",
                undefined,
                400,
            );

            this.armyHandler(
                "deathpits",
                [],
                "LF2_deathpits",
                "r1",
                CheckType.Item,
                "Darkblood Cohort Conquered",
                undefined,
                400,
            );

            this.armyHandler(
                "maxius",
                [],
                "LF2_maxius",
                "r4",
                CheckType.Item,
                "Vampire Cohort Conquered",
                undefined,
                400,
            );

            this.armyHandler(
                "curseshore",
                [],
                "LF2_curseshore",
                "Enter",
                CheckType.Item,
                "Spirit Cohort Conquered",
                undefined,
                400,
            );

            this.armyHandler(
                "dragonbone",
                [],
                "LF2_dragonbone",
                "r2",
                CheckType.Item,
                "Dragon Cohort Conquered",
                undefined,
                400,
            );

            this.armyHandler(
                "doomwood",
                [],
                "LF2_doomwood",
                "r3",
                CheckType.Item,
                "Doomwood Cohort Conquered",
                undefined,
                400,
            );

            bot.wait.forPickup("Conquest Wreath");
            Core.ensureComplete(6898);
        }
    }

    lf3Items(quant = 0): void {
        Engine.join("whitemap");
        Core.farmingLogger("Exalted Crown", quant);
        // Core.RegisterQuests(6899);
        Core.addDrop(...this.lf3);
        while (!bot.shouldExit) {
            Core.ensureAccept(6899);
            if (Ultra.checkArmyProgressBool(() => Core.checkInventory("Exalted Crown", quant), "Exalted_Crown.Sync")) {
                bot.wait.forPickup("Exalted Crown");
                bot.options.aggroMonsters = false;
                Core.jump("Enter", "Spawn");
                Core.logger("All players finished farm.");
                break;
            }

            Adv.buyItem("underworld", 216, "Hooded Legion Cowl");
            this.armyDarkToken(100);
            if (bot.config!.get<boolean>("UseFirstClassEntertainment")) {
                this.armyFirstClassEntertainment(4000);
            } else {
                this.armyLegionTokens(4000);
            }
            this.diamondTokenofDage(30);
            this.armyEmblemOfDage(1);
            if (bot.quests.canComplete(6899)) {
                bot.quests.complete(6899);
                bot.wait.forPickup("Exalted Crown");
            }
        }
        Core.cancelRegisteredQuests();
    }

    getLR(): void {
        Core.addDrop("Legion Revenant");
        Core.ensureAccept(6900);
        this.lf1Items(20);
        this.lf2Items(6);
        this.lf3Items(10);
        Core.ensureComplete(6900);
        bot.wait.forPickup("Legion Revenant");
    }

    dagesFavor(quant: number): void {
        this.armyHandler("evilwarnul", [], "LF4_dagefavor", "r2", CheckType.Item, "Dage's Favor", undefined, quant);
    }

    diamondTokenofDage(quant = 300): void {
        if (Core.checkInventory("Diamond Token of Dage", quant)) {
            return;
        }

        if (!Core.checkInventory("Legion Round 4 Medal")) {
            CLR.legionRound4Medal();
        }
        if (!Core.checkInventory("Legion Token", 50)) {
            CLR.farmLegionToken(50);
        }

        Core.farmingLogger("Diamond Token of Dage", quant);
        Core.addDrop("Diamond Token of Dage", "Legion Token");
        Core.registerQuests(4743);

        while (!bot.shouldExit && !Core.checkInventory("Diamond Token of Dage", quant)) {
            this.armyHandler("tercessuinotlim", [], "Makai", "m2", CheckType.Item, "Defeated Makai", undefined, 25);

            this.armyHandler("aqlesson", [], "Carnax", "Frame9", CheckType.Item, "Carnax Eye", undefined, 1);

            this.armyHandler("deepchaos", [], "Kathool", "Frame4", CheckType.Item, "Kathool Tentacle", undefined, 1);

            this.armyHandler("lair", [], "Red_Dragon", "End", CheckType.Item, "Red Dragon's Fang", undefined, 1);

            this.armyHandler(
                "bloodtitan",
                [],
                "Blood_Titan",
                "Enter",
                CheckType.Item,
                "Blood Titan's Blade",
                undefined,
                1,
            );

            // Fluffy's Bones
            this.armyHandler("dflesson", [], "Fluffys_Bones", "r12", CheckType.ItemID, null, 33257, 1);
        }
        Core.cancelRegisteredQuests();
    }

    armyEmblemOfDage(quant: number): void {
        this.armyHandler(
            "shadowblast",
            [4742],
            "emblem_dage",
            "r12",
            CheckType.Item,
            "Emblem of Dage",
            undefined,
            quant,
        );
    }

    armyLegionTokens(quant: number): void {
        this.armyHandler("dreadrock", [4849], "legion_tokens", "r3", CheckType.Item, "Legion Token", undefined, quant);
    }

    armyFirstClassEntertainment(quant: number): void {
        this.armyHandler(
            "legionarena",
            [6743],
            "first_class_entertainment",
            "Boss",
            CheckType.Item,
            "Legion Token",
            undefined,
            quant,
        );
    }

    armyDarkToken(quant: number): void {
        this.armyHandler(
            "seraphicwardage",
            [6248, 6249, 6251],
            "dark_token",
            "r3",
            CheckType.Item,
            "Dark Token",
            undefined,
            quant,
        );
    }

    private armyHandler(
        map: string,
        QuestIDs: number[],
        WaitForArmysyncPath: string,
        AggroCell: string,
        checkType: CheckType,
        Itemname: string | null = null,
        ItemID: number | null = null,
        quant = 0,
        condition: (() => boolean) | null = null,
    ): void {
        // Sync file used to keep track of what accs are done.
        Ultra.resolveSyncPath(WaitForArmysyncPath);
        Ultra.clearSyncFile(WaitForArmysyncPath);
        bot.sleep(2500);

        Core.logger(`Players in Curreny Army: ${sArmy.players().length}`);

        if (QuestIDs.length > 0) {
            Core.registerQuests(...QuestIDs);
        }

        if (Itemname != null) {
            Core.addDrop(Itemname);
        } else if (ItemID != null) {
            Core.addDrop(ItemID);
        }

        if (map === "revenant") {
            Core.ghostItem(
                47465,
                "Revenant Map Bypass",
                1,
                false,
                "Class",
                'Used to bypass the dark caster class requirement for the map "Revenant"',
            );
            this.revenantMapHandler();
        }
        if (map === "mummies") {
            bot.quests.updateQuest(4614);
        }

        Engine.join(map);
        Core.jump(AggroCell, "Left");

        if (sArmy.players().length > 1) {
            Ultra.waitForArmy(sArmy.players().length - 1, WaitForArmysyncPath);
        }
        bot.player.setSpawnPoint();
        bot.sleep(1500);
        bot.options.aggroMonsters = true;

        const syncKey =
            checkType === CheckType.Item
                ? `${Itemname}.Sync`
                : checkType === CheckType.ItemID
                  ? `${ItemID}.Sync`
                  : checkType === CheckType.Bool
                    ? `${WaitForArmysyncPath}.Sync`
                    : `${WaitForArmysyncPath}.Sync`;

        const progressCheck =
            checkType === CheckType.Item && Itemname != null
                ? () => Core.checkInventory(Itemname, quant)
                : checkType === CheckType.ItemID && ItemID != null
                  ? () => Core.checkInventory(ItemID, quant)
                  : checkType === CheckType.Bool && condition != null
                    ? condition
                    : (() => {
                          throw new Error(
                              `ArmyHandler: checkType ${CheckType[checkType]} requires a matching Itemname/ItemID/condition argument.`,
                          );
                      })();

        while (!bot.shouldExit) {
            if (Ultra.checkArmyProgressBool(progressCheck, syncKey)) {
                bot.options.aggroMonsters = false;
                Core.jump("Enter", "Spawn");
                Core.logger("All players finished farm.");
                break;
            }

            if (!bot.player.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);
                continue;
            }

            bot.combat.attack("*");
            bot.sleep(500);
        }
    }

    _revenantBaseRoom: number = -1;
    static readonly revenantBaseRoomDefault = 1;
    // pin explicitly instead of trusting live C.PrivateRoomNumber

    _rosterCheckedThisSession = false;

    revenantMapHandler(): void {
        const players = sArmy.players();
        if (players == null || players.length === 0) {
            return;
        }

        if (this._revenantBaseRoom === -1) {
            this._revenantBaseRoom = ArmyLR.revenantBaseRoomDefault;
        }

        if (!bot.player.username) {
            return;
        }
        // not logged in yet, nothing to do

        // Must match the normalization Players() applies to its entries
        // (ToLower + Trim) or IndexOf silently fails and the room never updates.
        const currentPlayer = bot.player.username.toLowerCase().trim();

        // One-time startup sanity check: catch typos/mismatches in the shared
        // config immediately and loudly, instead of discovering it later as
        // "this bot never left the base room."
        if (!this._rosterCheckedThisSession) {
            this._rosterCheckedThisSession = true;

            if (!players.includes(currentPlayer)) {
                bot.log(
                    `[RevenantMap] WARNING: '${currentPlayer}' not found in configured roster ` +
                        `[${players.join(", ")}]. Check the playerN entries in the shared cfg ` +
                        `for typos, extra whitespace, or a missing entry for this account. ` +
                        `This bot will NOT be assigned a room until this is fixed.`,
                );
            } else {
                bot.log(
                    `[RevenantMap] Roster check OK: '${currentPlayer}' found at index ` +
                        `${players.indexOf(currentPlayer)} of ${players.length}.`,
                );
            }
        }

        const playerIndex = players.indexOf(currentPlayer);
        if (playerIndex < 0) {
            return;
        }
        // already logged above; nothing more to do until config is fixed

        const roomOffset = playerIndex / 3;
        // 3 players per room
        const targetRoom = this._revenantBaseRoom + roomOffset;

        if (Core.privateRoomNumber !== targetRoom) {
            Core.privateRoomNumber = targetRoom;
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "Fill me in",
    [
        sArmy.player1,
        sArmy.player2,
        sArmy.player3,
        sArmy.player4,
        sArmy.player5,
        sArmy.player6,
        sArmy.player7,
        sArmy.packetDelay,
        option.bool(
            "UseFirstClassEntertainment",
            "Use First Class Entertainment?",
            "Farm Legion Tokens using First Class Entertainment instead of Dreadrock.",
            false,
        ),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new ArmyLR();
    Core.bankingBlackList.push("add", "any", "drops", "needed");
    Core.bankingBlackList.push(...script.lrMaterials);
    Core.bankingBlackList.push(...script.lf1);
    Core.bankingBlackList.push(...script.lf2);
    Core.bankingBlackList.push(...script.lf3);
    Core.setOptions(undefined, { disableClassSwap: true });

    Core.privateRooms = true;
    Core.privateRoomNumber = sArmy.getRoomNr();

    CLR.joinLegion();
    script.getLR();

    Core.setOptions(false);
}
