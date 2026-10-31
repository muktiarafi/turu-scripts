/*
name: Shanhaijing Bounty Merge
description: This bot will farm the items belonging to the selected mode for the Shanhaijing Bounty Merge [2634] in /shizaistrath
tags: shanhaijing, bounty, merge, shizaistrath, gold, voucher, k, refined, blossom, fan, fans, purified, luntai, taotie, nopperabo, samurai
*/
// Port of Scripts/Other/MergeShops/ShanhaijingBountyMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class ShanhaijingBountyMerge {
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
                case "Taotie Emblem":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonsterQuest(10482, "shizaistrath", "Taotie");
                        bot.wait.forPickup(req.name);
                    }
                    break;
                //#endregion
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("shizaistrath", 2634, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "96649",
            "Refined Blossom Fan",
            'Mode: [select] only\nShould the bot buy "Refined Blossom Fan" ?',
            false,
        ),
        option.bool(
            "96650",
            "Refined Blossom Fans",
            'Mode: [select] only\nShould the bot buy "Refined Blossom Fans" ?',
            false,
        ),
        option.bool(
            "94508",
            "Purified Luntai Axe",
            'Mode: [select] only\nShould the bot buy "Purified Luntai Axe" ?',
            false,
        ),
        option.bool(
            "96648",
            "Taotie Nopperabo Samurai",
            'Mode: [select] only\nShould the bot buy "Taotie Nopperabo Samurai" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ShanhaijingBountyMerge.select,
});

export default function main(): void {
    const script = new ShanhaijingBountyMerge();
    Core.bankingBlackList.push("Taotie Emblem");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
