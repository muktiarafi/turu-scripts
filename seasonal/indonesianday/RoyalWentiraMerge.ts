/*
name: Royal Wentira Merge
description: This bot will farm the items belonging to the selected mode for the Royal Wentira Merge [2318] in /wentira
tags: royal, wentira, merge, wentira, pesugihan, boar, crown, maned, morph, ritual, instruments, kabasaran, master, headdress, adornment, shielded, beloved, blessing, garb, udeng, golden, bungan, mitir, blessed, beloveds, kris, knives, wiracana, fans
*/
// Port of Scripts/Seasonal/IndonesianDay/RoyalWentiraMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { Wentira } from "./Wentira";

const Adv = new CoreAdvanced();
const Wen = new Wentira();

export class RoyalWentiraMerge {
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
                case "Wentiran Seal":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(9342);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("wentira", "Pesugihan Boar", "Boar Leather", 6, { log: false });
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("wentira", "Kabasaran Waranei", undefined, undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Gold Nugget":

                case "Broken Tusk":

                case "Beloved Blessing Hair":

                case "Uncut Ruby":

                case "Beloved Blessing Locks":

                case "Blessed Beloved's Kris Knife":

                case "Wiracana Fan":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("wentira", "Pesugihan Boar", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Ancient Bone":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("wentira", "Kabasaran Waranei", req.name, quant, { isTemp: false, log: false });
                    break;
            }
        };
        Wen.storyline();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("wentira", 2318, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("79077", "Pesugihan Boar", 'Mode: [select] only\nShould the bot buy "Pesugihan Boar" ?', false),
        option.bool(
            "79079",
            "Pesugihan Boar Crown",
            'Mode: [select] only\nShould the bot buy "Pesugihan Boar Crown" ?',
            false,
        ),
        option.bool(
            "79081",
            "Royal Pesugihan Boar",
            'Mode: [select] only\nShould the bot buy "Royal Pesugihan Boar" ?',
            false,
        ),
        option.bool(
            "79082",
            "Maned Pesugihan Boar Morph",
            'Mode: [select] only\nShould the bot buy "Maned Pesugihan Boar Morph" ?',
            false,
        ),
        option.bool(
            "79083",
            "Maned Pesugihan Boar Visage",
            'Mode: [select] only\nShould the bot buy "Maned Pesugihan Boar Visage" ?',
            false,
        ),
        option.bool(
            "79084",
            "Royal Pesugihan Boar Morph",
            'Mode: [select] only\nShould the bot buy "Royal Pesugihan Boar Morph" ?',
            false,
        ),
        option.bool(
            "79085",
            "Royal Pesugihan Boar Visage",
            'Mode: [select] only\nShould the bot buy "Royal Pesugihan Boar Visage" ?',
            false,
        ),
        option.bool(
            "79094",
            "Pesugihan Ritual Instruments",
            'Mode: [select] only\nShould the bot buy "Pesugihan Ritual Instruments" ?',
            false,
        ),
        option.bool("79117", "Kabasaran", 'Mode: [select] only\nShould the bot buy "Kabasaran" ?', false),
        option.bool(
            "79120",
            "Master Kabasaran Headdress",
            'Mode: [select] only\nShould the bot buy "Master Kabasaran Headdress" ?',
            false,
        ),
        option.bool(
            "79121",
            "Master Kabasaran Adornment",
            'Mode: [select] only\nShould the bot buy "Master Kabasaran Adornment" ?',
            false,
        ),
        option.bool(
            "79133",
            "Kabasaran Polearm",
            'Mode: [select] only\nShould the bot buy "Kabasaran Polearm" ?',
            false,
        ),
        option.bool(
            "79136",
            "Kabasaran Shielded Sword",
            'Mode: [select] only\nShould the bot buy "Kabasaran Shielded Sword" ?',
            false,
        ),
        option.bool(
            "79137",
            "Kabasaran Shielded Polearm",
            'Mode: [select] only\nShould the bot buy "Kabasaran Shielded Polearm" ?',
            false,
        ),
        option.bool(
            "87520",
            "Beloved Blessing Garb",
            'Mode: [select] only\nShould the bot buy "Beloved Blessing Garb" ?',
            false,
        ),
        option.bool(
            "87523",
            "Beloved Blessing Udeng",
            'Mode: [select] only\nShould the bot buy "Beloved Blessing Udeng" ?',
            false,
        ),
        option.bool(
            "87524",
            "Beloved Blessing Adornment",
            'Mode: [select] only\nShould the bot buy "Beloved Blessing Adornment" ?',
            false,
        ),
        option.bool(
            "87526",
            "Golden Bungan Mitir",
            'Mode: [select] only\nShould the bot buy "Golden Bungan Mitir" ?',
            false,
        ),
        option.bool(
            "87528",
            "Blessed Beloved's Kris Knives",
            'Mode: [select] only\nShould the bot buy "Blessed Beloved\'s Kris Knives" ?',
            false,
        ),
        option.bool("87530", "Wiracana Fans", 'Mode: [select] only\nShould the bot buy "Wiracana Fans" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: RoyalWentiraMerge.select,
});

export default function main(): void {
    const script = new RoyalWentiraMerge();
    Core.bankingBlackList.push("Wentiran Seal", "Broken Tusk", "Gold Nugget", "Ancient Bone");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
