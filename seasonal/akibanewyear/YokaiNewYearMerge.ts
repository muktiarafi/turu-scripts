/*
name: Yokai New Year Shop
description: Farms the materials needed for Yokai New Year Shop.
tags: yokai new year, akibacny, seasonal, akiba new year, merge shop
*/
// Port of Scripts/Seasonal/AkibaNewYear/YokaiNewYearMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class YokaiNewYearMerge {
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
                case "Emblem of Righteousness":

                case "Emblem of Good Luck":

                case "Emblem of Knowledge":

                case "Emblem of Longevity":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    if (!Core.isMember) {
                        Core.registerQuests(1582);
                        while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                            Core.huntMonster("mafic", "Mafic Dragon", "Magmas Spirit");
                            bot.wait.forPickup(req.name);
                        }
                    } else {
                        Core.registerQuests(1584);
                        while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                            Core.huntMonster("j6", "Sketchy Dragon", "Scrawl Spirit");
                            bot.wait.forPickup(req.name);
                        }
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Lucky Red Envelope":

                case "Super Lucky Red Envelope":

                case "Luckier Red Envelope":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    if (!Core.isMember) {
                        if (!Core.checkInventory("Emblem of Longevity")) {
                            Core.addDrop("Emblem of Longevity");
                            Core.ensureAccept(954);
                            Core.huntMonster("mountfrost", "Snow Golem", "Icy Amulet", 5);
                            Core.huntMonster("mountfrost", "Frostwyrm Rider", "Water Amulet", 5);
                            Core.ensureComplete(954);
                        }
                        Core.registerQuests(955);
                        while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                            Core.huntMonster("creatures", "Black Tortoise", req.name, quant);
                            bot.wait.forPickup(req.name);
                        }
                    } else {
                        Core.registerQuests(1584);
                        while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                            Core.huntMonster("j6", "Sketchy Dragon", req.name, quant);
                            bot.wait.forPickup(req.name);
                        }
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Bunny":
                    Adv.buyItem("ariapet", 12, "Bunny");
                    break;
                case "Gold Medallion":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("akibacny", "Hinezumi", req.name, quant);
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Lunar Firecracker":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(7923);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("akibacny", "Lu Niu", req.name, quant);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Fuchsia Dye":

                case "Magenta Dye":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    if (!Core.isMember) {
                        Core.registerQuests(1489);
                        while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                            Core.huntMonster("sandsea", "Cactus Creeper", "Fandango Flower", 5);
                            Core.killMonster("wanders", "r2", "Down", "Lotus Spider", "Lotus Flower", 4);
                            bot.wait.forPickup(req.name);
                        }
                    } else {
                        Core.registerQuests(1490);
                        while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                            Core.huntMonster("uppercity", "Rhino Beetle", "Carmine Pigment", 4);
                            Core.huntMonster("doomwood", "Doomwood Treeant", "Cerise Flower", 3);
                            Core.huntMonster("voltaire", "Fishbones", "Anthurium Flower");
                            bot.wait.forPickup(req.name);
                        }
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("akibacny")) {
            return;
        }
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("akibacny", 252, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("33676", "Chinese Umbrella", 'Mode: [select] only\nShould the bot buy "Chinese Umbrella" ?', false),
        option.bool("33636", "Stenciled Fan", 'Mode: [select] only\nShould the bot buy "Stenciled Fan" ?', false),
        option.bool("33677", "Deadly Fan", 'Mode: [select] only\nShould the bot buy "Deadly Fan" ?', false),
        option.bool(
            "33637",
            "Colorful Stenciled Fan",
            'Mode: [select] only\nShould the bot buy "Colorful Stenciled Fan" ?',
            false,
        ),
        option.bool(
            "33638",
            "Colorful Deadly Fan",
            'Mode: [select] only\nShould the bot buy "Colorful Deadly Fan" ?',
            false,
        ),
        option.bool(
            "33639",
            "Dynasty's Destiny Blade",
            'Mode: [select] only\nShould the bot buy "Dynasty\'s Destiny Blade" ?',
            false,
        ),
        option.bool(
            "33640",
            "Descendant of the Dragon",
            'Mode: [select] only\nShould the bot buy "Descendant of the Dragon" ?',
            false,
        ),
        option.bool(
            "33642",
            "Helm of the Dragon Dance",
            'Mode: [select] only\nShould the bot buy "Helm of the Dragon Dance" ?',
            false,
        ),
        option.bool(
            "33643",
            "Dragon Dance Tail",
            'Mode: [select] only\nShould the bot buy "Dragon Dance Tail" ?',
            false,
        ),
        option.bool("33641", "Gold FooPup", 'Mode: [select] only\nShould the bot buy "Gold FooPup" ?', false),
        option.bool("33644", "Red FooPup", 'Mode: [select] only\nShould the bot buy "Red FooPup" ?', false),
        option.bool("33645", "Blue FooPup", 'Mode: [select] only\nShould the bot buy "Blue FooPup" ?', false),
        option.bool(
            "33646",
            "Dragon Dance Fire Stick",
            'Mode: [select] only\nShould the bot buy "Dragon Dance Fire Stick" ?',
            false,
        ),
        option.bool(
            "33647",
            "Lucky Coin Katana",
            'Mode: [select] only\nShould the bot buy "Lucky Coin Katana" ?',
            false,
        ),
        option.bool("33649", "Lunisolar Katana", 'Mode: [select] only\nShould the bot buy "Lunisolar Katana" ?', false),
        option.bool("33650", "Blue FooDog", 'Mode: [select] only\nShould the bot buy "Blue FooDog" ?', false),
        option.bool("33651", "Red FooDog", 'Mode: [select] only\nShould the bot buy "Red FooDog" ?', false),
        option.bool("33654", "Gold FooDog", 'Mode: [select] only\nShould the bot buy "Gold FooDog" ?', false),
        option.bool("33652", "Red FooDog Morph", 'Mode: [select] only\nShould the bot buy "Red FooDog Morph" ?', false),
        option.bool(
            "33653",
            "White FooDog Morph",
            'Mode: [select] only\nShould the bot buy "White FooDog Morph" ?',
            false,
        ),
        option.bool(
            "6855",
            "Year of the Rabbit Warrior",
            'Mode: [select] only\nShould the bot buy "Year of the Rabbit Warrior" ?',
            false,
        ),
        option.bool(
            "6856",
            "Warrior of the Rabbit Helm",
            'Mode: [select] only\nShould the bot buy "Warrior of the Rabbit Helm" ?',
            false,
        ),
        option.bool(
            "6857",
            "Year of the Rabbit Morph",
            'Mode: [select] only\nShould the bot buy "Year of the Rabbit Morph" ?',
            false,
        ),
        option.bool(
            "6858",
            "Cuniculus Decimator",
            'Mode: [select] only\nShould the bot buy "Cuniculus Decimator" ?',
            false,
        ),
        option.bool("6859", "Rabbit Cannon", 'Mode: [select] only\nShould the bot buy "Rabbit Cannon" ?', false),
        option.bool("6860", "Dragon Bunny", 'Mode: [select] only\nShould the bot buy "Dragon Bunny" ?', false),
        option.bool(
            "6861",
            "Golden Rabbit Longsword",
            'Mode: [select] only\nShould the bot buy "Golden Rabbit Longsword" ?',
            false,
        ),
        option.bool(
            "6862",
            "Golden Rabbit Daggers",
            'Mode: [select] only\nShould the bot buy "Golden Rabbit Daggers" ?',
            false,
        ),
        option.bool(
            "33655",
            "Serpent Parade Violet",
            'Mode: [select] only\nShould the bot buy "Serpent Parade Violet" ?',
            false,
        ),
        option.bool(
            "33656",
            "Serpent Parade Red",
            'Mode: [select] only\nShould the bot buy "Serpent Parade Red" ?',
            false,
        ),
        option.bool(
            "33657",
            "Serpent Parade Green",
            'Mode: [select] only\nShould the bot buy "Serpent Parade Green" ?',
            false,
        ),
        option.bool(
            "33658",
            "Serpent Parade Blue",
            'Mode: [select] only\nShould the bot buy "Serpent Parade Blue" ?',
            false,
        ),
        option.bool(
            "33751",
            "Horse Tail Katana",
            'Mode: [select] only\nShould the bot buy "Horse Tail Katana" ?',
            false,
        ),
        option.bool(
            "33752",
            "Dual Horse Tail Katanas",
            'Mode: [select] only\nShould the bot buy "Dual Horse Tail Katanas" ?',
            false,
        ),
        option.bool(
            "33661",
            "Celebration Katana",
            'Mode: [select] only\nShould the bot buy "Celebration Katana" ?',
            false,
        ),
        option.bool(
            "33662",
            "Dual Celebration Katanas",
            'Mode: [select] only\nShould the bot buy "Dual Celebration Katanas" ?',
            false,
        ),
        option.bool("33663", "Parade Staff Red", 'Mode: [select] only\nShould the bot buy "Parade Staff Red" ?', false),
        option.bool(
            "33664",
            "Parade Staff Violet",
            'Mode: [select] only\nShould the bot buy "Parade Staff Violet" ?',
            false,
        ),
        option.bool(
            "33665",
            "Parade Staff Blue",
            'Mode: [select] only\nShould the bot buy "Parade Staff Blue" ?',
            false,
        ),
        option.bool(
            "33666",
            "Parade Staff Green",
            'Mode: [select] only\nShould the bot buy "Parade Staff Green" ?',
            false,
        ),
        option.bool(
            "33667",
            "Parade Violet Mask",
            'Mode: [select] only\nShould the bot buy "Parade Violet Mask" ?',
            false,
        ),
        option.bool("33668", "Parade Blue Mask", 'Mode: [select] only\nShould the bot buy "Parade Blue Mask" ?', false),
        option.bool("33669", "Parade Red Mask", 'Mode: [select] only\nShould the bot buy "Parade Red Mask" ?', false),
        option.bool(
            "33670",
            "Parade Green Mask",
            'Mode: [select] only\nShould the bot buy "Parade Green Mask" ?',
            false,
        ),
        option.bool("33671", "Parade Red Cloak", 'Mode: [select] only\nShould the bot buy "Parade Red Cloak" ?', false),
        option.bool(
            "33672",
            "Parade Green Cloak",
            'Mode: [select] only\nShould the bot buy "Parade Green Cloak" ?',
            false,
        ),
        option.bool(
            "33673",
            "Parade Blue Cloak",
            'Mode: [select] only\nShould the bot buy "Parade Blue Cloak" ?',
            false,
        ),
        option.bool(
            "33674",
            "Parade Violet Cloak",
            'Mode: [select] only\nShould the bot buy "Parade Violet Cloak" ?',
            false,
        ),
        option.bool(
            "42637",
            "Gold Parade Costume",
            'Mode: [select] only\nShould the bot buy "Gold Parade Costume" ?',
            false,
        ),
        option.bool(
            "42638",
            "Gold Parade Cloak",
            'Mode: [select] only\nShould the bot buy "Gold Parade Cloak" ?',
            false,
        ),
        option.bool("42639", "Gold Parade Helm", 'Mode: [select] only\nShould the bot buy "Gold Parade Helm" ?', false),
        option.bool(
            "42640",
            "Gold Parade Staff",
            'Mode: [select] only\nShould the bot buy "Gold Parade Staff" ?',
            false,
        ),
        option.bool("67798", "Nian Lantern 22", 'Mode: [select] only\nShould the bot buy "Nian Lantern 22" ?', false),
        option.bool(
            "59292",
            "Colorful Akiban Hanfu",
            'Mode: [select] only\nShould the bot buy "Colorful Akiban Hanfu" ?',
            false,
        ),
        option.bool(
            "59293",
            "Decorated Colorful Akiban Hanfu",
            'Mode: [select] only\nShould the bot buy "Decorated Colorful Akiban Hanfu" ?',
            false,
        ),
        option.bool(
            "59310",
            "Xi Qi's Claymore",
            'Mode: [select] only\nShould the bot buy "Xi Qi\'s Claymore" ?',
            false,
        ),
        option.bool("59296", "Akiban Hanfu", 'Mode: [select] only\nShould the bot buy "Akiban Hanfu" ?', false),
        option.bool(
            "59297",
            "Decorated Akiban Hanfu",
            'Mode: [select] only\nShould the bot buy "Decorated Akiban Hanfu" ?',
            false,
        ),
        option.bool(
            "10771",
            "Cerise Dragon Spirit",
            'Mode: [select] only\nShould the bot buy "Cerise Dragon Spirit" ?',
            false,
        ),
        option.bool(
            "10782",
            "Cerise Dragon Spirit Helm",
            'Mode: [select] only\nShould the bot buy "Cerise Dragon Spirit Helm" ?',
            false,
        ),
        option.bool(
            "10775",
            "Mask of the Cerise Dragon",
            'Mode: [select] only\nShould the bot buy "Mask of the Cerise Dragon" ?',
            false,
        ),
        option.bool(
            "10772",
            "Cerulean Dragon Spirit",
            'Mode: [select] only\nShould the bot buy "Cerulean Dragon Spirit" ?',
            false,
        ),
        option.bool(
            "10780",
            "Cerulean Dragon Spirit Helm",
            'Mode: [select] only\nShould the bot buy "Cerulean Dragon Spirit Helm" ?',
            false,
        ),
        option.bool(
            "10777",
            "Mask of the Cerulean Dragon",
            'Mode: [select] only\nShould the bot buy "Mask of the Cerulean Dragon" ?',
            false,
        ),
        option.bool(
            "10773",
            "Ebony Dragon Spirit",
            'Mode: [select] only\nShould the bot buy "Ebony Dragon Spirit" ?',
            false,
        ),
        option.bool(
            "10781",
            "Ebony Dragon Spirit Helm",
            'Mode: [select] only\nShould the bot buy "Ebony Dragon Spirit Helm" ?',
            false,
        ),
        option.bool(
            "10778",
            "Mask of the Ebony Dragon",
            'Mode: [select] only\nShould the bot buy "Mask of the Ebony Dragon" ?',
            false,
        ),
        option.bool(
            "10774",
            "Legendary Dragon Spirit",
            'Mode: [select] only\nShould the bot buy "Legendary Dragon Spirit" ?',
            false,
        ),
        option.bool(
            "10779",
            "Legendary Dragon Spirit Helm",
            'Mode: [select] only\nShould the bot buy "Legendary Dragon Spirit Helm" ?',
            false,
        ),
        option.bool(
            "10776",
            "Mask of the Legendary Dragon",
            'Mode: [select] only\nShould the bot buy "Mask of the Legendary Dragon" ?',
            false,
        ),
        option.bool(
            "10748",
            "Sakura Dragon Spirit",
            'Mode: [select] only\nShould the bot buy "Sakura Dragon Spirit" ?',
            false,
        ),
        option.bool(
            "10750",
            "Sakura Dragon Spirit Morph",
            'Mode: [select] only\nShould the bot buy "Sakura Dragon Spirit Morph" ?',
            false,
        ),
        option.bool(
            "10749",
            "Sakura Dragon Spirit Mask",
            'Mode: [select] only\nShould the bot buy "Sakura Dragon Spirit Mask" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: YokaiNewYearMerge.select,
});

export default function main(): void {
    const script = new YokaiNewYearMerge();
    Core.bankingBlackList.push(
        "Emblem of Righteousness",
        "Lucky Red Envelope",
        "Super Lucky Red Envelope",
        "Emblem of Good Luck",
        "Emblem of Knowledge",
        "Emblem of Longevity",
        "Luckier Red Envelope",
        "Bunny",
        "Gold Medallion",
        "Lunar Firecracker",
        "Fuchsia Dye",
        "Magenta Dye",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
