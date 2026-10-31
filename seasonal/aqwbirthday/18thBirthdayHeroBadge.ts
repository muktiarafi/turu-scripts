/*
name: 18th Birthday Hero Character Page Badge
description: This script will get the "Birthday Hero of DOOM" Character Page Badge.
tags: birthday, badge, anniversary, gifts, quest, seasonal
*/
// Port of Scripts/Seasonal/AqwBirthday/18thBirthdayHeroBadge.cs.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class BirthdayHeroBadge {
    badge(): void {
        if (Core.hasWebBadge(this.badgeName)) {
            Core.logger(`Already have the ${this.badgeName} badge`);
            return;
        }

        Core.equipClass(ClassType.Solo);

        //18th Anniversary Gifts
        if (!Story.questProgression(6554)) {
            Core.ensureAccept(6554);
            Core.huntMonster("birthday", "Birthday Cake", "Top Cherry", 1);
            Core.huntMonster("birthday", "Birthday Cake", "Copper Knife", 1);
            Core.huntMonster("birthday", "Birthday Cake", "Platinum Fork", 1);
            Core.huntMonster("birthday", "Birthday Cake", "Gold Spoon", 1);
            Core.ensureComplete(6554);
        }
    }

    readonly badgeName = "Birthday Hero of DOOM";
}

export default function main(): void {
    const script = new BirthdayHeroBadge();
    Core.setOptions();

    script.badge();
    Core.setOptions(false);
}
