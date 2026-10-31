/*
name: Evolved Shadow Orb Items (Member)
description: Requires active membership + Evolved Shadow Orb.Will do all quests to get all items from the orb
tags: evolved, shadow, orb, member, nulgath, helm, spear, reborn, dark, side, void, emotions, shape, nothingness
*/
// Port of Scripts/Nation/EvolvedOrb/EvolvedShadowOrbItems[Mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreNation } from "../CoreNation";
import { EvolvedShadowOrb } from "./EvolvedShadowOrb[Mem]";
import { Bard } from "../../other/classes/rep-based/Bard";
import { BattleConGearMerge } from "../../other/mergeshops/BattleConGearMerge";

const Adv = new CoreAdvanced();
const Farm = new CoreFarms();
const Nation = new CoreNation();
const ESO = new EvolvedShadowOrb();
const bard = new Bard();
const BCon = new BattleConGearMerge();

export class EvolvedShadowOrbItems {
    getItems(): void {
        if (!Core.isMember) {
            Core.logger("This bot requiers membership.");
            return;
        }
        if (Core.checkInventory(this.rewards, undefined, { toInv: false })) {
            Core.logger("You already own all Evolved Shadow Orb quest items.");
            return;
        }

        ESO.getEvolvedShadowOrb();

        Core.unbank("Evolved Shadow Orb");
        this.rebornDarkSide();
        this.voidEmotions();
        this.shapeNothingness();
    }

    rebornDarkSide(): void {
        // Pre-check required items
        const requiredItems = ["Evolved Shadow Orb", "Platinum Coin of Nulgath: 2500"];

        for (const item of requiredItems) {
            if (!Core.checkInventory(item)) {
                Core.logger(`Missing required item: ${item}. CANNOT PROCEED, STOPPING THE BOT`, undefined, {
                    stopBot: true,
                });
                return;
            }
        }

        for (const q of [4773, 4772, 4771]) {
            switch (q) {
                case 4773:

                // Shadow
                case 4772: {
                    // Rare
                    const req = q === 4772 ? 4813 : 5430;
                    // Skip if requirements not met
                    if (!Core.isMember || !Core.checkInventory(req)) {
                        continue;
                    }
                    // Blade
                    Core.huntMonster("lightguard", "Mysterious Spirit", "Lightguardian Spirit Blade");
                    // Mana Mallet
                    Adv.buyItem("citadel", 44, 843);
                    // Dark Energy Scrolls
                    if (!Core.checkInventory("Scroll of Dark Energy", 30)) {
                        Core.joinSWF("mobius", "ChiralValley/town-Mobius-21Feb14.swf", "Slugfit", "Bottom");
                        Core.huntMonster("mobius", "Slugfit", "Mystic Quills", 3, { isTemp: false });
                        Core.buyItem("dragonrune", 549, "Ember Ink", 3);

                        while (
                            !bot.shouldExit &&
                            Core.checkInventory("Ember Ink") &&
                            !Core.checkInventory("Scroll of Dark Energy", 30)
                        ) {
                            Core.chainComplete(2298);
                        }

                        bot.wait.forPickup("Scroll of Dark Energy");
                    }
                    // Dark Grip Scrolls
                    if (!Core.checkInventory("Scroll of Dark Grip", 30)) {
                        Core.joinSWF("mobius", "ChiralValley/town-Mobius-21Feb14.swf", "Slugfit", "Bottom");
                        Core.huntMonster("mobius", "Slugfit", "Mystic Quills", 3, { isTemp: false });
                        Core.buyItem("dragonrune", 549, "Runik Ink", 3);

                        while (
                            !bot.shouldExit &&
                            Core.checkInventory("Runik Ink") &&
                            !Core.checkInventory("Scroll of Dark Grip", 30)
                        ) {
                            Core.chainComplete(2349);
                        }
                    }
                    Nation.essenceofNulgath(80);
                    Nation.farmTotemofNulgath(10);
                    Core.ensureComplete(q);
                    bot.wait.forPickup(33182);
                    return;
                }
                // ✅ STOP after first valid path
                case 4771:
                    // F2P fallback
                    Core.addDrop("Evolved Shadow of Nulgath");
                    bard.getBard(true);
                    Nation.farmUni13(3);
                    Adv.buyItem("tercessuinotlim", 1951, "Unidentified 25");
                    Nation.farmVoucher({ member: true });
                    if (!Core.checkInventory("Behemoth Blade of Shadow")) {
                        Core.equipClass(ClassType.Solo);

                        if (!Core.checkInventory("Basic War Sword")) {
                            Farm.bludrutBrawlBoss(undefined, 100);
                            Core.buyItem("battleon", 222, "Basic War Sword");
                        }

                        if (!Core.checkInventory("Steel Afterlife")) {
                            Farm.bludrutBrawlBoss(undefined, 100);
                            Core.buyItem("battleon", 222, "Steel Afterlife");
                        }

                        if (!Core.checkInventory("Behemoth Blade of Shadow")) {
                            Farm.bludrutBrawlBoss(undefined, 500);
                            Core.buyItem("battleon", 222, "Behemoth Blade of Shadow");
                        }
                    }
                    Core.equipClass(ClassType.Farm);
                    Nation.approvalAndFavor(1, 0);
                    Nation.farmFiendToken(30);
                    BCon.buyAllMerge("Azure Starblade");
                    bot.wait.forPickup("Evolved Shadow of Nulgath");
                    return;
                // ✅ STOP after fallback
            }
        }

        // If nothing matched
        Core.logger("No valid quest path found.", undefined, { stopBot: true });
    }

    voidEmotions(): void {
        //Void Emotion 4774
        if (!Core.checkInventory("Platinum Coin of Nulgath: 300")) {
            Core.logger("Platinum Coin of Nulgath 300 not found");
            return;
        }

        Core.addDrop("Evolved Shadow Helm");
        Core.ensureAccept(4774);
        Core.equipClass(ClassType.Farm);
        Nation.farmDarkCrystalShard(10);
        Nation.farmDiamondofNulgath(50);
        Nation.farmVoucher({ member: false });
        Nation.farmBloodGem(5);
        Core.equipClass(ClassType.Solo);
        Core.killMonster("chaoslord", "r2", "Left", "*", "There is no Myself", undefined, { isTemp: false });
        Core.ensureComplete(4774);
        bot.wait.forPickup("Evolved Shadow Helm");
    }

    shapeNothingness(): void {
        if (!Core.checkInventory("Platinum Coin of Nulgath: 2500")) {
            Core.logger("Platinum Coin of Nulgath 2500 not found");
            return;
        }

        // Shape your Nothingness 4775
        Core.addDrop("Unidentified 29", "Random Weapon of Nulgath", "Evolved Shadow Spear of Nulgath");
        Core.ensureAccept(4775);
        Core.equipClass(ClassType.Farm);
        Nation.farmUni10(30);
        Nation.farmTaintedGem(30);
        Nation.farmDarkCrystalShard(30);
        Nation.supplies("Unidentified 29");
        Nation.supplies("Random Weapon of Nulgath");
        Nation.farmVoucher({ member: false });
        Nation.farmTotemofNulgath(10);
        Adv.buyItem("alchemyacademy", 2036, 12056, 15, 9827);
        Core.ensureComplete(4775);
        bot.wait.forPickup("Evolved Shadow Spear of Nulgath");
    }

    private readonly rewards: string[] = [
        "Evolved Shadow of Nulgath",
        "Evolved Shadow Helm",
        "Evolved Shadow Spear of Nulgath",
    ];
}

export default function main(): void {
    const script = new EvolvedShadowOrbItems();
    Core.setOptions();

    script.getItems();

    Core.setOptions(false);
}
