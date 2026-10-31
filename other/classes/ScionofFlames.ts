/*
name: Scion of Flames (Class)
description: This script will get Scion of Flames class.
tags: ScionofFlames, Scion of Flames
*/
// Port of Scripts/Other/Classes/ScionofFlames.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreDailies } from "../../core/CoreDailies";
import { CoreFarms } from "../../core/CoreFarms";
import { CarcossaCanteenMerge } from "../mergeshops/CarcossaCanteenMerge";
import { ForgeMalenoMerge } from "../mergeshops/ForgeMalenoMerge";
import { FortLumaForgeMerge } from "../mergeshops/FortLumaForgeMerge";
import { MagnumOpusMerge } from "../mergeshops/MagnumOpusMerge";
import { WarwickForestMerge } from "../mergeshops/WarwickForestMerge";
import { CoreAOR } from "../../story/ageofruin/CoreAOR";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const AOR = new CoreAOR();
const MOM = new MagnumOpusMerge();
const WFM = new WarwickForestMerge();
const FLF = new FortLumaForgeMerge();
const CCM = new CarcossaCanteenMerge();
const FMM = new ForgeMalenoMerge();
const Dailies = new CoreDailies();

export class ScionofFlames {
    getScionofFlames(rankUpClass = true): void {
        const ClassName = "Scion of Flames";

        Core.logger(`[${ClassName}] Start sequence`);
        if (Core.checkInventory(ClassName)) {
            Core.logger(`[Scion of Flames] Already owned`);

            if (rankUpClass) {
                Adv.rankUpClass(ClassName);
            }

            return;
        }
        Core.addDrop(ClassName);
        Core.ensureAccept(10716);
        // P1: Story progression
        Core.logger("[P1] Story progression (AOR)");
        AOR.doAll();

        // P2: Leveling
        Core.logger("[P2] Leveling to 80");
        Farm.experience(80);

        // P3: Reputation
        Core.logger("[P3] YewMountains REP to Rank 10");
        Farm.yewMountainsREP();

        // P4: Unlock sigil
        Core.logger("[P4] Pyromancer & Flame Sigil");
        Dailies.pyromancer();
        Adv.buyItem("fireforge", 1142, "Flame Sigil");

        // P5: Aleister the Dawnseeker
        Core.logger("[P5] mering Aleister the Dawnseeker Via MagnumOpusMerge");
        MOM.buyAllMerge("Aleister the Dawnseeker");
        WFM.buyAllMerge("Flame of Rubedo");
        FLF.buyAllMerge("Flame of Citrinitas");
        CCM.buyAllMerge("Flame of Albedo");
        FMM.buyAllMerge("Flame of Maleno");

        Core.ensureComplete(10716);

        bot.wait.forDrop(ClassName);
        bot.wait.forPickup(ClassName);

        if (rankUpClass) {
            Adv.rankUpClass(ClassName);
        }
    }

    materials(item: string, quant: number): void {
        if (Core.checkInventory(item, quant)) {
            Core.logger(`[MATS] Skipping ${item} (already have ${quant})`);
            return;
        }

        Core.farmingLogger(item, quant);
        Core.addDrop(item);
        switch (item) {
            case "Red Flame of Rubedo":
                Core.equipClass(ClassType.Solo);
                Core.registerQuests(Core.isMember ? 10689 : 10688);
                while (!bot.shouldExit && !Core.checkInventory(item, quant)) {
                    Core.killMonster("warwickforest", "r10", "Bottom", "*", "Rubedo Flicker");
                    Core.huntMonster("warwickforest", "Idea of a Champion", "Kolr's Needle");
                    Core.huntMonster("warwickforest", "Rubedo Match", "Alkahest", 100);
                    bot.wait.forPickup(item);
                }
                Core.cancelRegisteredQuests();
                break;
            case "Yew Ember":
                Core.equipClass(ClassType.Farm);
                Core.huntMonster("warwickforest", "Rubedo Elemental", item, quant, { isTemp: false });
                break;
            case "Yellow Flame of Citrinitas":
                Core.equipClass(ClassType.Solo);
                Core.registerQuests(Core.isMember ? 10620 : 10619);
                // TODO: Replace with actual quest ID
                while (!bot.shouldExit && !Core.checkInventory(item, quant)) {
                    Core.huntMonster("fortluma", "Flame of Citrinitas", "Citrinitas Flicker");
                    Core.huntMonster("fortluma", "Luma Dragon Twins", "Draconic Contrasoul");
                    Core.huntMonsterMapID("fortluma", 10, "King's Yellow");
                    bot.wait.forPickup(item);
                }
                Core.cancelRegisteredQuests();
                break;
            case "White Flame of Albedo":
                Core.registerQuests(Core.isMember ? 10424 : 10423);
                while (!bot.shouldExit && !Core.checkInventory(item, quant)) {
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("forgealbedo", "Defensive Turret", "Corrosive Sublimate", 9);
                    Core.huntMonster("forgealbedo", "Defense Droid", "Calx", 6);

                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("forgealbedo", "Flame of Albedo", "Albedo Flicker");

                    bot.wait.forPickup(item);
                }
                Core.cancelRegisteredQuests();
                break;
            case "Black Flame of Maleno":
                Core.registerQuests(Core.isMember ? 10370 : 10369);
                while (!bot.shouldExit && !Core.checkInventory(item, quant)) {
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("mountmaleno", "Draconian Bandit", "Lapis Infernalis", 9);

                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("mountmaleno", "Maleno Elemental", "Plumbago", 3);
                    Core.huntMonster("mountmaleno", "Idalion", "Powder of Algaroth");

                    bot.wait.forPickup(item);
                }
                Core.cancelRegisteredQuests();
                break;
            case "Steel Ingot":
                Core.registerQuests(Core.isMember ? 10358 : 10357);
                while (!bot.shouldExit && !Core.checkInventory(item, quant)) {
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("thelimacity", "Flame of Maleno", "Maleno Flicker");
                    Core.huntMonster("thelimacity", "Maleno Elemental", "Elemental Ferrum", 3);

                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("thelimacity", "Maleno Match", "Ferrum Blood", 12);
                    bot.wait.forPickup(item);
                }
                Core.cancelRegisteredQuests();
                break;
            case "Aiwass Diamond":
                Core.equipClass(ClassType.Farm);
                Core.registerQuests(Core.isMember ? 10387 : 10385);
                while (!bot.shouldExit && !Core.checkInventory(item, quant)) {
                    Core.killMonster("sanctuaryaiwass", "r9", "Top", "*", "Sal Alembroth", 1, { isTemp: false });
                    Core.killMonster("sanctuaryaiwass", "r9", "Top", "*", "Milk of Sulfur", 1, { isTemp: false });
                    Core.huntMonster("sanctuaryaiwass", "Anima Animus Aiwass", "Aeon Dream", 1, { isTemp: false });
                }
                Core.cancelRegisteredQuests();
                break;
        }
    }
}

export default function main(): void {
    const script = new ScionofFlames();
    Core.setOptions();

    script.getScionofFlames();

    Core.setOptions(false);
}
