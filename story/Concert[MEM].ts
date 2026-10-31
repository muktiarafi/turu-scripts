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
        Story.killQuest(1021, "vertigo", ["Fear Muncher", "Banished Banshee"]);

        //Elevation Sensation 1022
        Story.killQuest(1022, "vertigo", ["Cloaked Fiend", "Banished Banshee"]);

        //Altitude Adjustment 1023
        Story.killQuest(1023, "vertigo", ["Cloaked Fiend", "Abandoned Dolly"]);

        //Conquer Vertigo 1024
        Story.killQuest(1024, "vertigo", "Vertigo");
    }

    darkness(): void {
        if (Core.isCompletedBefore(1029)) {
            return;
        }

        //No Matter How Dark the Night 1025
        Story.killQuest(1025, "darkness", ["Fear Muncher", "Banished Banshee"]);

        //The Dark (K)Nights 1026
        Story.killQuest(1026, "darkness", "Cloaked Fiend");

        //Something, Something Dark Side 1027
        Story.killQuest(1027, "darkness", ["Banished Banshee", "Abandoned Dolly"]);

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
        Story.killQuest(1033, "feardeath", ["Fear Muncher", "Abandoned Dolly", "Banished Banshee", "Cloaked Fiend"]);

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
