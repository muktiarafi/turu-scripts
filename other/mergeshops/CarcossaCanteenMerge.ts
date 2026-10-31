/*
name: Carcossa Canteen Merge
description: This bot will farm the items belonging to the selected mode for the Carcossa Canteen Merge [2624] in /forgealbedo
tags: carcossa, canteen, merge, forgealbedo, knight, noelle, squire, morph, winged, capella, shrine, scorched, warlic, warlics, ponytail, bob
*/
// Port of Scripts/Other/MergeShops/CarcossaCanteenMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { ForgeMalenoMerge } from "./ForgeMalenoMerge";
import { CoreAOR } from "../../story/ageofruin/CoreAOR";

const Adv = new CoreAdvanced();
const AOR = new CoreAOR();
const FMM = new ForgeMalenoMerge();

export class CarcossaCanteenMerge {
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
                case "White Flame of Albedo":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.ensureAccept(10423);
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("forgealbedo", "Defensive Turret", "Corrosive Sublimate", 9);
                        Core.huntMonster("forgealbedo", "Defense Droid", "Calx", 6);
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("forgealbedo", "Flame of Albedo", "Albedo Flicker");
                        Core.ensureComplete(10423);
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Noelle Warden Morph":

                case "Noelle Warden Visage":

                case "Cape of the Noelle Knight":

                case "Noelle Warden Bob":

                case "Noelle Warden Ponytail":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.huntMonster("thelimacity", "Noelle Knight", req.name, quant, { isTemp: req.temp, log: false });
                    break;
                case "Stars of Capella":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    Core.huntMonster("forgealbedo", "Flame of Albedo", req.name, quant, {
                        isTemp: req.temp,
                        log: false,
                    });
                    break;
                case "Yew Ember":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("warwickforest", "Rubedo Elemental", req.name, quant, { isTemp: false });
                    break;
                case "Mystic Topaz":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.huntMonster("thelimacity", "Noelle Knight", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Blade of Maleno":
                    FMM.buyAllMerge(req.name);
                    break;
                case "Aiwass Diamond":
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(Core.isMember ? 10387 : 10385);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("sanctuaryaiwass", "r9", "Top", "*", "Sal Alembroth", 1, { isTemp: false });
                        Core.killMonster("sanctuaryaiwass", "r9", "Top", "*", "Milk of Sulfur", 1, { isTemp: false });
                        Core.huntMonster("sanctuaryaiwass", "Anima Animus Aiwass", "Aeon Dream", 1, { isTemp: false });
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        AOR.forgeAlbedo();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("forgealbedo", 2624, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("94434", "Knight of Noelle", 'Mode: [select] only\nShould the bot buy "Knight of Noelle" ?', false),
        option.bool("94435", "Squire of Noelle", 'Mode: [select] only\nShould the bot buy "Squire of Noelle" ?', false),
        option.bool("95134", "Scorched Warlic", 'Mode: [select] only\nShould the bot buy "Scorched Warlic" ?', false),
        option.bool("100877", "Flame of Albedo", 'Mode: [select] only\nShould the bot buy "Flame of Albedo" ?', false),
        option.bool("94445", "Cape of Capella", 'Mode: [select] only\nShould the bot buy "Cape of Capella" ?', false),
        option.bool("100879", "Calx Dust Cape", 'Mode: [select] only\nShould the bot buy "Calx Dust Cape" ?', false),
        option.bool(
            "100878",
            "Flame of Albedo Hood",
            'Mode: [select] only\nShould the bot buy "Flame of Albedo Hood" ?',
            false,
        ),
        option.bool(
            "95980",
            "Knight of Noelle Ponytail",
            'Mode: [select] only\nShould the bot buy "Knight of Noelle Ponytail" ?',
            false,
        ),
        option.bool(
            "95981",
            "Knight of Noelle Bob",
            'Mode: [select] only\nShould the bot buy "Knight of Noelle Bob" ?',
            false,
        ),
        option.bool(
            "95982",
            "Winged Noelle Ponytail",
            'Mode: [select] only\nShould the bot buy "Winged Noelle Ponytail" ?',
            false,
        ),
        option.bool(
            "95983",
            "Winged Noelle Bob",
            'Mode: [select] only\nShould the bot buy "Winged Noelle Bob" ?',
            false,
        ),
        option.bool(
            "95135",
            "Scorched Warlic Morph",
            'Mode: [select] only\nShould the bot buy "Scorched Warlic Morph" ?',
            false,
        ),
        option.bool(
            "95136",
            "Scorched Warlic Hair",
            'Mode: [select] only\nShould the bot buy "Scorched Warlic Hair" ?',
            false,
        ),
        option.bool(
            "94436",
            "Knight of Noelle Morph",
            'Mode: [select] only\nShould the bot buy "Knight of Noelle Morph" ?',
            false,
        ),
        option.bool(
            "94437",
            "Knight of Noelle Visage",
            'Mode: [select] only\nShould the bot buy "Knight of Noelle Visage" ?',
            false,
        ),
        option.bool(
            "94440",
            "Winged Noelle Morph",
            'Mode: [select] only\nShould the bot buy "Winged Noelle Morph" ?',
            false,
        ),
        option.bool(
            "94441",
            "Winged Noelle Visage",
            'Mode: [select] only\nShould the bot buy "Winged Noelle Visage" ?',
            false,
        ),
        option.bool(
            "94448",
            "Shrine of Capella",
            'Mode: [select] only\nShould the bot buy "Shrine of Capella" ?',
            false,
        ),
        option.bool(
            "95138",
            "Warlic's Scorched Staff",
            'Mode: [select] only\nShould the bot buy "Warlic\'s Scorched Staff" ?',
            false,
        ),
        option.bool("100880", "Blade of Albedo", 'Mode: [select] only\nShould the bot buy "Blade of Albedo" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: CarcossaCanteenMerge.select,
});

export default function main(): void {
    const script = new CarcossaCanteenMerge();
    Core.bankingBlackList.push(
        "Yew Ember",
        "Mystic Topaz",
        "White Flame of Albedo",
        "Noelle Warden Morph",
        "Noelle Warden Visage",
        "Cape of the Noelle Knight",
        "Stars of Capella",
        "Noelle Warden Bob",
        "Noelle Warden Ponytail",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
