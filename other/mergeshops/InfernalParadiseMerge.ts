/*
name: Infernal Paradise Merge
description: This bot will farm the items belonging to the selected mode for the Infernal Paradise Merge [2561] in /infernalparadise
tags: infernal, paradise, merge, infernalparadise, golden, crown, astral, celestial, wings, halo, fallen, aranx, evolved, wreathed, furled, archangel, mysteries
*/
// Port of Scripts/Other/MergeShops/InfernalParadiseMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { InfernalParadise } from "../../story/queenofmonsters/extra/InfernalParadise";

const Adv = new CoreAdvanced();
const IP = new InfernalParadise();

export class InfernalParadiseMerge {
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
                case "Celestial Seal":

                case "Golden Scale":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("goldenarena", "Blessed Dragon", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Golden Badge":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("goldenarena", "Blessed Inquisitor", req.name, quant, {
                        isTemp: false,
                        log: false,
                    });
                    break;
                case "Golden Wing":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("goldenarena", "Blessed Gladius", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Golden Rune":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("goldenarena", "Blessed Karok", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Laurel Crown":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("goldenarena", "Queen of Hope", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Divine Down":
                    Core.farmingLogger(req.name, quant);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAccept(10082);
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("infernalparadise", "Akh-a", "Hybrid Feathers", 4);
                        Core.equipClass(ClassType.Dodge);
                        Core.huntMonster("infernalparadise", "Azalith", "Azalith's Horn");
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("infernalparadise", "Infernal Knight", "Knight's Broken Halo", 8);
                        Core.ensureComplete(10082);
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Infernal Mage's Incantation":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("infernalparadise", "Infernal Mage", req.name, quant, {
                        isTemp: false,
                        log: false,
                    });
                    break;
                case "Malxas' Shed Feather":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("infernalparadise", "Infernal Malxas", req.name, quant, {
                        isTemp: false,
                        log: false,
                    });
                    break;
                case "Infernal Token":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("Celestialrealm", "Fallen Knight", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Champion Sash":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("celestialarenad", "Aranx", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Celestial Quintessence":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.killMonster("celestialpast", "r2", "Left", "*", req.name, quant, {
                        isTemp: false,
                        log: false,
                    });
                    break;
                case "Infernalis Penna":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAccept(9887);
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("champazalith", "Maah-na", "Maah-na's Wing");
                        Core.huntMonster("champazalith", "Akh-a", "Akh-a's Wing");
                        Core.ensureComplete(9887);
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Infernalis Oculus":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonsterQuest(9888, ["champazalith", "Azalith", ClassType.Solo]);
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        IP.storyline();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("infernalparadise", 2561, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("92183", "Golden Crown", 'Mode: [select] only\nShould the bot buy "Golden Crown" ?', false),
        option.bool(
            "92113",
            "Astral Celestial Wings",
            'Mode: [select] only\nShould the bot buy "Astral Celestial Wings" ?',
            false,
        ),
        option.bool(
            "92112",
            "Astral Celestial Halo",
            'Mode: [select] only\nShould the bot buy "Astral Celestial Halo" ?',
            false,
        ),
        option.bool(
            "92111",
            "Astral Celestial Hood",
            'Mode: [select] only\nShould the bot buy "Astral Celestial Hood" ?',
            false,
        ),
        option.bool("92110", "Astral Celestial", 'Mode: [select] only\nShould the bot buy "Astral Celestial" ?', false),
        option.bool(
            "92061",
            "Fallen Aranx Wings",
            'Mode: [select] only\nShould the bot buy "Fallen Aranx Wings" ?',
            false,
        ),
        option.bool(
            "92060",
            "Evolved Fallen Aranx Wings",
            'Mode: [select] only\nShould the bot buy "Evolved Fallen Aranx Wings" ?',
            false,
        ),
        option.bool(
            "92059",
            "Wreathed Fallen Aranx Wings",
            'Mode: [select] only\nShould the bot buy "Wreathed Fallen Aranx Wings" ?',
            false,
        ),
        option.bool(
            "92058",
            "Furled Fallen Aranx Wings",
            'Mode: [select] only\nShould the bot buy "Furled Fallen Aranx Wings" ?',
            false,
        ),
        option.bool(
            "92063",
            "Archangel of Mysteries",
            'Mode: [select] only\nShould the bot buy "Archangel of Mysteries" ?',
            false,
        ),
        option.bool(
            "92064",
            "Archangel of Mysteries Helm",
            'Mode: [select] only\nShould the bot buy "Archangel of Mysteries Helm" ?',
            false,
        ),
        option.bool(
            "92065",
            "Archangel of Mysteries Wings",
            'Mode: [select] only\nShould the bot buy "Archangel of Mysteries Wings" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: InfernalParadiseMerge.select,
});

export default function main(): void {
    const script = new InfernalParadiseMerge();
    Core.bankingBlackList.push(
        "Celestial Seal",
        "Golden Scale",
        "Golden Badge",
        "Golden Wing",
        "Golden Rune",
        "Laurel Crown",
        "Divine Down",
        "Infernal Mage's Incantation",
        "Malxas' Shed Feather",
        "Infernal Token",
        "Champion Sash",
        "Celestial Quintessence",
        "Infernalis Penna",
        "Infernalis Oculus",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
