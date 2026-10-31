/*
name: Sea Base House Merge
description: This bot will farm the items belonging to the selected mode for the Sea Base House Merge [2289] in /twilightzone
tags: sea, base, house, merge, twilightzone, stern, song, guest, taras, temporary, rest, disgruntled, mi, undine, office, desk, ominous, hero, hydration, station, server, rack, ergonomic, engineer, setup, basic, infirmary, bed, flowering, shrub, table, golden, bouquet, medical, monitor, trio, songs, seaside, portrait, sunlight, zone, workstation, chair, seabase, soft, reading, light, blue, ray, bookshelf, corner, fuel, vat, sleek, midnight, memorial, stones, occupied, experimentation, conference, couch, porthole, window, windows, slim, deep
*/
// Port of Scripts/Other/MergeShops/SeaBaseHouseMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreAOR } from "../../story/ageofruin/CoreAOR";

const Adv = new CoreAdvanced();
const AoR = new CoreAOR();

export class SeaBaseHouseMerge {
    // [Can Change] This should only be changed by the author.
    // If true, it will not stop the script if the default case triggers and the user chose to only get mats
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
                case "Sun Zone Chit":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(9252);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("sunlightzone", "Marine Snow", "Marine Sample", undefined, { log: false });
                        Core.huntMonster("sunlightzone", "Infernal Illusion", "Infernal Sample", 10, { log: false });
                        Core.huntMonster("sunlightzone", "Seraphic Illusion", "Seraphic Sample", 10, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Undine Visitor Badge":
                    Core.farmingLogger(req.name, quant);
                    Core.huntMonster("sunlightzone", "Astravian Illusion", req.name, quant, {
                        isTemp: false,
                        log: false,
                    });
                    break;
                case "Undine Base Scrip":
                    Core.farmingLogger(req.name, quant);
                    Core.huntMonster("sunlightzone", "Marine Snow", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Sundered Tentacle":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(9269);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("twilightzone", "Leviathan", "Leviathan Tentacle", 1, {
                            isTemp: true,
                            log: false,
                        });
                        Core.huntMonster("twilightzone", "Decay Spirit", "Decay Essence", 8, {
                            isTemp: true,
                            log: false,
                        });
                        Core.huntMonster("twilightzone", "Ice Guardian", "Tarnished Icicle", 8, {
                            isTemp: true,
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Leviathan Scale":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.logger("Better to use alts to farm it faster.");
                    Core.huntMonster("twilightzone", "Leviathan", "Leviathan Scale", quant, {
                        isTemp: false,
                        log: false,
                    });
                    break;
                case "Water Elf Pearl":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(9302);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("midnightzone", "Shadow Viscera", "Fleshy Shadows", 8, { log: false });
                        Core.huntMonster("midnightzone", "Venerated Wraith", "Wraith Memento", 8, { log: false });
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("midnightzone", "Sparagmos", "Memory Card", undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Undine Coffee Table":

                case "Sleeping Monitor":

                case "Water Temple Pedestal":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("midnightzone", "Sparagmos", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Scattered Bones":

                case "Experimentation Chair":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("midnightzone", "Undead Prisoner", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Ascending Kathool Tentacle":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("abyssalzone", "The Ashray", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Ashray Trench Pedestal":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("trenchobserve", "Lady Noelle", req.name, quant, { isTemp: false, log: false });
                    break;
            }
        };
        AoR.deepWater();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("twilightzone", 2289, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "77955",
            "Stern Song House Guest",
            'Mode: [select] only\nShould the bot buy "Stern Song House Guest" ?',
            false,
        ),
        option.bool(
            "77993",
            "Tara's Temporary Rest Guest",
            'Mode: [select] only\nShould the bot buy "Tara\'s Temporary Rest Guest" ?',
            false,
        ),
        option.bool(
            "77996",
            "Disgruntled Mi Guest",
            'Mode: [select] only\nShould the bot buy "Disgruntled Mi Guest" ?',
            false,
        ),
        option.bool(
            "77997",
            "Disgruntled Song Guest",
            'Mode: [select] only\nShould the bot buy "Disgruntled Song Guest" ?',
            false,
        ),
        option.bool(
            "78248",
            "Undine Office Desk",
            'Mode: [select] only\nShould the bot buy "Undine Office Desk" ?',
            false,
        ),
        option.bool(
            "78249",
            "Ominous Undine Desk",
            'Mode: [select] only\nShould the bot buy "Ominous Undine Desk" ?',
            false,
        ),
        option.bool(
            "78247",
            "Hero Hydration Station",
            'Mode: [select] only\nShould the bot buy "Hero Hydration Station" ?',
            false,
        ),
        option.bool(
            "78250",
            "Sea Base Server Rack",
            'Mode: [select] only\nShould the bot buy "Sea Base Server Rack" ?',
            false,
        ),
        option.bool(
            "78246",
            "Ergonomic Engineer Setup",
            'Mode: [select] only\nShould the bot buy "Ergonomic Engineer Setup" ?',
            false,
        ),
        option.bool(
            "78244",
            "Basic Infirmary Bed",
            'Mode: [select] only\nShould the bot buy "Basic Infirmary Bed" ?',
            false,
        ),
        option.bool(
            "78254",
            "Flowering Shrub Table",
            'Mode: [select] only\nShould the bot buy "Flowering Shrub Table" ?',
            false,
        ),
        option.bool(
            "78255",
            "Golden Bouquet Table",
            'Mode: [select] only\nShould the bot buy "Golden Bouquet Table" ?',
            false,
        ),
        option.bool("78242", "Medical Monitor", 'Mode: [select] only\nShould the bot buy "Medical Monitor" ?', false),
        option.bool(
            "78243",
            "Medical Monitor Trio",
            'Mode: [select] only\nShould the bot buy "Medical Monitor Trio" ?',
            false,
        ),
        option.bool(
            "78241",
            "Song's Seaside Portrait",
            'Mode: [select] only\nShould the bot buy "Song\'s Seaside Portrait" ?',
            false,
        ),
        option.bool(
            "78312",
            "Sunlight Zone Workstation",
            'Mode: [select] only\nShould the bot buy "Sunlight Zone Workstation" ?',
            false,
        ),
        option.bool(
            "78311",
            "Sunlight Zone Office Desk",
            'Mode: [select] only\nShould the bot buy "Sunlight Zone Office Desk" ?',
            false,
        ),
        option.bool(
            "78313",
            "Sunlight Zone Ergonomic Chair",
            'Mode: [select] only\nShould the bot buy "Sunlight Zone Ergonomic Chair" ?',
            false,
        ),
        option.bool(
            "78245",
            "Ergonomic Engineer Chair",
            'Mode: [select] only\nShould the bot buy "Ergonomic Engineer Chair" ?',
            false,
        ),
        option.bool("78668", "Seabase Undine", 'Mode: [select] only\nShould the bot buy "Seabase Undine" ?', false),
        option.bool(
            "78684",
            "Soft Reading Light",
            'Mode: [select] only\nShould the bot buy "Soft Reading Light" ?',
            false,
        ),
        option.bool("78683", "Blue Ray Light", 'Mode: [select] only\nShould the bot buy "Blue Ray Light" ?', false),
        option.bool("78679", "Bookshelf Corner", 'Mode: [select] only\nShould the bot buy "Bookshelf Corner" ?', false),
        option.bool("78678", "Undine Fuel Vat", 'Mode: [select] only\nShould the bot buy "Undine Fuel Vat" ?', false),
        option.bool(
            "78677",
            "Sleek Table Monitor",
            'Mode: [select] only\nShould the bot buy "Sleek Table Monitor" ?',
            false,
        ),
        option.bool(
            "78676",
            "Midnight Memorial Desk",
            'Mode: [select] only\nShould the bot buy "Midnight Memorial Desk" ?',
            false,
        ),
        option.bool("78674", "Undine Stones", 'Mode: [select] only\nShould the bot buy "Undine Stones" ?', false),
        option.bool(
            "78671",
            "Occupied Experimentation Chair",
            'Mode: [select] only\nShould the bot buy "Occupied Experimentation Chair" ?',
            false,
        ),
        option.bool(
            "78669",
            "Undine Conference Couch",
            'Mode: [select] only\nShould the bot buy "Undine Conference Couch" ?',
            false,
        ),
        option.bool(
            "78692",
            "Seabase Undine Monitor",
            'Mode: [select] only\nShould the bot buy "Seabase Undine Monitor" ?',
            false,
        ),
        option.bool(
            "78691",
            "Undine Porthole Window",
            'Mode: [select] only\nShould the bot buy "Undine Porthole Window" ?',
            false,
        ),
        option.bool(
            "78690",
            "Undine Dual Windows",
            'Mode: [select] only\nShould the bot buy "Undine Dual Windows" ?',
            false,
        ),
        option.bool(
            "78689",
            "Slim Undine Window",
            'Mode: [select] only\nShould the bot buy "Slim Undine Window" ?',
            false,
        ),
        option.bool(
            "78688",
            "Seabase Undine Window",
            'Mode: [select] only\nShould the bot buy "Seabase Undine Window" ?',
            false,
        ),
        option.bool(
            "79483",
            "Deep SeaBase House",
            'Mode: [select] only\nShould the bot buy "Deep SeaBase House" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: SeaBaseHouseMerge.select,
});

export default function main(): void {
    const script = new SeaBaseHouseMerge();
    Core.bankingBlackList.push(
        "Sun Zone Chit",
        "Undine Visitor Badge",
        "Undine Base Scrip",
        "Sundered Tentacle",
        "Leviathan Scale",
        "Water Elf Pearl",
        "Undine Coffee Table",
        "Scattered Bones",
        "Experimentation Chair",
        "Sleeping Monitor",
        "Water Temple Pedestal",
        "Ascending Kathool Tentacle",
        "Ashray Trench Pedestal",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
