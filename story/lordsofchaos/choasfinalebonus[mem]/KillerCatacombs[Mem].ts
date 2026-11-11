/*
name: (Chaos Finale Bonus) Killer Catacombs
description: This will finish the Killer Catacombs quest.
tags: story, quest, chaos-saga, 13-lords-of-chaos, chaos-finale, bonus, killer-catacombs, member
*/
// Port of Scripts/Story/LordsofChaos/ChoasFinaleBonus[Mem]/KillerCatacombs[Mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreStory } from "../../../core/CoreStory";

const Story = new CoreStory();

export class KillerCatacombs {
    killerCatacombs_Line(): void {
        if (Core.isCompletedBefore(3679)) {
            return;
        }

        if (!Core.isMember) {
            Core.logger("You need to be a member for complete this questline.");
            return;
        }

        Story.preLoad(this.killerCatacombs_Line);

        // The Coward
        Story.killQuest(3660, "killercatacombs", "Tomb Robber ");

        // Welcome Party
        Story.killQuest(3661, "killercatacombs", "Tomb Robber ");

        // Scout Ahead
        Story.killQuest(3662, "killercatacombs", "Ravenous Maw");

        // Dinner Party
        Story.killQuest(3663, "killercatacombs", "Ravenous Maw");

        // Illumination Preparation
        Story.mapItemQuest(3664, "killercatacombs", 2762, 8);

        // Bones Picked Clean
        Story.killQuest(3665, "killercatacombs", "Sundered Darkblood ");

        // Biased Window
        Story.mapItemQuest(3666, "killercatacombs", 2761, 3);
        Story.killQuest(3666, "killercatacombs", "Sundered Darkblood ");

        // Room For Seconds
        Story.killQuest(3667, "killercatacombs", "Starved Maw ");

        // Magic Doorstop
        Story.killQuest(3668, "killercatacombs", "Sundered Darkblood ");

        // Silverware Cipher
        Story.killQuest(3669, "killercatacombs", "Ravenous Maw");

        // Dinner Bell
        if (!Story.questProgression(3670)) {
            Core.ensureAccept(3670);
            Core.huntMonster("killercatacombs", "Starved Maw ", "Starved Maw Defeated", 10);
            Core.huntMonster("killercatacombs", "Ravenous Maw", "Ravenous Maw Defeated", 10);
            Core.ensureComplete(3670);
        }

        // Faceless Challengers
        Story.killQuest(3671, "killercatacombs", "Living Armor ");

        // Doorway
        Story.killQuest(3672, "killercatacombs", "Living Armor ");

        // Eternal Hunger
        if (!Story.questProgression(3673)) {
            Core.ensureAccept(3673);
            Core.huntMonster("killercatacombs", "Starved Maw ", "Starved Maw Defeated", 10);
            Core.huntMonster("killercatacombs", "Ravenous Maw", "Ravenous Maw Defeated", 10);
            Core.huntMonster("killercatacombs", "Living Armor ", "Living Armor Defeated", 10);
            Core.ensureComplete(3673);
        }

        // You Weren't Invited
        Story.killQuest(3674, "killercatacombs", "Living Armor ");

        // Teeth and Plates
        if (!Story.questProgression(3675)) {
            Core.ensureAccept(3675);
            Core.huntMonster("killercatacombs", "Ravenous Maw", "Ravenous Maw Defeated", 15);
            Core.huntMonster("killercatacombs", "Starved Maw ", "Starved Maw Defeated", 15);
            Core.huntMonster("killercatacombs", "Living Armor ", "Living Armor Defeated", 15);
            Core.ensureComplete(3675);
        }

        // The Moment of Silence
        Story.mapItemQuest(3676, "killercatacombs", 2763, 10);
        Story.killQuest(3676, "killercatacombs", "Living Armor");

        // Eternal Servitude
        if (!Story.questProgression(3677)) {
            Core.ensureAccept(3677);
            Core.huntMonster("killercatacombs", "Unstable Spirit Orb ", "Unstable Spirit Ousted", 10);
            Core.huntMonster("killercatacombs", "Living Armor ", "Living Armor Defeated", 20);
            Core.huntMonster("killercatacombs", "Sundered Darkblood ", "Sundered Darkblood Defeated", 10);
            Core.ensureComplete(3677);
        }

        // A Reanimated Dragon
        if (!Story.questProgression(3678)) {
            Core.ensureAccept(3678);
            Core.huntMonsterMapID("killercatacombs", 73, "Dracolich Slain");
            Core.ensureComplete(3678);
        }

        // Lonesome Twin Guardian
        if (!Story.questProgression(3679)) {
            Core.ensureAccept(3679);
            Core.huntMonsterMapID("killercatacombs", 74, "Dracolich Necromancer Ended");
            Core.ensureComplete(3679);
        }
    }
}

export default function main(): void {
    const script = new KillerCatacombs();
    Core.setOptions();

    script.killerCatacombs_Line();

    Core.setOptions(false);
}
