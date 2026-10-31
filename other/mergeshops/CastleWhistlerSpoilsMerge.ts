/*
name: Castle Whistler Spoils Merge
description: This bot will farm the items belonging to the selected mode for the Castle Whistler Spoils Merge [2607] in /castlewhistler
tags: castle, whistler, spoils, merge, castlewhistler, king, dark, antlered, armorial, crown, darkness, unknown, winters, dirges, midsummer, rhapsodies, pavane, fantasia, dirge, rhapsody
*/
// Port of Scripts/Other/MergeShops/CastleWhistlerSpoilsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class CastleWhistlerSpoilsMerge {
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
                // Pigment Powder (handled separately due to different quest IDs and requirements)
                case "Pigment Powder":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    // Unlock farming quest
                    if (!bot.quests.isUnlocked(10337)) {
                        Core.logger('unlocking farming quest for "Pigment Powder"');
                        Core.ensureAccept(10336);
                        Core.huntMonster("castlewhistler", "King of the Dark", "King's Pigment");
                        Core.ensureComplete(10336);
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop("Pigment Powder");
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.ensureAccept(10337);
                        Core.huntMonster("castlewhistler", "King of the Dark", "King's Varnish");
                        Core.ensureComplete(10337);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                // Shared case for other castlewhistler drops
                case "Winter's Dirge":

                case "Midsummer Rhapsody":

                case "Armorial Crown":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop("Armorial Crown", "Winter's Dirge", "Midsummer Rhapsody");
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonster("castlewhistler", "King of the Dark", req.name, quant, { isTemp: req.temp });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        Core.logger('Good luck killing "King of the Dark"... he hurts after awhile :D.');

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("castlewhistler", 2607, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("94864", "King of the Dark", 'Mode: [select] only\nShould the bot buy "King of the Dark" ?', false),
        option.bool(
            "94866",
            "Antlered Armorial Crown",
            'Mode: [select] only\nShould the bot buy "Antlered Armorial Crown" ?',
            false,
        ),
        option.bool(
            "94867",
            "Darkness of the Unknown",
            'Mode: [select] only\nShould the bot buy "Darkness of the Unknown" ?',
            false,
        ),
        option.bool("94869", "Winter's Dirges", 'Mode: [select] only\nShould the bot buy "Winter\'s Dirges" ?', false),
        option.bool(
            "94871",
            "Midsummer Rhapsodies",
            'Mode: [select] only\nShould the bot buy "Midsummer Rhapsodies" ?',
            false,
        ),
        option.bool(
            "94872",
            "Pavane and Fantasia",
            'Mode: [select] only\nShould the bot buy "Pavane and Fantasia" ?',
            false,
        ),
        option.bool(
            "94873",
            "Dirge and Rhapsody",
            'Mode: [select] only\nShould the bot buy "Dirge and Rhapsody" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: CastleWhistlerSpoilsMerge.select,
});

export default function main(): void {
    const script = new CastleWhistlerSpoilsMerge();
    Core.bankingBlackList.push("Pigment Powder", "Armorial Crown", "Winter's Dirge", "Midsummer Rhapsody");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
