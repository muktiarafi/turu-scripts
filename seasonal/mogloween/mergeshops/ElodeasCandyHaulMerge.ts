/*
name: Elodeas Candy Haul Merge
description: This bot will farm the items belonging to the selected mode for the Elodeas Candy Haul Merge [2632] in /eldritchworld
tags: elodeas, candy, haul, merge, eldritchworld, gold, voucher, k, horc, warrior, thok, magical, mariner, arcana, cat, burglar, metrea, thunder, flurry, juvania, aegean, calabaza, pumpkin, kings, twilight, peril, kabocha, killer, naginata, nocturne, penumbra
*/
// Port of Scripts/Seasonal/Mogloween/MergeShops/ElodeasCandyHaulMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreMogloween } from "../CoreMogloween";
import { UngourdlyGearMerge } from "./UngourdlyGearMerge";
import { WarMonger } from "../../../story/TrainersStory";

const Adv = new CoreAdvanced();
const Mog = new CoreMogloween();
const UGM = new UngourdlyGearMerge();
const warMonger = new WarMonger();

export class ElodeasCandyHaulMerge {
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
                case "Nudibranch Roe":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonsterQuest(10458, "eldritchworld", "Nudibranch");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Barnacle Rash":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonsterQuest(10459, "eldritchworld", "Infested Fisherman");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Shrimp Noodle Pack":
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
                case "Dzeza Welcome Pack":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonsterQuest(10461, "eldritchworld", "Dzeza Cultist");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Dzeza Coconuts":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonsterQuest(10462, "eldritchworld", "Dzeza Sapling");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Desiccated Bulbs":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonsterQuest(10463, "eldritchworld", "Infested Mummy");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Head of Hair":
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
                case "Bucket of Molars":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonsterQuest(10464, "eldritchworld", "Mass of Teeth");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Thok's War Armor":

                case "Thok's Hair":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.buyItem("classhalla", 170, req.name, quant);
                    break;
                case "Arcana's Vesture":

                case "Arcana's Locks":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Adv.buyItem("classhalla", 174, req.name, quant);
                    break;
                case "Metrea's Garb":

                case "Metrea's Locks":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Adv.buyItem("classhalla", 172, req.name, quant);
                    break;
                case "Juvania's Robes":

                case "Juvania's Locks":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Adv.buyItem("classhalla", 176, req.name, quant);
                    break;
                case "Great Calabaza Blade":

                case "Great Calabaza Blades":

                case "Pumpkin King's Revenge":

                case "Dual Pumpkin King's Revenge":

                case "Pumpkin Fever Staff":

                case "Kabocha King Naginata":

                case "Pumpkin King's Wrath":

                case "Dual Pumpkin King's Wrath":

                case "Pumpkin Fever Axe":

                case "Pumpkin Fever Axes":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    UGM.buyAllMerge(req.name);
                    break;
                //#endregion
            }
        };
        warMonger.trainers();
        Mog.eldritchWorld();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("eldritchworld", 2632, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "96437",
            "Horc Warrior Thok",
            'Mode: [select] only\nShould the bot buy "Horc Warrior Thok" ?',
            false,
        ),
        option.bool(
            "96438",
            "Magical Mariner Arcana",
            'Mode: [select] only\nShould the bot buy "Magical Mariner Arcana" ?',
            false,
        ),
        option.bool(
            "96439",
            "Cat Burglar Metrea",
            'Mode: [select] only\nShould the bot buy "Cat Burglar Metrea" ?',
            false,
        ),
        option.bool(
            "96440",
            "Thunder Flurry Juvania",
            'Mode: [select] only\nShould the bot buy "Thunder Flurry Juvania" ?',
            false,
        ),
        option.bool(
            "89583",
            "Aegean Calabaza Blade",
            'Mode: [select] only\nShould the bot buy "Aegean Calabaza Blade" ?',
            false,
        ),
        option.bool(
            "89584",
            "Aegean Calabaza Blades",
            'Mode: [select] only\nShould the bot buy "Aegean Calabaza Blades" ?',
            false,
        ),
        option.bool(
            "89585",
            "Pumpkin King's Twilight",
            'Mode: [select] only\nShould the bot buy "Pumpkin King\'s Twilight" ?',
            false,
        ),
        option.bool(
            "89586",
            "Dual Pumpkin King's Twilight",
            'Mode: [select] only\nShould the bot buy "Dual Pumpkin King\'s Twilight" ?',
            false,
        ),
        option.bool(
            "89587",
            "Pumpkin Peril Staff",
            'Mode: [select] only\nShould the bot buy "Pumpkin Peril Staff" ?',
            false,
        ),
        option.bool(
            "89588",
            "Kabocha Killer Naginata",
            'Mode: [select] only\nShould the bot buy "Kabocha Killer Naginata" ?',
            false,
        ),
        option.bool(
            "89589",
            "Pumpkin King's Nocturne",
            'Mode: [select] only\nShould the bot buy "Pumpkin King\'s Nocturne" ?',
            false,
        ),
        option.bool(
            "89590",
            "Dual Pumpkin King's Nocturne",
            'Mode: [select] only\nShould the bot buy "Dual Pumpkin King\'s Nocturne" ?',
            false,
        ),
        option.bool(
            "89591",
            "Penumbra Pumpkin Axe",
            'Mode: [select] only\nShould the bot buy "Penumbra Pumpkin Axe" ?',
            false,
        ),
        option.bool(
            "89592",
            "Penumbra Pumpkin Axes",
            'Mode: [select] only\nShould the bot buy "Penumbra Pumpkin Axes" ?',
            false,
        ),
        option.bool(
            "96536",
            "Horc Warrior Thok Mask",
            'Mode: [select] only\nShould the bot buy "Horc Warrior Thok Mask" ?',
            false,
        ),
        option.bool(
            "96537",
            "Magical Mariner Arcana Mask",
            'Mode: [select] only\nShould the bot buy "Magical Mariner Arcana Mask" ?',
            false,
        ),
        option.bool(
            "96538",
            "Cat Burglar Metrea Mask",
            'Mode: [select] only\nShould the bot buy "Cat Burglar Metrea Mask" ?',
            false,
        ),
        option.bool(
            "96539",
            "Thunder Flurry Juvania Mask",
            'Mode: [select] only\nShould the bot buy "Thunder Flurry Juvania Mask" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ElodeasCandyHaulMerge.select,
});

export default function main(): void {
    const script = new ElodeasCandyHaulMerge();
    Core.bankingBlackList.push(
        "Nudibranch Roe",
        "Barnacle Rash",
        "Shrimp Noodle Pack",
        "Dzeza Welcome Pack",
        "Dzeza Coconuts",
        "Desiccated Bulbs",
        "Head of Hair",
        "Bucket of Molars",
        "Thok's War Armor",
        "Arcana's Vesture",
        "Metrea's Garb",
        "Juvania's Robes",
        "Great Calabaza Blade",
        "Great Calabaza Blades",
        "Pumpkin King's Revenge",
        "Dual Pumpkin King's Revenge",
        "Pumpkin Fever Staff",
        "Kabocha King Naginata",
        "Pumpkin King's Wrath",
        "Dual Pumpkin King's Wrath",
        "Pumpkin Fever Axe",
        "Pumpkin Fever Axes",
        "Thok's Hair",
        "Arcana's Locks",
        "Metrea's Locks",
        "Juvania's Locks",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
