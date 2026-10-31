/*
name: Infernal Arena
description: This script will complete the quests in /infernalarena.
tags: na'al, naal, infernal, arena, story, dungeon
*/
// Port of Scripts/Story/QueenofMonsters/Extra/InfernalArena.cs.

import { bot, ClassUseMode } from "turu";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreStory } from "../../../core/CoreStory";
import { CelestialArenaQuests } from "./CelestialArena";

const Story = new CoreStory();
const CAQuests = new CelestialArenaQuests();

export class InfernalArena {
    doStory(ReturnEarly = false): void {
        Core.oneTimeMessage(
            "SOLO-ONLY",
            "this map is solo only\n" +
                "and anything past the duo's will require potions\n" +
                "so the script wont go past that mob.\n" +
                "[DO IT YOURSELF]",
            false,
        );

        if (Core.isCompletedBefore(ReturnEarly ? 9376 : 9377)) {
            return;
        }

        CAQuests.doAll();

        Story.preLoad(this.doStory);

        if (Core.checkInventory("ArchPaladin")) {
            Core.equip("ArchPaladin");
        } else {
            Core.equipClass(ClassType.Solo);
        }

        // Maligned Magus 9356
        Story.killQuest(9356, "infernalarena", "Infernal Mage");

        // Reverent Revenger 9357
        Story.killQuest(9357, "infernalarena", "Infernal Revenger");

        // Infernal Harbinger 9358
        Story.killQuest(9358, "infernalarena", "Infernal Harbinger");

        // First of the Fallen 9359
        Story.killQuest(9359, "infernalarena", "First Fallen");

        // Infernal Warlord 9360
        Story.killQuest(9360, "infernalarena", "Fallen Warlord");

        // Abhorrent Aperitif 9361
        Story.killQuest(9361, "infernalarena", "Malicious Maw");

        // Touch of Death 9362
        Story.killQuest(9362, "infernalarena", "Wicked Rotfinger");

        // Dire Dreams 9363
        Story.killQuest(9363, "infernalarena", "Dark Devourax");

        // Festering Forest 9364
        Story.killQuest(9364, "infernalarena", "Corrupt Terror");

        // Abominable Butchery 9365
        Story.killQuest(9365, "infernalarena", "Infernal Abominator");

        // Infernal Screech 9366
        Story.killQuest(9366, "infernalarena", "Twisted Harpy");

        // Frosty Burns 9367
        Story.killQuest(9367, "infernalarena", "Infernal Izotz");

        // Kramping Your Style 9368
        Story.killQuest(9368, "infernalarena", "Infernal Krampus");

        // Defiled Destiny 9369
        Story.killQuest(9369, "infernalarena", "Destructive Defiler");

        // Searing Snake Oil 9370
        Story.killQuest(9370, "infernalarena", "Infernal Naga");

        // Ambivalent Affection 9371
        Story.killQuest(9371, "infernalarena", "Accursed Agape");

        // From the Crux of Shadows 9372
        Story.killQuest(9372, "infernalarena", "Accursed Apephyrx");

        //#region Fuck these guys
        // Reviled Returner 9373
        Core.logger("Boss: [Deadly Duo]");
        Story.killQuest(9373, "infernalarena", "Deadly Duo");

        // Reign of the Deer 9374
        Core.logger("Boss: [Cervus Malus]");
        Story.killQuest(9374, "infernalarena", "Cervus Malus");

        // C# falls back to `"Void Highlord" ?? string.Empty`, never empty: without either class it
        // equipped Void Highlord anyway instead of the solo class.
        const VHLCheck = Core.checkInventory("Void HighLord (IoDA)")
            ? "Void HighLord (IoDA)"
            : Core.checkInventory("Void Highlord")
              ? "Void Highlord"
              : "";
        if (!!VHLCheck) {
            Core.equip(VHLCheck);
            bot.skills.startAdvanced(VHLCheck, false, ClassUseMode.Def);
        } else {
            Core.equipClass(ClassType.Solo);
        }

        // Ars Infernum 9375
        Core.logger("Boss: [Key of Sholemoh]");
        Story.killQuest(9375, "infernalarena", "Key of Sholemoh");

        // Unrepentant Culler 9376
        Core.logger("Boss: [Azalith's Scythe]");
        bot.options.attackWithoutTarget = true;
        Story.killQuest(9376, "infernalarena", "Azalith's Scythe");
        bot.options.attackWithoutTarget = false;

        if (!ReturnEarly) {
            // Lord of the Scarred Barrens  9377
            Core.logger("Boss: [Na'al]");
            Core.logger(
                "this may take an hr or 2... or u may first try\n" +
                    "it so good luck(a kill has been gotten with vhl\n" +
                    "so its confirmd able to be done...)",
            );
            Core.ensureAccept(9377);
            Story.killQuest(9377, "infernalarena", "Na'al");
            Core.ensureComplete(9377);
        }
        //#endregion Fuck these guysa
    }
}

export default function main(): void {
    const script = new InfernalArena();
    Core.setOptions();

    script.doStory();

    Core.setOptions(false);
}
