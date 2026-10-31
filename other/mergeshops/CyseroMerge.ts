/*
name: Cysero Merge
description: Farms the Cysero Merge [668] in /battleontown.
tags: battleontown, merge, cysero, merge
*/
// Port of Scripts/Other/MergeShops/CyseroMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { YulgarsBurgers } from "./YulgarsBurgers";

const Adv = new CoreAdvanced();
const Burgers = new YulgarsBurgers();

export class CyseroMergeShop {
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
            const quant = Adv.externalQuant;
            if (req == null) {
                return;
            }

            switch (req.name) {
                case "Black Knight's Nail":
                    Core.huntMonster("greenguardwest", "Black Knight", req.name, req.quantity, { isTemp: req.temp });
                    break;
                case "Borgar":
                    Burgers.buyAllMerge(req.name);
                    break;
                case "Barrel":
                    Adv.buyItem("artixpointe", 999, req.name, req.quantity);
                    bot.wait.forPickup(req.name);
                    break;
                case "Glass Bottle":
                    if (!Core.isMember) {
                        Core.logger(`${req.name} Requires membership`);
                        return;
                    }
                    Adv.buyItem("buyhouse", 1366, req.name, req.quantity);
                    bot.wait.forPickup(req.name);
                    break;
                case "New Home Weapon Display":
                    Core.killMonster("cyserowed", "r1", "Down", "*", req.name);
                    bot.wait.forPickup(req.name);
                    break;
                case "Staked Steak":

                case "Basic Wooden Stake":
                    Adv.buyItem("darkoviaforest", 138, req.name, req.quantity);
                    break;
                case "Real Rubber Ducky":
                    if (!Core.isMember) {
                        Core.logger(`${req.name} Requires membership`);
                        return;
                    }
                    Core.addDrop(req.id);
                    Core.ensureAccept(2776);
                    Core.huntMonster("river", "River Fishman", "Yellow Rubber Duck", 3);
                    Core.huntMonster("marsh", "Dark Witch", "Red Rubber Duck", 3);
                    Core.huntMonster("shallow", "Water Elemental", "Blue Rubber Duck", 3);
                    Core.ensureComplete(2776);
                    bot.wait.forPickup(req.id);
                    break;
                case "Glowing Sock":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(2777);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("greenguardwest", "Slime", "Slimy Lost Sock", 5, { isTemp: true, log: false });
                        Core.huntMonster("greenguardeast", "Wolf", "Furry Lost Sock", 2, { isTemp: true, log: false });
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
        Adv.startBuyAllMerge("battleontown", 668, findIngredients, buyOnlyThis, { buyMode });
    }

    static readonly select = [
        option.bool(
            "18396",
            "Mad Magic Manawalker",
            'Mode: [select] only\nShould the bot buy "Mad Magic Manawalker" ?',
            false,
        ),
        option.bool(
            "18434",
            "Living Yogurt Warrior",
            'Mode: [select] only\nShould the bot buy "Living Yogurt Warrior" ?',
            false,
        ),
        option.bool(
            "44109",
            "Gilded Rainbow Wrap",
            'Mode: [select] only\nShould the bot buy "Gilded Rainbow Wrap" ?',
            false,
        ),
        option.bool("18439", "Berry Tasty Helm", 'Mode: [select] only\nShould the bot buy "Berry Tasty Helm" ?', false),
        option.bool(
            "18397",
            "Mad Magic Mana Helm",
            'Mode: [select] only\nShould the bot buy "Mad Magic Mana Helm" ?',
            false,
        ),
        option.bool(
            "80008",
            "Cysero's Design Dais",
            'Mode: [select] only\nShould the bot buy "Cysero\'s Design Dais" ?',
            false,
        ),
        option.bool(
            "80009",
            "Cysero's Showcase Stage",
            'Mode: [select] only\nShould the bot buy "Cysero\'s Showcase Stage" ?',
            false,
        ),
        option.bool("18421", "Green Sockatana", 'Mode: [select] only\nShould the bot buy "Green Sockatana" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: CyseroMergeShop.select,
});

export default function main(): void {
    const script = new CyseroMergeShop();
    Core.bankingBlackList.push(
        "Barrel",
        "Basic Wooden Stake",
        "Black Knight's Nail",
        "Borgar",
        "Glass Bottle",
        "Glowing Sock",
        "New Home Weapon Display",
        "Real Rubber Ducky",
        "Staked Steak",
    );
    Core.setOptions();
    script.buyAllMerge();
    Core.setOptions(false);
}
