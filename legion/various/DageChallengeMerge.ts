/*
name: Dage Challenge Merge
description: This bot will farm the items belonging to the selected mode for the Dage Challenge Merge [2118] in /dage
tags: dage, challenge, merge, dage, avarice, legion, legions, scarf, scythe, luxuria, eye, virgil, vital, exanima
*/
// Port of Scripts/Legion/Various/DageChallengeMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";
import { HeadoftheLegionBeast } from "../HeadOfTheLegionBeast";
import { DageChallengeStory } from "../../story/legion/DageChallengeStory";
import { SevenCircles } from "../../story/legion/SevenCircles(War)";

const Adv = new CoreAdvanced();
const Legion = new CoreLegion();
const Circles = new SevenCircles();
const HOTLB = new HeadoftheLegionBeast();
const DageChallenge = new DageChallengeStory();

export class DageChallengeMerge {
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
                case "Underworld Laurel":
                    while (!bot.shouldExit && !Core.checkInventory("Underworld Laurel", quant)) {
                        Core.ensureAccept(8544);
                        Core.huntMonster("Dage", "Dage the Evil", "Dage Dueled");
                        Core.ensureComplete(8544);
                        bot.wait.forPickup("Underworld Laurel");
                    }
                    break;
                case "Underworld Medal":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory("Underworld Medal", quant)) {
                        Core.ensureAccept(8545);
                        Legion.approvalAndFavor(0, 200);
                        Legion.obsidianRock(10);
                        HOTLB.soulsHeresy(30);
                        Core.ensureComplete(8545);
                        bot.wait.forPickup("Underworld Medal");
                    }
                    break;
                case "Underworld Accolade":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAccept(8546);
                        Core.huntMonster("legionarena", "legion fiend rider", "Fiend Rider's Approval");
                        Core.huntMonster("frozenlair", "lich lord", "Lich Lord's Approval");
                        Core.huntMonster("dagefortress", "Grrrberus", "Grrrberus's Grr Grrr");
                        Core.ensureComplete(8546);
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Avarice of the Legion's Hood":

                case "Avarice of the Legion's Skull":
                    Core.addDrop("Avarice of the Legion's Hood", "Avarice of the Legion's Skull");
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("dage", "Dage the Evil", req.name, quant, { isTemp: req.temp });
                    break;
                case "Dage the Evil Insignia":
                    if (!Core.checkInventory(req.name, quant)) {
                        Core.logger(`Player does not have required amount of insignias [x${quant}]`, undefined, {
                            stopBot: true,
                        });
                    }
                    Core.logger(`Insignias [x${quant}] found, continuing`);
                    break;
            }
        };
        Legion.soulForgeHammer();
        Circles.circlesWar();
        //Required to turnin & accept the SoH quests
        DageChallenge.dageChallengeQuests();
        //to unlock mergeshop

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("dage", 2118, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "68433",
            "Avarice of the Legion",
            'Mode: [select] only\nShould the bot buy "Avarice of the Legion" ?',
            false,
        ),
        option.bool(
            "68434",
            "Avarice of the Legion's Helm",
            'Mode: [select] only\nShould the bot buy "Avarice of the Legion\'s Helm" ?',
            false,
        ),
        option.bool(
            "68437",
            "Avarice of the Legion's Scarf",
            'Mode: [select] only\nShould the bot buy "Avarice of the Legion\'s Scarf" ?',
            false,
        ),
        option.bool(
            "68438",
            "Avarice of the Legion's Scythe",
            'Mode: [select] only\nShould the bot buy "Avarice of the Legion\'s Scythe" ?',
            false,
        ),
        option.bool(
            "68440",
            "Luxuria of the Legion",
            'Mode: [select] only\nShould the bot buy "Luxuria of the Legion" ?',
            false,
        ),
        option.bool(
            "68442",
            "Eye of Luxuria Runes",
            'Mode: [select] only\nShould the bot buy "Eye of Luxuria Runes" ?',
            false,
        ),
        option.bool(
            "68443",
            "Virgil of the Legion",
            'Mode: [select] only\nShould the bot buy "Virgil of the Legion" ?',
            false,
        ),
        option.bool(
            "68444",
            "Virgil of the Legion's Helm",
            'Mode: [select] only\nShould the bot buy "Virgil of the Legion\'s Helm" ?',
            false,
        ),
        option.bool(
            "68445",
            "Virgil of the Legion's Cape",
            'Mode: [select] only\nShould the bot buy "Virgil of the Legion\'s Cape" ?',
            false,
        ),
        option.bool(
            "68446",
            "Virgil of the Legion's Staff",
            'Mode: [select] only\nShould the bot buy "Virgil of the Legion\'s Staff" ?',
            false,
        ),
        option.bool("73357", "Vital Exanima", 'Mode: [select] only\nShould the bot buy "Vital Exanima" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DageChallengeMerge.select,
});

export default function main(): void {
    const script = new DageChallengeMerge();
    Core.bankingBlackList.push(
        "Underworld Laurel",
        "Underworld Medal",
        "Underworld Accolade",
        "Avarice of the Legion's Skull",
        "Avarice of the Legion's Hood",
        "Dage the Evil Insignia",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
