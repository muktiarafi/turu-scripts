/*
name: TowerofWindsMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/TowerofWindsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { GlaceraStory } from "../../story/Glacera";

const Adv = new CoreAdvanced();
const Glacera = new GlaceraStory();

export class TowerofWindsMerge {
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
                case "Frozen Tower Merge Token":
                    Glacera.frozenTower();
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(3939);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        //Clear the Wolves 3939
                        Core.huntMonster("frozentower", "Ice Wolf", "Ice Wolf Slain", 7);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Bits of Cloth":

                case "Pieces of Glass":

                case "Metal bits":

                case "Bits of Hair":
                    Core.equipClass(ClassType.Farm);
                    Core.ensureAccept(3955);
                    Core.huntMonster("frozentower", "Frostwyrm", req.name, quant, { isTemp: false });
                    break;
                case "Pieces of Cloth":

                case "Ice Crystals":

                case "Metal Pieces":
                    Core.equipClass(ClassType.Farm);
                    Core.ensureAccept(3955);
                    Core.huntMonster("frozentower", "Polar Elemental", req.name, quant, { isTemp: false });
                    break;
                case "Flame of Courage":
                    Glacera.frozenTower();
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(3955);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        //Flame of Courage 3955
                        Core.huntMonster("frozenruins", "Frost Invader", "Spark of Courage");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Karok's Glaceran Gem":
                    Core.ensureAccept(3955);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("northstar", "Karok The Fallen", req.name, quant, { isTemp: false });
                    break;
                case "Mercury":
                    Glacera.frozenTower();
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(3956);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        //Quick as silver 3956
                        Core.huntMonster("frozenruins", "Arctic Eel", "Quicker Silver");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("glacera", 1055, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "27479",
            "Northern Lights Wanderer",
            'Mode: [select] only\nShould the bot buy "Northern Lights Wanderer" ?',
            false,
        ),
        option.bool(
            "27469",
            "Northern Lights Polearm",
            'Mode: [select] only\nShould the bot buy "Northern Lights Polearm" ?',
            false,
        ),
        option.bool("27470", "Aurora Wand", 'Mode: [select] only\nShould the bot buy "Aurora Wand" ?', false),
        option.bool("27475", "Frozen Fear Lad", 'Mode: [select] only\nShould the bot buy "Frozen Fear Lad" ?', false),
        option.bool("27474", "Frozen Fear Lass", 'Mode: [select] only\nShould the bot buy "Frozen Fear Lass" ?', false),
        option.bool(
            "27473",
            "Astromancer Locks",
            'Mode: [select] only\nShould the bot buy "Astromancer Locks" ?',
            false,
        ),
        option.bool("27472", "Astromancer Hair", 'Mode: [select] only\nShould the bot buy "Astromancer Hair" ?', false),
        option.bool("27471", "Aurora Dawn Cape", 'Mode: [select] only\nShould the bot buy "Aurora Dawn Cape" ?', false),
        option.bool(
            "27434",
            "Winged Aurora Staff",
            'Mode: [select] only\nShould the bot buy "Winged Aurora Staff" ?',
            false,
        ),
        option.bool("25007", "Holy Healer", 'Mode: [select] only\nShould the bot buy "Holy Healer" ?', false),
        option.bool(
            "25009",
            "Holy Healer Locks",
            'Mode: [select] only\nShould the bot buy "Holy Healer Locks" ?',
            false,
        ),
        option.bool("25010", "Holy Healer Hair", 'Mode: [select] only\nShould the bot buy "Holy Healer Hair" ?', false),
        option.bool("25011", "Holy Healer Halo", 'Mode: [select] only\nShould the bot buy "Holy Healer Halo" ?', false),
        option.bool(
            "25012",
            "Holy Healer Halo Locks",
            'Mode: [select] only\nShould the bot buy "Holy Healer Halo Locks" ?',
            false,
        ),
        option.bool(
            "27458",
            "BitterEdge Broadsword",
            'Mode: [select] only\nShould the bot buy "BitterEdge Broadsword" ?',
            false,
        ),
        option.bool("27464", "BitterEdge Wand", 'Mode: [select] only\nShould the bot buy "BitterEdge Wand" ?', false),
        option.bool(
            "27484",
            "Frozen FireOrb Mace",
            'Mode: [select] only\nShould the bot buy "Frozen FireOrb Mace" ?',
            false,
        ),
        option.bool(
            "27485",
            "Frozen FireOrb Staff",
            'Mode: [select] only\nShould the bot buy "Frozen FireOrb Staff" ?',
            false,
        ),
        option.bool(
            "27706",
            "Scythe of Vengeance",
            'Mode: [select] only\nShould the bot buy "Scythe of Vengeance" ?',
            false,
        ),
        option.bool(
            "27774",
            "Cold Scythe of Vengeance",
            'Mode: [select] only\nShould the bot buy "Cold Scythe of Vengeance" ?',
            false,
        ),
        option.bool(
            "27775",
            "Frigid Scythe of Vengeance",
            'Mode: [select] only\nShould the bot buy "Frigid Scythe of Vengeance" ?',
            false,
        ),
        option.bool(
            "27776",
            "Fallen Scythe of Vengeance",
            'Mode: [select] only\nShould the bot buy "Fallen Scythe of Vengeance" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: TowerofWindsMerge.select,
});

export default function main(): void {
    const script = new TowerofWindsMerge();
    Core.bankingBlackList.push(
        "Frozen Tower Merge Token",
        "Bits of Cloth",
        "Pieces of Glass",
        "Metal bits",
        "Bits of Hair",
        "Pieces of Cloth",
        "Ice Crystals",
        "Mercury",
        "Metal Pieces",
        "Flame of Courage",
        "Karok's Glaceran Gem ",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
