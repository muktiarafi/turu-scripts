/*
name: Do All Four Harbingers
description: Completes the Four Harbingers story and optionally farms selected Four Harbingers Trove merge items.
tags: four harbingers, fourharbingers, story, quest, merge, complete, all, halosis, bello, fame, mors, anethyxos, lonewolf12
*/
// Port of Scripts/Prototypes/FourHarbingers/0DoAllFourHarbingers.cs.

import { bot, choices, defineScriptOptions, option } from "turu";
import { Core } from "../../core/CoreBots";
import { AnethyxosAbsolution } from "./AnethyxosAbsolution";
import { Bello } from "./Bello";
import { CoreFourHarbingers, FarmMode } from "./CoreFourHarbingers";
import { Fame } from "./Fame";
import { Halosis } from "./Halosis";
import { Mors } from "./Mors";

const FH = new CoreFourHarbingers();

export enum ClassChoice {
    Optimized = "Optimized",
}

export enum GoalChoice {
    Complete_Story_Only = "Complete_Story_Only",
    Nightstar_Companion = "Nightstar_Companion",
    All_Merge_Items = "All_Merge_Items",
    Each_Individual_Merge_Item = "Each_Individual_Merge_Item",
}

export class DoAllFourHarbingers {
    static readonly mergeItems = [
        option.bool("CelestialDragonOfTime", "Celestial Dragon of Time", "Merge Celestial Dragon of Time.", false),
        option.bool("InfernalDragonOfTime", "Infernal Dragon of Time", "Merge Infernal Dragon of Time.", false),
        option.bool("HarbingerOfWar", "Harbinger of War", "Merge Harbinger of War.", false),
        option.bool("HarbingerOfFamine", "Harbinger of Famine", "Merge Harbinger of Famine.", false),
        option.bool("HarbingerOfDeath", "Harbinger of Death", "Merge Harbinger of Death.", false),
        option.bool("HarbingerOfConquest", "Harbinger of Conquest", "Merge Harbinger of Conquest.", false),
        option.bool("BowOfHalosis", "Bow of Halosis", "Merge Bow of Halosis.", false),
        option.bool("HalosisDivineWheel", "Halosis' Divine Wheel", "Merge Halosis' Divine Wheel.", false),
        option.bool("WingsOfMors", "Wings of Mors", "Merge Wings of Mors.", false),
        option.bool("BelloArmaments", "Bello's Armaments", "Merge Bello's Armaments.", false),
        option.bool("BelloBraziers", "Bello's Braziers", "Merge Bello's Braziers.", false),
        option.bool(
            "BelloSanctifiedBraziers",
            "Bello's Sanctified Braziers",
            "Merge Bello's Sanctified Braziers.",
            false,
        ),
        option.bool("HuntingBowOfHalosis", "Hunting Bow of Halosis", "Merge Hunting Bow of Halosis.", false),
        option.bool("PoiseOfHalosis", "Poise of Halosis", "Merge Poise of Halosis.", false),
        option.bool("PoiseOfFames", "Poise of Fames", "Merge Poise of Fames.", false),
        option.bool("PoiseOfMors", "Poise of Mors", "Merge Poise of Mors.", false),
        option.bool("PoiseOfBello", "Poise of Bello", "Merge Poise of Bello.", false),
        option.bool(
            "InfernalDragonOfTimeHood",
            "Infernal Dragon of Time Hood",
            "Merge Infernal Dragon of Time Hood.",
            false,
        ),
        option.bool(
            "CelestialDragonOfTimeHood",
            "Celestial Dragon of Time Hood",
            "Merge Celestial Dragon of Time Hood.",
            false,
        ),
        option.bool("BelloBrazier", "Bello's Brazier", "Merge Bello's Brazier.", false),
        option.bool("FamesBarrenScale", "Fames' Barren Scale", "Merge Fames' Barren Scale.", false),
        option.bool("BelloSanctifiedBrazier", "Bello's Sanctified Brazier", "Merge Bello's Sanctified Brazier.", false),
        option.bool("NightstarCompanion", "Nightstar Companion", "Use the Nightstar Companion goal instead.", false),
        option.bool("ScytheOfMors", "Scythe of Mors", "Merge Scythe of Mors.", false),
    ];

    run(): void {
        if (!this.completeStory()) {
            return;
        }

        const goal = bot.config!.get<GoalChoice>("Goal");
        if (goal === GoalChoice.Complete_Story_Only) {
            Core.logger("Four Harbingers story complete.");
            return;
        }

        if (!this.completeFabulaVinculumFracti()) {
            return;
        }

        const selectedItems = this.getSelectedMergeItems(goal);
        if (!FH.completeMergeItems(selectedItems, this.farmScroll.bind(this))) {
            return;
        }

        Core.logger("Four Harbingers goal complete.");
    }

    private completeStory(): boolean {
        if (!Core.isCompletedBefore(10850)) {
            const halosis = new Halosis();
            halosis.doAllMode = true;
            halosis.scriptMain();
            if (!Core.isCompletedBefore(10850)) {
                return false;
            }
        }

        if (!Core.isCompletedBefore(10851)) {
            const bello = new Bello();
            bello.doAllMode = true;
            bello.scriptMain();
            if (!Core.isCompletedBefore(10851)) {
                return false;
            }
        }

        if (!Core.isCompletedBefore(10852)) {
            const fame = new Fame();
            fame.doAllMode = true;
            fame.scriptMain();
            if (!Core.isCompletedBefore(10852)) {
                return false;
            }
        }

        if (!Core.isCompletedBefore(10853)) {
            const mors = new Mors();
            mors.doAllMode = true;
            mors.scriptMain();
            if (!Core.isCompletedBefore(10853)) {
                return false;
            }
        }

        if (!Core.isCompletedBefore(10854)) {
            const absolution = new AnethyxosAbsolution();
            absolution.doAllMode = true;
            absolution.scriptMain();
            if (!Core.isCompletedBefore(10854)) {
                return false;
            }
        }

        return true;
    }

    private completeFabulaVinculumFracti(): boolean {
        if (Core.isCompletedBefore(10855)) {
            return true;
        }

        if (!Core.ensureAccept(10855)) {
            Core.logger("WARNING: Fabula Vinculum Fracti [10855] could not be accepted.", undefined, {
                messageBox: true,
            });
            return false;
        }

        if (
            !this.farmScroll("Scroll of the Quartet", 1) ||
            !this.farmScroll("Scroll of the Wanderer", 1) ||
            !this.farmScroll("Scroll of the Preacher", 1) ||
            !this.farmScroll("Scroll of the Benevolent", 1) ||
            !this.farmScroll("Scroll of the Innocent", 1) ||
            !this.farmScroll("Scroll of the Heretic", 1)
        ) {
            return false;
        }

        if (!Core.ensureComplete(10855)) {
            Core.logger("WARNING: Fabula Vinculum Fracti [10855] could not be completed.", undefined, {
                messageBox: true,
            });
            return false;
        }

        return true;
    }

    private getSelectedMergeItems(goal: GoalChoice): string[] {
        if (goal === GoalChoice.Nightstar_Companion) {
            return ["Nightstar Companion"];
        }

        if (goal === GoalChoice.All_Merge_Items) {
            return [...CoreFourHarbingers.allMergeItems];
        }

        const selectedItems: string[] = [];
        this.addSelectedItem(selectedItems, "CelestialDragonOfTime", "Celestial Dragon of Time");
        this.addSelectedItem(selectedItems, "InfernalDragonOfTime", "Infernal Dragon of Time");
        this.addSelectedItem(selectedItems, "HarbingerOfWar", "Harbinger of War");
        this.addSelectedItem(selectedItems, "HarbingerOfFamine", "Harbinger of Famine");
        this.addSelectedItem(selectedItems, "HarbingerOfDeath", "Harbinger of Death");
        this.addSelectedItem(selectedItems, "HarbingerOfConquest", "Harbinger of Conquest");
        this.addSelectedItem(selectedItems, "BowOfHalosis", "Bow of Halosis");
        this.addSelectedItem(selectedItems, "HalosisDivineWheel", "Halosis' Divine Wheel");
        this.addSelectedItem(selectedItems, "WingsOfMors", "Wings of Mors");
        this.addSelectedItem(selectedItems, "BelloArmaments", "Bello's Armaments");
        this.addSelectedItem(selectedItems, "BelloBraziers", "Bello's Braziers");
        this.addSelectedItem(selectedItems, "BelloSanctifiedBraziers", "Bello's Sanctified Braziers");
        this.addSelectedItem(selectedItems, "HuntingBowOfHalosis", "Hunting Bow of Halosis");
        this.addSelectedItem(selectedItems, "PoiseOfHalosis", "Poise of Halosis");
        this.addSelectedItem(selectedItems, "PoiseOfFames", "Poise of Fames");
        this.addSelectedItem(selectedItems, "PoiseOfMors", "Poise of Mors");
        this.addSelectedItem(selectedItems, "PoiseOfBello", "Poise of Bello");
        this.addSelectedItem(selectedItems, "InfernalDragonOfTimeHood", "Infernal Dragon of Time Hood");
        this.addSelectedItem(selectedItems, "CelestialDragonOfTimeHood", "Celestial Dragon of Time Hood");
        this.addSelectedItem(selectedItems, "BelloBrazier", "Bello's Brazier");
        this.addSelectedItem(selectedItems, "FamesBarrenScale", "Fames' Barren Scale");
        this.addSelectedItem(selectedItems, "BelloSanctifiedBrazier", "Bello's Sanctified Brazier");
        this.addSelectedItem(selectedItems, "ScytheOfMors", "Scythe of Mors");

        if (bot.config!.get<boolean>("MergeItems", "NightstarCompanion")) {
            Core.logger(
                "Nightstar Companion was selected in MergeItems. Use the Nightstar Companion goal instead. Continuing without Nightstar Companion.",
                undefined,
                { messageBox: true },
            );
        }

        return selectedItems;
    }

    private addSelectedItem(selectedItems: string[], optionName: string, itemName: string): void {
        if (bot.config!.get<boolean>("MergeItems", optionName)) {
            selectedItems.push(itemName);
        }
    }

    private farmScroll(itemName: string, quantity: number): boolean {
        if (Core.checkInventory(itemName, quantity, { toInv: false })) {
            return true;
        }

        if (
            itemName.toLowerCase() === "Scroll of the Quartet".toLowerCase() ||
            itemName.toLowerCase() === "Scroll of the Wanderer".toLowerCase()
        ) {
            const halosis = new Halosis();
            this.configureFarm(halosis, itemName, quantity);
            halosis.scriptMain();
        } else if (itemName.toLowerCase() === "Scroll of the Preacher".toLowerCase()) {
            const bello = new Bello();
            this.configureFarm(bello, itemName, quantity);
            bello.scriptMain();
        } else if (itemName.toLowerCase() === "Scroll of the Benevolent".toLowerCase()) {
            const fame = new Fame();
            this.configureFarm(fame, itemName, quantity);
            fame.scriptMain();
        } else if (itemName.toLowerCase() === "Scroll of the Innocent".toLowerCase()) {
            const mors = new Mors();
            this.configureFarm(mors, itemName, quantity);
            mors.scriptMain();
        } else if (itemName.toLowerCase() === "Scroll of the Heretic".toLowerCase()) {
            const absolution = new AnethyxosAbsolution();
            this.configureFarm(absolution, itemName, quantity);
            absolution.scriptMain();
        } else {
            Core.logger(`WARNING: No Four Harbingers farm is configured for ${itemName}.`, undefined, {
                messageBox: true,
            });
            return false;
        }

        return Core.checkInventory(itemName, quantity, { toInv: false });
    }

    private configureFarm(
        bossScript: Halosis | Bello | Fame | Mors | AnethyxosAbsolution,
        itemName: string,
        quantity: number,
    ): void {
        bossScript.doAllMode = true;
        bossScript.farmModeOverride = FarmMode.Item_Quantity;
        bossScript.farmQuantityOverride = quantity;
        bossScript.farmItemOverride = itemName;
    }
}

export const scriptOptions = defineScriptOptions(
    "FourHarbingers_DoAll_v3",
    [
        option.choice(
            "ClassChoice",
            "Choose Class",
            "Optimized uses:\n\nHalosis - Dragon of Time\nBello - ArchPaladin\nFame - Yami no Ronin\nMors - Legion Revenant\nAnethyxos - King's Echo\n\nMore class options are available in the individual boss scripts.",
            choices(ClassChoice),
            ClassChoice.Optimized,
        ),
        option.choice(
            "Goal",
            "Goal",
            "Available goals:\n\nComplete Story Only - Completes the Four Harbingers story.\nNightstar Companion - Farms and merges Nightstar Companion.\nAll Merge Items - Farms and merges every shop item.\nEach Individual Merge Item - Uses the MergeItems panel.",
            choices(GoalChoice),
            GoalChoice.Complete_Story_Only,
        ),
        option.bool("UsePotions", "Use Potions", "Use the optimized potions during each fight.", true),
        option.bool("DoEnhancements", "Do Enhancements", "Apply the optimized enhancements before each fight.", true),
        Core.skipOptions,
    ],
    true,
    {
        MergeItems: DoAllFourHarbingers.mergeItems,
    },
);

export default function main(): void {
    const script = new DoAllFourHarbingers();
    Core.setOptions(undefined, { disableClassSwap: true });
    try {
        script.run();
    } finally {
        Core.setOptions(false);
    }
}
