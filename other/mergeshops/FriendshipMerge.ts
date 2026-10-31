/*
name: Friendship Merge
description: This script will farm materials to buy items from the Friendship Merge shop.
tags: friendship, merge, battleodium
*/
// Port of Scripts/Other/MergeShops/FriendshipMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { Friendship } from "../../story/Friendship";

const Adv = new CoreAdvanced();
const Fr = new Friendship();

export class FriendshipMerge {
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
                case "Faded Pigment":
                    Core.farmingLogger(req.name, quant);
                    Core.addDrop("Roses", "Strawberries", "Rubies");
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(9107);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("battleodium", "Widowing", "Roses", 1, { isTemp: false, log: false });
                        Core.killMonster("battleodium", "r6", "Left", "*", "Strawberries", 1, {
                            isTemp: false,
                            log: false,
                        });
                        while (!bot.shouldExit && !Core.checkInventory(76286)) {
                            Core.killMonster("battleodium", "r6", "Left", "*", undefined, undefined, { log: false });
                        }
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Grapes":

                case "Diamonds":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("battleodium", "r6", "Left", "*", req.name, quant, {
                            isTemp: false,
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        Fr.completeStory();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("battleodium", 2236, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "76337",
            "Shadow Rouge Armor",
            'Mode: [select] only\nShould the bot buy "Shadow Rouge Armor" ?',
            false,
        ),
        option.bool(
            "76338",
            "Shadowed Love Hat",
            'Mode: [select] only\nShould the bot buy "Shadowed Love Hat" ?',
            false,
        ),
        option.bool(
            "76341",
            "Dark Axe of Friendship",
            'Mode: [select] only\nShould the bot buy "Dark Axe of Friendship" ?',
            false,
        ),
        option.bool(
            "76342",
            "Violent Axe of Friendship",
            'Mode: [select] only\nShould the bot buy "Violent Axe of Friendship" ?',
            false,
        ),
        option.bool(
            "76343",
            "Ardent Axe of Friendship",
            'Mode: [select] only\nShould the bot buy "Ardent Axe of Friendship" ?',
            false,
        ),
        option.bool(
            "76344",
            "Passionate Axe of Friendship",
            'Mode: [select] only\nShould the bot buy "Passionate Axe of Friendship" ?',
            false,
        ),
        option.bool("76242", "Lovely Deity", 'Mode: [select] only\nShould the bot buy "Lovely Deity" ?', false),
        option.bool(
            "76243",
            "Love Thyself Outfit",
            'Mode: [select] only\nShould the bot buy "Love Thyself Outfit" ?',
            false,
        ),
        option.bool(
            "76244",
            "Lovely Deity's Hair",
            'Mode: [select] only\nShould the bot buy "Lovely Deity\'s Hair" ?',
            false,
        ),
        option.bool(
            "76245",
            "Lovely Deity's Locks",
            'Mode: [select] only\nShould the bot buy "Lovely Deity\'s Locks" ?',
            false,
        ),
        option.bool(
            "76246",
            "Lovely Deity's Cascade",
            'Mode: [select] only\nShould the bot buy "Lovely Deity\'s Cascade" ?',
            false,
        ),
        option.bool(
            "76247",
            "Lovely Deity Winged Halo",
            'Mode: [select] only\nShould the bot buy "Lovely Deity Winged Halo" ?',
            false,
        ),
        option.bool(
            "76248",
            "Lovely Deity Wings",
            'Mode: [select] only\nShould the bot buy "Lovely Deity Wings" ?',
            false,
        ),
        option.bool(
            "76249",
            "Lovely Deity Winglets",
            'Mode: [select] only\nShould the bot buy "Lovely Deity Winglets" ?',
            false,
        ),
        option.bool(
            "76250",
            "Dark Lovely Deity Wings",
            'Mode: [select] only\nShould the bot buy "Dark Lovely Deity Wings" ?',
            false,
        ),
        option.bool(
            "76253",
            "Lovely Deity's Bow",
            'Mode: [select] only\nShould the bot buy "Lovely Deity\'s Bow" ?',
            false,
        ),
        option.bool(
            "76347",
            "Blessed Lovely Deity Hair",
            'Mode: [select] only\nShould the bot buy "Blessed Lovely Deity Hair" ?',
            false,
        ),
        option.bool(
            "76345",
            "Dark Lovely Deity",
            'Mode: [select] only\nShould the bot buy "Dark Lovely Deity" ?',
            false,
        ),
        option.bool(
            "76350",
            "Dark Lovely Deity Winglets",
            'Mode: [select] only\nShould the bot buy "Dark Lovely Deity Winglets" ?',
            false,
        ),
        option.bool(
            "76351",
            "Dark Blessed Deity Wings",
            'Mode: [select] only\nShould the bot buy "Dark Blessed Deity Wings" ?',
            false,
        ),
        option.bool(
            "76352",
            "Dark Lovely Deity's Bow",
            'Mode: [select] only\nShould the bot buy "Dark Lovely Deity\'s Bow" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: FriendshipMerge.select,
});

export default function main(): void {
    const script = new FriendshipMerge();
    Core.bankingBlackList.push("Faded Pigment", "Grapes", "Diamonds");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
