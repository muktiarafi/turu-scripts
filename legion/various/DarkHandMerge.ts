/*
name: Dark Hand Merge
description: This bot will farm the items belonging to the selected mode for the Dark Hand Merge [1693] in /legionarena
tags: dark, hand, merge, legionarena, assassin, hands, shag, masked, chains, cyclone, cyclones, claws, claw, double, edge, kusarigama, axeros, moult, mandibles, torn, shroud, moon, airstrike, pet, behemoth, horns, morph, sheathed, slaughter, battle, cloak, slaughters, darkblood, ashura, armaments
*/
// Port of Scripts/Legion/Various/DarkHandMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";
import { WorthyBlade } from "./WorthyOfTheBlade";

const Adv = new CoreAdvanced();
const Legion = new CoreLegion();
const WB = new WorthyBlade();

export class DarkHandMerge {
    // [Can Change] This should only be changed by the author.
    //              If true, it will not stop the script if the default case triggers and the user chose to only get mats
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
            const quant = Adv.externalQuant;
            if (req == null) {
                Core.logger("req is NULL");
                return;
            }
            switch (req.name) {
                default: {
                    const shouldStop = !Adv.matsOnly || !this.dontStopMissingIng;
                    Core.logger(
                        `The bot hasn't been taught how to get ${req.name}.` +
                            (shouldStop ? " Please report the issue." : " Skipping"),
                        undefined,
                        { messageBox: shouldStop, stopBot: shouldStop },
                    );
                    break;
                }
                //#endregion
                case "Death Badge":
                    Core.equipClass(ClassType.Solo);
                    if (Core.isCompletedBefore(793)) {
                        Core.registerQuests(6742);
                        Core.addDrop("Bone Sigil");
                    }
                    Core.huntMonster("legionarena", "Legion Fiend Rider", req.name, quant, { isTemp: false });
                    Core.cancelRegisteredQuests();
                    break;
                case "Bone Sigil":
                    Core.farmingLogger(req.name, quant);
                    if (Core.isCompletedBefore(793)) {
                        Core.logger("Legion Fiend Rider - Bone Sigil");
                        Core.equipClass(ClassType.Solo);
                        Core.registerQuests(6742);
                        while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                            Core.huntMonster("legionarena", "Legion Fiend Rider", "Undead Rider Defeated");
                            bot.wait.forPickup(req.name);
                        }
                    } else {
                        Core.logger("Legions Finest - Bone Sigil");
                        Core.equipClass(ClassType.Farm);
                        Core.registerQuests(6741);
                        while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                            Core.killMonster("legionarena", "r4", "Left", "*", "Legion's Finest Defeated", 8);
                            bot.wait.forPickup(req.name);
                        }
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Legion Token":
                    Legion.farmLegionToken(quant);
                    break;
                case "Essence of Blade Master":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("underworld", "Blade Master", "Essence of Blade Master", quant, { isTemp: false });
                    break;
                case "Primarch's Trophy":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Dodge);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonsterQuest(10052, "bosschallenge", "Colossal Primarch");
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        WB.worthyOfTheBlade();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("legionarena", 1693, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "47315",
            "Dark Hand Assassin",
            'Mode: [select] only\nShould the bot buy "Dark Hand Assassin" ?',
            false,
        ),
        option.bool(
            "47316",
            "Dark Hand's Shag",
            'Mode: [select] only\nShould the bot buy "Dark Hand\'s Shag" ?',
            false,
        ),
        option.bool(
            "47317",
            "Dark Hand's Mask",
            'Mode: [select] only\nShould the bot buy "Dark Hand\'s Mask" ?',
            false,
        ),
        option.bool(
            "47318",
            "Dark Hand's Locks",
            'Mode: [select] only\nShould the bot buy "Dark Hand\'s Locks" ?',
            false,
        ),
        option.bool(
            "47319",
            "Dark Hand's Masked Locks",
            'Mode: [select] only\nShould the bot buy "Dark Hand\'s Masked Locks" ?',
            false,
        ),
        option.bool(
            "47320",
            "Dark Hand's Chains",
            'Mode: [select] only\nShould the bot buy "Dark Hand\'s Chains" ?',
            false,
        ),
        option.bool(
            "47321",
            "Dark Hand's Cyclone Cape",
            'Mode: [select] only\nShould the bot buy "Dark Hand\'s Cyclone Cape" ?',
            false,
        ),
        option.bool(
            "47322",
            "Dark Hand's Dual Cyclones",
            'Mode: [select] only\nShould the bot buy "Dark Hand\'s Dual Cyclones" ?',
            false,
        ),
        option.bool(
            "47323",
            "Dark Hand's Claws",
            'Mode: [select] only\nShould the bot buy "Dark Hand\'s Claws" ?',
            false,
        ),
        option.bool(
            "47324",
            "Dark Hand's Claw",
            'Mode: [select] only\nShould the bot buy "Dark Hand\'s Claw" ?',
            false,
        ),
        option.bool(
            "47325",
            "Dark Hand's Cyclone",
            'Mode: [select] only\nShould the bot buy "Dark Hand\'s Cyclone" ?',
            false,
        ),
        option.bool(
            "47326",
            "Dark Hand's Double Edge",
            'Mode: [select] only\nShould the bot buy "Dark Hand\'s Double Edge" ?',
            false,
        ),
        option.bool(
            "47327",
            "Dark Hand's Kusari-Gama",
            'Mode: [select] only\nShould the bot buy "Dark Hand\'s Kusari-Gama" ?',
            false,
        ),
        option.bool("74003", "Axeros Moult", 'Mode: [select] only\nShould the bot buy "Axeros Moult" ?', false),
        option.bool("74004", "Axeros Mandibles", 'Mode: [select] only\nShould the bot buy "Axeros Mandibles" ?', false),
        option.bool(
            "74005",
            "Axeros Torn Shroud",
            'Mode: [select] only\nShould the bot buy "Axeros Torn Shroud" ?',
            false,
        ),
        option.bool(
            "74006",
            "Moon Airstrike Pet",
            'Mode: [select] only\nShould the bot buy "Moon Airstrike Pet" ?',
            false,
        ),
        option.bool(
            "91607",
            "Dark Hand Behemoth",
            'Mode: [select] only\nShould the bot buy "Dark Hand Behemoth" ?',
            false,
        ),
        option.bool(
            "91608",
            "Dark Hand Behemoth Horns",
            'Mode: [select] only\nShould the bot buy "Dark Hand Behemoth Horns" ?',
            false,
        ),
        option.bool(
            "91609",
            "Dark Hand Behemoth Morph",
            'Mode: [select] only\nShould the bot buy "Dark Hand Behemoth Morph" ?',
            false,
        ),
        option.bool(
            "91610",
            "Dark Hand Behemoth Visage",
            'Mode: [select] only\nShould the bot buy "Dark Hand Behemoth Visage" ?',
            false,
        ),
        option.bool(
            "91611",
            "Dark Hand Behemoth Hood",
            'Mode: [select] only\nShould the bot buy "Dark Hand Behemoth Hood" ?',
            false,
        ),
        option.bool(
            "91612",
            "Sheathed Dark Hand's Slaughter",
            'Mode: [select] only\nShould the bot buy "Sheathed Dark Hand\'s Slaughter" ?',
            false,
        ),
        option.bool(
            "91613",
            "Dark Hand Behemoth Battle Cloak",
            'Mode: [select] only\nShould the bot buy "Dark Hand Behemoth Battle Cloak" ?',
            false,
        ),
        option.bool(
            "91614",
            "Dark Hand Behemoth Cloak",
            'Mode: [select] only\nShould the bot buy "Dark Hand Behemoth Cloak" ?',
            false,
        ),
        option.bool(
            "91615",
            "Dark Hand's Slaughter",
            'Mode: [select] only\nShould the bot buy "Dark Hand\'s Slaughter" ?',
            false,
        ),
        option.bool(
            "91616",
            "Dark Hand's Slaughters",
            'Mode: [select] only\nShould the bot buy "Dark Hand\'s Slaughters" ?',
            false,
        ),
        option.bool("91617", "Darkblood Ashura", 'Mode: [select] only\nShould the bot buy "Darkblood Ashura" ?', false),
        option.bool(
            "91618",
            "Dual Darkblood Ashura",
            'Mode: [select] only\nShould the bot buy "Dual Darkblood Ashura" ?',
            false,
        ),
        option.bool(
            "91619",
            "Dual Dark Hand's Armaments",
            'Mode: [select] only\nShould the bot buy "Dual Dark Hand\'s Armaments" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DarkHandMerge.select,
});

export default function main(): void {
    const script = new DarkHandMerge();
    Core.bankingBlackList.push(
        "Death Badge",
        "Bone Sigil",
        "Legion Token",
        "Essence of Blade Master",
        "Primarch's Trophy",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
