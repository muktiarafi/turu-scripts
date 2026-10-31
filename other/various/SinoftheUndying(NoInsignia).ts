/*
name: Sin of the SinoftheUndying NoInsignia
description: Does the Sin of the SinoftheUndying quest upto the "Atlas Regalia" item, of which skua cannot get.
tags: sin, of, the, SinoftheUndying, no, insignia, quest, atlas, regalia, sin of the SinoftheUndying, no insignia, 51, fifty one
*/
// Port of Scripts/Other/Various/SinoftheUndying(NoInsignia).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreLegion } from "../../legion/CoreLegion";
import { HeadoftheLegionBeast } from "../../legion/HeadOfTheLegionBeast";
import { AtlasFalls } from "../../story/legion/AtlasFalls";

const Adv = new CoreAdvanced();
const LR = new CoreLegion();
const HotLB = new HeadoftheLegionBeast();
const atlasFalls = new AtlasFalls();

export class SinoftheSinoftheUndyingNoInsignia {
    getSword(): void {
        Core.addDrop(
            "Sin of the Undying",
            "Atlas Lion Pelt",
            "Beast Soul",
            "Broken Chain",
            "Essence of Wrath",
            "Essence of Violence",
            "Essence of Treachery",
            "Atlas Regalia",
        );
        atlasFalls.storyline();

        Core.ensureAccept(10146);

        // Atlas Lion Pelt x 20
        if (!Core.checkInventory("Atlas Lion Pelt", 20)) {
            Core.farmingLogger("Atlas Lion Pelt", 20);
            while (!bot.shouldExit && !Core.checkInventory("Atlas Lion Pelt", 20)) {
                Core.huntMonsterQuest(
                    10126,
                    ["atlaskingdom", "Atlas Leo", ClassType.Solo],
                    ["atlaskingdom", "Atlas Elite", ClassType.Solo],
                    ["atlaskingdom", "Executioner Ladon", ClassType.Solo],
                );
                bot.wait.forPickup("Atlas Lion Pelt");
            }
        }

        // 20 Beast's Soul
        if (!Core.checkInventory("Beast Soul", 20)) {
            Adv.gearStore(false);
            if (Core.checkInventory("ArchPaladin")) {
                Core.equip("ArchPaladin");
            } else {
                Core.equipClass(ClassType.Solo);
            }
            Core.farmingLogger("Beast Soul", 20);
            Core.huntMonster("sevencircleswar", "The Beast", "Beast Soul", 20, { isTemp: false, publicRoom: true });
            Adv.gearStore(true, { enhAfter: true });
        }

        // Broke Chain x 20
        if (!Core.checkInventory("Broken Chain", 150)) {
            Core.farmingLogger("Broken Chain", 150);
            while (!bot.shouldExit && !Core.checkInventory("Broken Chain", 150)) {
                Core.huntMonsterQuest(
                    10115,
                    ["atlaspromenade", "Atlas Light Magus", ClassType.Farm],
                    ["atlaspromenade", "Wrath Guard", ClassType.Farm],
                    ["atlaspromenade", "Usurper Lord Slaine", ClassType.Solo],
                );
                bot.wait.forPickup("Broken Chain");
            }
        }

        //5k LTs
        LR.farmLegionToken(5000);

        // 20 of each Essence
        const requiredItems = new Map([
            ["Essence of Wrath", HotLB.essenceWrath],
            ["Essence of Violence", HotLB.essenceViolence],
            ["Essence of Treachery", HotLB.essenceTreachery],
        ]);

        for (const [item, farmAction] of requiredItems) {
            if (!Core.checkInventory(item, 20)) {
                farmAction(20);
            }
        }

        if (!Core.checkInventory("Atlas Regalia", 20)) {
            if (Core.checkInventory("Chaos Avenger")) {
                Core.useBossClass();
                while (!bot.shouldExit && !Core.checkInventory("Atlas Regalia", 20)) {
                    Core.huntMonsterQuest(10137, "atlasfalls", "King Zedek");
                    bot.wait.forPickup("Atlas Regalia");
                }
            } else {
                Core.logger("Atlas Regalia requires Chaos Avenger class.");
            }
        } else {
            Core.ensureComplete(10146);
            bot.wait.forDrop("Sin of the Undying");
            bot.wait.forPickup("Sin of the Undying");
            if (Core.checkInventory("Sin of the Undying")) {
                Core.logger("You have successfully obtained the Sin of the Undying.");
            }
        }
    }
}

export default function main(): void {
    const script = new SinoftheSinoftheUndyingNoInsignia();
    Core.setOptions();
    Core.bankingBlackList.push(
        "Sin of the Undying",
        "Atlas Lion Pelt",
        "Beast Soul",
        "Broken Chain",
        "Essence of Wrath",
        "Essence of Violence",
        "Essence of Treachery",
        "Atlas Regalia",
    );
    script.getSword();

    Core.setOptions(false);
}
