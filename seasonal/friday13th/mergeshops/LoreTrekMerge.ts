/*
name: Lore Trek Merge
description: This will get all or selected items on this merge shop.
tags: lore-trek-merge, friday-the-13th, seasonal
*/
// Port of Scripts/Seasonal/Friday13th/MergeShops/LoreTrekMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreFriday13th } from "../story/CoreFriday13th";

const Adv = new CoreAdvanced();
const F13 = new CoreFriday13th();

export class LoreTrekMerge {
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
                case "LoreTrek Token":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("wormhole", "r2", "Left", "*", req.name, quant, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Matted Dust Bunny":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(5067);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("wormhole", "r5", "Left", "Blue Trobbolier", "Blue Trobbolier Fluff", 4);
                        Core.killMonster("wormhole", "r8", "Left", "Purple Trobbolier", "Purple Trobbolier Fluff", 4);
                        Core.killMonster("wormhole", "r8", "Left", "Green Trobbolier", "Green Trobbolier Fluff", 4);
                        Core.killMonster("wormhole", "r5", "Left", "Red Trobbolier", "Red Trobbolier Fluff", 4);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        F13.wormhole();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("wormhole", 1250, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "34979",
            "Cybernetic Space Marine",
            'Mode: [select] only\nShould the bot buy "Cybernetic Space Marine" ?',
            false,
        ),
        option.bool(
            "34980",
            "Cybernetic Space Marine Mask",
            'Mode: [select] only\nShould the bot buy "Cybernetic Space Marine Mask" ?',
            false,
        ),
        option.bool(
            "34981",
            "Damaged Space Marine Mask",
            'Mode: [select] only\nShould the bot buy "Damaged Space Marine Mask" ?',
            false,
        ),
        option.bool(
            "34984",
            "Bald Space Marine",
            'Mode: [select] only\nShould the bot buy "Bald Space Marine" ?',
            false,
        ),
        option.bool(
            "34983",
            "Cybernetic Space Slicer",
            'Mode: [select] only\nShould the bot buy "Cybernetic Space Slicer" ?',
            false,
        ),
        option.bool(
            "34982",
            "Space Slicer Cape",
            'Mode: [select] only\nShould the bot buy "Space Slicer Cape" ?',
            false,
        ),
        option.bool("35001", "Stormslasher", 'Mode: [select] only\nShould the bot buy "Stormslasher" ?', false),
        option.bool(
            "35002",
            "Stormslasher Helm",
            'Mode: [select] only\nShould the bot buy "Stormslasher Helm" ?',
            false,
        ),
        option.bool(
            "35003",
            "Stormslasher Stick",
            'Mode: [select] only\nShould the bot buy "Stormslasher Stick" ?',
            false,
        ),
        option.bool("34998", "SwarmTrooper", 'Mode: [select] only\nShould the bot buy "SwarmTrooper" ?', false),
        option.bool(
            "34999",
            "Swarm Trooper Helm",
            'Mode: [select] only\nShould the bot buy "Swarm Trooper Helm" ?',
            false,
        ),
        option.bool(
            "35000",
            "SwarmTrooper Stick",
            'Mode: [select] only\nShould the bot buy "SwarmTrooper Stick" ?',
            false,
        ),
        option.bool("40268", "Trob-NOM NOM NOM", 'Mode: [select] only\nShould the bot buy "Trob-NOM NOM NOM" ?', false),
        option.bool("40267", "Trobbo-Locks", 'Mode: [select] only\nShould the bot buy "Trobbo-Locks" ?', false),
        option.bool("34978", "Cursed Alien", 'Mode: [select] only\nShould the bot buy "Cursed Alien" ?', false),
        option.bool("35040", "Swarmobite Helm", 'Mode: [select] only\nShould the bot buy "Swarmobite Helm" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: LoreTrekMerge.select,
});

export default function main(): void {
    const script = new LoreTrekMerge();
    Core.bankingBlackList.push("LoreTrek Token", "Matted Dust Bunny");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
