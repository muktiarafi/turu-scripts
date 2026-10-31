/*
name: Seven Deadly Dragons Saga Drops
description: get drops from all monsters from this saga.
tags: deadly, seven, dragons, drops
*/
// Port of Scripts/Other/DeadlyDragonsSagaDrops.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../core/CoreBots";
import { Core7DD } from "../story/7deadlydragons/Core7DD";

const DD = new Core7DD();

export class DeadlyDragonsDrops {
    getDrops(): void {
        DD.complete7DD();

        //#region Ashfallcamp
        const Smoldur = ["Smoldur's Wings"];

        Core.equipClass(ClassType.Solo);
        this.runEngine(Smoldur, "ashfallcamp", "r8", "Left");

        const Infernus = ["Infernus' Wings"];

        Core.equipClass(ClassType.Solo);
        this.runEngine(Infernus, "ashfallcamp", "r14", "Left");

        const Blackrawk = ["Blackrawk's Wings"];

        Core.equipClass(ClassType.Solo);
        this.runEngine(Blackrawk, "ashfallcamp", "r11", "Left");
        //#endregion
        //#region Gluttony
        const DeflatedGlutus = [
            "Burning Brand Banners Cape",
            "Burning Ember and Mace",
            "Dragonfang Piercer",
            "FlameScourge Helmet",
            "FlameScourge Hood",
            "FlameScourge Horns",
            "FlameScourge Mage",
            "FlameScourge Warrior",
        ];

        Core.equipClass(ClassType.Solo);
        this.runEngine(DeflatedGlutus, "gluttony", "Enter2", "Left");

        const Colonicus = ["Colonicus Club", "Colonicus' Wing Dagger", "Feceus Morph"];

        Core.equipClass(ClassType.Solo);
        this.runEngine(Colonicus, "gluttony", "r12", "Left");
        //#endregion
        //#region Pride
        const CellarGuard = [
            "Cellar Guard's Storm Mace",
            "Drakel Guard's Prod",
            "Drakel Guard Morph",
            "Storm Drakel Tail",
        ];

        Core.equipClass(ClassType.Farm);
        this.runEngine(CellarGuard, "pride", "r5", "Right");

        const EliteGuard = ["Elite Guard's Scythe"];

        Core.equipClass(ClassType.Farm);
        this.runEngine(EliteGuard, "pride", "r9", "Left");

        const Valsarian = [
            "BoltStriker Armor",
            "BoltStriker Blade",
            "BoltStriker Cape",
            "BoltStriker Claymore",
            "BoltStriker Hood",
            "BoltStriker Horn",
            "BoltStriker Wings",
            "LightningStorm Dragonoid",
        ];

        Core.equipClass(ClassType.Solo);
        this.runEngine(Valsarian, "pride", "r13", "Left");
        //#endregion
        //#region Greed
        const Goregold = [
            "Baby Ice Dragon",
            "Dragon's Treasure Pile",
            "Miniature Goregold Pet",
            "Sneezy the Ice Dragonoid",
            "WardKeeper's Armor",
            "Ward of the Ancients",
            "WardKeeper's War Axe",
        ];

        Core.equipClass(ClassType.Solo);
        this.runEngine(Goregold, "greed", "r16", "Left");

        const TreasurePile = [
            "Bright Keeper's Hood",
            "Bright Keeper's Locks",
            "Golden Ore Elemental",
            "Golden Reaper Helm",
            "Icy Dragonoid",
            "Keeper's Hood",
            "Keeper's Mask",
            "Magnifying Glass",
            "Maiden's Aegis Helm",
            "Treasure Chest (Misc)",
            "Warden's Aegis Helm",
            "WardKeeper's Blade",
            "WardKeeper's Double-edged Blade",
        ];

        Core.equipClass(ClassType.Solo);
        this.runEngine(TreasurePile, "greed", "r16", "Left");
        //#endregion
        //#region Sloth
        const ActualSlothDragon = ["Actual Slothagon Pet", "Baby Slothagon Pet"];

        Core.equipClass(ClassType.Solo);
        this.runEngine(ActualSlothDragon, "sloth", "r13c", "Left");

        const CuredPhlegnn = ["Bloodborne Death's Shadow Cape"];

        Core.equipClass(ClassType.Solo);
        this.runEngine(CuredPhlegnn, "sloth", "r13b", "Left");

        const MutatedPlague = ["Mutated Plague Cape", "Plague's Death Shadow Cape"];

        Core.equipClass(ClassType.Solo);
        this.runEngine(MutatedPlague, "sloth", "r11c", "Left");

        const Phlegnn = ["Dragon's Plague Scythe", "Re-Shroom Mace", "Slimed Dragonoid"];

        Core.equipClass(ClassType.Farm);
        this.runEngine(Phlegnn, "sloth", "r13a", "Left");
        //#endregion
        //#region Lust
        const KillekDeadChewer = [
            "Cursed Dungeon Spirit",
            "Dungeon Defender",
            "Dungeon Guard's Blade",
            "Dungeon Guard Hood",
            "Guard's Shag",
        ];

        Core.equipClass(ClassType.Solo);
        this.runEngine(KillekDeadChewer, "lust", "r16", "Left");

        const Lascivia = [
            "Blood Paladin",
            "Blood Paladin Hair",
            "Blood Paladin Wings",
            "Cecily's Crown",
            "Evolved Agony Chain",
            "Lascivian Dragonoid",
            "Lascivia in your House",
            "Royal Attendant",
            "Royal Attendant Beard",
            "Royal Attendant Cape",
            "Royal Attendant Locks",
        ];

        Core.equipClass(ClassType.Solo);
        this.runEngine(Lascivia, "lust", "r14", "Bottom");

        const Viscyra = ["Royal Dancer", "Royal Dancer Morph", "Viscyra's Axe"];

        Core.equipClass(ClassType.Solo);
        this.runEngine(Viscyra, "lust", "r13", "Left");
        //#endregion
        //#region Envy
        const Argo = [
            "Dark Draco Tail",
            "Draco Tenebris",
            "Draco Tenebris Helm",
            "Draco Tenebris Hood",
            "Draco Tenebris Horns",
            "Draco Tenebris Flail",
            "Draco Tenebris Scythe",
            "Dual Tenebris Flails",
            "Tenebris Hood And Horns",
            "Wings of Darkness",
        ];

        Core.equipClass(ClassType.Solo);
        this.runEngine(Argo, "dragoncrown", "r2a", "Left");
        //#endregion
        //#region Wrath
        const Gorgorath = [
            "Boneaxe of Gorgorath",
            "Boneblade of Gorgorath",
            "Bone Wings of Gorgorath",
            "DracoMori",
            "Dragonslayer Slayer",
            "Dragonslayer Slayer Backbeast",
            "Dragonslayer Slayer Hair",
            "Dragonslayer Slayer Head",
            "Dragonslayer Slayer Helm",
            "Dragonslayer Slayer Locks",
            "Dragonslayer Slayer Mask",
            "Dragonslayer Slayer Tail",
            "Dragonslayer Slayer Wings",
            "Dragonslayer Slayer Wings + Tail",
            "Dragonslayers Dread",
            "Gorgorath's Head",
            "Hooded Horns of Gorgorath",
            "Horns of Gorgorath",
            "Mane of Gorgorath",
            "Reversed Dragonslayer's Demise",
            "Shadow Eater of Wrath",
            "Skull Scarf of Gorgorath",
            "Tail of Gorgorath",
        ];

        Core.equipClass(ClassType.Solo);
        this.runEngine(Gorgorath, "wrath", "r12", "Left");
        //#endregion
    }

    private runEngine(rewards: string[], map: string, cell: string, pad: string): void {
        for (const drop of rewards) {
            Core.addDrop(drop);
        }

        for (let i = 0; i < rewards.length; i++) {
            const drop = rewards[i];
            if (Core.checkInventory(drop, undefined, { toInv: false })) {
                Core.removeDrop(drop);
                continue;
            }

            Core.logger(`${drop}: (${i + 1}/${rewards.length})`);

            while (!bot.shouldExit && !Core.checkInventory(drop)) {
                Core.killMonster(map, cell, pad, "*", undefined, undefined, { log: false });
            }
        }

        for (const drop of rewards) {
            Core.jump();
            Core.toBank(drop);
        }
    }
}

export default function main(): void {
    const script = new DeadlyDragonsDrops();
    Core.setOptions();

    script.getDrops();

    Core.setOptions(false);
}
