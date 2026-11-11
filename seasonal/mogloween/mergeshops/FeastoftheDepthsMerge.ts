/*
name: Feast of the Depths Merge
description: Farms the Feast of the Depths Merge [2633] in /elodeatemple.
tags: elodeatemple, merge, feast, of, the, depths, merge
*/
// Port of Scripts/Seasonal/Mogloween/MergeShops/FeastoftheDepthsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";

const Adv = new CoreAdvanced();

export class FeastoftheDepths {
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
            const quant = Adv.externalQuant;
            if (req == null) {
                return;
            }

            switch (req.name) {
                case "Acromegalia Seed":
                    // #FROM CASE STORAGE
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    Core.registerQuests(Core.isMember ? 10457 : 10454);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonster("eldritchbattletown", "Kathool Kultist", "Tier 2 Kathool Member Card", 6, {
                            isTemp: false,
                        });
                        Core.huntMonster("eldritchbattletown", "Dzeza Cultist", "Tier 2 Dzeza Member Card", 6, {
                            isTemp: false,
                        });
                        Core.huntMonster("eldritchbattletown", "Harvest Acromegalia", "Gourd Twinning", undefined, {
                            isTemp: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Depths Scale":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(Core.isMember ? 10480 : 10479);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("elodeatemple", "Child of the Depths", "Goldfish's Wish", 1);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Head of Hair":
                    // #FROM CASE STORAGE
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonsterQuest(10468, "eldritchworld", "Mass of Hair");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Shrimp Noodle Pack":
                    // #FROM CASE STORAGE
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonsterQuest(10460, "eldritchworld", "Kathool Cultist");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                default: {
                    const shouldStop = !Adv.matsOnly || !this.dontStopMissingIng;
                    Core.logger(`The bot hasn't been taught how to get ${req.name}.`, undefined, {
                        messageBox: shouldStop,
                        stopBot: shouldStop,
                    });
                    break;
                }
            }
        };
        // FILL_QUEST_UNLOCK: Add the story call that completes "The Victor! The Survivor!" [10478] to unlock "Return from Seafoam" [10479].
        Adv.startBuyAllMerge("elodeatemple", 2633, findIngredients, buyOnlyThis, { buyMode });
    }

    static readonly select = [
        option.bool("89695", "Pumpkin Warlock", 'Mode: [select] only\nShould the bot buy "Pumpkin Warlock" ?', false),
        option.bool(
            "95578",
            "Erudite Plague Doctor",
            'Mode: [select] only\nShould the bot buy "Erudite Plague Doctor" ?',
            false,
        ),
        option.bool(
            "95579",
            "Faustian Plague Doctor",
            'Mode: [select] only\nShould the bot buy "Faustian Plague Doctor" ?',
            false,
        ),
        option.bool("104743", "Elodea's Dress", 'Mode: [select] only\nShould the bot buy "Elodea\'s Dress" ?', false),
        option.bool(
            "95584",
            "Erudite Plague Doctor Cloak",
            'Mode: [select] only\nShould the bot buy "Erudite Plague Doctor Cloak" ?',
            false,
        ),
        option.bool(
            "95586",
            "Crimson Darkling Lamps",
            'Mode: [select] only\nShould the bot buy "Crimson Darkling Lamps" ?',
            false,
        ),
        option.bool(
            "95580",
            "Erudite Plague Doctor Hair",
            'Mode: [select] only\nShould the bot buy "Erudite Plague Doctor Hair" ?',
            false,
        ),
        option.bool(
            "95581",
            "Erudite Plague Doctor Locks",
            'Mode: [select] only\nShould the bot buy "Erudite Plague Doctor Locks" ?',
            false,
        ),
        option.bool(
            "95582",
            "Erudite Plague Doctor Mask",
            'Mode: [select] only\nShould the bot buy "Erudite Plague Doctor Mask" ?',
            false,
        ),
        option.bool(
            "95583",
            "Erudite Plague Doctor Moustache",
            'Mode: [select] only\nShould the bot buy "Erudite Plague Doctor Moustache" ?',
            false,
        ),
        option.bool(
            "89696",
            "Pumpkin Warlock Hair",
            'Mode: [select] only\nShould the bot buy "Pumpkin Warlock Hair" ?',
            false,
        ),
        option.bool(
            "89697",
            "Pumpkin Witch Locks",
            'Mode: [select] only\nShould the bot buy "Pumpkin Witch Locks" ?',
            false,
        ),
        option.bool(
            "89698",
            "Pumpkin Witch Ponytail",
            'Mode: [select] only\nShould the bot buy "Pumpkin Witch Ponytail" ?',
            false,
        ),
        option.bool(
            "89699",
            "Pumpkin Warlock Long Hair",
            'Mode: [select] only\nShould the bot buy "Pumpkin Warlock Long Hair" ?',
            false,
        ),
        option.bool(
            "89700",
            "Pumpkin Witch Twintails",
            'Mode: [select] only\nShould the bot buy "Pumpkin Witch Twintails" ?',
            false,
        ),
        option.bool(
            "89701",
            "Pumpkin Warlock Hat",
            'Mode: [select] only\nShould the bot buy "Pumpkin Warlock Hat" ?',
            false,
        ),
        option.bool(
            "89702",
            "Pumpkin Witch Hat",
            'Mode: [select] only\nShould the bot buy "Pumpkin Witch Hat" ?',
            false,
        ),
        option.bool(
            "89703",
            "Pumpkin Witch Ponytail Hat",
            'Mode: [select] only\nShould the bot buy "Pumpkin Witch Ponytail Hat" ?',
            false,
        ),
        option.bool(
            "89704",
            "Pumpkin Witch Twintail Hat",
            'Mode: [select] only\nShould the bot buy "Pumpkin Witch Twintail Hat" ?',
            false,
        ),
        option.bool("96369", "Elodea Visage", 'Mode: [select] only\nShould the bot buy "Elodea Visage" ?', false),
        option.bool(
            "96370",
            "Elodea's Befuddlement",
            'Mode: [select] only\nShould the bot buy "Elodea\'s Befuddlement" ?',
            false,
        ),
        option.bool("96371", "Elodea's Joy", 'Mode: [select] only\nShould the bot buy "Elodea\'s Joy" ?', false),
        option.bool("96372", "Elodea Morph", 'Mode: [select] only\nShould the bot buy "Elodea Morph" ?', false),
        option.bool("96373", "Elodea's Gloom", 'Mode: [select] only\nShould the bot buy "Elodea\'s Gloom" ?', false),
        option.bool(
            "96374",
            "Elodea's Surprise",
            'Mode: [select] only\nShould the bot buy "Elodea\'s Surprise" ?',
            false,
        ),
        option.bool("96375", "Elodea's Pout", 'Mode: [select] only\nShould the bot buy "Elodea\'s Pout" ?', false),
        option.bool("96376", "Elodea's Tears", 'Mode: [select] only\nShould the bot buy "Elodea\'s Tears" ?', false),
        option.bool(
            "95585",
            "Crimson Darkling Lamp",
            'Mode: [select] only\nShould the bot buy "Crimson Darkling Lamp" ?',
            false,
        ),
        option.bool("89707", "Mogloween Forest", 'Mode: [select] only\nShould the bot buy "Mogloween Forest" ?', false),
        option.bool(
            "89708",
            "Mangelwurzel Broom Pet",
            'Mode: [select] only\nShould the bot buy "Mangelwurzel Broom Pet" ?',
            false,
        ),
        option.bool(
            "89709",
            "Mangelwurzel Broom",
            'Mode: [select] only\nShould the bot buy "Mangelwurzel Broom" ?',
            false,
        ),
        option.bool(
            "89711",
            "Standing Mangelwurzel Broom",
            'Mode: [select] only\nShould the bot buy "Standing Mangelwurzel Broom" ?',
            false,
        ),
        option.bool(
            "95587",
            "Iron Doctor's Cane",
            'Mode: [select] only\nShould the bot buy "Iron Doctor\'s Cane" ?',
            false,
        ),
        option.bool(
            "95588",
            "Forged Doctor's Cane",
            'Mode: [select] only\nShould the bot buy "Forged Doctor\'s Cane" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: FeastoftheDepths.select,
});

export default function main(): void {
    const script = new FeastoftheDepths();
    Core.bankingBlackList.push("Acromegalia Seed", "Depths Scale", "Head of Hair");
    Core.setOptions();
    script.buyAllMerge();
    Core.setOptions(false);
}
