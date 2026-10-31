/*
name: Dawnsanctum Merge
description: This bot will farm the items belonging to the selected mode for the Dawnsanctum Merge [2505] in /dawnsanctum
tags: dawnsanctum, merge, dawnsanctum, gramiels, celestial, enoch, enochs, glorified, hollowborn, draconian, hollow, beast, tamer, claws, vindicated, assassin, dirk, soldier, dawn, priest, tome, grace, texts, spellbooks, grimoires
*/
// Port of Scripts/Hollowborn/MergeShops/DawnsanctumMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { HollowSoul } from "../materials/HollowSoul";
import { CoreHollowbornStory } from "../../story/hollowborn/CoreHollowbornStory";

const Adv = new CoreAdvanced();
const HBS = new CoreHollowbornStory();
const HS = new HollowSoul();

export class DawnsanctumMerge {
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
                case "Vindicator Badge":
                    VindicatorBadge(quant);
                    break;
                case "Grace Orb":
                    GraceOrb(quant);
                    break;
                case "Vindicator Crest":
                    VindicatorCrest(quant);
                    break;
                case "Gramiel's Emblem":

                case "Gramiel's Shattered Enoch":

                case "Gramiel's Shattered Enochs":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("dawnsanctum", "Celestial Gramiel", req.name, quant, { isTemp: false });
                    break;
                case "Hollow Soul":
                    HS.getYaSoulsHeeeere(quant);
                    break;
                case "Vindicator Draconian":

                case "Draconian Vindication Axe":

                case "Draconian Vindication Axes":
                    Core.equipClass(ClassType.Farm);
                    Core.killMonster("dawnsanctum", "r7", "Left", "Vindicator Draconian", req.name, quant, {
                        isTemp: false,
                    });
                    bot.wait.forPickup(req.name);
                    break;
                case "Hollowborn Draconian Morph":
                    Core.killMonster("dawnsanctum", "r8", "Left", "Hollowborn Draconian", req.name, undefined, {
                        isTemp: false,
                    });
                    bot.wait.forPickup(req.name);
                    break;
                case "Dawn Vindicator Helm":

                case "Dawn Vindicator Sword":

                case "Dawn Vindicator Swords":

                case "Dawn Vindicator Soldier":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    switch (req.name) {
                        case "Dawn Vindicator Helm":

                        case "Dawn Vindicator Soldier":
                            Core.huntMonster("trygve", "Vindicator Recruit", req.name, undefined, { isTemp: false });
                            break;
                        case "Dawn Vindicator Sword":
                            Core.huntMonster("trygve", "Vindicator Soldier", req.name, undefined, { isTemp: false });
                            break;
                        case "Dawn Vindicator Swords":
                            Core.huntMonster("trygve", "Vindicator Recruit", req.name, undefined, { isTemp: false });
                            break;
                    }
                    break;
                case "Vindicator Priest":

                case "Vindicator Beast Tamer":

                case "Vindicator Assassin":
                    VindicatorCrest(20);
                    Adv.buyItem("neotower", 2474, req.name);
                    break;
                case "Vindicator Assassin Mask":

                case "Vindicator Beast Tamer Hood":

                case "Vindicator Beast Tamer Mask":

                case "Vindicator Priest Mask":
                    VindicatorCrest(10);
                    Adv.buyItem("neotower", 2474, req.name);
                    bot.wait.forPickup(req.name);
                    break;
                case "Vindicator Assassin Hood":

                case "Vindicator Assassin Dirk":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonsterMapID("neotower", 12, req.name, quant, { isTemp: false });
                    bot.wait.forPickup(req.name);
                    break;
                case "Vindicator Beast Tamer Claws":

                case "Vindicator Priest Staff":

                case "Vindicator Assassin Daggers":
                    VindicatorCrest(15);
                    Adv.buyItem("neotower", 2474, req.name);
                    bot.wait.forPickup(req.name);
                    break;
                case "Dawn Vindication Grace Texts":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonsterMapID("neotower", 28, "Dawn Vindication Tome", undefined, { isTemp: false });
                    Core.huntMonsterMapID("neotower", 28, "Dawn Vindication Spellbooks", undefined, { isTemp: false });
                    Core.huntMonsterMapID("neotower", 28, "Dawn Vindication Grimoires", undefined, { isTemp: false });
                    Adv.buyItem("neotower", 2474, req.name);
                    bot.wait.forPickup(req.name);
                    break;
                case "Dawn Vindication Tome":

                case "Dawn Vindication Spellbooks":

                case "Dawn Vindication Grimoires":

                case "Vindicator Priest Hood":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonsterMapID("neotower", 28, req.name, quant, { isTemp: false });
                    bot.wait.forPickup(req.name);
                    break;
            }
        };
        const VindicatorCrest = (quant: number): void => {
            if (Core.checkInventory("Vindicator Crest", quant)) {
                return;
            }

            Core.farmingLogger("Vindicator Crest", quant);
            Core.addDrop("Vindicator Crest");
            Core.equipClass(ClassType.Farm);
            Core.registerQuests(9865);
            while (!bot.shouldExit && !Core.checkInventory("Vindicator Crest", quant)) {
                Core.huntMonsterMapID("neotower", 12, "Vindicated Blades");
                Core.huntMonsterMapID("neotower", 17, "Vindicated Chain");
                Core.huntMonsterMapID("neotower", 28, "Vindicated Scripture");
                bot.wait.forPickup("Vindicator Crest");
            }
            Core.cancelRegisteredQuests();
        };
        const VindicatorBadge = (quant: number): void => {
            if (Core.checkInventory("Vindicator Badge", quant)) {
                return;
            }

            Core.farmingLogger("Vindicator Badge", quant);
            bot.quests.updateQuest(8297);
            Core.registerQuests(8299);
            while (!bot.shouldExit && !Core.checkInventory("Vindicator Badge", quant)) {
                Core.equipClass(ClassType.Farm);
                Core.killMonster("trygve", "r3", "Left", "Blood Eagle", "Eagle Heart", 8);
                Core.killMonster("trygve", "r4", "Left", "Rune Boar", "Boar Heart", 8);
                Core.equipClass(ClassType.Solo);
                Core.huntMonster("trygve", "Gramiel", "Vindicator Seal");
                bot.wait.forPickup("Vindicator Badge");
            }
            Core.cancelRegisteredQuests();
        };
        const GraceOrb = (quant: number): void => {
            Core.farmingLogger("Grace Orb", quant);
            Core.equipClass(ClassType.Farm);
            Core.registerQuests(9291);
            while (!bot.shouldExit && !Core.checkInventory("Grace Orb", quant)) {
                Core.huntMonster("neofortress", "Vindicator Recruit", "Grace Extracted", 20, {
                    isTemp: false,
                    log: false,
                });
                bot.wait.forPickup("Grace Orb");
            }
            Core.cancelRegisteredQuests();
        };
        HBS.dawnSanctum();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("dawnsanctum", 2505, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part

        //#region Farm Area

        // void GramielsEmblem(int quant)
        // {
        //     if (Core.CheckInventory("Gramiel's Emblem", quant))
        //         return;

        //     Core.FarmingLogger("Gramiel's Emblem", quant);
        //     Core.AddDrop("Gramiel's Emblem");
        //     Core.EquipClass(ClassType.Solo);

        //     Core.HuntMonster("dawnsanctum", "Celestial Gramiel", "Gramiel's Emblem", quant, isTemp: false);
        //     Bot.Wait.ForPickup("Gramiel's Emblem");
        // }

        // bool IsShopLoaded(string? mapName, string? shopName)
        // {
        //     return Bot.Map.Name == mapName && Bot.Shops.IsLoaded && Bot.Shops.Name == shopName;
        // }

        //#endregion Farm Area
    }

    static readonly select = [
        option.bool(
            "89889",
            "Gramiel's Celestial Enoch",
            'Mode: [select] only\nShould the bot buy "Gramiel\'s Celestial Enoch" ?',
            false,
        ),
        option.bool(
            "89890",
            "Gramiel's Celestial Enochs",
            'Mode: [select] only\nShould the bot buy "Gramiel\'s Celestial Enochs" ?',
            false,
        ),
        option.bool(
            "89887",
            "Gramiel's Glorified Enoch",
            'Mode: [select] only\nShould the bot buy "Gramiel\'s Glorified Enoch" ?',
            false,
        ),
        option.bool(
            "89888",
            "Gramiel's Glorified Enochs",
            'Mode: [select] only\nShould the bot buy "Gramiel\'s Glorified Enochs" ?',
            false,
        ),
        option.bool(
            "89898",
            "Hollowborn Draconian",
            'Mode: [select] only\nShould the bot buy "Hollowborn Draconian" ?',
            false,
        ),
        option.bool(
            "89900",
            "Hollowborn Draconian Mask",
            'Mode: [select] only\nShould the bot buy "Hollowborn Draconian Mask" ?',
            false,
        ),
        option.bool(
            "89901",
            "Hollowborn Draconian Helm",
            'Mode: [select] only\nShould the bot buy "Hollowborn Draconian Helm" ?',
            false,
        ),
        option.bool(
            "89902",
            "Hollow Draconian Axe",
            'Mode: [select] only\nShould the bot buy "Hollow Draconian Axe" ?',
            false,
        ),
        option.bool(
            "89903",
            "Hollow Draconian Axes",
            'Mode: [select] only\nShould the bot buy "Hollow Draconian Axes" ?',
            false,
        ),
        option.bool(
            "89904",
            "Hollowborn Beast Tamer",
            'Mode: [select] only\nShould the bot buy "Hollowborn Beast Tamer" ?',
            false,
        ),
        option.bool(
            "89905",
            "Hollowborn Beast Tamer Mask",
            'Mode: [select] only\nShould the bot buy "Hollowborn Beast Tamer Mask" ?',
            false,
        ),
        option.bool(
            "89906",
            "Hollowborn Beast Tamer Hood",
            'Mode: [select] only\nShould the bot buy "Hollowborn Beast Tamer Hood" ?',
            false,
        ),
        option.bool(
            "89908",
            "Hollowborn Beast Tamer Claws",
            'Mode: [select] only\nShould the bot buy "Hollowborn Beast Tamer Claws" ?',
            false,
        ),
        option.bool(
            "89909",
            "Vindicated Hollowborn Assassin",
            'Mode: [select] only\nShould the bot buy "Vindicated Hollowborn Assassin" ?',
            false,
        ),
        option.bool(
            "89910",
            "Hollowborn Assassin Mask",
            'Mode: [select] only\nShould the bot buy "Hollowborn Assassin Mask" ?',
            false,
        ),
        option.bool(
            "89911",
            "Hollowborn Assassin Hood",
            'Mode: [select] only\nShould the bot buy "Hollowborn Assassin Hood" ?',
            false,
        ),
        option.bool(
            "89912",
            "Hollowborn Assassin Dirk",
            'Mode: [select] only\nShould the bot buy "Hollowborn Assassin Dirk" ?',
            false,
        ),
        option.bool(
            "89913",
            "Hollowborn Assassin Daggers",
            'Mode: [select] only\nShould the bot buy "Hollowborn Assassin Daggers" ?',
            false,
        ),
        option.bool(
            "89914",
            "Vindicated Hollowborn Soldier",
            'Mode: [select] only\nShould the bot buy "Vindicated Hollowborn Soldier" ?',
            false,
        ),
        option.bool(
            "89915",
            "Hollowborn Soldier Helm",
            'Mode: [select] only\nShould the bot buy "Hollowborn Soldier Helm" ?',
            false,
        ),
        option.bool(
            "89916",
            "Vindicated Dawn Blade",
            'Mode: [select] only\nShould the bot buy "Vindicated Dawn Blade" ?',
            false,
        ),
        option.bool(
            "89917",
            "Vindicated Dawn Blades",
            'Mode: [select] only\nShould the bot buy "Vindicated Dawn Blades" ?',
            false,
        ),
        option.bool(
            "89918",
            "Vindicated Hollowborn Priest",
            'Mode: [select] only\nShould the bot buy "Vindicated Hollowborn Priest" ?',
            false,
        ),
        option.bool(
            "89919",
            "Vindicated Hollowborn Priest Mask",
            'Mode: [select] only\nShould the bot buy "Vindicated Hollowborn Priest Mask" ?',
            false,
        ),
        option.bool(
            "89920",
            "Vindicated Hollowborn Priest Hood",
            'Mode: [select] only\nShould the bot buy "Vindicated Hollowborn Priest Hood" ?',
            false,
        ),
        option.bool("89921", "Hollow Dawn Tome", 'Mode: [select] only\nShould the bot buy "Hollow Dawn Tome" ?', false),
        option.bool(
            "89922",
            "Hollow Grace Texts",
            'Mode: [select] only\nShould the bot buy "Hollow Grace Texts" ?',
            false,
        ),
        option.bool(
            "89923",
            "Hollow Dawn Spellbooks",
            'Mode: [select] only\nShould the bot buy "Hollow Dawn Spellbooks" ?',
            false,
        ),
        option.bool(
            "89924",
            "Hollow Dawn Grimoires",
            'Mode: [select] only\nShould the bot buy "Hollow Dawn Grimoires" ?',
            false,
        ),
        option.bool(
            "89925",
            "Hollowborn Priest Staff",
            'Mode: [select] only\nShould the bot buy "Hollowborn Priest Staff" ?',
            false,
        ),
        option.bool(
            "90518",
            "Dawn Vindicator Castle",
            'Mode: [select] only\nShould the bot buy "Dawn Vindicator Castle" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DawnsanctumMerge.select,
});

export default function main(): void {
    const script = new DawnsanctumMerge();
    Core.bankingBlackList.push(
        "Vindicator Badge",
        "Grace Orb",
        "Vindicator Crest",
        "Gramiel's Emblem",
        "Gramiel's Shattered Enoch",
        "Gramiel's Shattered Enochs",
        "Hollow Soul",
        "Vindicator Draconian",
        "Hollowborn Draconian Morph",
        "Draconian Vindication Axe",
        "Draconian Vindication Axes",
        "Vindicator Beast Tamer",
        "Vindicator Beast Tamer Mask",
        "Vindicator Beast Tamer Hood",
        "Vindicator Beast Tamer Claws",
        "Vindicator Assassin",
        "Vindicator Assassin Mask",
        "Vindicator Assassin Hood",
        "Vindicator Assassin Dirk",
        "Vindicator Assassin Daggers",
        "Dawn Vindicator Soldier",
        "Dawn Vindicator Helm",
        "Dawn Vindicator Sword",
        "Dawn Vindicator Swords",
        "Vindicator Priest",
        "Vindicator Priest Mask",
        "Vindicator Priest Hood",
        "Dawn Vindication Tome",
        "Dawn Vindication Grace Texts",
        "Dawn Vindication Spellbooks",
        "Dawn Vindication Grimoires",
        "Vindicator Priest Staff",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
