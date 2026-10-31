/*
name: RankUpAllClasses
description: rank up all classes
tags: rank, up, class, rank class, rank up class, rank up all class, class rank, class points
*/
// Port of Scripts/Tools/RankUpAllClasses.cs.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced } from "../core/CoreAdvanced";
import { Core } from "../core/CoreBots";

const Adv = new CoreAdvanced();

export class RankUpAll {
    rankUpAllClasses(includeBank = false): void {
        // Define the classes to exclude
        // C# reads CurrentClass.Name without a null check; no class is "" here.
        const InitialClass = bot.player.currentClass ?? "";
        const excludedClasses = ["Hobo Highlord", "No Class", "Obsidian No Class", InitialClass];
        // Populate SelectedClasses from inventory, excluding specific classes
        const SelectedClasses = bot.inventory.items
            .filter(
                (c) =>
                    c.category === "Class" &&
                    c.quantity < 302500 &&
                    !excludedClasses.includes(c.name) &&
                    (Core.isMember || !c.upgrade) &&
                    c.enhancementLevel > 0,
            )
            .map((x) => x.name);

        // If includeBank is true, add classes from bank to SelectedClasses
        let bankClasses: string[] = [];
        if (includeBank) {
            bankClasses = bot.bank.items
                .filter(
                    (c) =>
                        c.category === "Class" &&
                        c.quantity < 302500 &&
                        !excludedClasses.includes(c.name) &&
                        (Core.isMember || !c.upgrade) &&
                        c.enhancementLevel > 0 &&
                        c.enhancementPatternId > 0,
                )
                .map((x) => x.name);

            SelectedClasses.push(...bankClasses);
        }

        // Optional: Log the updated SelectedClasses
        Core.logger("Classes to Rank: " + SelectedClasses.join(", "));

        // Rank up classes and bank them if they were sourced from the bank
        for (const Class of SelectedClasses.filter((x) => !InitialClass.includes(x))) {
            if (Core.checkInventory(Class)) {
                Adv.rankUpClass(Class, { gearRestore: false });

                //Equip class we started with so we can bank this one
                Core.equip(InitialClass);

                // Bank the class if it was originally from the bank
                if (bankClasses.includes(Class)) {
                    Core.toBank(Class);
                    // Bank the class that came from the bank
                }
            }
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "RankUpAll",
    [
        option.bool("inclBank", "Include Bank", "If True, will also rank up all unranked classes in the bank", false),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new RankUpAll();
    Core.setOptions();

    script.rankUpAllClasses(bot.config!.get<boolean>("inclBank"));

    Core.setOptions(false);
}
