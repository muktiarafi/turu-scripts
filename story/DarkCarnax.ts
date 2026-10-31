/*
name: Dark Carnax Story
description: This will finish the Dark Carnax story.
tags: story, quest, dark-carnax
*/
// Port of Scripts/Story/DarkCarnax.cs.

import { bot, ClassUseMode, type EventMap, SkillUseMode } from "turu";
import { CoreAdvanced, EnhancementType, WeaponSpecial } from "../core/CoreAdvanced";
import { ClassType, Core, randomInt } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();
const Adv = new CoreAdvanced();

export class DarkCarnaxStory {
    storyline(forUltra = false): void {
        if (Core.isCompletedBefore(forUltra ? 8871 : 8872)) {
            return;
        }

        Story.preLoad(this.storyline);

        //8870 The Beast Awakens
        Story.killQuest(8870, "aqlesson", "Carnax");

        //8871 Nightmare Containment Field
        if (!Story.questProgression(8871)) {
            Core.ensureAccept(8871);
            Core.huntMonster("doomvault", "Binky", "Binky's Uni-horn", undefined, { isTemp: false });
            Core.huntMonster("deadmoor", "Nightmare", "Nightmare Mane", undefined, { isTemp: false });
            Core.huntMonster("somnia", "NightWyrm", "NightWyrm Chitin", undefined, { isTemp: false });
            Core.huntMonster("fearhouse", "All Fears", "Sheer Horror", undefined, { isTemp: false });
            Core.ensureComplete(8871);
        }
        if (forUltra) {
            return;
        }

        //8872 The Last Stand
        if (!Story.questProgression(8872)) {
            Core.logger(`Doing Quest: [8872] - "The Last Stand"`);
            this.syntheticViscera(1);
            Core.logger(`Completed Quest: [8872] - "The Last Stand"`);
        } else {
            Core.logger(`Already Completed: [8872] - "The Last Stand"`);
        }
    }

    // C# moves on a Task; here a one-shot handler walks after the delay, and the move counts as
    // running until `carnaxMovingUntil` (the walk plus C#'s 1.5-2.5 s settle).
    private carnaxMovingUntil = 0;
    private currentCarnaxZone = "";
    private lastCarnaxMove: number = 0;
    private readonly carnaxMoveCooldown: number = 2 * 1000;

    syntheticViscera(quant = 1000): void {
        if (Core.checkInventory("Synthetic Viscera", quant)) {
            return;
        }

        Core.addDrop("Synthetic Viscera");
        Core.farmingLogger("Synthetic Viscera", quant);

        bot.options.attackWithoutTarget = true;

        bot.events.on("runToArea", this.darkCarnaxMove);

        if (Core.checkInventory("Dragon of Time")) {
            Core.equip("Dragon of Time");
            bot.skills.startSkills("3|2|4|2|1|2", 250, SkillUseMode.WaitForCooldown);
        } else if (Core.checkInventory("Healer (Rare)")) {
            bot.skills.startAdvanced("Healer (Rare)", true, ClassUseMode.Base);
        } else if (Core.checkInventory("Healer")) {
            bot.skills.startAdvanced("Healer", true, ClassUseMode.Base);
        } else {
            Core.equipClass(ClassType.Solo);
        }

        Adv.gearStore(undefined, { enhAfter: true });
        Adv.enhanceEquipped(EnhancementType.Healer, { wSpecial: WeaponSpecial.Elysium });

        Core.registerQuests(8872);
        while (!bot.shouldExit && !Core.checkInventory("Synthetic Viscera", quant)) {
            Core.killMonster("DarkCarnax", "Boss", "Right", "Nightmare Carnax");
        }

        Core.cancelRegisteredQuests();
        bot.options.attackWithoutTarget = false;
        Adv.gearStore(true, { enhAfter: true });

        bot.events.off("runToArea", this.darkCarnaxMove);

        // Cancel any pending movement
        bot.handlers.remove("DarkCarnaxMove");
        this.carnaxMovingUntil = 0;
    }

    private darkCarnaxMove = ({ zone }: EventMap["runToArea"]): void => {
        const zoneLower = zone?.toLowerCase() ?? "";
        if (zoneLower === this.currentCarnaxZone) {
            return;
        }

        if (Date.now() - this.lastCarnaxMove < this.carnaxMoveCooldown) {
            return;
        }

        this.currentCarnaxZone = zoneLower;
        this.lastCarnaxMove = Date.now();

        if (Date.now() < this.carnaxMovingUntil) {
            return;
        }

        const delay = randomInt(1000, 1500);
        this.carnaxMovingUntil = Date.now() + delay + randomInt(1500, 2500);
        bot.handlers.once("DarkCarnaxMove", delay, () => {
            const y = randomInt(380, 475);
            const x =
                zoneLower === "a" ? randomInt(600, 931) : zoneLower === "b" ? randomInt(25, 326) : randomInt(325, 601);

            bot.player.walkTo(x, y);
        });
    };
}

export default function main(): void {
    const script = new DarkCarnaxStory();
    Core.setOptions();

    script.storyline();

    Core.setOptions(false);
}
