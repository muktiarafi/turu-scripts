/*
name: Bryns Merge
description: This bot will farm the items belonging to the selected mode for the Bryns Merge [2748] in /templeofdoom
tags: bryns, merge, templeofdoom, doomed, shadowscythe, knight, ornate, shadow, greataxe, shadows, silk, cloak, wrap, greataxes, soulshredders, carcossan, orbs, morph, determination, trihorned, blazing, darkness, resolution, orb, halberd, dulcinea, soulshredder
*/
// Port of Scripts/Other/MergeShops/BrynsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class BrynsMerge {
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
                case "Empty Vessel":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.registerQuests(10811);
                    // TODO: Replace with actual quest ID
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonster("templeofdoom", "Emptiness", "Blank Space", 3, { isTemp: true });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Leech's Sucker":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.registerQuests(10812);
                    // TODO: Replace with actual quest ID
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonster("templeofdoom", "Doom Leech", "Leech Innards", 50, { isTemp: true });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Tainted Armor Scrap":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.registerQuests(10810);
                    // TODO: Replace with actual quest ID
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonster("templeofdoom", "Tainted Paladin", "Withered Light", 9, { isTemp: true });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Doom Lily":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.registerQuests(10813);
                    // TODO: Replace with actual quest ID
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonster("templeofdoom", "Downfall of Empires", "Dahlia's Hairpin", 1, {
                            isTemp: true,
                        });
                        //unsoloable
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                //#endregion
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("templeofdoom", 2748, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "102209",
            "Doomed ShadowScythe Knight",
            'Mode: [select] only\nShould the bot buy "Doomed ShadowScythe Knight" ?',
            false,
        ),
        option.bool(
            "102220",
            "Ornate ShadowScythe Knight",
            'Mode: [select] only\nShould the bot buy "Ornate ShadowScythe Knight" ?',
            false,
        ),
        option.bool(
            "102226",
            "Ornate Shadow GreatAxe",
            'Mode: [select] only\nShould the bot buy "Ornate Shadow GreatAxe" ?',
            false,
        ),
        option.bool(
            "102218",
            "Doomed GreatAxe of Shadows",
            'Mode: [select] only\nShould the bot buy "Doomed GreatAxe of Shadows" ?',
            false,
        ),
        option.bool(
            "102216",
            "Silk ShadowScythe Cloak",
            'Mode: [select] only\nShould the bot buy "Silk ShadowScythe Cloak" ?',
            false,
        ),
        option.bool(
            "102224",
            "Ornate Silk Shadow Wrap",
            'Mode: [select] only\nShould the bot buy "Ornate Silk Shadow Wrap" ?',
            false,
        ),
        option.bool(
            "102227",
            "Ornate Shadow GreatAxes",
            'Mode: [select] only\nShould the bot buy "Ornate Shadow GreatAxes" ?',
            false,
        ),
        option.bool(
            "102219",
            "Doomed GreatAxes of Shadows",
            'Mode: [select] only\nShould the bot buy "Doomed GreatAxes of Shadows" ?',
            false,
        ),
        option.bool(
            "96188",
            "Doomed Soulshredders",
            'Mode: [select] only\nShould the bot buy "Doomed Soulshredders" ?',
            false,
        ),
        option.bool(
            "96194",
            "Doomed Carcossan Orbs",
            'Mode: [select] only\nShould the bot buy "Doomed Carcossan Orbs" ?',
            false,
        ),
        option.bool(
            "102210",
            "Morph of Determination",
            'Mode: [select] only\nShould the bot buy "Morph of Determination" ?',
            false,
        ),
        option.bool(
            "102211",
            "Visage of Determination",
            'Mode: [select] only\nShould the bot buy "Visage of Determination" ?',
            false,
        ),
        option.bool("102212", "Doomed Hair", 'Mode: [select] only\nShould the bot buy "Doomed Hair" ?', false),
        option.bool("102213", "Doomed Locks", 'Mode: [select] only\nShould the bot buy "Doomed Locks" ?', false),
        option.bool(
            "102214",
            "Tri-Horned Shadow Helm",
            'Mode: [select] only\nShould the bot buy "Tri-Horned Shadow Helm" ?',
            false,
        ),
        option.bool(
            "102215",
            "Blazing Darkness Helmet",
            'Mode: [select] only\nShould the bot buy "Blazing Darkness Helmet" ?',
            false,
        ),
        option.bool(
            "102221",
            "Morph of Resolution",
            'Mode: [select] only\nShould the bot buy "Morph of Resolution" ?',
            false,
        ),
        option.bool(
            "102222",
            "Ornate Tri-Horned Helm",
            'Mode: [select] only\nShould the bot buy "Ornate Tri-Horned Helm" ?',
            false,
        ),
        option.bool(
            "102223",
            "Ornate Shadow Helmet",
            'Mode: [select] only\nShould the bot buy "Ornate Shadow Helmet" ?',
            false,
        ),
        option.bool(
            "96193",
            "Doomed Carcossan Orb",
            'Mode: [select] only\nShould the bot buy "Doomed Carcossan Orb" ?',
            false,
        ),
        option.bool(
            "102225",
            "Ornate Halberd of Shadows",
            'Mode: [select] only\nShould the bot buy "Ornate Halberd of Shadows" ?',
            false,
        ),
        option.bool(
            "102217",
            "Doomed Halberd of Shadows",
            'Mode: [select] only\nShould the bot buy "Doomed Halberd of Shadows" ?',
            false,
        ),
        option.bool(
            "96189",
            "Doomed Staff of Dulcinea",
            'Mode: [select] only\nShould the bot buy "Doomed Staff of Dulcinea" ?',
            false,
        ),
        option.bool(
            "96187",
            "Doomed Soulshredder",
            'Mode: [select] only\nShould the bot buy "Doomed Soulshredder" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: BrynsMerge.select,
});

export default function main(): void {
    const script = new BrynsMerge();
    Core.bankingBlackList.push("Empty Vessel", "Leech's Sucker", "Tainted Armor Scrap", "Doom Lily");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
