/*
name: Image of Dage Quest Rewards
description: This script will complete "Image of Dage" quest
tags: underworld,legion,dage,birthday,image of dage,quest,hateful,hateful goliath,hateful goliaths,
*/
// Port of Scripts/Legion/Various/HatefulGoliaths.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { HeadoftheLegionBeast } from "../HeadOfTheLegionBeast";
import { UndeadLegionMerge } from "../mergeshops/UndeadLegionMerge";
import { FortressDelve } from "../../seasonal/staffbirthdays/dagetheevil/FortressDelve";
import { CoreIsleOfFotia } from "../../story/isleoffotia/CoreIsleOfFotia";

const ULM = new UndeadLegionMerge();
const IOF = new CoreIsleOfFotia();
const HOTLB = new HeadoftheLegionBeast();
const FD = new FortressDelve();

export class HatefulGoliaths {
    getHatefulGoliaths(): void {
        if (Core.checkInventory(Core.questRewards(10103))) {
            return;
        }

        Core.addDrop(...Core.ensureLoad(10103).acceptRequirements.map((item) => item.name));
        Core.addDrop(...Core.questRewards(10103));

        Core.logger("Farming Prereqs...");

        // Ultimate Lich King
        ULM.buyAllMerge("Ultimate Lich King");

        // Palace Map
        IOF.dageFortress(true);

        // Indulgence
        HOTLB.indulgence(1);

        // Rune of Radiance
        FD.doStory();
        Core.ensureAccept(9170);
        Core.equipClass(ClassType.Farm);
        Core.huntMonster("fortressdelve", "Enlightened Shadow", "Shadowscythe Bone Shard", 10, { log: false });
        Core.huntMonster("fortressdelve", "Delirious Elemental", "Elemental Residue", 10, { log: false });
        Core.equipClass(ClassType.Solo);
        Core.huntMonster("fortressdelve", "Astero", "Glass Wing", undefined, { log: false });
        Core.ensureComplete(9170);

        Core.huntMonsterQuest(
            10103,
            ["shadowblast", "Thanatos", ClassType.Solo],
            ["evilwarnul", "Laken", ClassType.Solo],
            ["envy", "Envy", ClassType.Solo],
            ["darkfortress", "Wilhelm", ClassType.Solo],
            ["darkally", "Underfiend", ClassType.Solo],
        );
    }
}

export default function main(): void {
    const script = new HatefulGoliaths();
    Core.setOptions();

    script.getHatefulGoliaths();

    Core.setOptions(false);
}
