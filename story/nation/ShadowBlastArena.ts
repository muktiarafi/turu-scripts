/*
name: ShadowBlast Arena
description: This will finish the ShadowBlast Arena quest.
tags: story, quest, nation, shadowblast arena
*/
// Port of Scripts/Story/Nation/ShadowBlastArena.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class ShadowBlastArena {
    doall(): void {
        this.storyLineP1();
    }

    storyLineP1(): void {
        const QuestLogic = (): void => {
            switch (Story.legacyQuestId) {
                case 4733:
                    // The Shadowscythe Needs YOU! 4733
                    Core.huntMonster("shadowblast", "Legion Airstrike", "Legion Rookie Defeated", 5);
                    Core.huntMonster("shadowblast", "CaesarIsTheDark", "Nation Rookie Defeated", 5);
                    break;
                case 4734:
                    // Show Me More, Shadow-Noob 4734
                    Core.huntMonster("shadowblast", "Legion Fenrir", "Legion Veteran Defeated", 7);
                    Core.huntMonster("shadowblast", "Carnage", "Nation Veteran Defeated", 7);
                    break;
                case 4735:
                    // For the Shadowscythe! 4735
                    Core.huntMonster("shadowblast", "Legion Cannon", "Legion Elite Defeated", 10);
                    Core.huntMonster("shadowblast", "Minotaurofwar", "Nation Elite Defeated", 10);
                    break;
                case 4736:
                    // Gravelyn Likes Your Style 4736
                    Core.huntMonster("shadowblast", "Shadow Destroyer", "Shadowscythe Destroyer Vanquished");
                    break;
            }
        };
        if (Core.checkInventory("Shadowscythe Round 4 Medal")) {
            return;
        }

        Story.legacyQuestManager(QuestLogic, ...Core.fromTo(4733, 4736));
    }

    emblemofGravelyn(quant = 100): void {
        if (Core.checkInventory("Emblem of Gravelyn", quant)) {
            return;
        }

        if (!Core.checkInventory("Shadowscythe Round 4 Medal")) {
            this.storyLineP1();
        }

        Core.registerQuests(4750);
        Core.farmingLogger("Diamond Token of Dage", quant);
        Core.addDrop("Emblem of Gravelyn");
        while (!bot.shouldExit && !Core.checkInventory("Emblem of Gravelyn", quant)) {
            Core.huntMonster("shadowblast", "Carnage", "Shadow Seal", 1, { isTemp: false });
            Core.huntMonster("shadowblast", "Legion Fenrir", "Gem of Superiority", 1, { isTemp: false });
            bot.wait.forPickup("Emblem of Gravelyn");
        }
        Core.cancelRegisteredQuests();
    }

    diamondTokenofGravelyn(quant = 100): void {
        if (Core.checkInventory("Diamond Token of Dage", quant)) {
            return;
        }

        if (!Core.checkInventory("Shadowscythe Round 4 Medal")) {
            this.storyLineP1();
        }

        Core.addDrop("Legion Token", "Diamond Token of Dage");
        Core.farmingLogger("Diamond Token of Dage", quant);
        Core.registerQuests(4750);
        while (!bot.shouldExit && !Core.checkInventory("Diamond Token of Dage", quant)) {
            Core.equipClass(ClassType.Farm);
            Core.killMonster("tercessuinotlim", "m2", "Left", "*", "Defeated Makai", 25, { isTemp: false });

            Core.equipClass(ClassType.Solo);
            Core.killMonster("aqlesson", "Frame9", "Right", "Carnax", "Carnax Eye");
            Core.huntMonster("deepchaos", "Kathool", "Kathool Tentacle");
            Core.killMonster("dflesson", "r12", "Right", 29, 33257, undefined, { isTemp: true, publicRoom: true });
            Core.huntMonster("lair", "Red Dragon", "Red Dragon's Fang");
            Core.huntMonster("bloodtitan", "Blood Titan", "Blood Titan's Blade");
            bot.wait.forPickup("Diamond Token of Dage");
        }
        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new ShadowBlastArena();
    Core.bankingBlackList.push(
        "Shadowscythe Round 1 Medal",
        "Shadowscythe Round 2 Medal",
        "Shadowscythe Round 3 Medal",
        "Shadowscythe Round 4 Medal",
        "Emblem of Gravelyn",
        "Diamond Token of Gravelyn",
    );
    Core.setOptions();
    script.doall();

    Core.setOptions(false);
}
