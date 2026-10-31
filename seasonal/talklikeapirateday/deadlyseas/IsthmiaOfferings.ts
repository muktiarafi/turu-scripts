/*
name: Isthmia Offerings Merge
description: Farms the Isthmia Offerings Merge [2773] in /isthmiacastle.
tags: isthmiacastle, merge, isthmia, offerings, merge
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/DeadlySeas/IsthmiaOfferings.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { Isthmiacastle } from "./Isthmiacastle";
import { RedBettysBudget } from "./RedBettysBudget";

const Adv = new CoreAdvanced();
const IsthmiaCastle = new Isthmiacastle();
const RBB = new RedBettysBudget();

export class IsthmiaOfferings {
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
            const quant = Adv.externalQuant;
            if (req == null) {
                return;
            }

            switch (req.name) {
                case "Imperial Isthmian Gauntlet":

                case "Imperial Isthmian Gauntlets":

                case "BeastBane Cutlass":

                case "BeastBane Cutlasses":

                case "BeastBane Seahook":

                case "BeastBane Seahooks":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("isthmiacastle", "Reaper of the Sea", req.name, quant, { isTemp: req.temp });
                    break;
                case "Isthmian Conch":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(Core.isMember ? 10880 : 10879);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("isthmiacastle", "Mersoul", "Mersoul Reaped", 6);
                        Core.huntMonster("isthmiacastle", "Reaper of the Sea", "Reaper's Toy Model", 1);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Pearlescent Cyprinus":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("isthmiacastle", "Mersoul", req.name, quant, { isTemp: req.temp });
                    break;
                case "Royal Isthmian Axe":

                case "Royal Isthmian Mace":
                    RBB.buyAllMerge(req.name);
                    break;
                case "Royal Isthmian Gauntlet":

                case "Royal Isthmian Gauntlets":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("deadlyseas", "Isthmian Leviathan", req.name, quant, { isTemp: req.temp });
                    break;
                case "Royal Isthmian Wand":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("deadlyseas", "Isthmian Guard", req.name, quant, { isTemp: req.temp });
                    break;
                case "Imperial Isthmian Wand":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("isthmiacastle", "Isthmian Guard", req.name, quant, { isTemp: req.temp });
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
        Adv.startBuyAllMerge("isthmiacastle", 2773, findIngredients, buyOnlyThis, { buyMode });
    }

    static readonly select = [
        option.bool(
            "103716",
            "Siren of the Nethersea",
            'Mode: [select] only\nShould the bot buy "Siren of the Nethersea" ?',
            false,
        ),
        option.bool(
            "103760",
            "ShadowSlayer Corsair",
            'Mode: [select] only\nShould the bot buy "ShadowSlayer Corsair" ?',
            false,
        ),
        option.bool(
            "103759",
            "Imperial Isthmian Axe",
            'Mode: [select] only\nShould the bot buy "Imperial Isthmian Axe" ?',
            false,
        ),
        option.bool(
            "103772",
            "Reverse BeastBane Cutlasses",
            'Mode: [select] only\nShould the bot buy "Reverse BeastBane Cutlasses" ?',
            false,
        ),
        option.bool(
            "103774",
            "Reverse BeastBane Seahooks",
            'Mode: [select] only\nShould the bot buy "Reverse BeastBane Seahooks" ?',
            false,
        ),
        option.bool(
            "103777",
            "ShadowSlayer Fishing Gear",
            'Mode: [select] only\nShould the bot buy "ShadowSlayer Fishing Gear" ?',
            false,
        ),
        option.bool(
            "103761",
            "ShadowSlayer Corsair Hair",
            'Mode: [select] only\nShould the bot buy "ShadowSlayer Corsair Hair" ?',
            false,
        ),
        option.bool(
            "103762",
            "ShadowSlayer Corsair Bun",
            'Mode: [select] only\nShould the bot buy "ShadowSlayer Corsair Bun" ?',
            false,
        ),
        option.bool(
            "103763",
            "ShadowSlayer Corsair Stetson",
            'Mode: [select] only\nShould the bot buy "ShadowSlayer Corsair Stetson" ?',
            false,
        ),
        option.bool(
            "103764",
            "ShadowSlayer Corsair Hat",
            'Mode: [select] only\nShould the bot buy "ShadowSlayer Corsair Hat" ?',
            false,
        ),
        option.bool(
            "103765",
            "ShadowSlayer Corsair Bicorne",
            'Mode: [select] only\nShould the bot buy "ShadowSlayer Corsair Bicorne" ?',
            false,
        ),
        option.bool(
            "103717",
            "Nethersea Siren Morph",
            'Mode: [select] only\nShould the bot buy "Nethersea Siren Morph" ?',
            false,
        ),
        option.bool(
            "103718",
            "Nethersea Siren Visage",
            'Mode: [select] only\nShould the bot buy "Nethersea Siren Visage" ?',
            false,
        ),
        option.bool(
            "103754",
            "Imperial Isthmian Mace",
            'Mode: [select] only\nShould the bot buy "Imperial Isthmian Mace" ?',
            false,
        ),
        option.bool(
            "103771",
            "Reverse BeastBane Cutlass",
            'Mode: [select] only\nShould the bot buy "Reverse BeastBane Cutlass" ?',
            false,
        ),
        option.bool(
            "103773",
            "Reverse BeastBane Seahook",
            'Mode: [select] only\nShould the bot buy "Reverse BeastBane Seahook" ?',
            false,
        ),
        option.bool(
            "103752",
            "Imperial Isthmian Scythe",
            'Mode: [select] only\nShould the bot buy "Imperial Isthmian Scythe" ?',
            false,
        ),
        option.bool(
            "103750",
            "Imperial Isthmian Staff",
            'Mode: [select] only\nShould the bot buy "Imperial Isthmian Staff" ?',
            false,
        ),
        option.bool(
            "103720",
            "Innocent Cyprinus Staff",
            'Mode: [select] only\nShould the bot buy "Innocent Cyprinus Staff" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: IsthmiaOfferings.select,
});

export default function main(): void {
    const script = new IsthmiaOfferings();
    Core.bankingBlackList.push(
        "Imperial Isthmian Wand",
        "Imperial Isthmian Gauntlet",
        "Imperial Isthmian Gauntlets",
        "BeastBane Cutlass",
        "BeastBane Cutlasses",
        "BeastBane Seahook",
        "BeastBane Seahooks",
        "Isthmian Conch",
        "Pearlescent Cyprinus",
        "Royal Isthmian Axe",
        "Royal Isthmian Gauntlet",
        "Royal Isthmian Gauntlets",
        "Royal Isthmian Mace",
        "Royal Isthmian Wand",
    );
    Core.setOptions();
    IsthmiaCastle.storyline();
    script.buyAllMerge();
    Core.setOptions(false);
}
