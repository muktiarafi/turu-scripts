/*
name: Gear of Allwe
description: This bot will farm get you all the gear of awe
tags: armor, awe, good, pauldron, breastplate, vambrace, gauntlet, greaves, fragment, shard, relic
*/
// Port of Scripts/Good/GearOfAwe/GearofAllwe.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { Awescended } from "./Awescended";
import { CoreAwe } from "./CoreAwe";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const Awe = new CoreAwe();
const awescended = new Awescended();

export class GearofAllwe {
    getAllwe(): void {
        this.getArmor();
        this.getHoA();
        this.getCoA();
        this.boA();
        if (bot.config!.get<boolean>("GetAwescended")) {
            awescended.getAwe();
        }
    }

    getArmor(): void {
        if (Core.checkInventory("Armor of Awe")) {
            return;
        }

        if (Core.isMember) {
            if (!Core.checkInventory("Pauldron Relic")) {
                Farm.bladeofAweREP(10, false);
                Farm.experience(55);
                Core.buyItem("museum", 1130, "Armor of Awe Pass");
                Core.addDrop("Pauldron Fragment");
                Core.equipClass(ClassType.Solo);

                Core.registerQuests(4162);
                Core.huntMonster("gravestrike", "Ultra Akriloth", "Pauldron Fragment", 15, { isTemp: false });
                bot.wait.forPickup("Pauldron Fragment");
                Core.cancelRegisteredQuests();

                Core.buyItem("museum", 1129, "Pauldron Relic");
            }
        } else {
            Awe.getAweRelic("Pauldron", 4160, 15, 15, "gravestrike", "Ultra Akriloth");
        }

        Awe.getAweRelic("Breastplate", 4163, 10, 10, "aqlesson", "Carnax");
        Awe.getAweRelic("Vambrace", 4166, 15, 15, "bloodtitan", "Ultra Blood Titan");
        Awe.getAweRelic("Gauntlet", 4169, 25, 5, "alteonbattle", "ULTRA Alteon");
        Awe.getAweRelic("Greaves", 4172, 10, 15, "bosschallenge", "Mutated Void Dragon");
        Core.buyItem("museum", 1129, "Armor of Awe");

        Core.toBank("Legendary Awe Pass", "Guardian Awe Pass", "Armor of Awe Pass");
    }

    getHoA(): void {
        if (Core.checkInventory("Helm of Awe")) {
            return;
        }

        Core.equipClass(ClassType.Solo);
        Awe.getAweRelic("Helm", 4175, 10, 5, "doomvaultb", "Undead Raxgore");
        Core.buyItem("museum", 1129, "Helm of Awe");

        Core.toBank("Legendary Awe Pass", "Guardian Awe Pass", "Armor of Awe Pass");
    }

    getCoA(): void {
        if (Core.checkInventory("Cape of Awe")) {
            return;
        }

        Awe.getAweRelic("Cape", 4178, 1, 1, "doomvault", "Binky");
        Adv.buyItem("museum", 1129, "Cape of Awe");

        Core.toBank("Legendary Awe Pass", "Guardian Awe Pass", "Armor of Awe Pass");
    }

    boA(): void {
        Farm.bladeofAweREP(6, true);
    }
}

export const scriptOptions = defineScriptOptions(
    "GearofAllwe",
    [
        option.bool("GetAwescended", "Get Awescended? [Long]", `its a long grind.. are u sure? ᶠᵘᶜᵏ ᶦᵗ ʷᵉ ᵇᵃˡˡ`, false),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new GearofAllwe();
    Core.setOptions();

    script.getAllwe();

    Core.setOptions(false);
}
