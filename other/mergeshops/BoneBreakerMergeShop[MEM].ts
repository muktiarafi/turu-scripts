/*
name: Bonebreaker Merge
description: This bot will farm the items belonging to the selected mode for the Bonebreaker Merge [1051] in /bonebreak
tags: bonebreaker, merge, bonebreak, outcast, boneshattering, brokenbone, skull, bonepiercer, membership
*/
// Port of Scripts/Other/MergeShops/BoneBreakerMergeShop[MEM].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreDailies } from "../../core/CoreDailies";

const Adv = new CoreAdvanced();
const Daily = new CoreDailies();

export class BonebreakerMerge {
    // [Can Change] This should only be changed by the author.
    //If true, it will not stop the script if the default case triggers and the user chose to only get mats
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
                case "BoneBreaker Medallion":
                    Core.farmingLogger(req.name, quant);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant) && Daily.checkDailyv2(3898)) {
                        Core.ensureAccept(3898);
                        Core.huntMonster("bonebreak", "Undead Berserker", "Warrior Defeated", 5);
                        Core.ensureComplete(3898);
                        bot.wait.forPickup(req.name);
                    }
                    Core.toBank(...Core.questRewards(3898));
                    break;
            }
        };
        if (!Core.isMember || !Core.checkInventory("BoneBreaker Fortress Map")) {
            Core.logger("Membership Required.");
            return;
        }
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("bonebreak", 1051, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "27272",
            "BoneBreaker Outcast",
            'Mode: [select] only\nShould the bot buy "BoneBreaker Outcast" ?',
            false,
        ),
        option.bool(
            "27215",
            "Axe of Bone-Shattering",
            'Mode: [select] only\nShould the bot buy "Axe of Bone-Shattering" ?',
            false,
        ),
        option.bool("27213", "BrokenBone Skull", 'Mode: [select] only\nShould the bot buy "BrokenBone Skull" ?', false),
        option.bool(
            "27214",
            "BonePiercer Spikes",
            'Mode: [select] only\nShould the bot buy "BonePiercer Spikes" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: BonebreakerMerge.select,
});

export default function main(): void {
    const script = new BonebreakerMerge();
    Core.bankingBlackList.push("BoneBreaker Medallion");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
