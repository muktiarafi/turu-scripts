/*
name: Terces Archive Merge
description: This bot will farm the items belonging to the selected mode for the Terces Archive Merge [2668] in /tercesarchive
tags: terces, archive, merge, tercesarchive, void, kittarian, morph, fiendish, feline, claws, fiend, voracity, overfiend, pet, battle, crimson, scolex, bane, ascension, fury
*/
// Port of Scripts/Other/MergeShops/TercesArchiveMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreNation } from "../../nation/CoreNation";
import { NationMerge } from "../../nation/mergeshops/NationMerge";
import { JuggernautItemsofNulgath, RewardsSelection } from "../../nation/various/JuggernautItems";

const Adv = new CoreAdvanced();
const Nation = new CoreNation();
const juggernaut = new JuggernautItemsofNulgath();
const NM = new NationMerge();

export class TercesArchiveMerge {
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
                //#region Items not setup
                case "Nulgath Horns":
                    Nation.nulgathsRouletteofMisfortune(req.name, req.quantity);
                    break;
                //#endregion
                case "Blood Star of the Archfiend":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.addDrop(req.id);
                    NM.buyAllMerge(req.name);
                    break;
                case "Abyssal Fang":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.ensureAccept(Core.isMember ? 10559 : 10558);
                        Core.killMonster("tercesarchive", "r7", "Bottom", "Fiend of Voracity", "Voracious Appetite", 1);
                        Core.killMonster("tercesarchive", "r6", "Center", "*", "Double Iris", 6);
                        Core.killMonster("tercesarchive", "r5", "Left", "*", "Twisted Vision", 6);
                        Core.ensureComplete(Core.isMember ? 10559 : 10558);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                //#region Known items
                case "Unidentified 13":
                    Nation.farmUni13(quant);
                    break;
                case "Diamond of Nulgath":
                    Nation.farmDiamondofNulgath(quant);
                    break;
                case "Dark Crystal Shard":
                    Nation.farmDarkCrystalShard(quant);
                    break;
                case "Tainted Gem":
                    Nation.farmTaintedGem(quant);
                    break;
                case "Totem of Nulgath":
                    Nation.farmTotemofNulgath(quant);
                    break;
                case "Gem of Nulgath":
                    Nation.farmGemofNulgath(quant);
                    break;
                case "Voucher of Nulgath (non-mem)":
                    Nation.farmVoucher({ member: false });
                    break;
                case "Voucher of Nulgath":
                    Nation.farmVoucher({ member: true, keepVoucher: true });
                    bot.wait.forPickup(req.name);
                    break;
                case "Battlefiend Blade of Nulgath":
                    Core.farmingLogger(req.name, quant);
                    juggernaut.juggItems(RewardsSelection.Battlefiend_Blade_of_Nulgath);
                    bot.wait.forPickup(req.name);
                    break;
                case "Nulgath Armor":
                    Core.farmingLogger(req.name, quant);
                    juggernaut.juggItems(RewardsSelection.Nulgath_Armor);
                    bot.wait.forPickup(req.name);
                    break;
                case "Overfiend Blade of Nulgath":
                    Core.farmingLogger(req.name, quant);
                    juggernaut.juggItems(RewardsSelection.Overfiend_Blade_of_Nulgath);
                    bot.wait.forPickup(req.name);
                    break;
                case "Blood Gem of the Archfiend":
                    Nation.farmBloodGem(quant);
                    break;
                //#endregion
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("tercesarchive", 2668, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("75932", "Void Kittarian", 'Mode: [select] only\nShould the bot buy "Void Kittarian" ?', false),
        option.bool(
            "75933",
            "Void Kittarian Morph",
            'Mode: [select] only\nShould the bot buy "Void Kittarian Morph" ?',
            false,
        ),
        option.bool(
            "75934",
            "Fiendish Feline Claws",
            'Mode: [select] only\nShould the bot buy "Fiendish Feline Claws" ?',
            false,
        ),
        option.bool(
            "98448",
            "Fiend Of Voracity",
            'Mode: [select] only\nShould the bot buy "Fiend Of Voracity" ?',
            false,
        ),
        option.bool(
            "98449",
            "Fiend of Voracity Morph",
            'Mode: [select] only\nShould the bot buy "Fiend of Voracity Morph" ?',
            false,
        ),
        option.bool(
            "98450",
            "Overfiend Blade of Voracity Pet",
            'Mode: [select] only\nShould the bot buy "Overfiend Blade of Voracity Pet" ?',
            false,
        ),
        option.bool(
            "98451",
            "Overfiend Blade of Voracity Battle Pet",
            'Mode: [select] only\nShould the bot buy "Overfiend Blade of Voracity Battle Pet" ?',
            false,
        ),
        option.bool(
            "98452",
            "Overfiend Blade of Voracity",
            'Mode: [select] only\nShould the bot buy "Overfiend Blade of Voracity" ?',
            false,
        ),
        option.bool(
            "98453",
            "Overfiend Blades of Voracity",
            'Mode: [select] only\nShould the bot buy "Overfiend Blades of Voracity" ?',
            false,
        ),
        option.bool(
            "98488",
            "Crimson Scolex of the Void",
            'Mode: [select] only\nShould the bot buy "Crimson Scolex of the Void" ?',
            false,
        ),
        option.bool(
            "98489",
            "Fiendish Bane of Ascension",
            'Mode: [select] only\nShould the bot buy "Fiendish Bane of Ascension" ?',
            false,
        ),
        option.bool(
            "98490",
            "Fiendish Fury of Ascension",
            'Mode: [select] only\nShould the bot buy "Fiendish Fury of Ascension" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: TercesArchiveMerge.select,
});

export default function main(): void {
    const script = new TercesArchiveMerge();
    Core.bankingBlackList.push(
        "Abyssal Fang",
        "Unidentified 13",
        "Diamond of Nulgath",
        "Dark Crystal Shard",
        "Tainted Gem",
        "Totem of Nulgath",
        "Gem of Nulgath",
        "Voucher of Nulgath (non-mem)",
        "Nulgath Armor",
        "Nulgath Horns",
        "Battlefiend Blade of Nulgath",
        "Voucher of Nulgath",
        "Overfiend Blade of Nulgath",
        "Blood Gem of the Archfiend",
        "Blood Star of the Archfiend",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
