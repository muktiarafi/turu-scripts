/*
name: corrupt draconic paragon
description: farms the corrupt draconic paragon set from Quest: "Defeat the Underfiend".
tags: corrupt draconic paragon, set
*/
// Port of Scripts/Other/CorruptDraconicParagon.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../core/CoreBots";
import { CoreSoW } from "../story/shadowsofwar/CoreSoW";

const SoW = new CoreSoW();

export class CorruptDraconicParagon {
    getAll(): void {
        const RewardOptions = Core.ensureLoad(7428).rewards;
        const RewardList = RewardOptions.map((x) => x.name);
        const Rewards = [...RewardList];

        if (Core.checkInventory(Rewards, undefined, { toInv: false })) {
            return;
        }

        Core.addDrop(...Rewards);
        SoW.darkAlly();

        let count = 0;
        count = Core.checkSpaces(count, ...Rewards);

        Core.equipClass(ClassType.Solo);
        Core.registerQuests(7428);
        while (!bot.shouldExit && !Core.checkInventory(Rewards, undefined, { toInv: false })) {
            Core.huntMonster("darkally", "Underfiend", "Underfiend Defeated");
        }
        Core.toBank("Corrupt Draconic Paragon Plate");
        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new CorruptDraconicParagon();
    Core.setOptions();

    script.getAll();

    Core.setOptions(false);
}
