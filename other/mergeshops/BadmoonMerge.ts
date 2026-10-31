/*
name: Badmoon Merge
description: This bot will farm the items belonging to the selected mode for the Badmoon Merge [2470] in /badmoon
tags: badmoon, merge, badmoon, twisted, hunter, darkovian, captains, masked, hunters, arm, arms, sanguine, dussack, dussacks, shadowslayer, adept, ponytail, chapeau, mendicant, buzzcut, sash, veil, golden, panacea, claymore, claymores, mendicants, last, resort, resorts, sol, intenso
*/
// Port of Scripts/Other/MergeShops/BadmoonMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { ShadowSlayerKMerge } from "./ShadowSlayerKMerge";
import { ShadowslayerSummoningRitual } from "../various/ShadowslayerSummoningRitual";
import { ShadowslayerSummoningRitual2 } from "../various/ShadowslayerSummoningRitual2";

const Adv = new CoreAdvanced();
const SSR = new ShadowslayerSummoningRitual();
const ssr2 = new ShadowslayerSummoningRitual2();
const SSKM = new ShadowSlayerKMerge();

export class BadmoonMerge {
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
                case "Lunate Sigil":
                    ssr2.lunateSigil(quant);
                    break;
                case "Darkovia Hunter's Cowl":

                case "Iron Dussack":
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.killMonster("badmoon", "r5", "left", "hunter", req.name, quant, { isTemp: req.temp });
                    break;
                case "Darkovian Hunter":
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    bot.quests.updateQuest(9844);
                    Core.huntMonster("badmoon", "Twisted Hunter", req.name, quant, { isTemp: req.temp });
                    break;
                case "ShadowSlayer's Apprentice":

                case "Antiquated Shadow Hair":

                case "Antiquated Shadow Locks":

                case "Antiquated Shadow Hat":

                case "Antiquated Shadow Hat + Locks":
                    SSKM.buyAllMerge(req.name);
                    break;
                case "Zealous Claymore":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("techdungeon", "Kalron the Cryptborg", req.name, quant, {
                        isTemp: req.temp,
                        log: false,
                    });
                    break;
                case "Zealous Censer":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("stonewood", "BioKnight", req.name, quant, { isTemp: req.temp, log: false });
                    break;
                case "Shadowslayer Relic Sword":
                    Core.farmingLogger(req.name, quant);
                    SSR.getAll(undefined, req.name);
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("badmoon", 2470, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("87583", "Twisted Hunter", 'Mode: [select] only\nShould the bot buy "Twisted Hunter" ?', false),
        option.bool(
            "87586",
            "Darkovian Hunter Captain's Hat",
            'Mode: [select] only\nShould the bot buy "Darkovian Hunter Captain\'s Hat" ?',
            false,
        ),
        option.bool(
            "87585",
            "Darkovian Hunter Captain's Masked Hat",
            'Mode: [select] only\nShould the bot buy "Darkovian Hunter Captain\'s Masked Hat" ?',
            false,
        ),
        option.bool(
            "87590",
            "Twisted Hunter's Arm",
            'Mode: [select] only\nShould the bot buy "Twisted Hunter\'s Arm" ?',
            false,
        ),
        option.bool(
            "87591",
            "Twisted Hunter's Arms",
            'Mode: [select] only\nShould the bot buy "Twisted Hunter\'s Arms" ?',
            false,
        ),
        option.bool("87588", "Sanguine Dussack", 'Mode: [select] only\nShould the bot buy "Sanguine Dussack" ?', false),
        option.bool(
            "87589",
            "Sanguine Dussacks",
            'Mode: [select] only\nShould the bot buy "Sanguine Dussacks" ?',
            false,
        ),
        option.bool(
            "87783",
            "ShadowSlayer Adept",
            'Mode: [select] only\nShould the bot buy "ShadowSlayer Adept" ?',
            false,
        ),
        option.bool(
            "87784",
            "ShadowSlayer Adept Hair",
            'Mode: [select] only\nShould the bot buy "ShadowSlayer Adept Hair" ?',
            false,
        ),
        option.bool(
            "87785",
            "ShadowSlayer Adept Ponytail",
            'Mode: [select] only\nShould the bot buy "ShadowSlayer Adept Ponytail" ?',
            false,
        ),
        option.bool(
            "87786",
            "ShadowSlayer Adept Chapeau",
            'Mode: [select] only\nShould the bot buy "ShadowSlayer Adept Chapeau" ?',
            false,
        ),
        option.bool(
            "87787",
            "ShadowSlayer Adept Ponytail Chapeau",
            'Mode: [select] only\nShould the bot buy "ShadowSlayer Adept Ponytail Chapeau" ?',
            false,
        ),
        option.bool(
            "87788",
            "ShadowSlayer Mendicant",
            'Mode: [select] only\nShould the bot buy "ShadowSlayer Mendicant" ?',
            false,
        ),
        option.bool(
            "87789",
            "ShadowSlayer Mendicant Buzzcut",
            'Mode: [select] only\nShould the bot buy "ShadowSlayer Mendicant Buzzcut" ?',
            false,
        ),
        option.bool(
            "87790",
            "ShadowSlayer Mendicant Sash",
            'Mode: [select] only\nShould the bot buy "ShadowSlayer Mendicant Sash" ?',
            false,
        ),
        option.bool(
            "87791",
            "ShadowSlayer Mendicant Veil",
            'Mode: [select] only\nShould the bot buy "ShadowSlayer Mendicant Veil" ?',
            false,
        ),
        option.bool(
            "87794",
            "Golden Panacea Claymore",
            'Mode: [select] only\nShould the bot buy "Golden Panacea Claymore" ?',
            false,
        ),
        option.bool(
            "87795",
            "Golden Panacea Claymores",
            'Mode: [select] only\nShould the bot buy "Golden Panacea Claymores" ?',
            false,
        ),
        option.bool(
            "87796",
            "Mendicant's Last Resort",
            'Mode: [select] only\nShould the bot buy "Mendicant\'s Last Resort" ?',
            false,
        ),
        option.bool(
            "87797",
            "Mendicant's Last Resorts",
            'Mode: [select] only\nShould the bot buy "Mendicant\'s Last Resorts" ?',
            false,
        ),
        option.bool("87602", "Sol Intenso", 'Mode: [select] only\nShould the bot buy "Sol Intenso" ?', false),
        option.bool("87603", "Dual Sol Intenso", 'Mode: [select] only\nShould the bot buy "Dual Sol Intenso" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: BadmoonMerge.select,
});

export default function main(): void {
    const script = new BadmoonMerge();
    Core.bankingBlackList.push(
        "Lunate Sigil",
        "Darkovian Hunter",
        "Darkovia Hunter's Cowl",
        "Iron Dussack",
        "ShadowSlayer's Apprentice",
        "Antiquated Shadow Hair",
        "Antiquated Shadow Locks",
        "Antiquated Shadow Hat",
        "Antiquated Shadow Hat + Locks",
        "Zealous Claymore",
        "Zealous Censer",
        "Shadowslayer Relic Sword",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
