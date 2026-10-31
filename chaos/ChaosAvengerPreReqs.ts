/*
name: Chaos Avenger Class
description: Gets the prerequisites for the Chaos avengers class besides the insignias.
tags: chaos avenger, class, prerequisites
*/
// Port of Scripts/Chaos/ChaosAvengerPreReqs.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../core/CoreAdvanced";
import { ClassType, Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";
import { Core13LoC } from "../story/lordsofchaos/Core13LoC";

const Story = new CoreStory();
const Adv = new CoreAdvanced();
const LOC = new Core13LoC();

export class ChaosAvengerClass {
    cavItems: string[] = [
        "Fragment of the Dragon",
        "Fragment of the Queen",
        "Fragments of the Lords B",
        "Fragments of the Lords A",
        "Fragment of Mount Doomskull",
        "Parallel Chaos Amulet",
    ];

    getClass(rankup = true): void {
        //Progress Check
        if (Core.checkInventory("Empowered Chaos Avenger's GreatSword") || Core.checkInventory("Chaos Avenger")) {
            if (rankup) {
                Adv.rankUpClass("Chaos Avenger");
            }
            return;
        }
        //Preload Quests
        if (!Core.isCompletedBefore(3881)) {
            Story.preLoad(this.getClass);
        }

        //Complete 13LoC Saga
        LOC.hero();

        Core.ensureAccept(8301);
        this.fragmentoftheDragon();
        this.fragmentofMountDoomskull();
        this.fragmentsoftheLordsA();
        this.fragmentsoftheLordsB();
        this.fragmentoftheQueen();
        this.parallelChaosAmulet();
        this.completeandBuy();

        if (rankup) {
            Adv.rankUpClass("Chaos Avenger");
        }
    }

    parallelChaosAmulet(): void {
        if (Core.checkInventory("Parallel Chaos Amulet")) {
            return;
        }

        if (Core.checkInventory("Champion Drakath Insignia", 20)) {
            //ensure your in the map
            Core.join("championdrakath");
            Core.buyItem("championdrakath", 2055, "Parallel Chaos Amulet");
            return;
        } else {
            Core.logger("not enough insigs");
            bot.stop();
        }
    }

    fragmentoftheDragon(): void {
        if (Core.checkInventory("Fragment of the Dragon")) {
            return;
        }

        Core.equipClass(ClassType.Solo);
        Core.join("chaoslord");
        bot.wait.forMapLoad("chaoslord");
        Core.jump("r2", "Left");
        bot.wait.forCellChange("r2");

        const kys = bot.monsters.mapMonsters.find((x) => x != null && x.mapId === 1) ?? null;
        if (kys != null) {
            Core.killMonster(
                "chaoslord",
                "r2",
                "Left",
                kys.mapId === 0 ? 1 : kys.mapId,
                "Fragment of the Dragon",
                undefined,
                { isTemp: false },
            );
        } else {
            Core.logger("No monster found");
            return;
        }
    }

    fragmentofMountDoomskull(): void {
        if (Core.checkInventory("Fragment of Mount Doomskull", 1300)) {
            return;
        }

        Core.equipClass(ClassType.Farm);
        Core.huntMonster("mountdoomskull", "Chaorrupted Rogue", "Fragment of Mount Doomskull", 1300, { isTemp: false });
    }

    fragmentsoftheLordsA(): void {
        if (Core.checkInventory("Fragments of the Lords A")) {
            return;
        }

        Core.equipClass(ClassType.Solo);
        const Ledgermayne = true;

        //Escherion's Robe
        Core.killEscherion("Escherion's Robe");

        //Vath's Chaotic Dragonlord Armor
        Core.killVath("Vath's Chaotic Dragonlord Armor");

        //Chaos Shogun Armor
        Core.killKitsune("Chaos Shogun Armor");

        //Wolfwing Armor
        Core.huntMonster("wolfwing", "Wolfwing", "Wolfwing Armor", undefined, { isTemp: false });

        //Discordia Armor
        Core.huntMonster("palooza", "Discordia", "Discordia Armor", undefined, { isTemp: false });

        //Ledgermayne (Armor)
        Core.huntMonster("Ledgermayne", "Ledgermayne", "Ledgermayne", undefined, {
            isTemp: !Ledgermayne,
            publicRoom: Ledgermayne,
        });

        Core.buyItem("championdrakath", 2055, "Fragments of the Lords A");
    }

    fragmentsoftheLordsB(): void {
        if (Core.checkInventory("Fragments of the Lords B")) {
            return;
        }

        Core.equipClass(ClassType.Solo);

        //Tibicenas (Armor)
        Core.huntMonster("djinn", "Tibicenas", "Tibicenas", undefined, { isTemp: false });

        //Soul of Chaos Armor
        Core.huntMonster("dreamnexus", "Khasaanda", "Soul of Chaos Armor", undefined, { isTemp: false });

        //Iadoa (Armor)
        Core.huntMonster("mqlesson", "Dragonoid", "Dragonoid of Hours", undefined, { isTemp: false });
        Core.huntMonster("timespace", "Chaos Lord Iadoa", "Iadoa", undefined, { isTemp: false });

        //Chaos Lionfang Armor
        bot.quests.updateQuest(2814);
        Core.huntMonster("stormtemple", "Chaos Lord Lionfang", "Chaos Lionfang Armor", undefined, { isTemp: false });

        //Chaos Lord Alteon (Armor)
        Core.huntMonster("swordhavenfalls", "Chaos Lord Alteon", "Chaos Lord Alteon", undefined, { isTemp: false });

        //Xiang Chaos
        Adv.gearStore(undefined, { enhAfter: true });
        Core.killXiang("Xiang Chaos");
        Adv.gearStore(true, { enhAfter: true });

        Core.buyItem("championdrakath", 2055, "Fragments of the Lords B");
    }

    fragmentoftheQueen(): void {
        if (Core.checkInventory("Fragment of the Queen", 13)) {
            return;
        }

        bot.quests.updateQuest(8094);
        Core.equipClass(ClassType.Solo);
        Core.huntMonster("transformation", "Queen of Monsters", "Fragment of the Queen", 13, { isTemp: false });
    }

    completeandBuy(): void {
        if (!Core.checkInventory(this.cavItems)) {
            for (const item of this.cavItems.filter((x) => !Core.checkInventory(x))) {
                Core.logger(`Missing: ${item}`);
            }
            return;
        }

        //insurance:
        Core.unbank(...this.cavItems);

        Core.ensureComplete(8301);
        bot.wait.forQuestComplete(8301);
        Adv.buyItem("championdrakath", 2056, "Chaos Avenger");
    }
}

export default function main(): void {
    const script = new ChaosAvengerClass();
    Core.bankingBlackList.push(...script.cavItems);

    Core.setOptions();

    script.getClass();

    Core.setOptions(false);
}
