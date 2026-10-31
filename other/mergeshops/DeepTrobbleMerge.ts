/*
name: Deep Trobble Merge
description: This bot will farm the items belonging to the selected mode for the Deep Trobble Merge [2338] in /pirates
tags: deep, trobble, merge, pirates, silver, sun, bandana, pistol, cutlass, enchanted, plunger, omocha, tsuika, no, higure
*/
// Port of Scripts/Other/MergeShops/DeepTrobbleMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreDarkon } from "../../darkon/CoreDarkon";

const Adv = new CoreAdvanced();
const CDarkon = new CoreDarkon();

export class DeepTrobbleMerge {
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
                case "Bounty Hunter Dubloon":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    // Very Trobblesome 9394
                    Core.registerQuests(9394);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonsterMapID("dreadspace", 48, "Trobble Captured");
                    }
                    bot.wait.forPickup(req.name);
                    Core.cancelRegisteredQuests();
                    break;
                case "Deep Trobble Plunger":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    // Pressurized Weapon 9157
                    while (!bot.shouldExit && !Core.checkInventory(req.id)) {
                        Core.ensureAccept(9157);
                        Core.huntMonster("brightoak", "Bright Treeant", "Chunk of Rubber", 10);
                        Core.huntMonster("marsh", "Marsh Tree", "Broken Sticks", 8);
                        Adv.buyItem("yulgar", 16, 16946, undefined, 10477);
                        Core.ensureComplete(9157);
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Darkon's Receipt":
                    CDarkon.farmReceipt(quant);
                    break;
                case "La's Gratitude":
                    CDarkon.lasGratitude(quant);
                    break;
                case "Astravian Medal":
                    CDarkon.astravianMedal(quant);
                    break;
                case "A Melody":
                    CDarkon.aMelody(quant);
                    break;
                case "Suki's Prestige":
                    CDarkon.sukisPrestiege(quant);
                    break;
                case "Ancient Remnant":
                    CDarkon.ancientRemnant(quant);
                    break;
                case "Mourning Flower":
                    CDarkon.wheelofFortune(quant, 0);
                    break;
                case "Unfinished Musical Score":
                    CDarkon.unfinishedMusicalScore(quant);
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("pirates", 2338, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "25531",
            "Silver Sun Bandana",
            'Mode: [select] only\nShould the bot buy "Silver Sun Bandana" ?',
            false,
        ),
        option.bool(
            "25588",
            "Silver Sun Pistol",
            'Mode: [select] only\nShould the bot buy "Silver Sun Pistol" ?',
            false,
        ),
        option.bool(
            "25088",
            "Silver Sun Cutlass",
            'Mode: [select] only\nShould the bot buy "Silver Sun Cutlass" ?',
            false,
        ),
        option.bool(
            "61875",
            "Enchanted Trobble Plunger",
            'Mode: [select] only\nShould the bot buy "Enchanted Trobble Plunger" ?',
            false,
        ),
        option.bool("71897", "Omocha", 'Mode: [select] only\nShould the bot buy "Omocha" ?', false),
        option.bool("71898", "Tsuika no Omocha", 'Mode: [select] only\nShould the bot buy "Tsuika no Omocha" ?', false),
        option.bool("79817", "Higure", 'Mode: [select] only\nShould the bot buy "Higure" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DeepTrobbleMerge.select,
});

export default function main(): void {
    const script = new DeepTrobbleMerge();
    Core.bankingBlackList.push(
        "Bounty Hunter Dubloon",
        "Deep Trobble Plunger",
        "Darkon's Receipt",
        "La's Gratitude",
        "Astravian Medal",
        "A Melody",
        "Suki's Prestige",
        "Ancient Remnant",
        "Mourning Flower",
        "Unfinished Musical Score",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
