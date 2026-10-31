/*
name: Empowered Vordred's Armor
description: This script will farm Empowered Vordred's Armor.
tags: vordred, armor, empowered, more skulls, voiduminance, unbroken skulls, evil
*/
// Port of Scripts/Evil/VordredsArmor.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../core/CoreAdvanced";
import { ClassType, Core } from "../core/CoreBots";
import { CoreFarms } from "../core/CoreFarms";
import { CoreStory } from "../core/CoreStory";
import { CoreSDKA } from "./sdka/CoreSDKA";
import { CoreDoomwood } from "../story/doomwood/CoreDoomwood";

const Farm = new CoreFarms();
const DW = new CoreDoomwood();
const Story = new CoreStory();
const Adv = new CoreAdvanced();
const SDKA = new CoreSDKA();

export class VordredArmor {
    getVordredsArmor(DMN = false): void {
        if (DMN && Core.isCompletedBefore(8380)) {
            return;
        }

        if (Core.checkInventory("Empowered Vordred's Armor")) {
            return;
        }

        Story.preLoad(this.getVordredsArmor);

        DW.doomwoodPart3();
        Farm.experience(60);

        if (!Story.questProgression(8376)) {
            Core.equipClass(ClassType.Farm);
            Core.ensureAccept(8376);
            Core.huntMonster("warundead", "Skeletal Fire Mage", "Undead Army Skull", 1000, { isTemp: false });
            Core.ensureComplete(8376);
        }

        // MORE SKULLS
        if (!Story.questProgression(8377)) {
            Core.ensureAccept(8377);
            if (!Core.checkInventory("Screaming Might")) {
                Core.huntMonster("dagefortress", "Scorned Knight", "Dark Palace Token", 10, { isTemp: false });
                Adv.buyItem("dagefortress", 1144, "Screaming Might");
            }
            Core.huntMonster("graveyard", "Big Jack Sprat", "Bone Axe", undefined, { isTemp: false });
            Core.huntMonster("battleundera", "Angry Undead Giant", "Spine Gripper", undefined, { isTemp: false });
            Core.huntMonster("marsh", "Dreadspider", "Dread Staff", undefined, { isTemp: false });
            Core.killMonster("Odokuro", "Boss", "Left", "O-Dokuro", "O-dokuro Blade", undefined, { isTemp: false });
            Farm.arcangroveREP();
            Adv.buyItem("arcangrove", 214, "Ancient Skull Blade");
            Farm.doomWoodREP();
            Core.huntMonster("dragonheart", "Avatar of Desolich", "Dracolich Destroyer Scythe", undefined, {
                isTemp: false,
            });
            Core.huntMonster("dragonbone", "Gorgorath", "Boneblade of Gorgorath", undefined, { isTemp: false });
            Core.ensureComplete(8377);
        }

        // MORE SKULLS ON THE SKULLS
        if (!Story.questProgression(8378)) {
            Core.ensureAccept(8378);
            Farm.evilREP();
            Adv.buyItem("Shadowfall", 89, "Shadow Lich");
            Core.killEscherion("Escherion's Robe");
            Core.huntMonster("battleundera", "Bone Terror", "Undead Terror Armor", undefined, { isTemp: false });
            Core.huntMonster("necrocavern", "Shadow Dragon", "Skulls of the Necromancer", undefined, { isTemp: false });
            if (!Core.checkInventory("Undead Warrior Executioner")) {
                if (!Core.checkInventory("Dage's Approval", 100)) {
                    Core.huntMonster("evilwardage", "Bloodfiend", "Dage's Approval", 100, { isTemp: false });
                }
                if (!Core.checkInventory("Dage's Favor", 75)) {
                    Core.huntMonster("evilwardage", "Bloodfiend", "Dage's Favor", 75, { isTemp: false });
                }
                if (!Core.checkInventory("Undead Warrior Bruiser")) {
                    Core.huntMonster("underworld", "Revontheus ", "Undead Warrior Bruiser", undefined, {
                        isTemp: false,
                    });
                }
                Adv.buyItem("evilwardage", 454, "Undead Warrior Executioner");
            }
            Core.ensureComplete(8378);
        }

        // MORE SKULLS ON THOSE SKULLS - 8379
        if (!Story.questProgression(8379)) {
            Core.ensureAccept(8379);
            Core.huntMonster("desolich", "Desolich", "Desolich's Skull", 5, { isTemp: false });
            Core.equipClass(ClassType.Solo);
            Core.killMonster("doomvaultb", "r26", "Left", "Undead Raxgore", "Undead Raxgore's Skull", 10, {
                isTemp: false,
            });
            Core.huntMonster("frozenlair", "Legion Lich Lord", "Legion Lich Lord's Skull", 15, { isTemp: false });
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("thevoid", "Reaper", "Reaper's Skull", 20, { isTemp: false });
            Core.ensureComplete(8379);
        }

        // VOIDUMINANCE - 8380
        if (!Story.questProgression(8380)) {
            Core.ensureAccept(8380);
            Core.huntMonster("epicvordred", "Ultra Vordred", "(Necro) Scroll of Dark Arts", 1, { isTemp: false });
            Core.huntMonster("lightguardwar", "Extreme Noxus", "Noxus Runes", undefined, { isTemp: false });
            Adv.buyItem("necrotower", 282, "Sally's Necronomicon");
            Core.equipClass(ClassType.Farm);
            bot.quests.updateQuest(2059);
            Core.killMonster("necrodungeon", "r22", "Down", "*", "Ancient Evil of the Necropolis", undefined, {
                isTemp: false,
            });
            Core.ensureComplete(8380);
            if (DMN) {
                return;
            }
        }

        // Empower Vordred's Armor - 8381
        if (!Story.questProgression(8381)) {
            Core.equipClass(ClassType.Solo);
            Core.ensureAccept(8381);
            if (!Core.checkInventory("Sepulchure's DoomKnight Armor")) {
                SDKA.doAll();
            }
            if (!Core.checkInventory("Vordred's Armor") && bot.quests.isUnlocked(8381)) {
                Adv.buyItem("stonewood", 2063, "Vordred's Armor");
            }
            Core.huntMonster("epicvordred", "Ultra Vordred", "Ultra Vordred Beat Up");
            Core.ensureComplete(8381);
        }
    }

    especiallyUnbrokenSkull(quant = 500): void {
        if (Core.checkInventory("Especially Unbroken Skull", quant)) {
            return;
        }

        Core.addDrop("Especially Unbroken Skull");
        Core.equipClass(ClassType.Farm);

        // UNBROKEN SKULLS (Mem) - 8342
        if (Core.isMember) {
            Core.registerQuests(8411);
            while (!bot.shouldExit && !Core.checkInventory("Especially Unbroken Skull", quant)) {
                Core.ensureAccept(8411);
                Core.huntMonster("warundead", "Undead Mage", "Unbroken Skulls", 100, { isTemp: false });
                Core.huntMonster("warundead", "Summon Lich", "Summon Lich's Orb", 1, { isTemp: false });
                Core.ensureComplete(8411);
                bot.wait.forPickup("Especially Unbroken Skull");
            }
            Core.cancelRegisteredQuests();
        } else {
            // UNBROKEN SKULLS - 8341
            Core.registerQuests(8341);
            while (!bot.shouldExit && !Core.checkInventory("Especially Unbroken Skull", quant)) {
                Core.huntMonster("warundead", "Undead Mage", "Unbroken Skulls", 100, { isTemp: false });
                bot.wait.forPickup("Especially Unbroken Skull");
            }
        }
        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new VordredArmor();
    Core.setOptions();

    script.getVordredsArmor();

    Core.setOptions(false);
}
