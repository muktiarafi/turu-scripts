/*
name: Nusantara Bosses Badge
description: This script will obtain the Nusantara Bosses Character Page Badge.
tags: nusantara, bosses, badge, seasonal,indonesian day,rangda,kala,kabasaran waranei,nusantara defender medali
*/
// Port of Scripts/Seasonal/IndonesianDay/NusantaraBossesBadge.cs.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";
import { RangdaSeasonal } from "./Rangda";

const Story = new CoreStory();
const Rangda = new RangdaSeasonal();

export class NusantaraBosses {
    badge(): void {
        if (Core.hasWebBadge(this.badgeName)) {
            Core.logger(`Already have the ${this.badgeName} badge`);
            return;
        }
        Rangda.storyLine();

        // Widow's Wail (10371)
        if (!Story.questProgression(10371)) {
            Core.huntMonsterQuest(10371, "rangda", "Rangda");
        }

        if (!Story.questProgression(10374)) {
            Core.huntMonsterQuest(
                10374,
                ["rangda", "Rangda", ClassType.Solo],
                ["kala", "Kala", ClassType.Solo],
                ["wentira", "Kabasaran Waranei", ClassType.Solo],
            );
        }
    }

    readonly badgeName = "Nusantara Bosses Badge";
}

export default function main(): void {
    const script = new NusantaraBosses();
    Core.setOptions();

    script.badge();
    Core.setOptions(false);
}
