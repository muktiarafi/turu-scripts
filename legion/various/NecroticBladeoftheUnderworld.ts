/*
name: Necrotic Blade of the Underworld
description: null
tags: necrotic blade of the underworld, necrotic, blade, of, the, underworld,nsod
*/
// Port of Scripts/Legion/Various/NecroticBladeoftheUnderworld.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, type EventMap } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, Core, randomInt } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreNSOD } from "../../evil/nsod/CoreNSOD";
import { CoreLegion } from "../CoreLegion";
import { AnotherOneBitesTheDust } from "../legionmaterials/SoulSand";
import { DageChallengeStory } from "../../story/legion/DageChallengeStory";

const Adv = new CoreAdvanced();
const NSoD = new CoreNSOD();
const Legion = new CoreLegion();
const DageChallenge = new DageChallengeStory();
const SoulSand = new AnotherOneBitesTheDust();
const Farm = new CoreFarms();

export class NecroticBladeoftheUnderworld {
    getNBoU(): void {
        const Event_RunToArea = ({ zone }: EventMap["runToArea"]): void => {
            switch (zone.toLowerCase()) {
                case "a":
                    //Move to the left
                    bot.player.walkTo(randomInt(40, 175), randomInt(400, 410), 8);
                    break;
                case "b":
                    //Move to the right
                    bot.player.walkTo(randomInt(760, 930), randomInt(410, 415), 8);
                    break;
                default:
                    //Move to the center
                    bot.player.walkTo(randomInt(480, 500), randomInt(300, 420), 8);
                    break;
            }
        };
        //Item Check
        if (Core.checkInventory("Necrotic Blade of the Underworld")) {
            return;
        }

        //Necessary AddDrops
        Core.addDrop(
            "Necrotic Blade of the Underworld",
            "Underworld Blade of DOOM",
            "Necrotic Sword of Doom",
            "Legion Token",
            "Beast Soul",
            "Soul Sand",
            "Dage the Evil Insignia",
        );

        //Leveling to 95
        Farm.experience(95);

        //Unlocking Quest
        DageChallenge.dageChallengeQuests();

        Core.ensureAccept(8548);

        //Get Necrotic Sword of Doom
        if (!Core.checkInventory("Necrotic Sword of Doom")) {
            Core.logger("Getting Necrotic Sword of Doom (This Will Take a LONG Time");
            NSoD.getNSOD();
        }

        //Underworld Blade of DOOM
        if (!Core.checkInventory("Underworld Blade of DOOM")) {
            Core.huntMonster("Dage", "Dage the Evil", "Underworld Blade of DOOM", undefined, {
                isTemp: false,
                publicRoom: false,
            });
            bot.wait.forPickup("Underworld Blade of DOOM");
        }

        //Farm 25,000 Legion Tokens
        Legion.farmLegionToken(25000);

        //Beast Souls
        Adv.gearStore(false);
        if (Core.checkInventory("ArchPaladin")) {
            Core.equip("ArchPaladin");
        } else {
            Core.equipClass(ClassType.Solo);
        }
        Adv.boostKillMonster("SevenCirclesWar", "r17", "Left", "The Beast", "Beast Soul", 25, {
            isTemp: false,
            publicRoom: false,
        });
        Adv.gearStore(true, { enhAfter: true });

        //Soul Sand
        SoulSand.soulSand(7);

        //Dage the Evil Insignia
        bot.events.on("runToArea", Event_RunToArea);
        if (!Core.checkInventory("Dage the Evil Insignia", 5)) {
            if (bot.quests.isDailyComplete(8547)) {
                Core.logger("Can't accept quest 8547 because the weekly is complete", undefined, { messageBox: true });
                return;
            }
            Core.ensureAccept(8547);
            Core.equipClass(ClassType.Solo);

            Adv.boostKillMonster(
                "UltraDage",
                "Boss",
                "Right",
                "Dage the Dark Lord",
                "Dage the Dark Lord Defeated",
                undefined,
                { isTemp: false, publicRoom: false },
            );

            Core.ensureComplete(8547);
            bot.wait.forPickup("Dage the Evil Insignia");
        }
        bot.events.off("runToArea", Event_RunToArea);

        Core.ensureComplete(8548);
        bot.wait.forPickup("Necrotic Blade of the Underworld");
    }
}

export default function main(): void {
    const script = new NecroticBladeoftheUnderworld();
    Core.bankingBlackList.push("Legion Token", "Beast Soul", "Soul Sand", "Dage the Evil Insignia");
    Core.setOptions();

    script.getNBoU();

    Core.setOptions(false);
}
