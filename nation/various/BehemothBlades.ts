/*
name: BehemothBlades
description: null
tags: null
*/
// Port of Scripts/Nation/Various/BehemothBlades.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export enum Blade {
    Shadow = "Shadow",
    Light = "Light",
    Both = "Both",
}

export class BehemothBlade {
    blades(): void {
        const bladeChoice = bot.config?.get<Blade>("BladeChoice") ?? null;

        if (bladeChoice === Blade.Both) {
            this.behemothBladeof("Shadow");
            this.behemothBladeof("Light");
        } else {
            this.behemothBladeof(String(bladeChoice));
        }
    }

    behemothBladeof(blade: string): void {
        if (Core.checkInventory(`Behemoth Blade of ${blade}`)) {
            return;
        }

        Core.farmingLogger(`Behemoth Blade of ${blade}`, 1);

        Core.equipClass(ClassType.Solo);
        if (!Core.checkInventory("Basic War Sword")) {
            Farm.bludrutBrawlBoss(undefined, 50);
            Core.buyItem("battleon", 222, "Basic War Sword");
        }
        if (!Core.checkInventory("Steel Afterlife")) {
            Farm.bludrutBrawlBoss(undefined, 50);
            Core.buyItem("battleon", 222, "Steel Afterlife");
        }
        Farm.bludrutBrawlBoss(undefined, 500);
        const bladeChoice = String(bot.config?.get<Blade>("BladeChoice")) ?? "";
        Core.buyItem("battleon", 222, `Behemoth Blade of ${bladeChoice}`);
    }
}

export const scriptOptions = defineScriptOptions(
    "BehemothBlade",
    [
        Core.skipOptions,
        option.choice(
            "BladeChoice",
            "Choose Your Version",
            "Choose between Behemoth Blade of Shadow, Light, or both",
            choices(Blade),
            Blade.Both,
        ),
    ],
    true,
);

export default function main(): void {
    const script = new BehemothBlade();
    Core.bankingBlackList.push(
        "",
        "Combat Trophy",
        "Basic War Sword",
        "Behemoth Blade of Shadow",
        "Behemoth Blade of Light",
    );
    Core.setOptions();

    script.blades();

    Core.setOptions(false);
}
