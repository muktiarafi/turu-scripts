/*
name: Divorares Hoard Merge
description: Farms the Divorares Hoard Merge [2777] in /divorarepass.
tags: divorarepass, merge, divorares, hoard, merge
*/
// Port of Scripts/Other/MergeShops/DivoraresHoard.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class DivoraresHoard {
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
            const quant = Adv.externalQuant;
            if (req == null) {
                return;
            }

            switch (req.name) {
                case "Confiscated Harp String":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(10881);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("divorarepass", "Nazarene's Artist", "Moon Dust Pigment", 12);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Divorare Horn":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(10882);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("divorarepass", "Divorare", "Divorare Blood Sample", 1);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
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
        Adv.startBuyAllMerge("divorarepass", 2777, findIngredients, buyOnlyThis, { buyMode });
    }

    static readonly select = [
        option.bool(
            "102129",
            "Divorare ShadowSlayer (Armor)",
            'Mode: [select] only\nShould the bot buy "Divorare ShadowSlayer (Armor)" ?',
            false,
        ),
        option.bool(
            "102128",
            "Chosen Divorare ShadowSlayer",
            'Mode: [select] only\nShould the bot buy "Chosen Divorare ShadowSlayer" ?',
            false,
        ),
        option.bool(
            "102142",
            "Dual Divorare's Hunger",
            'Mode: [select] only\nShould the bot buy "Dual Divorare\'s Hunger" ?',
            false,
        ),
        option.bool(
            "102143",
            "Divorare's Pseudo-Talons",
            'Mode: [select] only\nShould the bot buy "Divorare\'s Pseudo-Talons" ?',
            false,
        ),
        option.bool(
            "102144",
            "Divorare's Pseudo-Claws",
            'Mode: [select] only\nShould the bot buy "Divorare\'s Pseudo-Claws" ?',
            false,
        ),
        option.bool(
            "102130",
            "Divorare ShadowSlayer Morph",
            'Mode: [select] only\nShould the bot buy "Divorare ShadowSlayer Morph" ?',
            false,
        ),
        option.bool(
            "102131",
            "Divorare ShadowSlayer Visage",
            'Mode: [select] only\nShould the bot buy "Divorare ShadowSlayer Visage" ?',
            false,
        ),
        option.bool(
            "102132",
            "Divorare ShadowSlayer Scarf",
            'Mode: [select] only\nShould the bot buy "Divorare ShadowSlayer Scarf" ?',
            false,
        ),
        option.bool(
            "102133",
            "Divorare ShadowSlayer Sash",
            'Mode: [select] only\nShould the bot buy "Divorare ShadowSlayer Sash" ?',
            false,
        ),
        option.bool(
            "102134",
            "Divorare ShadowSlayer Hat",
            'Mode: [select] only\nShould the bot buy "Divorare ShadowSlayer Hat" ?',
            false,
        ),
        option.bool(
            "102135",
            "Divorare ShadowSlayer (Helm)",
            'Mode: [select] only\nShould the bot buy "Divorare ShadowSlayer (Helm)" ?',
            false,
        ),
        option.bool(
            "102141",
            "Divorare's Hunger",
            'Mode: [select] only\nShould the bot buy "Divorare\'s Hunger" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DivoraresHoard.select,
});

export default function main(): void {
    const script = new DivoraresHoard();
    Core.bankingBlackList.push("Confiscated Harp String", "Divorare Horn");
    Core.setOptions();
    script.buyAllMerge();
    Core.setOptions(false);
}
