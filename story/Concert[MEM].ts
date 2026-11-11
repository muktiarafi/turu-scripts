/*
name: Concert Story (Member)
description: This will finish the Concert quest.
tags: story, quest, concert, member
*/
// Port of Scripts/Story/Concert[MEM].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class Concert {
    doAll(): void {
        if (!Core.isMember) {
            Core.logger("Concert Event Is Member Only. Skipping this Script");
            return;
        }

        Story.preLoad(this.doAll);

        this.vertigo();
        this.darkness();
        this.feardeath();
    }

    vertigo(): void {
        if (Core.isCompletedBefore(1024)) {
            return;
        }

        //Up to the Highest Heights 1020
        Story.mapItemQuest(1020, "vertigo", 390);

        //High-sterical 1021
        if (!Story.questProgression(1021)) {
            Core.ensureAccept(1021);
            Core.huntMonster("vertigo", "Fear Muncher", "Fear Muncher Teeth", 6);
            Core.huntMonster("vertigo", "Banished Banshee", "Banshee Wail", 4);
            Core.ensureComplete(1021);
        }

        //Elevation Sensation 1022
        if (!Story.questProgression(1022)) {
            Core.ensureAccept(1022);
            Core.huntMonster("vertigo", "Cloaked Fiend", "Elevated Fiend", 5);
            Core.huntMonster("vertigo", "Banished Banshee", "Elevated Banshee", 5);
            Core.ensureComplete(1022);
        }

        //Altitude Adjustment 1023
        if (!Story.questProgression(1023)) {
            Core.ensureAccept(1023);
            Core.huntMonster("vertigo", "Cloaked Fiend", "Re-adjusted Fiend", 3);
            Core.huntMonster("vertigo", "Abandoned Dolly", "Re-adjusted Dolly", 5);
            Core.ensureComplete(1023);
        }

        //Conquer Vertigo 1024
        Story.killQuest(1024, "vertigo", "Vertigo");
    }

    darkness(): void {
        if (Core.isCompletedBefore(1029)) {
            return;
        }

        //No Matter How Dark the Night 1025
        if (!Story.questProgression(1025)) {
            Core.ensureAccept(1025);
            Core.huntMonster("darkness", "Fear Muncher", "Beam of Sunlight", 4);
            Core.huntMonster("darkness", "Banished Banshee", "Beam of Sunshine", 5);
            Core.ensureComplete(1025);
        }

        //The Dark (K)Nights 1026
        Story.killQuest(1026, "darkness", "Cloaked Fiend");

        //Something, Something Dark Side 1027
        if (!Story.questProgression(1027)) {
            Core.ensureAccept(1027);
            Core.huntMonster("darkness", "Banished Banshee", "Force-d Light", 6);
            Core.huntMonster("darkness", "Abandoned Dolly", "Force-d Beam", 5);
            Core.ensureComplete(1027);
        }

        //One Little Candle 1028
        Story.mapItemQuest(1028, "darkness", 392, 10);

        //Conquer Nyctox 1029
        Story.killQuest(1029, "darkness", "Nyctox");
    }

    feardeath(): void {
        if (Core.isCompletedBefore(1035)) {
            return;
        }

        //Death Be Not Pround 1030
        Story.mapItemQuest(1030, "feardeath", 391);

        //What Fear Makes 1031
        Story.killQuest(1031, "feardeath", "Abandoned Dolly");

        //The Little Death 1032
        Story.killQuest(1032, "feardeath", "Fear Muncher");

        //Terrify the Terrorkind 1033
        if (!Story.questProgression(1033)) {
            Core.ensureAccept(1033);
            Core.huntMonster("feardeath", "Fear Muncher", "Muncher Terrified", 2);
            Core.huntMonster("feardeath", "Abandoned Dolly", "Dolly Terrified", 3);
            Core.huntMonster("feardeath", "Banished Banshee", "Banshee Terrified", 3);
            Core.huntMonster("feardeath", "Cloaked Fiend", "Fiend Terrified", 2);
            Core.ensureComplete(1033);
        }

        //Conquer Thanatops 1034
        Story.killQuest(1034, "feardeath", "Thanotops");

        //Face Fear 1034
        Story.killQuest(1035, "fear", "Fear");
    }
}

export default function main(): void {
    const script = new Concert();
    Core.setOptions();
    script.doAll();
    Core.setOptions(false);
}
