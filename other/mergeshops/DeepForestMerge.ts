/*
name: DeepForest Merge
description: This bot will farm the items belonging to the selected mode for the DeepForest Merge [1999] in /deepforest
tags: deepforest, merge, deepforest, chaotic, monsterhunter, monsterhunters, supreme, arcane, chaos, polished, dragon, necrotic, hanzamune
*/
// Port of Scripts/Other/MergeShops/DeepForestMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreQOM } from "../../story/queenofmonsters/CoreQoM";

const Adv = new CoreAdvanced();
const QOM = new CoreQOM();

export class DeepForestMerge {
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
                case "Necrotic Blade of Chaos":

                case "Dragon Sword of Chaos":
                    Adv.buyItem("castleundead", 45, req.name);
                    break;
                case "Chaotic Hanzamune":
                    Core.killKitsune(req.name, req.quantity, { isTemp: req.temp });
                    break;
                case "Deep Forest Sap":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.registerQuests(8081);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.killMonster("deepforest", "r2", "Left", "Deep Truffle");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Fallen MonsterHunter":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("DeepForest", "Aberrant Horror", req.name, undefined, { isTemp: false });
                    break;
                case "Fallen MonsterHunter Cape":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("DeepForest", "Aberrant Horror", req.name, undefined, { isTemp: false });
                    break;
                case "Fallen MonsterHunter Helm":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("DeepForest", "Aberrant Horror", req.name, undefined, { isTemp: false });
                    break;
                case "The Supreme Arcane Staff":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("ledgermayne", "Ledgermayne", "The Supreme Arcane Staff", 1, {
                        isTemp: false,
                        log: false,
                    });
                    bot.wait.forPickup(req.name);
                    break;
                case "Fallen MonsterHunter Sword":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("DeepForest", "Aberrant Horror", req.name, undefined, { isTemp: false });
                    break;
            }
        };
        QOM.theBook();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("deepforest", 1999, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "61039",
            "Chaotic MonsterHunter",
            'Mode: [select] only\nShould the bot buy "Chaotic MonsterHunter" ?',
            false,
        ),
        option.bool(
            "61041",
            "Chaotic MonsterHunter's Cape",
            'Mode: [select] only\nShould the bot buy "Chaotic MonsterHunter\'s Cape" ?',
            false,
        ),
        option.bool(
            "61040",
            "Chaotic MonsterHunter's Helm",
            'Mode: [select] only\nShould the bot buy "Chaotic MonsterHunter\'s Helm" ?',
            false,
        ),
        option.bool(
            "60989",
            "Supreme Arcane Staff of Chaos",
            'Mode: [select] only\nShould the bot buy "Supreme Arcane Staff of Chaos" ?',
            false,
        ),
        option.bool(
            "60985",
            "Polished Dragon Sword of Chaos",
            'Mode: [select] only\nShould the bot buy "Polished Dragon Sword of Chaos" ?',
            false,
        ),
        option.bool(
            "60987",
            "Polished Necrotic Blade of Chaos",
            'Mode: [select] only\nShould the bot buy "Polished Necrotic Blade of Chaos" ?',
            false,
        ),
        option.bool(
            "60986",
            "Polished Chaotic Hanzamune",
            'Mode: [select] only\nShould the bot buy "Polished Chaotic Hanzamune" ?',
            false,
        ),
        option.bool(
            "61042",
            "Chaotic MonsterHunter's Sword",
            'Mode: [select] only\nShould the bot buy "Chaotic MonsterHunter\'s Sword" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DeepForestMerge.select,
});

export default function main(): void {
    const script = new DeepForestMerge();
    Core.bankingBlackList.push(
        "Deep Forest Sap",
        "Fallen MonsterHunter",
        "Fallen MonsterHunter Cape",
        "Fallen MonsterHunter Helm",
        "The Supreme Arcane Staff",
        "Dragon Sword of Chaos",
        "Necrotic Blade of Chaos",
        "Chaotic Hanzamune",
        "Fallen MonsterHunter Sword",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
