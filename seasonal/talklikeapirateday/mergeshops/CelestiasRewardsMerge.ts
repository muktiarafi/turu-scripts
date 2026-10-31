/*
name: Celestias Rewards Merge
description: This bot will farm the items belonging to the selected mode for the Celestias Rewards Merge [2341] in /nerites
tags: celestias, rewards, merge, nerites, messina, mirage, corsair, patched, captain, sea, enchanter, flag, glint, edge, cutlasses, doubled, illusionary, grog, crews, gear, helmsmans, elite, zardic, swordmaster, savage, swordsmaster, beastly, kinsman, morph, scarred, kinsmans, single, partner, yokai, bandit, straw
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/MergeShops/CelestiasRewardsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";

const Adv = new CoreAdvanced();

export class CelestiasRewardsMerge {
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
                case "Nerites Scale":

                case "Glint Edge Cutlass":
                    Core.logger(`${req.name} requires ultra boss, you need to farm it manually.`, undefined, {
                        stopBot: true,
                    });
                    break;
                case "Pirate Remains":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(9409);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("nerites", "Ghostly Eel", undefined, undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("nerites", 2341, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "79415",
            "Messina Mirage Corsair",
            'Mode: [select] only\nShould the bot buy "Messina Mirage Corsair" ?',
            false,
        ),
        option.bool(
            "79417",
            "Messina Mirage Patched Visage",
            'Mode: [select] only\nShould the bot buy "Messina Mirage Patched Visage" ?',
            false,
        ),
        option.bool(
            "79420",
            "Messina Mirage Captain Visage",
            'Mode: [select] only\nShould the bot buy "Messina Mirage Captain Visage" ?',
            false,
        ),
        option.bool(
            "79421",
            "Messina Mirage Hat Visage",
            'Mode: [select] only\nShould the bot buy "Messina Mirage Hat Visage" ?',
            false,
        ),
        option.bool(
            "79423",
            "Sea Enchanter Visage",
            'Mode: [select] only\nShould the bot buy "Sea Enchanter Visage" ?',
            false,
        ),
        option.bool(
            "79428",
            "Messina Mirage Flag",
            'Mode: [select] only\nShould the bot buy "Messina Mirage Flag" ?',
            false,
        ),
        option.bool(
            "79430",
            "Glint Edge Cutlasses",
            'Mode: [select] only\nShould the bot buy "Glint Edge Cutlasses" ?',
            false,
        ),
        option.bool(
            "79432",
            "Doubled Illusionary Grog",
            'Mode: [select] only\nShould the bot buy "Doubled Illusionary Grog" ?',
            false,
        ),
        option.bool(
            "79434",
            "Messina Mirage Crew's Gear",
            'Mode: [select] only\nShould the bot buy "Messina Mirage Crew\'s Gear" ?',
            false,
        ),
        option.bool(
            "79435",
            "Messina Helmsman's Gear",
            'Mode: [select] only\nShould the bot buy "Messina Helmsman\'s Gear" ?',
            false,
        ),
        option.bool(
            "80205",
            "Elite Zardic Swordmaster",
            'Mode: [select] only\nShould the bot buy "Elite Zardic Swordmaster" ?',
            false,
        ),
        option.bool(
            "80206",
            "Savage Zardic Swordsmaster",
            'Mode: [select] only\nShould the bot buy "Savage Zardic Swordsmaster" ?',
            false,
        ),
        option.bool(
            "80211",
            "Beastly Kinsman Morph",
            'Mode: [select] only\nShould the bot buy "Beastly Kinsman Morph" ?',
            false,
        ),
        option.bool(
            "80212",
            "Beastly Kinsman Visage",
            'Mode: [select] only\nShould the bot buy "Beastly Kinsman Visage" ?',
            false,
        ),
        option.bool(
            "80213",
            "Beastly Kinsman Scarred Morph",
            'Mode: [select] only\nShould the bot buy "Beastly Kinsman Scarred Morph" ?',
            false,
        ),
        option.bool(
            "80227",
            "Kinsman's Single Blade",
            'Mode: [select] only\nShould the bot buy "Kinsman\'s Single Blade" ?',
            false,
        ),
        option.bool(
            "80228",
            "Kinsman's Partner Blades",
            'Mode: [select] only\nShould the bot buy "Kinsman\'s Partner Blades" ?',
            false,
        ),
        option.bool("80321", "Yokai Bandit", 'Mode: [select] only\nShould the bot buy "Yokai Bandit" ?', false),
        option.bool(
            "80324",
            "Yokai Bandit Straw Hat",
            'Mode: [select] only\nShould the bot buy "Yokai Bandit Straw Hat" ?',
            false,
        ),
        option.bool(
            "80325",
            "Yokai Bandit Straw Locks",
            'Mode: [select] only\nShould the bot buy "Yokai Bandit Straw Locks" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: CelestiasRewardsMerge.select,
});

export default function main(): void {
    const script = new CelestiasRewardsMerge();
    Core.bankingBlackList.push("Nerites Scale", "Pirate Remains", "Glint Edge Cutlass");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
