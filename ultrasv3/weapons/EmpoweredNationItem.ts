/*
name: Empowered Weapons of Nulgath
description: pick an empowered weapon, if you own teh requirements and 25 insignias, itll farm the empowered ver.
tags: empowered, nulgath, reavers, bloodletter, overfiend blade, shadow spear, prismatic manslayers, legacy of nulgath, worshipper of nulgath, evolved void armor, oblivion blade, charged oblivion blade
*/
// Port of Scripts/Ultrasv3/Weapons/EmpoweredNationItem.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, configEnum, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreNation } from "../../nation/CoreNation";

const Nation = new CoreNation();
const Farm = new CoreFarms();
const Adv = new CoreAdvanced();

export enum EmpoweredItems {
    Empowered_Overfiend_Blade = 70441,
    Empowered_Ungodly_Reavers = 70442,
    Empowered_Shadow_Spear = 70443,
    Empowered_Bloodletter = 70444,
    Empowered_Prismatic_Manslayer = 70445,
    Empowered_Prismatic_Manslayers = 70446,
    Empowered_Legacy_of_Nulgath = 70447,
    Empowered_Worshipper_of_Nulgath = 70448,
    Empowered_Evolved_Void = 70449,
    Empowered_Evolved_Fiend = 70450,
    Empowered_Evolved_Blood = 70451,
    Empowered_Evolved_Hex = 70452,
    Empowered_Evolved_Shadow = 70453,
    Empowered_Oblivion_Blade = 70454,
    Empowered_Charged_Oblivion_Blade = 70455,
}

export class EmpoweredWeaponsofNulgath {
    getEmpoweredItem(Item: EmpoweredItems): void {
        if (!Core.checkInventory("Nulgath Insignia", 25)) {
            Core.logger("Could not find 25x Nulgath Insignia, stopping.", undefined, {
                messageBox: true,
                stopBot: true,
            });
        }

        //#region  nullcheck
        // Retry mechanism to get the selected item from config
        let selectedItem: EmpoweredItems | null = null;
        for (let i = 0; i < 5; i++) {
            selectedItem = configEnum("EmpoweredWep", EmpoweredItems, EmpoweredItems.Empowered_Overfiend_Blade);
            if (selectedItem != null) {
                break;
            }
            Core.logger(`Attempt ${i + 1}: EmpoweredWep not found in config. Retrying...`);
            Core.sleep(1000);
            // Wait for 1 second before retrying
        }

        // Ensure we have a valid item selection from the config
        if (selectedItem == null) {
            Core.logger("EmpoweredWep not found in config after 5 attempts.");
            return;
        }

        // Convert the enum value to a string for checking in the inventory
        const itemName = EmpoweredItems[selectedItem]?.replaceAll("_", " ");

        if (!itemName) {
            Core.logger("Item name is null or empty after conversion.");
            return;
        }
        //#endregion  nullcheck
        Farm.experience(80);
        Core.addDrop(...Nation.bagDrops);
        const questList = Core.fromTo(8694, 8701);
        questList.push(10546, 10547, 10548);
        for (const Quest of questList) {
            const q = Core.initializeWithRetries(() => Core.ensureLoad(Quest));
            if (q == null) {
                Core.logger(`Failed to load quest with ID ${Quest}`);
                continue;
            }
            Core.addDrop(...q.rewards.map((x) => x.id));
        }

        if (Core.checkInventory(itemName, undefined, { toInv: false })) {
            return;
        }

        Core.addDrop(itemName);

        switch (configEnum("EmpoweredWep", EmpoweredItems, EmpoweredItems.Empowered_Overfiend_Blade)) {
            //Empowered Bloodletter 8696
            case EmpoweredItems.Empowered_Bloodletter:
                if (!Core.checkInventory("Bloodletter of Nulgath")) {
                    Core.logger(`Missing required items. Bot cannot continue`, undefined, {
                        messageBox: true,
                        stopBot: true,
                    });
                }
                Core.ensureAccept(8696);
                Nation.farmTaintedGem(350);
                Nation.farmDarkCrystalShard(200);
                Nation.farmDiamondofNulgath(500);
                Nation.farmVoucher({ member: false });
                Core.ensureComplete(8696);
                bot.wait.forPickup(
                    configEnum("EmpoweredWep", EmpoweredItems, EmpoweredItems.Empowered_Overfiend_Blade),
                );
                break;
            //Empowered Evolved Void Armors 1 8700
            case EmpoweredItems.Empowered_Evolved_Fiend:

            case EmpoweredItems.Empowered_Evolved_Void:
                if (
                    !Core.checkInventory(
                        ((v) =>
                            v === EmpoweredItems.Empowered_Evolved_Fiend
                                ? "Evolved Fiend Of Nulgath"
                                : v === EmpoweredItems.Empowered_Evolved_Void
                                  ? "Evolved Void Of Nulgath"
                                  : null)(
                            configEnum("EmpoweredWep", EmpoweredItems, EmpoweredItems.Empowered_Overfiend_Blade),
                        ),
                    )
                ) {
                    Core.logger("Missing required item. Bot cannot continue", undefined, {
                        messageBox: true,
                        stopBot: true,
                    });
                    break;
                }
                Core.ensureAccept(8700);
                Core.equipClass(ClassType.Solo);
                Core.huntMonster("lair", "Red Dragon", "Phoenix Blade", undefined, { isTemp: false });
                Core.huntMonster("Marsh2", "Soulseeker", "Soul Scythe", undefined, { isTemp: false });
                Core.huntMonster("superdeath", "Super Death", "Chaos Tentacles", undefined, { isTemp: false });
                Nation.farmDiamondofNulgath(1000);
                Nation.farmTotemofNulgath(30);
                Farm.chronoSpanREP(4);
                Adv.buyItem("thespan", 435, "Shadow Warrior");
                Adv.buyItem("tercessuinotlim", 1951, "Unmoulded Fiend Essence");
                Core.ensureComplete(
                    8700,
                    configEnum("EmpoweredWep", EmpoweredItems, EmpoweredItems.Empowered_Overfiend_Blade),
                );
                break;
            //Empowered Evolved Void Armors 2 8701
            case EmpoweredItems.Empowered_Evolved_Blood:

            case EmpoweredItems.Empowered_Evolved_Shadow:

            case EmpoweredItems.Empowered_Evolved_Hex:
                if (
                    !Core.checkInventory(
                        ((v) =>
                            v === EmpoweredItems.Empowered_Evolved_Blood
                                ? "Evolved Blood of Nulgath"
                                : v === EmpoweredItems.Empowered_Evolved_Shadow
                                  ? "Evolved Shadow of Nulgath"
                                  : v === EmpoweredItems.Empowered_Evolved_Hex
                                    ? "Evolved Hex of Nulgath"
                                    : null)(
                            configEnum("EmpoweredWep", EmpoweredItems, EmpoweredItems.Empowered_Overfiend_Blade),
                        ),
                    )
                ) {
                    Core.logger("Missing required item. Bot cannot continue", undefined, {
                        messageBox: true,
                        stopBot: true,
                    });
                    break;
                }
                Core.ensureAccept(8701);
                Core.equipClass(ClassType.Solo);
                Core.huntMonster("lair", "Red Dragon", "Phoenix Blade", undefined, { isTemp: false });
                Core.huntMonster("Marsh2", "Soulseeker", "Soul Scythe", undefined, { isTemp: false });
                Core.huntMonster("superdeath", "Super Death", "Chaos Tentacles", undefined, { isTemp: false });
                Nation.farmDiamondofNulgath(1000);
                Nation.farmTotemofNulgath(30);
                Farm.chronoSpanREP(4);
                Adv.buyItem("thespan", 435, "Shadow Warrior");
                Adv.buyItem("tercessuinotlim", 1951, "Unmoulded Fiend Essence");
                Core.ensureComplete(
                    8701,
                    configEnum("EmpoweredWep", EmpoweredItems, EmpoweredItems.Empowered_Overfiend_Blade),
                );
                break;
            //Empowered Legacy of Nulgath 8698
            case EmpoweredItems.Empowered_Legacy_of_Nulgath:
                if (!Core.checkInventory("Legacy of Nulgath")) {
                    Core.logger(`Missing required items. Bot cannot continue`, undefined, {
                        messageBox: true,
                        stopBot: true,
                    });
                }
                Core.ensureAccept(8698);
                Nation.farmDiamondofNulgath();
                Core.ensureComplete(8698);
                break;
            //Empowered Overfiend Blade 8693
            case EmpoweredItems.Empowered_Overfiend_Blade:
                if (!Core.checkInventory("Overfiend Blade of Nulgath")) {
                    Core.logger(`Missing required items. Bot cannot continue`, undefined, {
                        messageBox: true,
                        stopBot: true,
                    });
                }
                Core.ensureAccept(8693);
                Nation.farmTaintedGem(200);
                Nation.farmDarkCrystalShard(100);
                Nation.farmDiamondofNulgath(400);
                Nation.farmVoucher({ member: false });
                Nation.farmTotemofNulgath(30);
                Nation.farmGemofNulgath(80);
                Core.ensureComplete(8693);
                break;
            //Empowered Prismatic Manslayers 8697
            case EmpoweredItems.Empowered_Prismatic_Manslayer:

            case EmpoweredItems.Empowered_Prismatic_Manslayers:
                if (
                    !Core.checkInventory(
                        configEnum("EmpoweredWep", EmpoweredItems, EmpoweredItems.Empowered_Overfiend_Blade) ===
                            EmpoweredItems.Empowered_Prismatic_Manslayer
                            ? "Taro's Prismatic Manslayer"
                            : "Taro's Dual Prismatic Manslayers",
                    ) ||
                    !Core.isMember
                ) {
                    Core.logger("Required item not found or you're not a member. Bot cannot continue", undefined, {
                        messageBox: true,
                        stopBot: true,
                    });
                    break;
                }
                Core.ensureAccept(8697);
                Nation.farmTaintedGem(400);
                Nation.farmDarkCrystalShard(250);
                Nation.farmDiamondofNulgath(600);
                Nation.farmGemofNulgath(150);
                Nation.farmBloodGem(70);
                Core.ensureComplete(
                    8697,
                    configEnum("EmpoweredWep", EmpoweredItems, EmpoweredItems.Empowered_Overfiend_Blade),
                );
                break;
            //Empowered Shadow Spear 8695
            case EmpoweredItems.Empowered_Shadow_Spear:
                if (!Core.checkInventory("Shadow Spear of Nulgath")) {
                    Core.logger(`Missing required items. Bot cannot continue`, undefined, {
                        messageBox: true,
                        stopBot: true,
                    });
                }
                Core.ensureAccept(8695);
                Nation.farmTaintedGem(350);
                Nation.farmDarkCrystalShard(200);
                Nation.farmDiamondofNulgath(500);
                Nation.farmVoucher({ member: false });
                break;
            //Empowered Ungodly Reavers 8694
            case EmpoweredItems.Empowered_Ungodly_Reavers:
                if (!Core.checkInventory("Ungodly Reavers of Nulgath")) {
                    Core.logger(`Missing required items. Bot cannot continue`, undefined, {
                        messageBox: true,
                        stopBot: true,
                    });
                }
                Core.ensureAccept(8694);
                Nation.farmTaintedGem(200);
                Nation.farmDarkCrystalShard(100);
                Nation.farmDiamondofNulgath(400);
                Nation.farmVoucher({ member: false });
                Nation.farmTotemofNulgath(30);
                Nation.farmGemofNulgath(80);
                Core.ensureComplete(8694);
                break;
            //Empowered Worshipper of Nulgath 8699
            case EmpoweredItems.Empowered_Worshipper_of_Nulgath:
                if (!Core.checkInventory("Worshipper of Nulgath")) {
                    Core.logger(`Missing required items. Bot cannot continue`, undefined, {
                        messageBox: true,
                        stopBot: true,
                    });
                }
                Core.ensureAccept(8699);
                Nation.farmDiamondofNulgath();
                Core.ensureComplete(8699);
                break;
            //Empowered Oblivion Blade 10546
            case EmpoweredItems.Empowered_Oblivion_Blade:
                if (!Core.checkInventory("Oblivion Blade of Nulgath")) {
                    Core.logger(`Missing required items. Bot cannot continue`, undefined, {
                        messageBox: true,
                        stopBot: true,
                    });
                }
                Core.ensureAccept(10546);
                Nation.nulgathsRouletteofMisfortune("Bane of Nulgath", 1);
                Nation.farmDarkCrystalShard(150);
                Nation.farmDiamondofNulgath(500);
                Nation.farmTotemofNulgath(30);
                Nation.farmVoucher({ member: false });
                Core.ensureComplete(10546);
                break;
            //Empowered Charged Oblivion Blade 10547/10548
            case EmpoweredItems.Empowered_Charged_Oblivion_Blade:
                if (
                    !Core.checkInventory("Oblivion Blade of Nulgath") ||
                    !(
                        Core.checkInventory("Oblivion Blade of Nulgath Pet") ||
                        Core.checkInventory("Oblivion Blade of Nulgath Pet (Rare)")
                    )
                ) {
                    Core.logger(`Missing required items. Bot cannot continue`, undefined, {
                        messageBox: true,
                        stopBot: true,
                    });
                }
                if (Core.checkInventory("Oblivion Blade of Nulgath Pet")) {
                    Core.ensureAccept(10547);
                } else {
                    Core.ensureAccept(10548);
                }
                Nation.nulgathsRouletteofMisfortune("Bane of Nulgath", 1);
                Nation.farmDarkCrystalShard(150);
                Nation.farmDiamondofNulgath(500);
                Nation.farmTotemofNulgath(30);
                Nation.farmVoucher({ member: false });
                if (Core.checkInventory("Oblivion Blade of Nulgath Pet")) {
                    Core.ensureComplete(10547);
                } else {
                    Core.ensureComplete(10548);
                }
                break;
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "EmpoweredWeaponofN",
    [
        Core.skipOptions,
        option.choice(
            "EmpoweredWep",
            "Choose Weapon",
            "Choose, and the bot will Farm the Appropriate item.",
            choices(EmpoweredItems),
            EmpoweredItems[EmpoweredItems.Empowered_Overfiend_Blade],
        ),
    ],
    true,
);

export default function main(): void {
    const script = new EmpoweredWeaponsofNulgath();
    Core.bankingBlackList.push(...Nation.bagDrops);
    Core.setOptions();

    script.getEmpoweredItem(configEnum("EmpoweredWep", EmpoweredItems, EmpoweredItems.Empowered_Overfiend_Blade));

    Core.setOptions(false);
}
