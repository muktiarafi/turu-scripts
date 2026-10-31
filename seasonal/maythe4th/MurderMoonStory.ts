/*
name: Murder Moon Story
description: This will complete the Murder Moon story.
tags: story, quest, seasonal, murder, moon, may-the-4th
*/
// Port of Scripts/Seasonal/MayThe4th/MurderMoonStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced, EnhancementType, WeaponSpecial } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();
const Adv = new CoreAdvanced();

export class MurderMoon {
    murderMoonStory(StopEarly = false): void {
        if (Core.isCompletedBefore(9224) || !Core.isSeasonalMapActive("murdermoon")) {
            return;
        }

        //That Is The Way
        if (!Story.questProgression(8062)) {
            Core.ensureAccept(8062);
            Core.killMonster("murdermoon", "r2", "Left", "Tempest Soldier", "Soldiers Defeated", 6);
            Core.ensureComplete(8062);
        }

        //Murder Moon Plans
        if (!Story.questProgression(8063)) {
            Core.ensureAccept(8063);
            Core.killMonster("murdermoon", "r2", "Left", "Tempest Soldier", "Murder Moon Plans");
            Story.mapItemQuest(8063, "murdermoon", 8373, 5);
        }

        //Revenge of the Fifth
        Story.killQuest(8064, "murdermoon", "Fifth Sepulchure");

        // Tempest Proofing (9223)
        Story.killQuest(9223, "murdermoon", "Tempest Soldier");

        if (StopEarly) {
            return;
        }

        // Liberty's Ghost (9224)
        if (!Story.questProgression(9224)) {
            Adv.gearStore(undefined, { enhAfter: true });
            if (!Core.checkInventory(["Dark Lord", "Darkside"], undefined, { any: true })) {
                this.getDL();
            } else {
                if (Core.checkInventory("Dark Lord")) {
                    Core.equip("Dark Lord");
                } else if (Core.checkInventory("Darkside")) {
                    Core.equip("Darkside");
                } else {
                    Core.logger("Neither `Darkside or `Dark Lord` owned... guess we'll use what u have on peasant");
                }
            }

            if (Adv.uElysium()) {
                const EquippedWeapon = bot.inventory.items.find(
                    (i) => i != null && i.equipped && Adv.weaponCatagories.includes(i.category),
                );
                Adv.enhanceItem(EquippedWeapon!.name, EnhancementType.Wizard, { wSpecial: WeaponSpecial.Elysium });
            }

            Story.killQuest(9224, "murdermoon", "Fourth Lynaria");
            Adv.gearStore(true, { enhAfter: true });
        }
    }

    // keep this here, i tried referencing Darklord to loop back.. but it crashes the client
    getDL(): void {
        if (Core.checkInventory("Dark Lord")) {
            return;
        }

        Core.addDrop(`Cyber Crystal`, "S Ring", "Fifth Lord's Filtrinator", "Dark Helmet", "Dotty");

        //Cyber Crystal x66
        Core.equipClass(ClassType.Farm);
        Core.registerQuests(8065);
        while (!bot.shouldExit && !Core.checkInventory("Cyber Crystal", 66)) {
            Core.killMonster("murdermoon", "r2", "Left", "Tempest Soldier", "Tempest Soldier Badge", 5, { log: false });
        }
        Core.cancelRegisteredQuests();

        //S Ring x15
        Core.equipClass(ClassType.Solo);
        Core.huntMonster("murdermoon", "Fifth Sepulchure", "S Ring", 15, { isTemp: false });

        //Fifth Lord's Filtrinator x15
        Core.huntMonster(`murdermoon`, "Fifth Sepulchure", "Fifth Lord's Filtrinator", 15, { isTemp: false });

        //Dark Helmet x1
        bot.quests.updateQuest(7484);
        Core.huntMonster("zorbaspalace", "Zorba the Bakk", "Dark Helmet", 1, { isTemp: false });

        //Dotty x15
        Core.huntMonster("zorbaspalace", "Zorba the Bakk", "Dotty", 15, { isTemp: false });

        //Gold Voucher 25k x4
        Adv.buyItem("murdermoon", 1998, "Gold Voucher 25k", 4);

        //Buying the Dark Lord
        Core.buyItem("murdermoon", 1998, "Dark Lord");
        bot.wait.forItemBuy();

        Adv.rankUpClass("Dark Lord");
    }
}

export default function main(): void {
    const script = new MurderMoon();
    Core.setOptions();

    script.murderMoonStory();

    Core.setOptions(false);
}
