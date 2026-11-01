/*
name: Thelima Jewelers Merge
description: This bot will farm the items belonging to the selected mode for the Thelima Jewelers Merge [2616] in /thelimacity
tags: thelima, jewelers, merge, thelimacity, custom, gem, vert, vitriol, emerald, emile, melano, amethyst, catalyst, blue, smaragdine, enchanted, golden, claymore, gilded, doomwood, starks, brilliant, ice, engraved, unholy, heavy, holy, desert, dunes, toothbrush, toothpaste, amp
*/
// Port of Scripts/Other/MergeShops/ThelimaJewelersMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { ShadowFallMerge } from "../../evil/ShadowFallMerge";
import { CoreAOR } from "../../story/ageofruin/CoreAOR";

const Adv = new CoreAdvanced();
const AOR = new CoreAOR();
const SFM = new ShadowFallMerge();

export class ThelimaJewelersMerge {
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
                case "Mystic Topaz":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.huntMonster("thelimacity", "Noelle Knight", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Dwarven Gold":

                case "Dwarven Emerald":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.huntMonster("thelimacity", "Dwarven Aegis", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Maleno Obsidian":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    Core.huntMonster("thelimacity", "Maleno Elemental", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Drow Silver":

                case "Drow Amethyst":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.huntMonster("thelimacity", "Drow Soldier", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Silver Claymore":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.ensureAccept(739);
                        while (!bot.shouldExit && !Core.checkInventory("Racing Trophy", 20)) {
                            Core.chainComplete(746);
                        }
                        Core.huntMonster("table", "Roach", "Gold Roach Antenna", 10);
                        Core.ensureCompleteChoose(739, [req.name]);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Necrotized Claymore":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.logger("Cannot Get Item, requires manual pvp.");
                    break;
                case "Stark's Ice":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Adv.buyItem("blindingsnow", 236, req.name, quant);
                    break;
                case "Grave Terror":

                case "The Unholy":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    SFM.buyAllMerge(req.name);
                    break;
                case "Heavy Holy Blade":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Adv.buyItem("necropolis", 408, req.name, quant);
                    break;
                case "Blade of the Desert Dunes":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Adv.buyItem("sandsea", 242, req.name, quant);
                    break;
                //#endregion
            }
        };
        AOR.thelimaCity();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("thelimacity", 2616, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "93124",
            "Custom Gem Dagger",
            'Mode: [select] only\nShould the bot buy "Custom Gem Dagger" ?',
            false,
        ),
        option.bool(
            "93125",
            "Custom Gem Daggers",
            'Mode: [select] only\nShould the bot buy "Custom Gem Daggers" ?',
            false,
        ),
        option.bool(
            "93380",
            "Vert Vitriol Dagger",
            'Mode: [select] only\nShould the bot buy "Vert Vitriol Dagger" ?',
            false,
        ),
        option.bool(
            "93381",
            "Vert Vitriol Daggers",
            'Mode: [select] only\nShould the bot buy "Vert Vitriol Daggers" ?',
            false,
        ),
        option.bool("93385", "Emerald Emile", 'Mode: [select] only\nShould the bot buy "Emerald Emile" ?', false),
        option.bool(
            "93386",
            "Melano Amethyst Catalyst",
            'Mode: [select] only\nShould the bot buy "Melano Amethyst Catalyst" ?',
            false,
        ),
        option.bool(
            "93118",
            "Blue Vitriol Dagger",
            'Mode: [select] only\nShould the bot buy "Blue Vitriol Dagger" ?',
            false,
        ),
        option.bool(
            "93119",
            "Melano Amethyst Dagger",
            'Mode: [select] only\nShould the bot buy "Melano Amethyst Dagger" ?',
            false,
        ),
        option.bool(
            "93120",
            "Smaragdine Dagger",
            'Mode: [select] only\nShould the bot buy "Smaragdine Dagger" ?',
            false,
        ),
        option.bool(
            "93121",
            "Smaragdine Daggers",
            'Mode: [select] only\nShould the bot buy "Smaragdine Daggers" ?',
            false,
        ),
        option.bool(
            "93382",
            "Enchanted Gem Dagger",
            'Mode: [select] only\nShould the bot buy "Enchanted Gem Dagger" ?',
            false,
        ),
        option.bool(
            "93383",
            "Enchanted Gem Daggers",
            'Mode: [select] only\nShould the bot buy "Enchanted Gem Daggers" ?',
            false,
        ),
        option.bool("95099", "Golden Claymore", 'Mode: [select] only\nShould the bot buy "Golden Claymore" ?', false),
        option.bool(
            "95100",
            "Gilded Claymore of Doomwood",
            'Mode: [select] only\nShould the bot buy "Gilded Claymore of Doomwood" ?',
            false,
        ),
        option.bool(
            "95101",
            "Stark's Brilliant Ice Blade",
            'Mode: [select] only\nShould the bot buy "Stark\'s Brilliant Ice Blade" ?',
            false,
        ),
        option.bool(
            "95102",
            "Gilded Engraved Blade",
            'Mode: [select] only\nShould the bot buy "Gilded Engraved Blade" ?',
            false,
        ),
        option.bool(
            "95103",
            "Golden Unholy Blade",
            'Mode: [select] only\nShould the bot buy "Golden Unholy Blade" ?',
            false,
        ),
        option.bool(
            "95104",
            "Brilliant Heavy Holy Blade",
            'Mode: [select] only\nShould the bot buy "Brilliant Heavy Holy Blade" ?',
            false,
        ),
        option.bool(
            "95105",
            "Gilded Blade of the Desert Dunes",
            'Mode: [select] only\nShould the bot buy "Gilded Blade of the Desert Dunes" ?',
            false,
        ),
        option.bool(
            "95106",
            "Golden Toothbrush",
            'Mode: [select] only\nShould the bot buy "Golden Toothbrush" ?',
            false,
        ),
        option.bool(
            "95107",
            "Golden Toothpaste",
            'Mode: [select] only\nShould the bot buy "Golden Toothpaste" ?',
            false,
        ),
        option.bool(
            "95108",
            "Golden Toothbrush & Toothpaste",
            'Mode: [select] only\nShould the bot buy "Golden Toothbrush & Toothpaste" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ThelimaJewelersMerge.select,
});

export default function main(): void {
    const script = new ThelimaJewelersMerge();
    Core.bankingBlackList.push(
        "Mystic Topaz",
        "Dwarven Gold",
        "Maleno Obsidian",
        "Drow Silver",
        "Dwarven Emerald",
        "Drow Amethyst",
        "Silver Claymore",
        "Necrotized Claymore",
        "Stark's Ice",
        "Grave Terror",
        "The Unholy",
        "Heavy Holy Blade",
        "Blade of the Desert Dunes",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
