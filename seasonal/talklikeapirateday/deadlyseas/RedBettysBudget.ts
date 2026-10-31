/*
name: Red Bettys Budget
description: Farms the Red Bettys Budget [2767] in /deadlyseas.
tags: deadlyseas, merge, deadly, seas, loot, merge, red, bettys, budget
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/DeadlySeas/RedBettysBudget.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { Deadlyseas } from "./Deadlyseas";

const Adv = new CoreAdvanced();
const DeadlySeas = new Deadlyseas();

export class RedBettysBudget {
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
            const quant = Adv.externalQuant;
            if (req == null) {
                return;
            }

            switch (req.name) {
                case "Isthmian Seashell":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(Core.isMember ? 10868 : 10867);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("deadlyseas", "Isthmian Guard", "Guard's Pearl Polish", 4);
                        Core.huntMonster("deadlyseas", "Isthmian Leviathan", "Leviathan's Egg", 1);
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("deadlyseas", "Isthmian Eel", "Smoked Eel", 9);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Mermaid Hunter Hair":

                case "Mermaid Hunter Locks":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("deadlyseas", "Mermaid Hunter", req.name, quant, { isTemp: req.temp });
                    break;
                case "Royal Isthmian Gauntlet":

                case "Royal Isthmian Gauntlets":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("deadlyseas", "Isthmian Leviathan", req.name, quant, { isTemp: req.temp });
                    break;
                case "Royal Isthmian Wand":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("deadlyseas", "Isthmian Guard", req.name, quant, { isTemp: req.temp });
                    break;
                default: {
                    const shouldStop = !Adv.matsOnly || !this.dontStopMissingIng;
                    Core.logger(`The bot hasn't been taught how to get ${req.name}.`, undefined, {
                        messageBox: shouldStop,
                        stopBot: shouldStop,
                    });
                    break;
                }
            }
        };
        Adv.startBuyAllMerge("deadlyseas", 2767, findIngredients, buyOnlyThis, { buyMode });
    }

    static readonly select = [
        option.bool("103266", "Mermaid Hunter", 'Mode: [select] only\nShould the bot buy "Mermaid Hunter" ?', false),
        option.bool(
            "103455",
            "Royal Isthmian Guard",
            'Mode: [select] only\nShould the bot buy "Royal Isthmian Guard" ?',
            false,
        ),
        option.bool(
            "103741",
            "Royal Isthmian Axe",
            'Mode: [select] only\nShould the bot buy "Royal Isthmian Axe" ?',
            false,
        ),
        option.bool(
            "103273",
            "Nereid Skin Cape",
            'Mode: [select] only\nShould the bot buy "Nereid Skin Cape" ?',
            false,
        ),
        option.bool(
            "103458",
            "Isthmian Pearl Shield",
            'Mode: [select] only\nShould the bot buy "Isthmian Pearl Shield" ?',
            false,
        ),
        option.bool(
            "103456",
            "Isthmian Guard Helm",
            'Mode: [select] only\nShould the bot buy "Isthmian Guard Helm" ?',
            false,
        ),
        option.bool(
            "103457",
            "Isthmian Guard Visor",
            'Mode: [select] only\nShould the bot buy "Isthmian Guard Visor" ?',
            false,
        ),
        option.bool(
            "103267",
            "Mermaid Hunter Mask Morph",
            'Mode: [select] only\nShould the bot buy "Mermaid Hunter Mask Morph" ?',
            false,
        ),
        option.bool(
            "103268",
            "Mermaid Hunter Visage",
            'Mode: [select] only\nShould the bot buy "Mermaid Hunter Visage" ?',
            false,
        ),
        option.bool(
            "103269",
            "Mermaid Poacher Morph",
            'Mode: [select] only\nShould the bot buy "Mermaid Poacher Morph" ?',
            false,
        ),
        option.bool(
            "103270",
            "Mermaid Poacher Visage",
            'Mode: [select] only\nShould the bot buy "Mermaid Poacher Visage" ?',
            false,
        ),
        option.bool(
            "103736",
            "Royal Isthmian Mace",
            'Mode: [select] only\nShould the bot buy "Royal Isthmian Mace" ?',
            false,
        ),
        option.bool(
            "103734",
            "Royal Isthmian Scythe",
            'Mode: [select] only\nShould the bot buy "Royal Isthmian Scythe" ?',
            false,
        ),
        option.bool(
            "103276",
            "Siren's Anathema",
            'Mode: [select] only\nShould the bot buy "Siren\'s Anathema" ?',
            false,
        ),
        option.bool(
            "103732",
            "Royal Isthmian Staff",
            'Mode: [select] only\nShould the bot buy "Royal Isthmian Staff" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: RedBettysBudget.select,
});

export default function main(): void {
    const script = new RedBettysBudget();
    Core.bankingBlackList.push(
        "Isthmian Seashell",
        "Mermaid Hunter Hair",
        "Mermaid Hunter Locks",
        "Royal Isthmian Gauntlet",
        "Royal Isthmian Gauntlets",
        "Royal Isthmian Wand",
    );
    Core.setOptions();
    DeadlySeas.storyline();
    script.buyAllMerge();
    Core.setOptions(false);
}
