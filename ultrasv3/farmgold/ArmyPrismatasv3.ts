/*
name: Army Prismatas
description: Farms gold using the Prismatas in /archmage and selling the elemental bindings
tags: Prismatas, elemental binding, gold, farm
*/
// Port of Scripts/Ultrasv3/FarmGold/ArmyPrismatasv3.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreEnginev3 } from "../dependenciesultras/CoreEnginev3";
import { CoreUltrav3 } from "../dependenciesultras/CoreUltrav3";
import { UltraEnhancements } from "../dependenciesultras/UltraEnhancements";

const Engine = new CoreEnginev3();
const Ultra = new CoreUltrav3();
const Enh = new UltraEnhancements();

export class ArmyPristmasv3 {
    prep(): void {
        Core.logger("Preparing Army Prismatas...");
        this.equipPresetClasses();

        if (bot.config!.get<boolean>("DoEnh")) {
            this.doEnhs();
        }
    }

    killPrismatas(): void {
        const map = "archmage";
        const boss = "Prismata";
        const syncPath = Ultra.resolveSyncPath("ArmyBool.sync");
        Ultra.clearSyncFile(syncPath);
        bot.sleep(2500);

        // Wait for the army in a safe map before entering the boss area.
        Engine.join("whitemap");
        bot.wait.forMapLoad("whitemap");

        const armySize = Math.max(1, bot.config!.get<number>("ArmySize"));
        if (armySize > 1) {
            Ultra.waitForArmy(armySize - 1, "ArmyPrismatas.sync", 3000, 500, 10000);
        }
        Engine.join(map);
        Core.addDrop("Elemental Binding");
        Engine.chooseBestCell(boss);

        bot.player.setSpawnPoint();
        bot.sleep(1500);

        const sellEvery100 = bot.config!.get<boolean>("SellEvery100");
        const stopAtMaxGold = bot.config!.get<boolean>("StopAtMaxGold");
        while (!bot.shouldExit) {
            if (stopAtMaxGold && Ultra.checkArmyProgressBool(() => bot.player.gold >= 100000000, syncPath)) {
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

            if (bot.player.cell !== "r2") {
                bot.map.jump("r2", "Left");
                bot.wait.forCellChange("r2");
            }

            bot.combat.attack(this.getPrismataTargetMapID());

            if (!Core.goldMaxed && sellEvery100 && Core.checkInventory("Elemental Binding", 100)) {
                Core.sellItem("Elemental Binding", undefined, { all: true });
            }

            bot.sleep(500);
        }
    }

    private equipPresetClasses(): void {
        const entries = [
            bot.config!.get<string>("Class1"),
            bot.config.get<string>("Class2"),
            bot.config.get<string>("Class3"),
            bot.config.get<string>("Class4"),
            bot.config.get<string>("Class5"),
            bot.config.get<string>("Class6"),
            bot.config.get<string>("Class7"),
        ]
            .map((raw) => this.parseClassEntry(raw))
            .filter((e) => !!e.className);

        if (entries.length === 0) {
            return;
        }

        const armySize = Math.max(1, bot.config!.get<number>("ArmySize"));
        const classNames = entries.map((e) => e.className);

        const allowDuplicates =
            classNames.length < armySize || new Set(classNames.map((c) => c.toLowerCase())).size < classNames.length;

        let classSlots: string[][];
        if (entries.length >= armySize) {
            classSlots = entries.slice(0, armySize).map((e) => [e.className]);
        } else {
            classSlots = Array.from({ length: armySize }, () => classNames);
        }

        // C#'s GroupBy(Username, OrdinalIgnoreCase): the first entry for a user wins.
        const preferredAssignments = new Map<string, string>();
        for (const e of entries) {
            if (!e.username) continue;
            if (![...preferredAssignments.keys()].some((u) => u.toLowerCase() === e.username.toLowerCase()))
                preferredAssignments.set(e.username, e.className);
        }

        Ultra.equipClassSync(
            classSlots,
            armySize,
            "army_prismatas_class-v2.sync",
            allowDuplicates,
            preferredAssignments.size > 0 ? preferredAssignments : null,
        );
    }

    private parseClassEntry(raw: string | null): { className: string; username: string } {
        if (!raw?.trim()) {
            return { className: "", username: "" };
        }

        const parts = raw.split(",");
        const className = parts[0].trim();
        const username = parts.length > 1 ? parts[1].trim() : "";
        return { className, username };
    }

    private getPrismataTargetMapID(): number {
        const currentTarget = bot.player.target;
        if (currentTarget != null && currentTarget.hp > 0 && currentTarget.state > 0 && currentTarget.hp > 0) {
            return currentTarget.mapId;
        }

        const nextTarget =
            [
                ...bot.monsters.currentAvailableMonsters.filter(
                    (m) => m != null && m.hp > 0 && m.state > 0 && m.hp > 0,
                ),
            ].sort((a, b) => compare(((m) => m.mapId)(a), ((m) => m.mapId)(b)))[0] ?? null;

        return nextTarget?.mapId ?? 1;
    }

    private doEnhs(): void {
        Enh.apply();
    }
}

export const scriptOptions = defineScriptOptions(
    "ArmyPristmas-v2",
    [
        option.int("ArmySize", "Army Size", "How many players are in your army (including yourself).", 4),
        option.text(
            "Class1",
            "Class 1",
            "Preset class 1 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "StoneCrusher",
        ),
        option.text(
            "Class2",
            "Class 2",
            "Preset class 2 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "Lord of Order",
        ),
        option.text(
            "Class3",
            "Class 3",
            "Preset class 3 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "Verus DoomKnight",
        ),
        option.text(
            "Class4",
            "Class 4",
            "Preset class 4 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "King's Echo",
        ),
        option.text(
            "Class5",
            "Class 5",
            "Preset class 5 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "",
        ),
        option.text(
            "Class6",
            "Class 6",
            "Preset class 6 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "",
        ),
        option.text(
            "Class7",
            "Class 7",
            "Preset class 7 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "",
        ),
        option.bool(
            "DoEnh",
            "Do Enhancements",
            "Auto-enhance gear properly for the fight before killing Prismatas.",
            true,
        ),
        option.bool(
            "SellEvery100",
            "Sell Every 100",
            "Enable to sell Elemental Binding every 100. Disable to keep them.",
            true,
        ),
        option.bool(
            "StopAtMaxGold",
            "Stop at Max Gold",
            "Enable to stop when reaching 100M gold. Disable to continue farming.",
            true,
        ),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new ArmyPristmasv3();
    Core.bankingBlackList.push("Elemental Binding");
    Core.setOptions(true);
    Core.logger("Elemental Bindings will be sold every 100\nClass presets will be applied if configured.");
    Engine.boot();
    try {
        script.prep();
        script.killPrismatas();
    } finally {
        Core.setOptions(false);
        bot.stop();
    }
}

function compare(a: any, b: any): number {
    return a < b ? -1 : a > b ? 1 : 0;
}
