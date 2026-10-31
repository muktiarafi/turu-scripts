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
        Story.killQuest(3670, "killercatacombs", ["Starved Maw ", "Ravenous Maw"]);

        // Faceless Challengers
        Story.killQuest(3671, "killercatacombs", "Living Armor ");

        // Doorway
        Story.killQuest(3672, "killercatacombs", "Living Armor ");

        // Eternal Hunger
        Story.killQuest(3673, "killercatacombs", ["Starved Maw ", "Ravenous Maw", "Living Armor "]);

        // You Weren't Invited
        Story.killQuest(3674, "killercatacombs", "Living Armor ");

        // Teeth and Plates
        Story.killQuest(3675, "killercatacombs", ["Ravenous Maw", "Starved Maw", "Living Armor "]);

        // The Moment of Silence
        Story.mapItemQuest(3676, "killercatacombs", 2763, 10);
        Story.killQuest(3676, "killercatacombs", "Living Armor");

        // Eternal Servitude
        Story.killQuest(3677, "killercatacombs", ["Unstable Spirit Orb", "Living Armor ", "Sundered Darkblood "]);

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
