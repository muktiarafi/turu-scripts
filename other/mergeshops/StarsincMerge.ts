/*
name: Starsinc Merge
description: This bot will farm the items belonging to the selected mode for the Starsinc Merge [678] in /starsinc
tags: starsinc, merge, starsinc, finals, base, skull, horned, galactic, stars, primes, exo, wings, legendary, prime, dominus, visor
*/
// Port of Scripts/Other/MergeShops/StarsincMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { StarSinc } from "../../story/StarSinc";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const Star = new StarSinc();

export class StarsincMerge {
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
                case "Star Scrap Metal":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(4289);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("dreadspace", "Undead Space Marine", "Golden Spork of Justice");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Brimstone Scrap":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("starsinc", "Infernal Imp", req.name, undefined, { isTemp: false });
                    bot.wait.forPickup(req.name);
                    break;
                case "Star Fragment":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(4413);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("starsinc", "Living Star", "Living Star Defeated", 30, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Taker and Giver Stone":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAccept(4414);
                        Farm.battleUnderB("Bone Dust", 15);
                        Farm.bludrutBrawlBoss(undefined, 5);
                        Core.huntMonster("starsinc", "Living Star", "Living Star Essence", 100, { isTemp: false });
                        Core.ensureComplete(4414);

                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Prime's Respect":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(4415);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("starsinc", "Empowered Prime", "Empowered Primed Defeated", 10, {
                            isTemp: false,
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        Star.starSincQuests();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("starsinc", 678, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "30563",
            "Final's Base Armor",
            'Mode: [select] only\nShould the bot buy "Final\'s Base Armor" ?',
            false,
        ),
        option.bool(
            "30565",
            "Final's Skull Helm",
            'Mode: [select] only\nShould the bot buy "Final\'s Skull Helm" ?',
            false,
        ),
        option.bool("30564", "Final's Armor", 'Mode: [select] only\nShould the bot buy "Final\'s Armor" ?', false),
        option.bool(
            "30566",
            "Final's Horned Skull",
            'Mode: [select] only\nShould the bot buy "Final\'s Horned Skull" ?',
            false,
        ),
        option.bool("30466", "Final's Blade", 'Mode: [select] only\nShould the bot buy "Final\'s Blade" ?', false),
        option.bool(
            "30637",
            "Galactic Blade of Stars",
            'Mode: [select] only\nShould the bot buy "Galactic Blade of Stars" ?',
            false,
        ),
        option.bool(
            "30649",
            "Prime's Exo Wings",
            'Mode: [select] only\nShould the bot buy "Prime\'s Exo Wings" ?',
            false,
        ),
        option.bool(
            "30470",
            "Prime's Legendary Wings",
            'Mode: [select] only\nShould the bot buy "Prime\'s Legendary Wings" ?',
            false,
        ),
        option.bool("30656", "Prime Dominus", 'Mode: [select] only\nShould the bot buy "Prime Dominus" ?', false),
        option.bool(
            "30657",
            "Legendary Prime Dominus",
            'Mode: [select] only\nShould the bot buy "Legendary Prime Dominus" ?',
            false,
        ),
        option.bool(
            "30658",
            "Legendary Prime Dominus Visor",
            'Mode: [select] only\nShould the bot buy "Legendary Prime Dominus Visor" ?',
            false,
        ),
        option.bool(
            "30659",
            "Prime Dominus Visor",
            'Mode: [select] only\nShould the bot buy "Prime Dominus Visor" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: StarsincMerge.select,
});

export default function main(): void {
    const script = new StarsincMerge();
    Core.bankingBlackList.push(
        "Star Scrap",
        "Brimstone Scrap",
        "Star Fragment",
        "Taker and Giver Stone",
        "Prime's Respect",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
