/*
name: Terces Invasion Merge
description: This bot will farm the items belonging to the selected mode for the Terces Invasion Merge [2670] in /tercesinvasion
tags: terces, invasion, merge, tercesinvasion, nulgaths, oathbreaker, wretched, scolex, void, archfiend, vigneron, morph, apex, bloodfiend, wings, scythe, recollection, solstice, blood, rodeleros, fiendish, wind
*/
// Port of Scripts/Nation/MergeShops/TercesInvasionMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreNation } from "../CoreNation";
import { JuggernautItemsofNulgath, RewardsSelection } from "../various/JuggernautItems";
import { TercesArchiveMerge } from "../../other/mergeshops/TercesArchiveMerge";
import { TempleSiegeMerge } from "../../seasonal/staffbirthdays/nulgath/TempleSiegeMerge";
import { TercesInvasion } from "../../story/nation/TercesInvasion";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const Nation = new CoreNation();
const TAM = new TercesArchiveMerge();
const TSM = new TempleSiegeMerge();
const Jugg = new JuggernautItemsofNulgath();
const TI = new TercesInvasion();

export class TercesInvasionMerge {
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
                case "Wrath of Nulgath E":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Farm.bludrutBrawlBoss(undefined, quant * 350);
                    Adv.buyItem("battleon", 222, req.name, quant);
                    break;
                case "Fiendish Fury of Ascension":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    TAM.buyAllMerge(req.name);
                    break;
                case "Evolved DragonFire of Nulgath":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    TSM.buyAllMerge(req.name);
                    break;
                case "Purified Claw of Nulgath":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.ensureAccept(668);
                    Nation.farmTaintedGem(7);
                    Nation.supplies("Claw of Nulgath");
                    Core.resetQuest(7551);
                    Core.darkMakaiItem("Dark Makai Sigil");
                    Core.ensureComplete(668);
                    bot.wait.forPickup(req.name);
                    break;
                case "Polish Hussar Spear":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Jugg.juggItems(RewardsSelection.Polish_Hussar_Spear);
                    break;
                case "Makai Bloodtaker":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.registerQuests(4008);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonster("tercessuinotlim", "Dark Makai");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Blood From the Void":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonsterQuest(
                            Core.isMember ? 10583 : 10582,
                            ["tercesinvasion", "Archfiend Rodeleros", ClassType.Solo],
                            ["tercesinvasion", "Archfiend Vigneron", ClassType.Solo],
                            ["tercesinvasion", "Archfiend Casimir", ClassType.Solo],
                        );
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Solstice Blood Axe":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    Core.huntMonster("tercesinvasion", "Archfiend Vigneron", req.name, quant, {
                        isTemp: req.temp,
                        log: false,
                    });
                    break;
                //#endregion
                //#region Known items
                case "Blade of Affliction":
                    Core.farmingLogger(req.name, quant);
                    Core.buyItem("Tercessuinotlim", 68, req.name, quant);
                    break;
                case "Unidentified 13":
                    Nation.farmUni13(quant);
                    break;
                case "Blood Gem of the Archfiend":
                    Nation.farmBloodGem(quant);
                    break;
                //#endregion
            }
        };
        TI.storyLine();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("tercesinvasion", 2670, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "90517",
            "Nulgath's Oathbreaker",
            'Mode: [select] only\nShould the bot buy "Nulgath\'s Oathbreaker" ?',
            false,
        ),
        option.bool(
            "98493",
            "Wretched Scolex of the Void",
            'Mode: [select] only\nShould the bot buy "Wretched Scolex of the Void" ?',
            false,
        ),
        option.bool(
            "98907",
            "Archfiend Vigneron",
            'Mode: [select] only\nShould the bot buy "Archfiend Vigneron" ?',
            false,
        ),
        option.bool(
            "98908",
            "Archfiend Vigneron Morph",
            'Mode: [select] only\nShould the bot buy "Archfiend Vigneron Morph" ?',
            false,
        ),
        option.bool(
            "98909",
            "Apex Bloodfiend Wings",
            'Mode: [select] only\nShould the bot buy "Apex Bloodfiend Wings" ?',
            false,
        ),
        option.bool(
            "98999",
            "Scythe of Recollection",
            'Mode: [select] only\nShould the bot buy "Scythe of Recollection" ?',
            false,
        ),
        option.bool(
            "99002",
            "Solstice Blood Axes",
            'Mode: [select] only\nShould the bot buy "Solstice Blood Axes" ?',
            false,
        ),
        option.bool(
            "99003",
            "Archfiend Rodeleros",
            'Mode: [select] only\nShould the bot buy "Archfiend Rodeleros" ?',
            false,
        ),
        option.bool(
            "99004",
            "Archfiend Rodeleros Visage",
            'Mode: [select] only\nShould the bot buy "Archfiend Rodeleros Visage" ?',
            false,
        ),
        option.bool("99005", "Fiendish Wind", 'Mode: [select] only\nShould the bot buy "Fiendish Wind" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: TercesInvasionMerge.select,
});

export default function main(): void {
    const script = new TercesInvasionMerge();
    Core.bankingBlackList.push(
        "Wrath of Nulgath E",
        "Fiendish Fury of Ascension",
        "Evolved DragonFire of Nulgath",
        "Purified Claw of Nulgath",
        "Blade of Affliction",
        "Polish Hussar Spear",
        "Makai Bloodtaker",
        "Unidentified 13",
        "Blood Gem of the Archfiend",
        "Blood From the Void",
        "Solstice Blood Axe",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
