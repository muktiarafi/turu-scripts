/*
name: Ultra Speaker Merge PreReqs
description: Gets the prerequisites for the Ultra Speaker merge.
tags: ultra speaker merge, ultra malgor merge, rgow, goddess of war
*/
// Port of Scripts/ShadowsOfWar/RGOWMergePrereq.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { AscendedDrakathGear } from "../chaos/AscendedDrakathGear";
import { DrakathArmorBot } from "../chaos/DrakathsArmor";
import { ClassType, Core } from "../core/CoreBots";
import { CoreFarms } from "../core/CoreFarms";
import { UltimateBLoD } from "../good/blod/2UltimateBlindingLightofDestiny";
import { CoreBLOD } from "../good/blod/CoreBLOD";
import { Awescended } from "../good/gearofawe/Awescended";
import { CoreHollowbornDoomKnight } from "../hollowborn/hollowborndoomknight/CoreHollowbornDoomKnight";
import { CoreHollowbornPaladin } from "../hollowborn/hollowbornpaladin/CoreHollowbornPaladin";
import { FireChampionsArmor } from "../other/armor/FireChampionsArmor";
import { MalgorsArmorSet } from "../other/armor/MalgorsArmorSet";
import { DragonslayerGeneral } from "../other/classes/DragonslayerGeneral";
import { BeetleQuests } from "../seasonal/staffbirthdays/nulgath/BeetleQuests";
import { CoreSoWMats } from "./CoreSoWMats";
import { DragonFableOrigins } from "../story/DragonFableOrigins";
import { CoreSoC } from "../story/shadowsofchaos/CoreSoC";
import { CoreSoW } from "../story/shadowsofwar/CoreSoW";

const Farm = new CoreFarms();
const ADG = new AscendedDrakathGear();
const BLOD = new CoreBLOD();
const HDK = new CoreHollowbornDoomKnight();
const SoC = new CoreSoC();
const SoW = new CoreSoW();
const SOWM = new CoreSoWMats();
const DFO = new DragonFableOrigins();
const DSG = new DragonslayerGeneral();
const UBLOD = new UltimateBLoD();
const FCA = new FireChampionsArmor();
const beetleQuests = new BeetleQuests();
const awescended = new Awescended();
const CHBP = new CoreHollowbornPaladin();
const malgorsArmorSet = new MalgorsArmorSet();
const DAB = new DrakathArmorBot();

export class UltraSpeakerMergePreReqs {
    acquiescenceCount: number = 0;
    elementalCoreCount: number = 0;
    insigniasCount: number = 0;

    getPrereqs(): void {
        const GoddessOfWarBlades = (): void => {
            if (Core.checkInventory("Goddess Of War Blades")) {
                return;
            }

            SoC.lagunaBeach();

            for (const blade of [
                "War Blade of Courage",
                "War Blade of Power",
                "War Blade of Speed",
                "War Blade of Strength",
                "War Blade of Wisdom",
            ]) {
                if (Core.checkInventory(blade)) {
                    continue;
                }

                switch (blade) {
                    case "War Blade of Courage":
                        BLOD.brilliantAura(50);
                        BLOD.blindingAura(1);
                        this.insigniasCount += 7;
                        this.acquiescenceCount += 10;
                        Core.logger(
                            `New totals: InsigniasCount: ${this.insigniasCount}, AcquiescenceCount: ${this.acquiescenceCount}, ElementalCoreCount: ${this.elementalCoreCount}`,
                            "Update Counts",
                        );
                        break;
                    case "War Blade of Power":
                        Core.addDrop(11475);
                        while (!Core.checkInventory(11475, 30)) {
                            Core.killMonster("lair", "Hole", "Center", "*", undefined, undefined, {
                                isTemp: false,
                                log: false,
                            });
                        }
                        DSG.enchantedScaleandClaw(250, 0);
                        this.insigniasCount += 7;
                        this.acquiescenceCount += 10;
                        Core.logger(
                            `New totals: InsigniasCount: ${this.insigniasCount}, AcquiescenceCount: ${this.acquiescenceCount}, ElementalCoreCount: ${this.elementalCoreCount}`,
                            "Update Counts",
                        );
                        break;
                    case "War Blade of Speed":
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("shadowfallwar", "Skeletal Fire Mage", "Ultimate Darkness Gem", 75, {
                            isTemp: false,
                        });
                        Core.equipClass(ClassType.Solo);
                        Core.killMonster("shadowattack", "Boss", "Left", "Death", "Death's Oversight", 5, {
                            isTemp: false,
                        });
                        this.insigniasCount += 7;
                        this.acquiescenceCount += 10;
                        Core.logger(
                            `New totals: InsigniasCount: ${this.insigniasCount}, AcquiescenceCount: ${this.acquiescenceCount}, ElementalCoreCount: ${this.elementalCoreCount}`,
                            "Update Counts",
                        );
                        break;
                    case "War Blade of Strength":
                        SoW.tyndarius();
                        Core.addDrop("Fire Avatar's Favor");
                        Core.equipClass(ClassType.Farm);
                        Core.registerQuests(8244);
                        while (!bot.shouldExit && !Core.checkInventory("Fire Avatar's Favor", 25)) {
                            Core.killMonster("fireavatar", "r4", "Right", "*", "Onslaught Defeated", 6);
                            Core.killMonster("fireavatar", "r6", "Left", "*", "Elemental Defeated", 6);
                            bot.wait.forPickup("Fire Avatar's Favor");
                        }
                        Core.cancelRegisteredQuests();
                        this.insigniasCount += 7;
                        this.acquiescenceCount += 10;
                        this.elementalCoreCount += 25;
                        Core.logger(
                            `New totals: InsigniasCount: ${this.insigniasCount}, AcquiescenceCount: ${this.acquiescenceCount}, ElementalCoreCount: ${this.elementalCoreCount}`,
                            "Update Counts",
                        );
                        break;
                    case "War Blade of Wisdom":
                        Core.addDrop("Fragment of the Queen", "ShadowChaos Mote");
                        Core.equipClass(ClassType.Solo);
                        bot.quests.updateQuest(8094);
                        Core.huntMonster("transformation", "Queen of Monsters", "Fragment of the Queen", 13, {
                            isTemp: false,
                        });
                        Core.equipClass(ClassType.Farm);
                        Core.registerQuests(7700);
                        Core.huntMonster("lagunabeach", "Flying Fisheye", "ShadowChaos Mote", 250, { isTemp: false });
                        bot.wait.forPickup("ShadowChaos Mote");
                        Core.cancelRegisteredQuests();
                        this.insigniasCount += 7;
                        this.acquiescenceCount += 10;
                        Core.logger(
                            `New totals: InsigniasCount: ${this.insigniasCount}, AcquiescenceCount: ${this.acquiescenceCount}, ElementalCoreCount: ${this.elementalCoreCount}`,
                            "Update Counts",
                        );
                        break;
                }
            }
        };
        const GoddessOfWarCloak = (): void => {
            if (Core.checkInventory("Goddess of War Cloak")) {
                return;
            }

            this.acquiescenceCount += 10;
            this.insigniasCount += 10;
            Core.logger(
                `New totals: InsigniasCount: ${this.insigniasCount}, AcquiescenceCount: ${this.acquiescenceCount}, ElementalCoreCount: ${this.elementalCoreCount}`,
                "Update Counts",
            );
        };
        const GoW = (): void => {
            if (Core.checkInventory("Goddess Of War")) {
                return;
            }

            if (
                bot.config!.get<boolean>("UseInsigsonEmpDrkArm") &&
                !Core.checkInventory("Empowered Drakath Armor") &&
                Core.checkInventory("Champion Drakath Insignia", 5) &&
                Core.checkInventory(25779)
            ) {
                DAB.drakathArmorQuest();
                Core.join("championdrakath");
                bot.wait.forMapLoad("championdrakath");

                while (!bot.shouldExit && bot.shops.id !== 2055) {
                    bot.shops.load(2055);
                    bot.wait.forActionCooldown("loadShop");
                    bot.wait.forTrue(() => bot.shops.isLoaded && bot.shops.id === 2055, 20);
                    Core.sleep(1000);
                }

                bot.shops.buyItem("Empowered Drakath Armor");
                bot.wait.forItemBuy();
            }

            UBLOD.purifiedUndeadDragonEssence(3);

            if (!Core.checkInventory(43712, 50)) {
                Core.equipClass(ClassType.Solo);
                Core.addDrop(43712);
                Core.registerQuests(6311);

                while (!bot.shouldExit && !Core.checkInventory(43712, 50)) {
                    Core.killMonster("northmountain", "r7", "Left", "Izotz");
                }

                Core.cancelRegisteredQuests();
            }

            SOWM.dragonsTear();
            ADG.ascendedGear("Ascended Blade of Awe");
            DFO.dragonFableOriginsAll();
            HDK.adkFalls(true);

            GoddessOfWarCloak();
            GoddessOfWarBlades();
            Core.logger(
                `Final totals: InsigniasCount: ${this.insigniasCount}, AcquiescenceCount: ${this.acquiescenceCount}, ElementalCoreCount: ${this.elementalCoreCount}`,
                "Update Counts",
            );

            SOWM.acquiescence(this.acquiescenceCount);
            SOWM.elementalCore(this.elementalCoreCount);

            // Reset counts
            this.acquiescenceCount = 0;
            this.elementalCoreCount = 0;

            if (Core.checkInventory(["Goddess Of War Blades", "Goddess of War Cloak"])) {
                Core.buyItem("ultraspeaker", 2248, 72921, undefined, 11443);
            }
        };
        SoW.completeCoreSoW();

        if (Core.checkInventory("Radiant Goddess of War")) {
            return;
        }

        GoW();

        if (!Core.checkInventory("Goddess Of War")) {
            return;
        }

        Core.addDrop("Radiant Goddess of War");
        Core.ensureAccept(9184);

        Farm.experience();
        FCA.getFireChampsArmor();
        beetleQuests.warlordRewards("Void Beetle Warlord");
        awescended.getAwe();
        CHBP.getSpecific("Classic Hollowborn Paladin Armor");
        malgorsArmorSet.getSet(false, ["Malgor the ShadowLord"]);

        //#region Radiant Goddess of War Item Check
        const requiredItems = [
            "Empowered Drakath Armor",
            "Fire Champion's Armor",
            "Void Beetle Warlord",
            "Malgor the ShadowLord",
            "Classic Hollowborn Paladin Armor",
            "Awescended",
        ];

        if (Core.checkInventory(requiredItems)) {
            Core.ensureComplete(9184);
        } else {
            for (const item of requiredItems) {
                if (!Core.checkInventory(item)) {
                    Core.logger(`Missing ${item}`);
                }
            }

            bot.wait.forPickup("Radiant Goddess of War");

            if (Core.checkInventory("Radiant Goddess of War")) {
                Core.logger("Congrats!!!!");
            } else {
                Core.logger("Still missing Goddess Of War prereqs.");
            }
        }

        //#endregion
        // Goddess Of War Prestige Cloak
        // Requires `Goddess Of War Blades` + `Goddess of War Cloak`
        Core.buyItem("ultraspeaker", 2248, 72921, undefined, 11443);

        // ========================= LOCAL FUNCTIONS =========================
    }
}

export const scriptOptions = defineScriptOptions(
    "Rgrow",
    [
        option.bool(
            "UseInsigsonEmpDrkArm",
            "Use Insig on Emp Drak",
            'Wether to use your Champion Drakath Insignia to buy the "Empowered Drakath Armor"',
            false,
        ),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new UltraSpeakerMergePreReqs();
    Core.bankingBlackList.push(
        //End Goal:
        "Radiant Goddess of War", // Non-Bottable
        "Malgor Insignia",
        "Elemental Core",
        "Fire Avatar's Favor ",
        "Acquiescence", //last step items:
        "Goddess Of War", //2nd to last step items
        "Goddess Of War Prestige Cloak", // 2nd step items:
        "Goddess Of War Blades",
        "Goddess of War Cloak", //begining steps:
        "War Blade of Strength",
        "War Blade of Courage",
        "War Blade of Power",
        "War Blade of Speed",
        "War Blade of Wisdom", //add more here
    );

    Core.setOptions();
    script.getPrereqs();

    Core.setOptions(false);
}
