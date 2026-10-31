/*
name: Astravian Oracle Set
description: does the follow quests to get the astravian oracle set: 'mourning cygnus' & 'extinguished eridanus'
tags: mourning cygnus, extinguished eridanus, quest, reward, astravian oracle set
*/
// Port of Scripts/Other/AstravianOracleSet.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../core/CoreBots";

export class AstravianOracleSet {
    doQuests(): void {
        this.extinguishedEridanus(9208);
        this.mourningCygnus(9209);
    }

    extinguishedEridanus(questID = 0, quant = 1): void {
        const RewardOptions = Core.ensureLoad(questID).rewards;

        for (const item of RewardOptions) {
            Core.addDrop(item.name);
        }

        Core.equipClass(ClassType.Farm);
        for (const item of RewardOptions) {
            while (!bot.shouldExit && !Core.checkInventory(item.id, quant)) {
                Core.ensureAccept(questID);
                Core.killMonster("eridani", "r6", "Left", "*", "Extinguished Shard", 15, { log: false });
                Core.ensureComplete(questID, item.id);
            }
            Core.toBank(item.id);
        }
    }

    mourningCygnus(questID = 0, quant = 1): void {
        const RewardOptions = Core.ensureLoad(questID).rewards;

        for (const item of RewardOptions) {
            Core.addDrop(item.name);
        }

        Core.equipClass(ClassType.Farm);

        for (const item of RewardOptions) {
            while (!bot.shouldExit && !Core.checkInventory(item.id, quant)) {
                Core.ensureAccept(questID);
                Core.killMonster("astravia", "r6", "Top", "*", "Broken Astravia Shards", 15, { log: false });
                Core.ensureComplete(questID, item.id);
            }
            Core.toBank(item.id);
        }
    }
}

export default function main(): void {
    const script = new AstravianOracleSet();
    Core.setOptions();

    script.doQuests();

    Core.setOptions(true);
}
