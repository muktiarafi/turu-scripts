/*
name: Queens Battle Merge
description: This bot will farm the items belonging to the selected mode for the Queens Battle Merge [2061] in /queenbattle
tags: queens, battle, merge, queenbattle, st, chaoslord, prime, chaoslords, tattered, cloak, twisted, inversion, good, ponytail, morph, evil, rd, primes, monstrous, control, th, runed, laser, katana, katanas, ruined, wings, twintails
*/
// Port of Scripts/Other/MergeShops/QueensBattleMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { QueenBattle } from "../../story/queenofmonsters/extra/QueenBattle";

const Adv = new CoreAdvanced();
const QB = new QueenBattle();

export class QueensBattleMerge {
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
                case "Severed Tentacle":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(8362);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster(
                            "queenbattle",
                            "Proto Chaos Champion",
                            "Proto Chaos Champion Redefeated",
                            undefined,
                            { log: false },
                        );
                        Core.huntMonster("queenbattle", "Queen of Monsters", undefined, undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "1st Hero of Balance":

                case "1st Hero of Balance Hood":

                case "1st Hero of Balance Cloak":

                case "Good Hero of Balance":

                case "Good Hero of Balance Morph":

                case "Evil Hero of Balance":

                case "Evil Hero of Balance Morph":

                case "3rd Hero of Balance":

                case "3rd Hero of Balance Locks":

                case "3rd Hero of Balance Scarf":

                case "3rd Hero of Balance Daggers":

                case "3rd Hero of Balance Dirk":

                case "4th Hero of Balance":

                case "4th Hero of Balance Cloak":

                case "5th Hero of Balance":

                case "5th Hero of Balance Morph":

                case "5th Hero of Balance Wings":

                case "7th Hero of Balance":

                case "7th Hero of Balance Morph":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("queenbattle", "Queen of Monsters", req.name, quant, {
                        isTemp: false,
                        log: false,
                    });
                    break;
            }
        };
        QB.storyLine();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("queenbattle", 2061, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "64802",
            "1st ChaosLord Prime",
            'Mode: [select] only\nShould the bot buy "1st ChaosLord Prime" ?',
            false,
        ),
        option.bool(
            "64803",
            "1st ChaosLord Prime Hood",
            'Mode: [select] only\nShould the bot buy "1st ChaosLord Prime Hood" ?',
            false,
        ),
        option.bool(
            "64804",
            "1st ChaosLord's Tattered Cloak",
            'Mode: [select] only\nShould the bot buy "1st ChaosLord\'s Tattered Cloak" ?',
            false,
        ),
        option.bool(
            "64805",
            "Twisted Staff of Inversion",
            'Mode: [select] only\nShould the bot buy "Twisted Staff of Inversion" ?',
            false,
        ),
        option.bool(
            "64806",
            "Good ChaosLord Prime",
            'Mode: [select] only\nShould the bot buy "Good ChaosLord Prime" ?',
            false,
        ),
        option.bool(
            "64807",
            "Good ChaosLord's Ponytail",
            'Mode: [select] only\nShould the bot buy "Good ChaosLord\'s Ponytail" ?',
            false,
        ),
        option.bool(
            "64808",
            "Good ChaosLord's Morph",
            'Mode: [select] only\nShould the bot buy "Good ChaosLord\'s Morph" ?',
            false,
        ),
        option.bool(
            "64809",
            "Evil ChaosLord Prime",
            'Mode: [select] only\nShould the bot buy "Evil ChaosLord Prime" ?',
            false,
        ),
        option.bool(
            "64810",
            "Evil ChaosLord's Locks",
            'Mode: [select] only\nShould the bot buy "Evil ChaosLord\'s Locks" ?',
            false,
        ),
        option.bool(
            "64811",
            "Evil ChaosLord's Morph",
            'Mode: [select] only\nShould the bot buy "Evil ChaosLord\'s Morph" ?',
            false,
        ),
        option.bool(
            "64812",
            "3rd ChaosLord Prime",
            'Mode: [select] only\nShould the bot buy "3rd ChaosLord Prime" ?',
            false,
        ),
        option.bool(
            "64813",
            "3rd ChaosLord Prime's Locks",
            'Mode: [select] only\nShould the bot buy "3rd ChaosLord Prime\'s Locks" ?',
            false,
        ),
        option.bool(
            "64814",
            "3rd ChaosLord's Tattered Cloak",
            'Mode: [select] only\nShould the bot buy "3rd ChaosLord\'s Tattered Cloak" ?',
            false,
        ),
        option.bool(
            "64815",
            "Monstrous Blade of Control",
            'Mode: [select] only\nShould the bot buy "Monstrous Blade of Control" ?',
            false,
        ),
        option.bool(
            "64816",
            "4th ChaosLord Prime",
            'Mode: [select] only\nShould the bot buy "4th ChaosLord Prime" ?',
            false,
        ),
        option.bool(
            "64817",
            "4th ChaosLord Prime's Helmet",
            'Mode: [select] only\nShould the bot buy "4th ChaosLord Prime\'s Helmet" ?',
            false,
        ),
        option.bool(
            "64818",
            "4th ChaosLord's Runed Cloak",
            'Mode: [select] only\nShould the bot buy "4th ChaosLord\'s Runed Cloak" ?',
            false,
        ),
        option.bool(
            "64819",
            "4th ChaosLord's Laser Katana",
            'Mode: [select] only\nShould the bot buy "4th ChaosLord\'s Laser Katana" ?',
            false,
        ),
        option.bool(
            "64820",
            "4th ChaosLord's Dual Katanas",
            'Mode: [select] only\nShould the bot buy "4th ChaosLord\'s Dual Katanas" ?',
            false,
        ),
        option.bool(
            "64821",
            "5th ChaosLord Prime",
            'Mode: [select] only\nShould the bot buy "5th ChaosLord Prime" ?',
            false,
        ),
        option.bool(
            "64822",
            "5th ChaosLord's Morph",
            'Mode: [select] only\nShould the bot buy "5th ChaosLord\'s Morph" ?',
            false,
        ),
        option.bool(
            "64823",
            "5th ChaosLord's Ruined Wings",
            'Mode: [select] only\nShould the bot buy "5th ChaosLord\'s Ruined Wings" ?',
            false,
        ),
        option.bool(
            "64824",
            "6th ChaosLord Prime",
            'Mode: [select] only\nShould the bot buy "6th ChaosLord Prime" ?',
            false,
        ),
        option.bool(
            "64825",
            "6th ChaosLord's Twintails",
            'Mode: [select] only\nShould the bot buy "6th ChaosLord\'s Twintails" ?',
            false,
        ),
        option.bool(
            "64826",
            "7th ChaosLord Prime",
            'Mode: [select] only\nShould the bot buy "7th ChaosLord Prime" ?',
            false,
        ),
        option.bool(
            "64827",
            "7th ChaosLord's Morph",
            'Mode: [select] only\nShould the bot buy "7th ChaosLord\'s Morph" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: QueensBattleMerge.select,
});

export default function main(): void {
    const script = new QueensBattleMerge();
    Core.bankingBlackList.push(
        "Severed Tentacle",
        "1st Hero of Balance",
        "1st Hero of Balance Hood",
        "1st Hero of Balance Cloak",
        "Good Hero of Balance",
        "Good Hero of Balance Morph",
        "Evil Hero of Balance",
        "Evil Hero of Balance Morph",
        "3rd Hero of Balance",
        "3rd Hero of Balance Locks",
        "3rd Hero of Balance Scarf",
        "3rd Hero of Balance Daggers",
        "3rd Hero of Balance Dirk",
        "4th Hero of Balance",
        "4th Hero of Balance Cloak",
        "5th Hero of Balance",
        "5th Hero of Balance Morph",
        "5th Hero of Balance Wings",
        "7th Hero of Balance",
        "7th Hero of Balance Morph",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
