/*
name: NightBane
description: NightBane helper for army farming NightBane.
tags: Ultra, NightBane, voidNightBane
*/
// Port of Scripts/Ultrasv3/ChallengeBosses/NightBanev3.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { configEnum, Core } from "../../core/CoreBots";
import { CoreEnginev3 } from "../dependenciesultras/CoreEnginev3";
import { CoreUltrav3 } from "../dependenciesultras/CoreUltrav3";
import { UltraEnhancements } from "../dependenciesultras/UltraEnhancements";
import { UltraGeneral } from "../dependenciesultras/UltraGeneral";
import { UltraPotions } from "../dependenciesultras/UltraPotions";

const Adv = new CoreAdvanced();
const Pots = new UltraPotions();
const Enh = new UltraEnhancements();
const Engine = new CoreEnginev3();
const Ultra = new CoreUltrav3();

export enum ItemToFarm {
    All = 0,
    Nightbanes_Essence = 73862,
    Insatiable_Hunger = 73361,
    Chest_Plate = 40066,
    Starlit_Journal_Page_3 = 56682,
}

export class NightBanev2 {
    get quantityToFarm(): number {
        return bot.config!.get<number>("Quantity");
    }
    get selectedItem(): ItemToFarm {
        return configEnum("Item", ItemToFarm, ItemToFarm.All);
    }
    get armySize(): number {
        return Math.max(1, bot.config!.get<number>("ArmySize"));
    }
    get usePotions(): boolean {
        return bot.config!.get<boolean>("UsePotions");
    }

    getQuantity(item: ItemToFarm): number {
        return item === ItemToFarm.Starlit_Journal_Page_3 ? 10 : this.quantityToFarm;
    }

    private equipPresetClasses(): void {
        UltraGeneral.equipPresetClasses(Ultra, bot, "nightbane_class-v3.sync");
    }

    prep(): void {
        this.equipPresetClasses();

        if (bot.config!.get<boolean>("DoEnh")) {
            this.doEnhs();
        }

        const potionQuant = bot.config!.get<number>("PotionQuantity");
        if (this.usePotions) {
            Pots.ensureRecommendedPotions(potionQuant);
            Pots.useRecommendedPotions(potionQuant, undefined, undefined, false);
        }

        bot.sleep(2500);
    }

    fight(): void {
        const map = "voidNightBane";
        const boss = "NightBane";

        const syncPath = Ultra.resolveSyncPath("UltraItemCheck.sync");
        const wipeDeadSyncPath = Ultra.resolveSyncPath("NightBaneWipeDead.sync");
        const wipeAliveSyncPath = Ultra.resolveSyncPath("NightBaneWipeAlive.sync");
        Ultra.clearSyncFile(syncPath);
        Ultra.clearSyncFile(wipeDeadSyncPath);
        Ultra.clearSyncFile(wipeAliveSyncPath);
        bot.sleep(2500);

        Core.ensureAcceptmultiple(9418, 7713);
        Core.addDrop("Nightbane's ??? Essence", "Insatiable Hunger", "Chest Plate", "Starlit Journal Page 3 Scraps");

        Engine.join(map);
        Ultra.waitForArmy(this.armySize - 1, "NightBane.sync");
        Engine.chooseBestCell(boss);

        bot.player.setSpawnPoint();
        Engine.enableSkills();

        Core.logger("Fight start synced.");

        let armyWipeDetected = false;

        while (!bot.shouldExit) {
            const allDead = UltraGeneral.isWholeArmyDead(Ultra, bot, wipeDeadSyncPath);
            if (allDead) {
                if (!armyWipeDetected) {
                    Core.logger("Army wipe detected — all clients dead.");
                }
                armyWipeDetected = true;
            }

            if (armyWipeDetected) {
                const allAlive = UltraGeneral.isWholeArmyAlive(Ultra, bot, wipeAliveSyncPath);
                if (allAlive) {
                    Core.logger("Army wipe recovered — all clients alive again.");
                    Ultra.clearSyncFile(wipeDeadSyncPath);
                    Ultra.clearSyncFile(wipeAliveSyncPath);
                    bot.combat.cancelTarget();
                    armyWipeDetected = false;
                    Core.logger("Army wipe recovered — resuming fight.");
                    continue;
                }

                bot.combat.cancelTarget();
                Core.logger("Army wipe active — waiting for everyone to respawn before fighting.");
                bot.sleep(250);
                continue;
            }

            if (!bot.player.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);
                continue;
            }

            if (Ultra.checkArmyProgressBool(() => this.inventoryHasItems(), syncPath)) {
                Core.logger("All players finished farm.");
                Core.ensureComplete(8547);
                Ultra.joinHouse();
                if (bot.config!.get<boolean>("DoEnh")) {
                    Adv.gearStore(true, { enhAfter: true });
                }
                break;
            }

            if (!this.hasBossTarget(boss)) {
                bot.combat.attack(boss);
            }

            if (this.usePotions) {
                Pots.activateEquippedPotion();
            }
            bot.sleep(100);
        }
    }

    private hasBossTarget(boss: string): boolean {
        return bot.player.hasTarget && bot.player.target?.name?.toLowerCase() === boss?.toLowerCase();
    }

    inventoryHasItems(): boolean {
        if (this.selectedItem === ItemToFarm.All) {
            return choices(ItemToFarm)
                .map((n) => ItemToFarm[n as keyof typeof ItemToFarm])
                .filter((i) => i !== ItemToFarm.All)
                .every((i) => bot.inventory.contains(i, this.getQuantity(i)));
        }

        return bot.inventory.contains(this.selectedItem, this.getQuantity(this.selectedItem));
    }

    doEnhs(): void {
        Enh.apply();
    }
}

export const scriptOptions = defineScriptOptions(
    "NightBane-v3",
    [
        option.int("ArmySize", "Army Size", "How many players are in your army (including yourself).", 4),
        option.choice(
            "Item",
            "Item to Farm",
            "Which item to farm (choose 'All' for all items)",
            choices(ItemToFarm),
            ItemToFarm[ItemToFarm.Insatiable_Hunger],
        ),
        option.int("Quantity", "Quantity", "Number of items to check/farm", 1),
        option.text(
            "Class1",
            "Class 1",
            "Preset class 1 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "ArchPaladin",
        ),
        option.text(
            "Class2",
            "Class 2",
            "Preset class 2 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "StoneCrusher",
        ),
        option.text(
            "Class3",
            "Class 3",
            "Preset class 3 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "Lord of Order",
        ),
        option.text(
            "Class4",
            "Class 4",
            "Preset class 4 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "King's Echo",
        ),
        option.text(
            "Class5",
            "Class 5",
            "Preset class 5 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "",
        ),
        option.text(
            "Class6",
            "Class 6",
            "Preset class 6 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "",
        ),
        option.text(
            "Class7",
            "Class 7",
            "Preset class 7 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "",
        ),
        option.bool("DoEnh", "Do Enhancements", "Auto-Enhance Gear properly for the fight", true),
        option.bool("UsePotions", "Use Potions", "Enable buying and consuming recommended potions.", true),
        option.int("PotionQuantity", "Potion Quantity", "How many potions to keep stocked.", 10),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new NightBanev2();
    Core.setOptions(true);

    Engine.boot();
    try {
        script.prep();
        script.fight();
    } finally {
        Engine.disableSkills();
        Core.setOptions(false);
        bot.stop();
    }
}
