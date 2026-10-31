/*
name: Lich Kings Bounty Merge
description: This bot will farm the items belonging to the selected mode for the Lich Kings Bounty Merge [1658] in /frozenlair
tags: lich, kings, bounty, merge, frozenlair, legion, lords, scythe, masked, lord, , frozen, legionnaires, mini
*/
// Port of Scripts/Legion/MergeShops/LichKingsBountyMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";

const Adv = new CoreAdvanced();
const Legion = new CoreLegion();

export class LichKingsBountyMerge {
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
                case "Legion Token":
                    Legion.farmLegionToken(quant);
                    break;
                case "Ice Spike":

                case "Ice Splinter":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("frozenlair", "Frozen Legionnaire", req.name, quant, {
                        isTemp: false,
                        log: false,
                    });
                    break;
                case "Sapphire Orb":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Dodge);
                    Core.huntMonster("frozenlair", "Legion Lich Lord", req.name, quant, { isTemp: false, log: false });
                    Core.equipClass(ClassType.Solo);
                    break;
                case "Necrotic Orb":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("frozenlair", "Lich Lord", req.name, quant, { isTemp: false, log: false });
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("frozenlair", 1658, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "45846",
            "Legion Lich Lord's Staff",
            'Mode: [select] only\nShould the bot buy "Legion Lich Lord\'s Staff" ?',
            false,
        ),
        option.bool(
            "45845",
            "Legion Lich Lord's Scythe",
            'Mode: [select] only\nShould the bot buy "Legion Lich Lord\'s Scythe" ?',
            false,
        ),
        option.bool(
            "45844",
            "Legion Lich Lord's Runes",
            'Mode: [select] only\nShould the bot buy "Legion Lich Lord\'s Runes" ?',
            false,
        ),
        option.bool(
            "45843",
            "Legion Lich Lord's Helm",
            'Mode: [select] only\nShould the bot buy "Legion Lich Lord\'s Helm" ?',
            false,
        ),
        option.bool(
            "45842",
            "Legion Lich Lord's Masked Helm",
            'Mode: [select] only\nShould the bot buy "Legion Lich Lord\'s Masked Helm" ?',
            false,
        ),
        option.bool(
            "45841",
            "Legion Lich Lord + Staff",
            'Mode: [select] only\nShould the bot buy "Legion Lich Lord + Staff" ?',
            false,
        ),
        option.bool(
            "45840",
            "Lich Lord's Staff",
            'Mode: [select] only\nShould the bot buy "Lich Lord\'s Staff" ?',
            false,
        ),
        option.bool(
            "45839",
            "Lich Lord's Scythe",
            'Mode: [select] only\nShould the bot buy "Lich Lord\'s Scythe" ?',
            false,
        ),
        option.bool(
            "45838",
            "Lich Lord's Runes",
            'Mode: [select] only\nShould the bot buy "Lich Lord\'s Runes" ?',
            false,
        ),
        option.bool(
            "45837",
            "Lich Lord's Masked Helm",
            'Mode: [select] only\nShould the bot buy "Lich Lord\'s Masked Helm" ?',
            false,
        ),
        option.bool(
            "46056",
            "Lich Lord's Helm",
            'Mode: [select] only\nShould the bot buy "Lich Lord\'s Helm" ?',
            false,
        ),
        option.bool("45836", "Lich Lord", 'Mode: [select] only\nShould the bot buy "Lich Lord" ?', false),
        option.bool(
            "46057",
            "Frozen Legionnaire's Blade",
            'Mode: [select] only\nShould the bot buy "Frozen Legionnaire\'s Blade" ?',
            false,
        ),
        option.bool("45652", "Legion Lich Lord", 'Mode: [select] only\nShould the bot buy "Legion Lich Lord" ?', false),
        option.bool("46071", "Mini Lich Lord", 'Mode: [select] only\nShould the bot buy "Mini Lich Lord" ?', false),
        option.bool(
            "46079",
            "Mini Legion Lich Lord",
            'Mode: [select] only\nShould the bot buy "Mini Legion Lich Lord" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: LichKingsBountyMerge.select,
});

export default function main(): void {
    const script = new LichKingsBountyMerge();
    Core.bankingBlackList.push("Legion Token", "Ice Spike", "Sapphire Orb", "Ice Splinter", "Necrotic Orb");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
