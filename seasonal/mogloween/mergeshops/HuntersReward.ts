/*
name: Hunters Reward Merge
description: Farms the Hunters Reward Merge [2781] in /shadowslayerwar.
tags: shadowslayerwar, merge, hunters, reward, merge
*/
// Port of Scripts/Seasonal/Mogloween/MergeShops/HuntersReward.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreMogloween } from "../CoreMogloween";

const Adv = new CoreAdvanced();
const coreMogloween = new CoreMogloween();

export class HuntersReward {
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
            const quant = Adv.externalQuant;
            if (req == null) {
                return;
            }

            switch (req.name) {
                case "Darkovian Nobility Hair":

                case "Darkovian Nobility Locks":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("shadowslayerwar", "Enthralled Hunter", req.name, quant, { isTemp: req.temp });
                    break;
                case "Darkovian Pup Hair":

                case "Darkovian Pup Locks":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("shadowslayerwar", "Darkovia Hunter", req.name, quant, { isTemp: req.temp });
                    break;
                case "Silver Stake":
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(10908, 10909);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.killMonster("shadowslayerwar", "r11", "Left", "*");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
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
        coreMogloween.birgittaMogloween();
        coreMogloween.shadowSlayerWar();
        Adv.startBuyAllMerge("shadowslayerwar", 2781, findIngredients, buyOnlyThis, { buyMode });
    }

    static readonly select = [
        option.bool(
            "101382",
            "Neo ShadowSlayer",
            'Mode: [select] only\nShould the bot buy "Neo ShadowSlayer" ?',
            false,
        ),
        option.bool(
            "104615",
            "Sanguine Endura ShadowSlayer",
            'Mode: [select] only\nShould the bot buy "Sanguine Endura ShadowSlayer" ?',
            false,
        ),
        option.bool(
            "101385",
            "ShadowSlayer's Duster",
            'Mode: [select] only\nShould the bot buy "ShadowSlayer\'s Duster" ?',
            false,
        ),
        option.bool(
            "101386",
            "Shadowslayer's Trench Coat",
            'Mode: [select] only\nShould the bot buy "Shadowslayer\'s Trench Coat" ?',
            false,
        ),
        option.bool(
            "104618",
            "Back-up Painkiller Mk.II",
            'Mode: [select] only\nShould the bot buy "Back-up Painkiller Mk.II" ?',
            false,
        ),
        option.bool(
            "104620",
            "Dual Moonspring Katana",
            'Mode: [select] only\nShould the bot buy "Dual Moonspring Katana" ?',
            false,
        ),
        option.bool(
            "104623",
            "Thorn Catharsis Chainblades",
            'Mode: [select] only\nShould the bot buy "Thorn Catharsis Chainblades" ?',
            false,
        ),
        option.bool(
            "103351",
            "Darkovian Nobility Morph",
            'Mode: [select] only\nShould the bot buy "Darkovian Nobility Morph" ?',
            false,
        ),
        option.bool(
            "103352",
            "Darkovian Nobility Visage",
            'Mode: [select] only\nShould the bot buy "Darkovian Nobility Visage" ?',
            false,
        ),
        option.bool(
            "103356",
            "Darkovian Pup Morph",
            'Mode: [select] only\nShould the bot buy "Darkovian Pup Morph" ?',
            false,
        ),
        option.bool(
            "103358",
            "Darkovian Pup Visage",
            'Mode: [select] only\nShould the bot buy "Darkovian Pup Visage" ?',
            false,
        ),
        option.bool(
            "104616",
            "Sanguine Endura Hat",
            'Mode: [select] only\nShould the bot buy "Sanguine Endura Hat" ?',
            false,
        ),
        option.bool(
            "104617",
            "Sanguine Endura Cap",
            'Mode: [select] only\nShould the bot buy "Sanguine Endura Cap" ?',
            false,
        ),
        option.bool(
            "101383",
            "Contemporary Hunter's Fedora",
            'Mode: [select] only\nShould the bot buy "Contemporary Hunter\'s Fedora" ?',
            false,
        ),
        option.bool(
            "101384",
            "Contemporary Hunter's Cap",
            'Mode: [select] only\nShould the bot buy "Contemporary Hunter\'s Cap" ?',
            false,
        ),
        option.bool(
            "104621",
            "BloodRain Royale",
            'Mode: [select] only\nShould the bot buy "BloodRain Royale" ?',
            false,
        ),
        option.bool(
            "104619",
            "Moonspring Katana",
            'Mode: [select] only\nShould the bot buy "Moonspring Katana" ?',
            false,
        ),
        option.bool(
            "104622",
            "Thorn Catharsis Chainblade",
            'Mode: [select] only\nShould the bot buy "Thorn Catharsis Chainblade" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: HuntersReward.select,
});

export default function main(): void {
    const script = new HuntersReward();
    Core.bankingBlackList.push(
        "Darkovian Nobility Hair",
        "Darkovian Nobility Locks",
        "Darkovian Pup Hair",
        "Darkovian Pup Locks",
        "Silver Stake",
    );
    Core.setOptions();
    script.buyAllMerge();
    Core.setOptions(false);
}
