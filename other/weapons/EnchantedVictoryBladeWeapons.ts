/*
name: EnchantedVictoryBladeWeapons
description: null
tags: null
*/
// Port of Scripts/Other/Weapons/EnchantedVictoryBladeWeapons.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Alignment, Core, randomInt } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export enum VictoryBladeStyles {
    ArcaneBladeOfGlory = 0,
    ShadowBladeOfDespair = 1,
    Smart = 2,
}

export class EnchantedVictoryBladeWeapons {
    getBoth(): void {
        this.getWeapon(VictoryBladeStyles.ArcaneBladeOfGlory);
        this.getWeapon(VictoryBladeStyles.ShadowBladeOfDespair);
    }

    getWeapon(Method: VictoryBladeStyles = VictoryBladeStyles.Smart): void {
        if (Method === 2) {
            if (
                Core.checkInventory(
                    ["Enchanted Mana Blade", "Bright Aura Gem", "Amulet of Glory", "Arcane Blade of Glory"],
                    undefined,
                    { any: true },
                )
            ) {
                Method = VictoryBladeStyles.ArcaneBladeOfGlory;
            } else if (
                Core.checkInventory(
                    ["Enchanted Shadow Blade", "Dark Aura Gem", "Amulet of Despair", "Shadow Blade of Despair"],
                    undefined,
                    { any: true },
                )
            ) {
                Method = VictoryBladeStyles.ShadowBladeOfDespair;
            } else {
                const alignment = bot.flash.callGameFunction<number>("world.getQuestValue", 41) as Alignment;
                if (alignment === Alignment.Good) {
                    Method = VictoryBladeStyles.ArcaneBladeOfGlory;
                } else if (alignment === Alignment.Evil) {
                    Method = VictoryBladeStyles.ShadowBladeOfDespair;
                } else {
                    Method =
                        randomInt(0, 100) > 50
                            ? VictoryBladeStyles.ArcaneBladeOfGlory
                            : VictoryBladeStyles.ShadowBladeOfDespair;
                }
            }
        }
        const doGlory = Method === 0;

        if (doGlory && Core.checkInventory("Arcane Blade of Glory")) {
            return;
        } else if (Method === 1 && Core.checkInventory("Shadow Blade of Despair")) {
            return;
        }

        this.typeAuraGem(doGlory ? "bright" : "dark");
        Core.sleep();
        Adv.buyItem("river", 1213, doGlory ? "Enchanted Mana Blade" : "Enchanted Shadow Blade");
        this.amuletOfType(doGlory ? "glory" : "despair");
        Core.sleep();
        Adv.buyItem("river", 1213, doGlory ? "Arcane Blade of Glory" : "Shadow Blade of Despair");
    }

    enchantedVictoryBlade(): void {
        if (Core.checkInventory("Enchanted Victory Blade")) {
            return;
        }

        Adv.buyItem("river", 1213, "Silver Victory Blade");
        if (!Core.checkInventory("Enchantment Rune")) {
            Core.addDrop("Enchantment Rune");
            Core.farmingLogger("Enchantment Rune", 1);
            Core.ensureAccept(4811);

            Core.huntMonster("graveyard", "Skeletal Viking", "Ravenwing Scroll", 1, { isTemp: false });
            Core.huntMonster("graveyard", "Skeletal Warrior", "Unseeing Eye", 3, { isTemp: false });
            Core.huntMonster("graveyard", "Big Jack Sprat", "Shard of Diamond Blade", 5, { isTemp: false });

            Core.ensureComplete(4811);
            bot.wait.forPickup("Enchantment Rune");
        }
        Core.sleep();
        Adv.buyItem("river", 1213, "Enchanted Victory Blade");
    }

    typeAuraGem(type: string): void {
        type = this.captialize(type.trim());
        if (type !== "Bright" && type !== "Dark") {
            Core.logger('Invalid paramater. Expected "Bright" or "Dark"');
            return;
        }
        type = `${type} Aura Gem`;
        if (Core.checkInventory(type)) {
            return;
        }

        this.enchantedVictoryBlade();

        Core.addDrop(type);
        Core.farmingLogger(type, 1);
        Core.ensureAccept(4812);

        Core.huntMonster("graveyard", "Skeletal Warrior", "Broken Dream Catcher", 10, { isTemp: false });

        Core.ensureComplete(4812, type === "Bright Aura Gem" ? 33500 : 33499);
        bot.wait.forPickup(type);
    }

    amuletOfType(type: string): void {
        type = this.captialize(type.trim());
        if (type !== "Glory" && type !== "Despair") {
            Core.logger('Invalid paramater. Expected "Glory" or "Despair"');
            return;
        }
        type = `Amulet of ${type}`;
        if (Core.checkInventory(type)) {
            return;
        }

        Core.addDrop(type);
        Core.farmingLogger(type, 1);
        Core.ensureAccept(4813);

        Core.huntMonster("graveyard", "Skeletal Viking", "Nornir Triad Shard", 12, { isTemp: false });

        Core.ensureComplete(4813, type === "Amulet of Glory" ? 33502 : 33501);
        // Core.EnsureComplete(4813, Amulet.ID);
        bot.wait.forPickup(type);
    }

    private captialize(input: string): string {
        if (!input) {
            return input;
        }
        if (input.length === 1) {
            return input[0].toUpperCase();
        }
        return input[0].toUpperCase() + input.substring(1).toLowerCase();
    }
}

export default function main(): void {
    const script = new EnchantedVictoryBladeWeapons();
    Core.setOptions();
    Core.bankingBlackList.push(
        "Enchanted Mana Blade",
        "Bright Aura Gem",
        "Amulet of Glory",
        "Arcane Blade of Glory",
        "Enchanted Shadow Blade",
        "Dark Aura Gem",
        "Amulet of Despair",
        "Shadow Blade of Despair",
    );

    script.getBoth();

    Core.setOptions(false);
}
