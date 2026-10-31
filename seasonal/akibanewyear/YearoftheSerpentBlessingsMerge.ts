/*
name: Year of the Serpent Blessings Merge
description: This bot will farm the items belonging to the selected mode for the Year of the Serpent Blessings Merge [2559] in /yokaihunt
tags: year, of, the, serpent, blessings, merge, yokaihunt, serpents, refinement, fans, fan, silver, qi, pao, favor, gold, rap, artist, urban, cap, morph, glasses, streetwear, royal
*/
// Port of Scripts/Seasonal/AkibaNewYear/YearoftheSerpentBlessingsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { YokaiHunt } from "./YokaiHunt";

const Adv = new CoreAdvanced();
const YH = new YokaiHunt();

export class YearoftheSerpentBlessingsMerge {
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
                case "Miko's Blessing":
                    Core.farmingLogger(req.name, quant);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonsterQuest(10059, ["shogunwar", "Shadow Samurai", ClassType.Farm]);
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Pearlescent Scale":
                    Core.farmingLogger(req.name, quant);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonsterQuest(10060, ["yokaihunt", "Zhenzhu Shé", ClassType.Solo]);
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Urban Serpent Cap + Glasses":

                case "Urban Serpent Hat + Glasses":

                case "Urban Serpent Locks + Glasses":

                case "Urban Serpent Hair + Glasses":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("yokaihunt", "Zhenzhu Shé", req.name, quant, { isTemp: req.temp, log: false });
                    break;
            }
        };
        YH.aiNoMiko2();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("yokaihunt", 2559, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "91791",
            "Serpent's Refinement Fans",
            'Mode: [select] only\nShould the bot buy "Serpent\'s Refinement Fans" ?',
            false,
        ),
        option.bool(
            "91790",
            "Serpent's Refinement Fan",
            'Mode: [select] only\nShould the bot buy "Serpent\'s Refinement Fan" ?',
            false,
        ),
        option.bool(
            "91789",
            "Silver Serpent Qi Pao",
            'Mode: [select] only\nShould the bot buy "Silver Serpent Qi Pao" ?',
            false,
        ),
        option.bool(
            "91788",
            "Serpent's Favor Fans",
            'Mode: [select] only\nShould the bot buy "Serpent\'s Favor Fans" ?',
            false,
        ),
        option.bool(
            "91787",
            "Serpent's Favor Fan",
            'Mode: [select] only\nShould the bot buy "Serpent\'s Favor Fan" ?',
            false,
        ),
        option.bool(
            "91786",
            "Gold Serpent Qi Pao",
            'Mode: [select] only\nShould the bot buy "Gold Serpent Qi Pao" ?',
            false,
        ),
        option.bool(
            "91738",
            "Serpent Rap Artist",
            'Mode: [select] only\nShould the bot buy "Serpent Rap Artist" ?',
            false,
        ),
        option.bool(
            "91724",
            "Urban Serpent Cap Visage",
            'Mode: [select] only\nShould the bot buy "Urban Serpent Cap Visage" ?',
            false,
        ),
        option.bool(
            "91723",
            "Urban Serpent Hat Morph",
            'Mode: [select] only\nShould the bot buy "Urban Serpent Hat Morph" ?',
            false,
        ),
        option.bool(
            "91722",
            "Urban Serpent Glasses Visage",
            'Mode: [select] only\nShould the bot buy "Urban Serpent Glasses Visage" ?',
            false,
        ),
        option.bool(
            "91721",
            "Urban Serpent Glasses Morph",
            'Mode: [select] only\nShould the bot buy "Urban Serpent Glasses Morph" ?',
            false,
        ),
        option.bool(
            "91716",
            "Urban Serpent Streetwear",
            'Mode: [select] only\nShould the bot buy "Urban Serpent Streetwear" ?',
            false,
        ),
        option.bool(
            "91715",
            "Urban Royal Streetwear",
            'Mode: [select] only\nShould the bot buy "Urban Royal Streetwear" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: YearoftheSerpentBlessingsMerge.select,
});

export default function main(): void {
    const script = new YearoftheSerpentBlessingsMerge();
    Core.bankingBlackList.push(
        "Miko's Blessing",
        "Pearlescent Scale",
        "Urban Serpent Cap + Glasses",
        "Urban Serpent Hat + Glasses",
        "Urban Serpent Locks + Glasses",
        "Urban Serpent Hair + Glasses",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
