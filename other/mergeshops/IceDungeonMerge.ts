/*
name: IceDungeonMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/IceDungeonMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { GlaceraStory } from "../../story/Glacera";

const Adv = new CoreAdvanced();
const Glacera = new GlaceraStory();

export class IceDungeonMerge {
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
                case "Icy Token I":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(7838);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        //Basic Ingredients 7838
                        Core.huntMonster("icedungeon", "Frosted Banshee", "Frosted Banshee Defeated", 10);
                        Core.huntMonster("icedungeon", "Frozen Undead", "Frozen Undead Defeated", 10);
                        Core.huntMonster("icedungeon", "Ice Symbiote", "Ice Symbiote Defeated", 10);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Icy Token II":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(7839);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        //Cool Flavor 7839
                        Core.huntMonster("icedungeon", "Spirit of Ice", "Spirit of Ice Defeated", 10);
                        Core.huntMonster("icedungeon", "Ice Crystal", "Ice Crystal Defeated", 10);
                        Core.huntMonster("icedungeon", "Frigid Spirit", "Frigid Spirit Defeated", 10);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Icy Token III":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(7840);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        //Chilled to Perfection 7840
                        Core.huntMonster("icedungeon", "Living Ice", "Living Ice Defeated", 5);
                        Core.huntMonster("icedungeon", "Crystallized Elemental", "Crystallized Elemental Defeated", 5);
                        Core.huntMonster("icedungeon", "Frozen Demon", "Frozen Demon Defeated", 5);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Icy Token IV":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(7841);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        //Icing on the Cake 7841
                        Core.huntMonster("icedungeon", "Image of Glace", "Glace's Approval");
                        Core.huntMonster("icedungeon", "Abel", "Abel's Approval");
                        Core.huntMonster("icedungeon", "Shade of Kyanos", "Kyanos' Approval");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Warrior of Kyanos":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("icedungeon", "Shade of Kyanos", req.name, undefined, { isTemp: false });
                    break;
                case "Glacial Envoy's Helm":

                case "Glacial Envoy's Wrap":

                case "Warrior of Kyanos Daggers":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("icedungeon", "Abel", req.name, undefined, { isTemp: false });
                    break;
                case "Glacial Portal":

                case "Floating Glacial Shards Mace":

                case "Glacial Envoy's Buzzcut":

                case "Glacial Envoy's Locks":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("icedungeon", "Image of Glace", req.name, undefined, { isTemp: false });
                    break;
            }
        };
        Glacera.iceDungeon();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("icedungeon", 1948, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "58262",
            "Favored of Kyanos",
            'Mode: [select] only\nShould the bot buy "Favored of Kyanos" ?',
            false,
        ),
        option.bool(
            "58266",
            "Glacial Envoy's Crested Helm",
            'Mode: [select] only\nShould the bot buy "Glacial Envoy\'s Crested Helm" ?',
            false,
        ),
        option.bool(
            "58267",
            "Glacial Envoy's Hood",
            'Mode: [select] only\nShould the bot buy "Glacial Envoy\'s Hood" ?',
            false,
        ),
        option.bool(
            "58279",
            "Kyanos' Spirit + Portal",
            'Mode: [select] only\nShould the bot buy "Kyanos\' Spirit + Portal" ?',
            false,
        ),
        option.bool(
            "58278",
            "Glacial Arch + Wrap",
            'Mode: [select] only\nShould the bot buy "Glacial Arch + Wrap" ?',
            false,
        ),
        option.bool(
            "58282",
            "Dual Floating Glacial Shards",
            'Mode: [select] only\nShould the bot buy "Dual Floating Glacial Shards" ?',
            false,
        ),
        option.bool(
            "58283",
            "Favored of Kyanos Polearm",
            'Mode: [select] only\nShould the bot buy "Favored of Kyanos Polearm" ?',
            false,
        ),
        option.bool("58261", "Envoy of Kyanos", 'Mode: [select] only\nShould the bot buy "Envoy of Kyanos" ?', false),
        option.bool(
            "58269",
            "Frozen Envoy's Crested Helm",
            'Mode: [select] only\nShould the bot buy "Frozen Envoy\'s Crested Helm" ?',
            false,
        ),
        option.bool(
            "58268",
            "Glacial Envoy's Furred Hood",
            'Mode: [select] only\nShould the bot buy "Glacial Envoy\'s Furred Hood" ?',
            false,
        ),
        option.bool(
            "58271",
            "Envoy's Icy Morph + Hair",
            'Mode: [select] only\nShould the bot buy "Envoy\'s Icy Morph + Hair" ?',
            false,
        ),
        option.bool(
            "58273",
            "Envoy's Icy Morph + Locks",
            'Mode: [select] only\nShould the bot buy "Envoy\'s Icy Morph + Locks" ?',
            false,
        ),
        option.bool(
            "58277",
            "Kyanos' Spirit + Wrap",
            'Mode: [select] only\nShould the bot buy "Kyanos\' Spirit + Wrap" ?',
            false,
        ),
        option.bool(
            "58284",
            "Envoy of Kyanos Blade",
            'Mode: [select] only\nShould the bot buy "Envoy of Kyanos Blade" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: IceDungeonMerge.select,
});

export default function main(): void {
    const script = new IceDungeonMerge();
    Core.bankingBlackList.push(
        "Icy Token I",
        "Icy Token II",
        "Icy Token III",
        "Icy Token IV",
        "Warrior of Kyanos",
        "Glacial Envoy's Helm",
        "Glacial Portal",
        "Glacial Envoy's Wrap",
        "Floating Glacial Shards Mace",
        "Warrior of Kyanos Daggers",
        "Glacial Envoy's Buzzcut",
        "Glacial Envoy's Locks ",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
