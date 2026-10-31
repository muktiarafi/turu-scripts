/*
name: Green Guard Pirate Rewards Merge
description: This bot will farm the items belonging to the selected mode for the Green Guard Pirate Rewards Merge [2623] in /piratealliance
tags: green, guard, pirate, rewards, merge, piratealliance, merunit, operator, morph, glorious, spear, stolen, treasure, smugglers, raiment, bandana, bearded, rusted, cutlass, cutlasses, seastrand, gold, sea, king, gravefang, abyssal, horde, sailors, beard, captains, wolfs, golden, bloodbiter, bloodbiters, mortal
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/MergeShops/GreenGuardPirateRewardsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { PirateAlliance } from "../PirateAlliance";

const Adv = new CoreAdvanced();
const PA = new PirateAlliance();

export class GreenGuardPirateRewardsMerge {
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
                case "Bloodstained Doubloon":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonsterQuest(
                            Core.isMember ? 10412 : 10410,
                            ["piratealliance", "S.S. Phantom Pirate", ClassType.Farm],
                            ["piratealliance", "Captain Squalus", ClassType.Solo],
                            ["piratealliance", "Phantom Jaws", ClassType.Solo],
                        );
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Mer-Unit Operator Hair":

                case "Mer-Unit Operator Locks":

                case "Spear of Lost Jewels":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    Core.huntMonster("piratealliance", "Phantom Jaws", req.name, quant, {
                        isTemp: req.temp,
                        log: false,
                    });
                    break;
                //#endregion
            }
        };
        PA.storyline();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("piratealliance", 2623, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "89389",
            "Mer-Unit Operator Morph",
            'Mode: [select] only\nShould the bot buy "Mer-Unit Operator Morph" ?',
            false,
        ),
        option.bool(
            "89390",
            "Mer-Unit Operator Locks",
            'Mode: [select] only\nShould the bot buy "Mer-Unit Operator Locks" ?',
            false,
        ),
        option.bool(
            "95356",
            "Glorious Spear of Stolen Treasure",
            'Mode: [select] only\nShould the bot buy "Glorious Spear of Stolen Treasure" ?',
            false,
        ),
        option.bool(
            "95615",
            "Smuggler's Raiment",
            'Mode: [select] only\nShould the bot buy "Smuggler\'s Raiment" ?',
            false,
        ),
        option.bool(
            "95616",
            "Smuggler's Bandana",
            'Mode: [select] only\nShould the bot buy "Smuggler\'s Bandana" ?',
            false,
        ),
        option.bool("95617", "Smugglers Locks", 'Mode: [select] only\nShould the bot buy "Smugglers Locks" ?', false),
        option.bool(
            "95618",
            "Smuggler's Bearded Bandana",
            'Mode: [select] only\nShould the bot buy "Smuggler\'s Bearded Bandana" ?',
            false,
        ),
        option.bool("95620", "Rusted Cutlass", 'Mode: [select] only\nShould the bot buy "Rusted Cutlass" ?', false),
        option.bool("95621", "Rusted Cutlasses", 'Mode: [select] only\nShould the bot buy "Rusted Cutlasses" ?', false),
        option.bool(
            "95622",
            "Seastrand Gold Cutlass",
            'Mode: [select] only\nShould the bot buy "Seastrand Gold Cutlass" ?',
            false,
        ),
        option.bool(
            "95623",
            "Seastrand Gold Cutlasses",
            'Mode: [select] only\nShould the bot buy "Seastrand Gold Cutlasses" ?',
            false,
        ),
        option.bool(
            "95626",
            "Sea King Gravefang",
            'Mode: [select] only\nShould the bot buy "Sea King Gravefang" ?',
            false,
        ),
        option.bool(
            "95627",
            "Abyssal Horde Sailor's Beard",
            'Mode: [select] only\nShould the bot buy "Abyssal Horde Sailor\'s Beard" ?',
            false,
        ),
        option.bool(
            "95628",
            "Abyssal Horde Captain's Beard",
            'Mode: [select] only\nShould the bot buy "Abyssal Horde Captain\'s Beard" ?',
            false,
        ),
        option.bool(
            "95629",
            "Abyssal Horde Sailor's Locks",
            'Mode: [select] only\nShould the bot buy "Abyssal Horde Sailor\'s Locks" ?',
            false,
        ),
        option.bool(
            "95630",
            "Abyssal Horde Captain's Locks",
            'Mode: [select] only\nShould the bot buy "Abyssal Horde Captain\'s Locks" ?',
            false,
        ),
        option.bool(
            "95631",
            "Abyssal Horde Captain's Morph",
            'Mode: [select] only\nShould the bot buy "Abyssal Horde Captain\'s Morph" ?',
            false,
        ),
        option.bool(
            "95632",
            "Abyssal Horde Wolf's Morph",
            'Mode: [select] only\nShould the bot buy "Abyssal Horde Wolf\'s Morph" ?',
            false,
        ),
        option.bool(
            "95634",
            "Golden Bloodbiter",
            'Mode: [select] only\nShould the bot buy "Golden Bloodbiter" ?',
            false,
        ),
        option.bool(
            "95635",
            "Golden Bloodbiters",
            'Mode: [select] only\nShould the bot buy "Golden Bloodbiters" ?',
            false,
        ),
        option.bool(
            "95900",
            "Mortal Sea King Gravefang",
            'Mode: [select] only\nShould the bot buy "Mortal Sea King Gravefang" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: GreenGuardPirateRewardsMerge.select,
});

export default function main(): void {
    const script = new GreenGuardPirateRewardsMerge();
    Core.bankingBlackList.push(
        "Bloodstained Doubloon",
        "Mer-Unit Operator Hair",
        "Mer-Unit Operator Locks",
        "Spear of Lost Jewels",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
