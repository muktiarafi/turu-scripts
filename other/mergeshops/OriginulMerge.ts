/*
name: OriginulMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/OriginulMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreNation } from "../../nation/CoreNation";

const Adv = new CoreAdvanced();
const Nation = new CoreNation();

export class OriginulMerge {
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
                case "Fiend Emblem":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(7890);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Farm);
                        Core.killMonster("originul", "r5", "Right", "*", "Essence of The Citadel", 30);

                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("originul", "Fiend Champion", "Champion's Essence");

                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Unidentified 13":
                    Nation.farmUni13(quant);
                    break;
                case "Diamond of Nulgath":
                    Nation.farmDiamondofNulgath(quant);
                    break;
                case "Dark Crystal Shard":
                    Nation.farmDarkCrystalShard(quant);
                    break;
                case "Totem of Nulgath":
                    Nation.farmTotemofNulgath(quant);
                    break;
                case "Tainted Gem":
                    Nation.farmTaintedGem(quant);
                    break;
                case "Essence of Nulgath":
                    Nation.essenceofNulgath(quant);
                    break;
                case "Blood Gem of the Archfiend":
                    Nation.farmBloodGem(quant);
                    break;
                case "Voucher of Nulgath (non-mem)":
                    Nation.farmVoucher({ member: false });
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("originul", 1962, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "58813",
            "Fiend Champion of Adimonde",
            'Mode: [select] only\nShould the bot buy "Fiend Champion of Adimonde" ?',
            false,
        ),
        option.bool(
            "58814",
            "Fiend Champion Horns",
            'Mode: [select] only\nShould the bot buy "Fiend Champion Horns" ?',
            false,
        ),
        option.bool(
            "58815",
            "Fiend Champion's Morph",
            'Mode: [select] only\nShould the bot buy "Fiend Champion\'s Morph" ?',
            false,
        ),
        option.bool(
            "58816",
            "Fiend Champion's Cloak",
            'Mode: [select] only\nShould the bot buy "Fiend Champion\'s Cloak" ?',
            false,
        ),
        option.bool(
            "58817",
            "Fiend Champion's Spikes",
            'Mode: [select] only\nShould the bot buy "Fiend Champion\'s Spikes" ?',
            false,
        ),
        option.bool(
            "58818",
            "Fiend Champion's Cloak + Spikes",
            'Mode: [select] only\nShould the bot buy "Fiend Champion\'s Cloak + Spikes" ?',
            false,
        ),
        option.bool(
            "58819",
            "Fiend Champion's Spear",
            'Mode: [select] only\nShould the bot buy "Fiend Champion\'s Spear" ?',
            false,
        ),
        option.bool(
            "58820",
            "Fiend Champion's Blade",
            'Mode: [select] only\nShould the bot buy "Fiend Champion\'s Blade" ?',
            false,
        ),
        option.bool(
            "58732",
            "Arcane Warfiend of Nulgath",
            'Mode: [select] only\nShould the bot buy "Arcane Warfiend of Nulgath" ?',
            false,
        ),
        option.bool("58733", "Warfiend's Hood", 'Mode: [select] only\nShould the bot buy "Warfiend\'s Hood" ?', false),
        option.bool(
            "58734",
            "Warfiend's Masked Hood",
            'Mode: [select] only\nShould the bot buy "Warfiend\'s Masked Hood" ?',
            false,
        ),
        option.bool("58735", "Warfiend's Cape", 'Mode: [select] only\nShould the bot buy "Warfiend\'s Cape" ?', false),
        option.bool(
            "58736",
            "Warfiend's Backblade",
            'Mode: [select] only\nShould the bot buy "Warfiend\'s Backblade" ?',
            false,
        ),
        option.bool(
            "58737",
            "Warfiend's Dual Backblades",
            'Mode: [select] only\nShould the bot buy "Warfiend\'s Dual Backblades" ?',
            false,
        ),
        option.bool(
            "58738",
            "Warfiend's Backblades + Cape",
            'Mode: [select] only\nShould the bot buy "Warfiend\'s Backblades + Cape" ?',
            false,
        ),
        option.bool(
            "58739",
            "Gift of The ArchFiend Staff",
            'Mode: [select] only\nShould the bot buy "Gift of The ArchFiend Staff" ?',
            false,
        ),
        option.bool(
            "58770",
            "Evolved Worshipper of Nulgath",
            'Mode: [select] only\nShould the bot buy "Evolved Worshipper of Nulgath" ?',
            false,
        ),
        option.bool(
            "58771",
            "Evolved Worshipper's Morph",
            'Mode: [select] only\nShould the bot buy "Evolved Worshipper\'s Morph" ?',
            false,
        ),
        option.bool(
            "58772",
            "Evolved Worshipper's Visage",
            'Mode: [select] only\nShould the bot buy "Evolved Worshipper\'s Visage" ?',
            false,
        ),
        option.bool(
            "58773",
            "Worshipper Hood of Nulgath",
            'Mode: [select] only\nShould the bot buy "Worshipper Hood of Nulgath" ?',
            false,
        ),
        option.bool(
            "58774",
            "Worshipper Key of Nulgath",
            'Mode: [select] only\nShould the bot buy "Worshipper Key of Nulgath" ?',
            false,
        ),
        option.bool(
            "58775",
            "Dual Worshipper Keys of Nulgath",
            'Mode: [select] only\nShould the bot buy "Dual Worshipper Keys of Nulgath" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: OriginulMerge.select,
});

export default function main(): void {
    const script = new OriginulMerge();
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
