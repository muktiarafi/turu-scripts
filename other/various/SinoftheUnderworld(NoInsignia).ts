/*
name: Sin of the SinoftheUnderworld NoInsignia
description: Does the Sin of the SinoftheUnderworld quest upto the "Dage the Evil Insignia" item, of which skua cannot get.
tags: sin, of, the, SinoftheUnderworld, no, insignia, quest, Dage the Evil Insignia, sin of the SinoftheUnderworld, no insignia, 51, fifty one
*/
// Port of Scripts/Other/Various/SinoftheUnderworld(NoInsignia).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreLegion } from "../../legion/CoreLegion";
import { SoulForgeMerge } from "../../legion/mergeshops/SoulForgeMerge";
import { VulcarsMerge } from "../../legion/various/VulcarsMerge";
import { CoreYnR } from "../../legion/yaminoronin/CoreYnR";
import { UnderworldTeamMerge } from "../../seasonal/staffbirthdays/dagetheevil/UnderworldTeamMerge";
import { AtlasFalls } from "../../story/legion/AtlasFalls";

const Adv = new CoreAdvanced();
const LR = new CoreLegion();
const atlasFalls = new AtlasFalls();
const YnR = new CoreYnR();
const vulcarsMerge = new VulcarsMerge();
const underworldTeamMerge = new UnderworldTeamMerge();
const soulForgeMerge = new SoulForgeMerge();

export class SinoftheSinoftheUnderworldNoInsignia {
    getSword(): void {
        Core.addDrop(
            "Undead Champion Blade",
            "Corrupted Dragon Slayer",
            "Wrath of the Legion Blade",
            "Fatal Keraunos",
            "Yami no Ronin Katana",
            "Dual Legion Soul Devourers",
            "Dage the Evil Insignia",
            "Sin Of the Underworld",
        );
        atlasFalls.storyline();

        Core.ensureAccept(10147);

        //5k LTs
        LR.farmLegionToken(25000);

        if (!Core.checkInventory("Undead Champion Blade")) {
            Adv.buyItem("underworld", 216, "Undead Champion");
            Core.farmingLogger("Undead Champion Blade");
            Core.equipClass(ClassType.Farm);
            while (!bot.shouldExit && !Core.checkInventory("Undead Champion Blade")) {
                Core.ensureAccept(821);
                Core.huntMonster("lair", "Water Draconian", "Flawless DracoHorn", 40, { isTemp: false });
                Core.huntMonster("lair", "Golden Draconian", "Golden DracoHeart");
                Core.huntMonster("lair", "Dark Draconian", "Dark DracoHeart");
                Core.huntMonster("lair", "Bronze Draconian", "Mammoth DracoHeart");
                Core.huntMonster("lair", "Water Draconian", "Water DracoHeart");
                Core.huntMonster("lair", "Venom Draconian", "Venom DracoHeart");
                Core.huntMonster("lair", "Purple Draconian", "Iron DracoHeart");
                Core.ensureComplete(821);
            }
        }

        if (!Core.checkInventory("Corrupted Dragon Slayer")) {
            Core.farmingLogger("Corrupted Dragon Slayer");
            Core.registerQuests(824);
            while (!bot.shouldExit && !Core.checkInventory(["Corrupted Dragon Slayer"])) {
                Core.equipClass(ClassType.Farm);
                Core.killMonster("doomhaven", "r4", "Down", "Skeletal Ice Mage", "Frostbit Skull", 15);
                Core.huntMonster("Marsh2", "Lesser Shadow Serpent", "Potent Viper's Blood");
                Core.equipClass(ClassType.Solo);
                Core.huntMonster("Marsh2", "Soulseeker", "Soul Scythe", undefined, { isTemp: false });
            }
        }

        if (!Core.checkInventory("Wrath of the Legion Blade")) {
            underworldTeamMerge.buyAllMerge("Wrath of the Legion Blade");
        }

        if (!Core.checkInventory("Fatal Keraunos")) {
            soulForgeMerge.buyAllMerge("Fatal Keraunos");
        }

        if (!Core.checkInventory("Yami no Ronin Katana")) {
            YnR.yokaiSwordScroll();
        }

        if (!Core.checkInventory("Dual Legion Soul Devourers")) {
            vulcarsMerge.buyAllMerge("Dual Legion Soul Devourers");
        }

        if (!Core.checkInventory("Dage the Evil Insignia", 20)) {
            Core.logger('Bot **Cannot** get "Dage the Evil Insignia", please do it manually.');
        } else {
            Core.ensureComplete(10147);
            bot.wait.forDrop("Sin Of the Underworld");
            bot.wait.forPickup("Sin Of the Underworld");
            if (Core.checkInventory("Sin Of the Underworld")) {
                Core.logger("You have successfully obtained the Sin Of the Underworld.");
            }
        }
    }
}

export default function main(): void {
    const script = new SinoftheSinoftheUnderworldNoInsignia();
    Core.setOptions();
    Core.bankingBlackList.push(
        "Undead Champion Blade",
        "Corrupted Dragon Slayer",
        "Wrath of the Legion Blade",
        "Fatal Keraunos",
        "Yami no Ronin Katana",
        "Dual Legion Soul Devourers",
        "Dage the Evil Insignia",
        "Sin Of the Underworld",
    );
    script.getSword();

    Core.setOptions(false);
}
