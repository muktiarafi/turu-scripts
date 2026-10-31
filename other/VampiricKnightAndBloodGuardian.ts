/*
name: Vampiric Knight And Blood Guardian
description: Gets the Vampiric Knight And Blood Guardian Armors
tags: vampiric knight, blood guardian, armor
*/
// Port of Scripts/Other/VampiricKnightAndBloodGuardian.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../core/CoreBots";
import { BloodMoon } from "../story/BloodMoon";

const bloodMoon = new BloodMoon();

export class VampiricKnightAndBloodGuardian {
    getAll(): void {
        const AllRewards = [
            ...[
                ...Core.ensureLoad(6068).rewards.map((i) => i.name),
                ...Core.ensureLoad(6069).rewards.map((i) => i.name),
            ],
            ...Core.ensureLoad(6070).rewards.map((i) => i.name),
        ];

        if (Core.checkInventory(AllRewards, undefined, { toInv: false })) {
            return;
        }

        bloodMoon.bloodMoonSaga();
        bot.drops.add(...AllRewards);

        Core.equipClass(ClassType.Farm);

        Core.registerQuests(6068, 6069, 6070);
        while (!bot.shouldExit && !Core.checkInventory(AllRewards, undefined, { toInv: false })) {
            Core.killMonster("BloodWarVamp", "r5", "Left", "*", undefined, undefined, { log: false });
        }
        Core.jumpWait();
        Core.toBank(...AllRewards);
    }

    // while (!Bot.ShouldExit && !Core.CheckInventory(Quest2Rewards, toInv: false))
    //     //Mega Lycan Medals 6069
    //     Core.HuntMonster("BloodWarVamp", "Lunar Blazebinder", "Mega Lycan Medal", 3);
    // Core.JumpWait();
    // Core.ToBank(Quest2Rewards);

    // while (!Bot.ShouldExit && !Core.CheckInventory(Quest3Rewards, toInv: false))
    //     //Blackened Incense 6072
    //     Core.HuntMonster("BloodWarVamp", "Lunar Blazebinder", "Blackened Incense", 5);
    // Core.CancelRegisteredQuests();
    // Core.JumpWait();
    // Core.ToBank(Quest3Rewards);

    // }
}

export default function main(): void {
    const script = new VampiricKnightAndBloodGuardian();
    Core.setOptions();

    script.getAll();

    Core.setOptions(false);
}
