/*
name: Dragons of Yokai Drops
description: farms all drops from Dragons of Yokai saga maps.
tags: yokai, dragons, drops
*/
// Port of Scripts/Other/DragonsOfYokaiDrops.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../core/CoreBots";
import { CoreDOY } from "../story/dragonsofyokai/CoreDOY";

const DOY = new CoreDOY();

export class DragonsOfYokaiDrops {
    getDrops(): void {
        DOY.doAll();

        //#region Yokai Pirate
        const DisguisedPirate = [
            "Backup Battle Blunderbuss",
            "Battlescarred Backup Cutlass",
            "Coastal Raider's Backup Rifle",
            "Coastal Raider's Beard",
            "Disguised Pirate's BattleGear",
            "Disguised Pirate's Crossed Cutlasses",
            "Disguised Pirate's EyePatch",
            "Disguised Pirate's Hair",
            "Disguised Pirate's Tricorn",
            "Hippodrome Star Cutlass",
            "Hippodrome Star Cutlasses",
            "Lovely Roger Flag",
            "Marauder's Monkey on yer Back",
            "Maurader's Mane",
            "Maurader's Mane + Beard",
            "Maurader's Monkey Morph + Hat",
            "Pi-Rat Pet",
            "Star Pirate's Cutlass + Rapier",
        ];

        Core.equipClass(ClassType.Farm);
        this.runEngine(DisguisedPirate, "yokaipirate", "r2", "Left");

        const NevergladesKnight = ["Swashbuckler's Rapier", "Yokai Gunpowder"];

        Core.equipClass(ClassType.Farm);
        this.runEngine(NevergladesKnight, "yokaipirate", "Enter", "Spawn");
        //#endregion
        //#region Yokai Treasure
        const AdmiralZheng = [
            "Daitengu Cloak",
            "Dual Loyal Alloy Tourne",
            "Dual Pearl Dust Shuriken",
            "Golden Long Head",
            "Golden Long Statue",
            "Loyal Alloy Dagger",
            "Loyal Alloy Daggers",
            "Loyal Alloy Tourne",
            "Moonlit Steel Back Rapier",
            "Moonlit Steel Rapier",
            "Pearl Dust Shuriken",
            "Tengu Feather Cap",
            "Tengu Feather Locks",
            "Tengu Typhoon Cutlass",
            "Wuji Zodiac Wheel",
        ];

        Core.equipClass(ClassType.Solo);
        this.runEngine(AdmiralZheng, "yokaitreasure", "r10", "Bottom");

        const ImperialWarrior = [
            "Iron Flight Cutlass",
            "Loyal Alloy Dirk",
            "Loyal Alloy Dirks",
            "Loyal Alloy Knife",
            "Loyal Alloy Knives",
            "Mercury Phial",
            "Resting Iron Flight Cutlass",
            "Stealthy Sea Hair",
            "Stealthy Sea Locks",
            "Stealthy Sea Patch Hair",
            "Stealthy Sea Patch Locks",
            "Stygian Navigator's Hair",
            "Stygian Navigator's Locks",
            "Stygian Navigator's Morph",
            "Stygian Navigator's Visage",
        ];

        Core.equipClass(ClassType.Farm);
        this.runEngine(ImperialWarrior, "yokaitreasure", "r9", "Right");

        const NeedleMouth = [
            "Grim Sailor's Battle Gear",
            "GrimSailor's Pistol",
            "GrimSailor's Pistols",
            "Necro Crewmember's Battle Gear",
            "Necro Crewmember's Blade + Sheath",
            "Necro Crewmember's Blades",
            "Necro Crewmember's Blunderbuss",
            "Necro Crewmember's Flintlock",
            "Necro Crewmember's Flintlocks",
        ];

        Core.equipClass(ClassType.Farm);
        this.runEngine(NeedleMouth, "yokaitreasure", "r2", "Right");

        const Quicksilver = ["J6's Backup Shotguns", "Raging Storm Blunderbuss", "Westion Commander's Backup Shotguns"];

        Core.equipClass(ClassType.Farm);
        this.runEngine(Quicksilver, "yokaitreasure", "r3", "Left");
        //#endregion
        //#region Haku Village
        const DaiTengu = [
            "Elegant Changshan",
            "Hooded Loose Noble Topknot",
            "Loose Noble Topknot",
            "Noble Incognito Cloak",
        ];

        Core.equipClass(ClassType.Solo);
        this.runEngine(DaiTengu, "hakuvillage", "r5", "Left");
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
    const script = new DragonsOfYokaiDrops();
    Core.setOptions();

    script.getDrops();

    Core.setOptions(false);
}
