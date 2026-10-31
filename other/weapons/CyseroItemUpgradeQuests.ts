/*
name: CyseroItemUpgradeQuests
description: null
tags: null
*/
// Port of Scripts/Other/Weapons/CyseroItemUpgradeQuests.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { SepulchuresOriginalHelm } from "../../evil/SepulchuresOriginalHelm";
import { BLODMethod, CoreBLOD } from "../../good/blod/CoreBLOD";
import { TarosManslayer } from "../../nation/various/TarosManslayer";
import { DarknessShard } from "../materials/DarknessShard";

const Farm = new CoreFarms();
const BLOD = new CoreBLOD();
const Adv = new CoreAdvanced();
const DS = new DarknessShard();
const Seppy = new SepulchuresOriginalHelm();
const tarosManslayer = new TarosManslayer();

export class CyseroItemUpgrade {
    scriptOtions(): void {
        if (bot.config!.get<boolean>("PolishedBlod")) {
            this.getPolishedBLoD();
        }

        if (bot.config!.get<boolean>("ToxicPlagueSpear")) {
            this.getToxicPlagueSpear();
        }

        if (bot.config!.get<boolean>("BurningPhoenixBlade")) {
            this.getBurningPhoenixBlade();
        }

        if (bot.config!.get<boolean>("OdokuroBlight")) {
            this.getOdokuroBlight();
        }

        if (bot.config!.get<boolean>("PolishedManslayer")) {
            this.getPolishedManslayer();
        }

        if (bot.config!.get<boolean>("CursedDoomBlade")) {
            this.getCursedDoomBlade();
        }

        if (bot.config!.get<boolean>("RebornSepulchureHelm")) {
            this.getRebornSepulchureHelm();
        }

        if (bot.config!.get<boolean>("GetAll")) {
            this.getAll();
        }
    }

    getAll(): void {
        this.getPolishedBLoD();
        this.getToxicPlagueSpear();
        this.getBurningPhoenixBlade();
        this.getOdokuroBlight();
        this.getPolishedManslayer();
        this.getCursedDoomBlade();
        this.getRebornSepulchureHelm();
    }

    getPolishedBLoD(): void {
        if (Core.checkInventory("Polished Blinding Light of Destiny", undefined, { toInv: false })) {
            return;
        }

        BLOD.blindingLightOfDestiny(BLODMethod.Fewest_Hours);

        Core.addDrop("Polished Blinding Light of Destiny");

        //Upgrade the Blinding Light of Destiny 7063

        bot.quests.updateQuest(5807);
        Core.ensureAccept(7063);

        Farm.battleUnderB("Undead Energy", 3000);
        Adv.buyItem("alchemyacademy", 2114, "Bright Tonic", 10);
        Core.huntMonster("doomwood", "Undead Paladin", "Purification Orb", 10, { isTemp: false });
        Core.killMonster("doomwood", "r7", "Up", "*", "Shoelace of a Fallen Paladin", 3, { isTemp: false });
        Core.killMonster("charredpath", "r5", "Left", "Plague Spreader", "Slimed Sigil", 75, { isTemp: false });
        Core.huntMonster("lightguardwar", "Sigrid Sunshield", "Medal of Justice", 150, { isTemp: false });

        Core.ensureComplete(7063);
        bot.wait.forPickup("Polished Blinding Light of Destiny");
    }

    getToxicPlagueSpear(): void {
        if (Core.checkInventory("Toxic Plague Spear", undefined, { toInv: false })) {
            return;
        }

        if (!Core.checkInventory("Undead Plague Spear")) {
            Core.huntMonster("Graveyard", "Big Jack Sprat", "Undead Plague Spear", undefined, { isTemp: false });
        }

        Core.addDrop("Toxic Plague Spear");

        while (!bot.shouldExit && !Core.checkInventory("Toxic Plague Spear")) {
            //Upgrade the Plague Spear 7064

            Core.ensureAccept(7064);

            Core.equipClass(ClassType.Farm);
            Core.huntMonster("Swallowed", "Germs", "Botulinum", 6);
            Core.huntMonster("Artixpointe", "Enchanted Sushi", "Pufferfish Sushi", 3);
            Core.huntMonster("TowerofDoom10", "Dreadroom", "Dried Dreadroom", 5);

            Core.ensureComplete(7064);
            bot.wait.forPickup("Toxic Plague Spear");
        }
    }

    getBurningPhoenixBlade(): void {
        if (Core.checkInventory("Burning Phoenix Blade", undefined, { toInv: false })) {
            return;
        }

        if (!Core.checkInventory("Phoenix Blade")) {
            Core.huntMonster("lair", "Red Dragon", "Phoenix Blade", undefined, { isTemp: false });
        }

        Core.addDrop("Burning Phoenix Blade");

        while (!bot.shouldExit && !Core.checkInventory("Burning Phoenix Blade")) {
            //Upgrade the Phoenix Blade 7065

            Core.ensureAccept(7065);

            Core.equipClass(ClassType.Farm);
            Core.huntMonster("Lair", "Bronze Draconian", "Wisp of Dragonspirit", 12);
            Core.huntMonster("Lair", "Dark Draconian", "Crystallized Flame");
            //why the fuck was the class buffed!?
            const usethis =
                bot.inventory.items
                    .concat(...bot.bank.items)
                    .find((n) => n.name === "Yami no Ronin" || n.name.startsWith("Chaos Slayer")) ?? null;
            if (usethis != null) {
                Core.equip(usethis.id);
                Core.equip(...Core.farmGear);
                if (usethis.name === "Yami no Ronin") {
                    bot.skills.startAdvanced("1 | 4");
                }
            } else {
                Core.equipClass(ClassType.Dodge);
            }
            Core.huntMonster("underlair", "ArchFiend DragonLord", "Void Scale", 13, { isTemp: false });

            Core.ensureComplete(7065);
            bot.wait.forPickup("Burning Phoenix Blade");
        }
        Core.equipClass(ClassType.Solo);
    }

    getOdokuroBlight(): void {
        if (Core.checkInventory("O-dokuro's Blight", undefined, { toInv: false })) {
            return;
        }

        if (!Core.checkInventory("O-dokuro Blade")) {
            Core.huntMonster("Odokuro", "O-dokuro", "O-dokuro Blade", undefined, { isTemp: false });
        }

        Core.addDrop("O-dokuro's Blight");

        while (!bot.shouldExit && !Core.checkInventory("O-dokuro's Blight")) {
            //Upgrade O-Dokuro Blade 7066

            Core.ensureAccept(7066);

            Core.equipClass(ClassType.Farm);
            Farm.battleUnderB("Bone Dust", 25);
            Core.huntMonster("Embersea", "Storm Scout", "Polish");
            Core.huntMonster("Embersea", "Flame Soldier", "Cloth");

            Core.ensureComplete(7066);
            bot.wait.forPickup("O-dokuro's Blight");
        }
    }

    getPolishedManslayer(): void {
        if (Core.checkInventory("Polished Manslayer", undefined, { toInv: false })) {
            return;
        }

        if (!Core.checkInventory("Taro's Manslayer")) {
            tarosManslayer.guardianTaro(true);
        }

        Core.addDrop("Polished Manslayer");

        while (!bot.shouldExit && !Core.checkInventory("Polished Manslayer")) {
            //Upgrade Taro’s Manslayer 7067

            Core.ensureAccept(7067);

            Core.equipClass(ClassType.Farm);
            Farm.battleUnderB("Bone Dust", 25);
            Core.huntMonster("Bloodtusk ", "Crystal-Rock", "Polished Rocks", 3);
            Core.huntMonster("Bloodtusk ", "Crystal-Rock", "Precious Gemstone", 3);
            Core.huntMonster("DarkFortress", "Wilhelm", "Ultra Shifting Plane Gem", 15, { isTemp: false });

            Core.ensureComplete(7067);
            bot.wait.forPickup("Polished Manslayer");
        }
    }

    getCursedDoomBlade(): void {
        if (Core.checkInventory("Cursed DoomBlade", undefined, { toInv: false })) {
            return;
        }

        Adv.buyItem("museum", 580, "Sepulchure's Undead Blade");
        Core.addDrop("Cursed DoomBlade");

        while (!bot.shouldExit && !Core.checkInventory("Cursed DoomBlade")) {
            //Upgrade Sepulchure’s Undead Blade 7068

            Core.ensureAccept(7068);

            DS.getShard(1);
            Core.equipClass(ClassType.Farm);
            Core.killMonster("shadowfallwar", "Garden1", "Bottom", "Bonemuncher", "Ultimate Darkness Gem", 50, {
                isTemp: false,
            });
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("frozenlair", "Lich Lord", "Necrotic Orb", 100, { isTemp: false });
            Core.huntMonster("underworld", "Frozen Pyromancer", "Flaming Skull", 50, { isTemp: false });

            Core.ensureComplete(7068);
            bot.wait.forPickup("Cursed DoomBlade");
        }
    }

    getRebornSepulchureHelm(): void {
        if (Core.checkInventory("Reborn Sepulchure's Helm", undefined, { toInv: false })) {
            return;
        }

        Seppy.doAll();

        Core.addDrop("Reborn Sepulchure's Helm", "Ultimate Darkness Gem");

        //Upgrade Sepulchure’s Original Helm 7069
        Core.ensureAccept(7069);

        DS.getShard(1);
        Core.equipClass(ClassType.Farm);
        Core.killMonster("shadowfallwar", "Garden1", "Bottom", "Bonemuncher", "Ultimate Darkness Gem", 75, {
            isTemp: false,
        });
        Core.equipClass(ClassType.Solo);
        Core.huntMonster("frozenlair", "Lich Lord", "Necrotic Orb", 150, { isTemp: false });
        Core.huntMonster("underworld", "Frozen Pyromancer", "Flaming Skull", 100, { isTemp: false });

        Core.ensureComplete(7069);
        bot.wait.forPickup("Reborn Sepulchure's Helm");
    }
}

export const scriptOptions = defineScriptOptions(
    "CyseroItemUpgrade",
    [
        Core.skipOptions,
        option.bool(
            "PolishedBlod",
            "Polished Blinding Light of Destiny",
            'Finishes Cysero Quest "Upgrade the Blinding Light of Destiny (7063)" to get you "Polished Blinding Light of Destiny"',
            false,
        ),
        option.bool(
            "ToxicPlagueSpear",
            "Toxic Plague Spear",
            'Finishes Cysero Quest "Upgrade the Plague Spear (7064)" to get you "Toxic Plague Spear"',
            false,
        ),
        option.bool(
            "BurningPhoenixBlade",
            "Burning Phoenix Blade",
            'Finishes Cysero Quest "Upgrade the Phoenix Blade (7065)" to get you "Burning Phoenix Blade"',
            false,
        ),
        option.bool(
            "OdokuroBlight",
            "O-dokuro's Blight",
            'Finishes Cysero Quest "Upgrade O-Dokuro Blade (7066)" to get you "O-dokuro\'s Blight"',
            false,
        ),
        option.bool(
            "PolishedManslayer",
            "Polished Manslayer",
            'Finishes Cysero Quest "Upgrade Taro’s Manslayer (7067)" to get you "Polished Manslayer"',
            false,
        ),
        option.bool(
            "CursedDoomBlade",
            "Cursed DoomBlade",
            'Finishes Cysero Quest "Upgrade Sepulchure’s Undead Blade (7068)" to get you "Cursed DoomBlade"',
            false,
        ),
        option.bool(
            "RebornSepulchureHelm",
            "Reborn Sepulchure's Helm",
            'Finishes Cysero Quest "Upgrade Sepulchure’s Original Helm (7069)" to get you "Reborn Sepulchure\'s Helm"',
            false,
        ),
        option.bool(
            "GetAll",
            "GetAllUpgrades",
            "Finishes All Cysero Item Upgrade Quests to Get you all of the  rewards",
            false,
        ),
    ],
    true,
);

export default function main(): void {
    const script = new CyseroItemUpgrade();
    Core.setOptions();

    script.scriptOtions();

    Core.setOptions(false);
}
