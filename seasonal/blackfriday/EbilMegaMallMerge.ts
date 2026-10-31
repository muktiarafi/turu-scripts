/*
name: Ebil Mega Mall Merch Merge
description: This bot will farm the items belonging to the selected mode for the Ebil Mega Mall Merch Merge [2641] in /ebilmegamall
tags: ebil, mega, mall, merch, merge, ebilmegamall, super, rare, mogugu, common, successful, ebilcorp, scalper, undercover, morph, sunglasses, shades, capital, cyber, night, prowler, mohawk, cut, tail, prowlers, catastrophe, cannons, executor, executors, denken, reserve, claw, claws, collection, , ultimate, display, mogugudra, behemoth, cyberstrike, pet, achievement
*/
// Port of Scripts/Seasonal/BlackFriday/EbilMegaMallMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { EbilMegaMall } from "./EbilMegaMallStory";

const Adv = new CoreAdvanced();
const ebilMegaMall = new EbilMegaMall();

export class EbilMegaMallMerge {
    // [Can Change] This should only be changed by the author.
    //              If true, it will not stop the script if the default case triggers and the user chose to only get mats
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
            const quant = Adv.externalQuant;
            if (req == null) {
                Core.debugLogger("req is NULL");
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
                //#region Items not setup
                case "Common Mogugu":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(10509);
                    Core.killMonster("ebilmegamall", "r8", "Left", "*", req.name, quant, { isTemp: req.temp });
                    bot.wait.forPickup(req.name);
                    Core.cancelRegisteredQuests();
                    break;
                case "Super Rare Mogugu":
                    this.handleMogugu(req.name, quant, ["Common Mogugu", "Super Rare Mogugu"], [10]);
                    break;
                case "Super Super Rare Mogugu":
                    this.handleMogugu(
                        req.name,
                        quant,
                        ["Common Mogugu", "Super Rare Mogugu", "Super Super Rare Mogugu"],
                        [100, 10],
                    );
                    break;
                case "Super Super Super Rare Mogugu":
                    this.handleMogugu(
                        req.name,
                        quant,
                        [
                            "Common Mogugu",
                            "Super Rare Mogugu",
                            "Super Super Rare Mogugu",
                            "Super Super Super Rare Mogugu",
                        ],
                        [1000, 100, 10],
                    );
                    break;
                case "EbilCorp Scalper":

                case "Pockeymog Card Pack":

                case "EbilCorp Scalper Morph":

                case "EbilCorp Scalper Locks":

                case "EbilCorp Scalper Hair":

                case "EbilCorp Scalper Visage":
                    if (req.upgrade && !Core.isMember) {
                        Core.debugLogger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.huntMonster("ebilmegamall", "Scalper", req.name, quant, { isTemp: req.temp, log: false });
                    break;
                case "Mogugu Display Case":

                case "Red Mogugu Box":

                case "Yellow Mogugu Box":

                case "Blue Mogugu Box":

                case "Blue Mogugu Critter":

                case "Yellow Mogugu Critter":

                case "Red Mogugu Critter":

                case "Black Mogugu Critter":

                case "Black Mogugu Box":
                    if (req.upgrade && !Core.isMember) {
                        Core.debugLogger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.addDrop(
                        "Mogugu Display Case",
                        "Red Mogugu Box",
                        "Yellow Mogugu Box",
                        "Blue Mogugu Box",
                        "Blue Mogugu Critter",
                        "Yellow Mogugu Critter",
                        "Red Mogugu Critter",
                        "Black Mogugu Critter",
                        "Black Mogugu Box",
                    );
                    Core.registerQuests(10509);
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("ebilmegamall", "Black BOGOdrone Prime", req.name, quant, {
                        isTemp: req.temp,
                        log: false,
                    });
                    break;
                //#endregion
            }
        };
        ebilMegaMall.storyLine();
        Adv.mergeItemisinShopExceptions = [
            "Common Mogugu",
            "Super Rare Mogugu",
            "Super Super Rare Mogugu",
            "Super Super Super Rare Mogugu",
        ];
        Core.addDrop(...[...Adv.mergeItemisinShopExceptions]);
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("ebilmegamall", 2641, findIngredients, buyOnlyThis, { buyMode });
        //#region Dont edit this part
    }

    handleMogugu(finalName: string, quant: number, tiers: string[], multipliers: number[]): void {
        Core.farmingLogger(finalName, quant);
        Core.equipClass(ClassType.Solo);
        Core.registerQuests(10509);
        Core.unbank(...tiers);

        let needed = quant;
        const MAX_STACK = 1000;

        while (!bot.shouldExit && needed > 0) {
            if (Core.checkInventory(finalName, needed)) {
                needed = 0;
                continue;
            }

            // Highest multiplier determines how many we can batch
            const maxMult = multipliers[0];
            let batchSize = Math.min(needed, MAX_STACK / maxMult);
            if (batchSize === 0) {
                batchSize = 1;
            }

            // Process all dependency tiers except final
            for (let t = 0; t < tiers.length - 1; t++) {
                const tierName = tiers[t];
                const tierNeeded = batchSize * multipliers[t];

                const current = bot.inventory.getQuantity(tierName);
                const missing = tierNeeded - current;

                if (missing <= 0) {
                    continue;
                }

                if (t === 0) {
                    // Common Mogugu farming
                    const goal = current + missing;
                    Core.farmingLogger("Common Mogugu", goal);

                    while (!bot.shouldExit && bot.inventory.getQuantity("Common Mogugu") < goal) {
                        Core.killMonster("ebilmegamall", "r8", "Left", "*", undefined, undefined, { log: false });
                        bot.wait.forPickup("Common Mogugu");
                    }
                } else {
                    // Higher-tier purchase
                    Core.buyItem("ebilmegamall", 2641, tierName, missing);
                    bot.wait.forPickup(tierName);
                }
            }

            // Validate all lower tiers exist before buying final
            let canBuyFinal = true;
            for (let i = 0; i < multipliers.length; i++) {
                if (!Core.checkInventory(tiers[i], batchSize * multipliers[i])) {
                    canBuyFinal = false;
                    break;
                }
            }

            if (canBuyFinal) {
                Core.buyItem("ebilmegamall", 2641, finalName, batchSize);
                bot.wait.forPickup(finalName);
                needed -= batchSize;
            }
        }

        Core.cancelRegisteredQuests();
    }

    static readonly select = [
        option.bool(
            "97180",
            "Super Rare Mogugu",
            'Mode: [select] only\nShould the bot buy "Super Rare Mogugu" ?',
            false,
        ),
        option.bool(
            "97181",
            "Super Super Rare Mogugu",
            'Mode: [select] only\nShould the bot buy "Super Super Rare Mogugu" ?',
            false,
        ),
        option.bool(
            "97182",
            "Super Super Super Rare Mogugu",
            'Mode: [select] only\nShould the bot buy "Super Super Super Rare Mogugu" ?',
            false,
        ),
        option.bool("97179", "Common Mogugu", 'Mode: [select] only\nShould the bot buy "Common Mogugu" ?', false),
        option.bool(
            "96808",
            "Successful EbilCorp Scalper",
            'Mode: [select] only\nShould the bot buy "Successful EbilCorp Scalper" ?',
            false,
        ),
        option.bool(
            "96810",
            "Undercover EbilCorp Scalper Morph",
            'Mode: [select] only\nShould the bot buy "Undercover EbilCorp Scalper Morph" ?',
            false,
        ),
        option.bool(
            "96811",
            "EbilCorp Scalper Sunglasses",
            'Mode: [select] only\nShould the bot buy "EbilCorp Scalper Sunglasses" ?',
            false,
        ),
        option.bool(
            "96814",
            "EbilCorp Scalper Shades",
            'Mode: [select] only\nShould the bot buy "EbilCorp Scalper Shades" ?',
            false,
        ),
        option.bool(
            "96815",
            "Undercover EbilCorp Scalper Visage",
            'Mode: [select] only\nShould the bot buy "Undercover EbilCorp Scalper Visage" ?',
            false,
        ),
        option.bool(
            "96820",
            "Ebil Capital Blade",
            'Mode: [select] only\nShould the bot buy "Ebil Capital Blade" ?',
            false,
        ),
        option.bool(
            "96821",
            "Ebil Capital Blades",
            'Mode: [select] only\nShould the bot buy "Ebil Capital Blades" ?',
            false,
        ),
        option.bool(
            "96933",
            "Cyber Night Prowler",
            'Mode: [select] only\nShould the bot buy "Cyber Night Prowler" ?',
            false,
        ),
        option.bool(
            "96934",
            "Cyber Night Prowler Helm",
            'Mode: [select] only\nShould the bot buy "Cyber Night Prowler Helm" ?',
            false,
        ),
        option.bool(
            "96935",
            "Cyber Night Prowler Mask",
            'Mode: [select] only\nShould the bot buy "Cyber Night Prowler Mask" ?',
            false,
        ),
        option.bool(
            "96936",
            "Cyber Night Prowler Mohawk",
            'Mode: [select] only\nShould the bot buy "Cyber Night Prowler Mohawk" ?',
            false,
        ),
        option.bool(
            "96937",
            "Cyber Night Prowler Cut",
            'Mode: [select] only\nShould the bot buy "Cyber Night Prowler Cut" ?',
            false,
        ),
        option.bool(
            "96938",
            "Cyber Night Prowler Locks",
            'Mode: [select] only\nShould the bot buy "Cyber Night Prowler Locks" ?',
            false,
        ),
        option.bool(
            "96939",
            "Cyber Night Prowler Tail",
            'Mode: [select] only\nShould the bot buy "Cyber Night Prowler Tail" ?',
            false,
        ),
        option.bool(
            "96940",
            "Prowler's Catastrophe Cannons",
            'Mode: [select] only\nShould the bot buy "Prowler\'s Catastrophe Cannons" ?',
            false,
        ),
        option.bool(
            "96942",
            "Cyber Prowler's Executor",
            'Mode: [select] only\nShould the bot buy "Cyber Prowler\'s Executor" ?',
            false,
        ),
        option.bool(
            "96943",
            "Cyber Prowler's Executors",
            'Mode: [select] only\nShould the bot buy "Cyber Prowler\'s Executors" ?',
            false,
        ),
        option.bool(
            "96944",
            "Prowler's Denken",
            'Mode: [select] only\nShould the bot buy "Prowler\'s Denken" ?',
            false,
        ),
        option.bool(
            "96945",
            "Prowler's Dual Denken",
            'Mode: [select] only\nShould the bot buy "Prowler\'s Dual Denken" ?',
            false,
        ),
        option.bool(
            "96946",
            "Prowler's Reserve Denken",
            'Mode: [select] only\nShould the bot buy "Prowler\'s Reserve Denken" ?',
            false,
        ),
        option.bool(
            "96947",
            "Prowler's Reserve Dual Denken",
            'Mode: [select] only\nShould the bot buy "Prowler\'s Reserve Dual Denken" ?',
            false,
        ),
        option.bool(
            "96948",
            "Cyber Prowler's Claw",
            'Mode: [select] only\nShould the bot buy "Cyber Prowler\'s Claw" ?',
            false,
        ),
        option.bool(
            "96949",
            "Cyber Prowler's Claws",
            'Mode: [select] only\nShould the bot buy "Cyber Prowler\'s Claws" ?',
            false,
        ),
        option.bool(
            "97230",
            "Mogugu Collection: 25%",
            'Mode: [select] only\nShould the bot buy "Mogugu Collection: 25%" ?',
            false,
        ),
        option.bool(
            "97231",
            "Mogugu Collection: 50%",
            'Mode: [select] only\nShould the bot buy "Mogugu Collection: 50%" ?',
            false,
        ),
        option.bool(
            "97232",
            "Mogugu Collection: 75%",
            'Mode: [select] only\nShould the bot buy "Mogugu Collection: 75%" ?',
            false,
        ),
        option.bool(
            "97234",
            "ULTIMATE Mogugu Display",
            'Mode: [select] only\nShould the bot buy "ULTIMATE Mogugu Display" ?',
            false,
        ),
        option.bool(
            "97235",
            "Mogugudra Behemoth",
            'Mode: [select] only\nShould the bot buy "Mogugudra Behemoth" ?',
            false,
        ),
        option.bool(
            "97233",
            "Mogugu Collection: 100%",
            'Mode: [select] only\nShould the bot buy "Mogugu Collection: 100%" ?',
            false,
        ),
        option.bool(
            "97343",
            "CyberStrike Blade Pet",
            'Mode: [select] only\nShould the bot buy "CyberStrike Blade Pet" ?',
            false,
        ),
        option.bool(
            "96832",
            "CyberStrike Achievement Blade",
            'Mode: [select] only\nShould the bot buy "CyberStrike Achievement Blade" ?',
            false,
        ),
        option.bool(
            "96833",
            "CyberStrike Achievement Blades",
            'Mode: [select] only\nShould the bot buy "CyberStrike Achievement Blades" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: EbilMegaMallMerge.select,
});

export default function main(): void {
    const script = new EbilMegaMallMerge();
    Core.bankingBlackList.push(
        "EbilCorp Scalper",
        "Pockeymog Card Pack",
        "EbilCorp Scalper Morph",
        "EbilCorp Scalper Locks",
        "EbilCorp Scalper Hair",
        "EbilCorp Scalper Visage",
        "Mogugu Display Case",
        "Red Mogugu Box",
        "Yellow Mogugu Box",
        "Blue Mogugu Box",
        "Blue Mogugu Critter",
        "Yellow Mogugu Critter",
        "Red Mogugu Critter",
        "Black Mogugu Critter",
        "Black Mogugu Box",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
