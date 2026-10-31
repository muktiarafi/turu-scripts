/*
name: (Chaos Finale Bonus) Deadly Dungeon
description: This will finish the Deadly Dungeon quest.
tags: story, quest, chaos-saga, 13-lords-of-chaos, chaos-finale, deadly-dungeon, member
*/
// Port of Scripts/Story/LordsofChaos/ChoasFinaleBonus[Mem]/DeadlyDungeon[Mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreStory } from "../../../core/CoreStory";

const Story = new CoreStory();

export class DeadlyDungeon {
    deadlyDungeonQuest_Line(): void {
        if (Core.isCompletedBefore(3699)) {
            return;
        }

        if (!Core.isMember) {
            Core.logger("You need to be a member for complete this questline.");
            return;
        }

        Story.preLoad(this.deadlyDungeonQuest_Line);

        // Floor 1
        Story.killQuest(3680, "deadlydungeon", "Dire Muncher ");
        // Floor 2
        Story.killQuest(3681, "deadlydungeon", "Hulking Dire Wolf");
        // Floor 3
        Story.killQuest(3682, "deadlydungeon", "Undead Dungeon Crawler");
        // Floor 4
        Story.killQuest(3683, "deadlydungeon", "Hulking Dire Wolf");
        // Floor 5
        Story.mapItemQuest(3684, "deadlydungeon", 2764, 1);
        Story.killQuest(3684, "deadlydungeon", "Dire Draugr");
        // Floor 6
        Story.mapItemQuest(3685, "deadlydungeon", 2756, 8);
        Story.killQuest(3685, "deadlydungeon", "Hulking Dire Wolf");
        // Floor 7
        Story.killQuest(3686, "deadlydungeon", "Weeping Spyball");
        // Floor 8
        Story.killQuest(3687, "deadlydungeon", "Dire Muncher ");
        // Floor 9
        Story.killQuest(3688, "deadlydungeon", "Weeping Spyball");
        // Floor 10
        Story.mapItemQuest(3689, "deadlydungeon", 2766, 1);
        Story.killQuest(3689, "deadlydungeon", "DoomKitten");
        // Floor 11
        Story.mapItemQuest(3690, "deadlydungeon", 2765, 1);
        Story.killQuest(3690, "deadlydungeon", "Dire Draugr");
        // Floor 12
        Story.killQuest(3691, "deadlydungeon", "Giant Dungeon Spider");
        // Floor 13
        Story.killQuest(3692, "deadlydungeon", "Undead Dungeon Crawler");
        // Floor 14
        Story.killQuest(3693, "deadlydungeon", "Giant Dungeon Spider");
        // Floor 15
        Story.killQuest(3694, "deadlydungeon", "Dire Draugr");
        // Floor 16
        Story.killQuest(3695, "deadlydungeon", "Dire Draugr");
        // Floor 17
        Story.mapItemQuest(3696, "deadlydungeon", 2767, 1);
        Story.killQuest(3696, "deadlydungeon", "DoomKitten");
        // Floor 18
        Story.killQuest(3697, "deadlydungeon", "Giant Dungeon Spider");
        // Floor 19

        if (!Story.questProgression(3698)) {
            Core.ensureAccept(3698);
            const quest = Core.initializeWithRetries(() => Core.ensureLoad(3698));

            if (quest != null) {
                const Item = quest.requirements[0] ?? null;

                if (Item != null) {
                    if (Core.checkInventory(Item.id, 100)) {
                        Core.sellItem(Item.name, 1);
                    }

                    Core.huntMonster("deadlydungeon", "Dire Draugr", Item.name, 100, { isTemp: false });
                    Core.ensureComplete(3698);
                } else {
                    Core.logger(`Quest ${quest.name} returned no requirements.`);
                }
            } else {
                Core.logger("Quest could not be loaded.");
            }
        }

        // Floor 20
        Story.killQuest(3699, "deadlydungeon", "Chest Guardian");
    }
}

export default function main(): void {
    const script = new DeadlyDungeon();
    Core.setOptions();

    script.deadlyDungeonQuest_Line();

    Core.setOptions(false);
}
