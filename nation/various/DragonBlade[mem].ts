/*
name: DragonBlade[mem]
description: null
tags: null
*/
// Port of Scripts/Nation/Various/DragonBlade[mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreNation } from "../CoreNation";

const Farm = new CoreFarms();
const Nation = new CoreNation();

export class DragonBladeofNulgath {
    readonly twistedItems: string[] = [
        "DragonFire of Nulgath",
        "Crimson Plate of Nulgath",
        "Crimson Face Plate of Nulgath",
    ];

    /** Farms DragonBlade of Nulgath or Ebony DragonBlade of Nulgath when the seasonal reward is active. */
    getDragonBlade(DbladeOnly = false): void {
        const DBON = Core.initializeWithRetries(() => bot.quests.ensureLoad(766));
        const Rewards = [...(DBON?.rewards ?? [])];

        const SeasonalActive = !DbladeOnly && Rewards.some((x) => x.name === "Ebony DragonBlade of Nulgath");
        const TargetBlade = SeasonalActive ? "Ebony DragonBlade of Nulgath" : "DragonBlade of Nulgath";

        if (!Core.isMember || Core.checkInventory(TargetBlade)) {
            Core.logger(
                !Core.isMember ? "Not a Member, cannot get DragonBlade of Nulgath." : `"${TargetBlade}" owned.`,
            );
            return;
        }

        Core.addDrop(
            ...Nation.bagDrops,
            ...this.twistedItems,
            "DragonBlade of Nulgath",
            "Combat Trophy",
            "Basic War Sword",
            "Behemoth Blade of Shadow",
            "Behemoth Blade of Light",
            "Ebony DragonBlade of Nulgath",
        );

        Core.ensureAccept(766);
        this.behemothBladeof("Shadow");
        this.behemothBladeof("Light");

        while (!bot.shouldExit && !Core.checkInventory(this.twistedItems)) {
            Core.ensureAccept(765);
            Nation.farmTotemofNulgath(3);
            Core.huntMonster("underworld", "Skull Warrior", "Skull Warrior Rune");
            Core.ensureCompleteChoose(765);
        }

        Nation.farmTotemofNulgath(3);

        Core.huntMonster("underworld", "Legion Fenrir", "Legion Fenrir Rune");
        Core.ensureComplete(766);
        bot.wait.forPickup(TargetBlade);
    }

    behemothBladeof(blade: string): void {
        if (Core.checkInventory(`Behemoth Blade of ${blade}`)) {
            return;
        }

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
        Core.buyItem("battleon", 222, `Behemoth Blade of ${blade}`);
    }
}

export default function main(): void {
    const script = new DragonBladeofNulgath();
    Core.bankingBlackList.push(...Nation.bagDrops);
    Core.bankingBlackList.push(...script.twistedItems);
    Core.bankingBlackList.push(
        "DragonBlade of Nulgath",
        "Combat Trophy",
        "Basic War Sword",
        "Behemoth Blade of Shadow",
        "Behemoth Blade of Light",
    );
    Core.setOptions();

    script.getDragonBlade();

    Core.setOptions(false);
}
