/*
name: Tower of Doom Story
description: This will finish the Tower of Doom Story.
tags: story, quest, tower-of-doom
*/
// Port of Scripts/Story/TowerOfDoom.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../core/CoreBots";

export class TowerOfDoom {
    towerProgress(Floor = 10): void {
        if (!bot.quests.tree.some((x) => x.id === 3474 + Floor)) {
            bot.quests.load(3475, 3476, 3477, 3478, 3479, 3480, 3481, 3482, 3483, 3484);
        }
        if (Core.isCompletedBefore(3474 + Floor)) {
            return;
        }

        if (Floor !== 1 && !Core.isCompletedBefore(3474 + (Floor - 1))) {
            this.towerProgress(Floor - 1);
        }

        bot.quests.updateQuest(3474 + Floor);
        Core.logger(`Tower of Doom ${Floor}`);

        Core.equipClass(ClassType.Solo);
        Core.ensureAccept(3474 + Floor);
        Core.join(Floor === 1 ? "towerofdoom" : `towerofdoom${Floor}`, "r10", "Left");
        const mob = bot.monsters.mapMonsters.find((m) => m.cell === "r10") ?? null;
        Core.killMonster(
            Floor === 1 ? "towerofdoom" : `towerofdoom${Floor}`,
            "r10",
            "Left",
            mob!.name,
            `${mob!.name} Defeated`,
        );
        Core.ensureComplete(3474 + Floor);
    }
}

export default function main(): void {
    const script = new TowerOfDoom();
    Core.setOptions();

    script.towerProgress();

    Core.setOptions(false);
}
