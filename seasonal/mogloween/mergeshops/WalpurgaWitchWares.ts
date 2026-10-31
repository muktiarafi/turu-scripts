/*
name: Walpurga Witch Wares Merge
description: Farms the Walpurga Witch Wares Merge [2780] in /birgittamogloween.
tags: birgittamogloween, merge, walpurga, witch, wares, merge
*/
// Port of Scripts/Seasonal/Mogloween/MergeShops/WalpurgaWitchWares.cs.

import { bot, defineScriptOptions, type Monster, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreMogloween } from "../CoreMogloween";

const Adv = new CoreAdvanced();
const Mog = new CoreMogloween();

export class WalpurgaWitchWares {
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
            const quant = Adv.externalQuant;
            if (req == null) {
                return;
            }

            // Declared in the "Hollyhock Brew" case and used in a later one: C# cases share the
            // switch's scope.
            let ensis: Monster | null;
            let grigor: Monster | null;
            switch (req.name) {
                case "Gothic Guest Hair":

                case "Gothic Guest Locks":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("birgittamogloween", "ShadowSlayer", req.name, quant, { isTemp: req.temp });
                    break;
                case "Hollyhock Brew": {
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(Core.isMember ? 10907 : 10906);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        if (bot.map.name !== "birgittamogloween") {
                            Core.join("birgittamogloween");
                        }

                        if (bot.player.cell !== "r6") {
                            Core.jump("r6", "Left");
                        }

                        ensis =
                            bot.monsters.currentAvailableMonsters?.find(
                                (m) => (m?.hp > 0 && m?.state > 0) === true && m.mapId === 16,
                            ) ?? null;
                        grigor =
                            bot.monsters.currentAvailableMonsters?.find(
                                (m) => (m?.hp > 0 && m?.state > 0) === true && m.mapId === 17,
                            ) ?? null;

                        if (bot.tempInv.contains("Cor Mortis Cosage") && ensis != null) {
                            bot.combat.attack(16);
                        } else if (bot.tempInv.contains("Grigor's Silver Tooth") && grigor != null) {
                            bot.combat.attack(17);
                        } else if (ensis != null) {
                            bot.combat.attack(16);
                        } else if (grigor != null) {
                            bot.combat.attack(17);
                        }
                        bot.sleep(200);
                        bot.wait.forQuestComplete(Core.isMember ? 10907 : 10906);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                }
                case "Owl's Dark Guise":

                case "Roosting Owl":

                case "Rufous Wisdom Staff":

                case "Stikini Witch Visage":

                case "Strikini Witch Morph":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        if (bot.map.name !== "birgittamogloween") {
                            Core.join("birgittamogloween");
                        }

                        if (bot.player.cell !== "r6") {
                            Core.jump("r6", "Left");
                        }

                        ensis =
                            bot.monsters.currentAvailableMonsters?.find(
                                (m) => (m?.hp > 0 && m?.state > 0) === true && m.mapId === 16,
                            ) ?? null;
                        grigor =
                            bot.monsters.currentAvailableMonsters?.find(
                                (m) => (m?.hp > 0 && m?.state > 0) === true && m.mapId === 17,
                            ) ?? null;

                        if (ensis != null) {
                            bot.combat.attack(16);
                        } else if (grigor != null) {
                            bot.combat.attack(17);
                        }

                        bot.sleep(200);
                    }
                    break;
                case "Poltergeistcorn Snack":

                case "Poltergeistcorn Snacks":

                case "Sinema Snack":

                case "Sinema Snacks":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("birgittamogloween", "Nazarene Artist", req.name, quant, { isTemp: req.temp });
                    break;
                case "Tiny Pink Princess Cupcake":

                case "Tiny Pink Princess Cupcakes":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("birgittamogloween", "Vampiric Guest", req.name, quant, { isTemp: req.temp });
                    break;
                case "Upsizer":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("birgittamogloween", "Pumpkin Pixie", req.name, quant, { isTemp: req.temp });
                    break;
                default: {
                    const shouldStop = !Adv.matsOnly || !this.dontStopMissingIng;
                    Core.logger(`The bot hasn't been taught how to get ${req.name}.`, undefined, {
                        messageBox: shouldStop,
                        stopBot: shouldStop,
                    });
                    break;
                }
            }
        };
        Mog.birgittaMogloween();
        Adv.startBuyAllMerge("birgittamogloween", 2780, findIngredients, buyOnlyThis, { buyMode });
    }

    static readonly select = [
        option.bool(
            "104360",
            "Spooky Sleepover PJs",
            'Mode: [select] only\nShould the bot buy "Spooky Sleepover PJs" ?',
            false,
        ),
        option.bool(
            "103697",
            "Grande Owl Witch",
            'Mode: [select] only\nShould the bot buy "Grande Owl Witch" ?',
            false,
        ),
        option.bool("104365", "Cineghouls", 'Mode: [select] only\nShould the bot buy "Cineghouls" ?', false),
        option.bool(
            "104367",
            "Poltergeistcorn Buckets",
            'Mode: [select] only\nShould the bot buy "Poltergeistcorn Buckets" ?',
            false,
        ),
        option.bool(
            "104369",
            "Double Sinema Popcorn",
            'Mode: [select] only\nShould the bot buy "Double Sinema Popcorn" ?',
            false,
        ),
        option.bool(
            "104379",
            "Pink Princess Cupcakes",
            'Mode: [select] only\nShould the bot buy "Pink Princess Cupcakes" ?',
            false,
        ),
        option.bool(
            "103713",
            "Owl's Earthly Guise",
            'Mode: [select] only\nShould the bot buy "Owl\'s Earthly Guise" ?',
            false,
        ),
        option.bool(
            "103714",
            "Owl's Mystic Guise",
            'Mode: [select] only\nShould the bot buy "Owl\'s Mystic Guise" ?',
            false,
        ),
        option.bool(
            "103698",
            "Stikini Witch Hat",
            'Mode: [select] only\nShould the bot buy "Stikini Witch Hat" ?',
            false,
        ),
        option.bool(
            "103699",
            "Stikini Witch Cap",
            'Mode: [select] only\nShould the bot buy "Stikini Witch Cap" ?',
            false,
        ),
        option.bool(
            "103704",
            "Strikini Familiar Morph",
            'Mode: [select] only\nShould the bot buy "Strikini Familiar Morph" ?',
            false,
        ),
        option.bool(
            "103705",
            "Strikini Familiar Visage",
            'Mode: [select] only\nShould the bot buy "Strikini Familiar Visage" ?',
            false,
        ),
        option.bool(
            "104361",
            "Gothic Guest Visage",
            'Mode: [select] only\nShould the bot buy "Gothic Guest Visage" ?',
            false,
        ),
        option.bool(
            "104363",
            "Gothic Guest Morph",
            'Mode: [select] only\nShould the bot buy "Gothic Guest Morph" ?',
            false,
        ),
        option.bool(
            "104366",
            "Poltergeistcorn Bucket",
            'Mode: [select] only\nShould the bot buy "Poltergeistcorn Bucket" ?',
            false,
        ),
        option.bool(
            "104378",
            "Pink Princess Cupcake",
            'Mode: [select] only\nShould the bot buy "Pink Princess Cupcake" ?',
            false,
        ),
        option.bool("104368", "Sinema Popcorn", 'Mode: [select] only\nShould the bot buy "Sinema Popcorn" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: WalpurgaWitchWares.select,
});

export default function main(): void {
    const script = new WalpurgaWitchWares();
    Core.bankingBlackList.push(
        "Gothic Guest Hair",
        "Gothic Guest Locks",
        "Hollyhock Brew",
        "Owl's Dark Guise",
        "Poltergeistcorn Snack",
        "Poltergeistcorn Snacks",
        "Roosting Owl",
        "Rufous Wisdom Staff",
        "Sinema Snack",
        "Sinema Snacks",
        "Stikini Witch Visage",
        "Strikini Witch Morph",
        "Tiny Pink Princess Cupcake",
        "Tiny Pink Princess Cupcakes",
        "Upsizer",
    );
    Core.setOptions();
    script.buyAllMerge();
    Core.setOptions(false);
}
