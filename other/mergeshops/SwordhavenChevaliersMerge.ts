/*
name: Swordhaven Chevaliers Merge
description: This bot will farm the items belonging to the selected mode for the Swordhaven Chevaliers Merge [2712] in /swordhavengardens
tags: swordhaven, chevaliers, merge, swordhavengardens, corroded, chevalier, gilded, rebels, relic, reavers, armaments, reawakened, visor, armet, reaver, lance
*/
// Port of Scripts/Other/MergeShops/SwordhavenChevaliersMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class SwordhavenChevaliersMerge {
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
                case "Granville Knight's Crest":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.registerQuests(10721);
                    // TODO: Replace with actual quest ID
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonster("swordhavengardens", "Swordhaven Knight", "Knight's Card", 10, {
                            isTemp: true,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Reginolds Datura Crest":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.registerQuests(10722);
                    // TODO: Replace with actual quest ID
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonster("swordhavengardens", "Blithe Roses", "Violet Rose Honey", undefined, {
                            isTemp: true,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Volkov Gold Crest":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.registerQuests(10724);
                    // TODO: Replace with actual quest ID
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonster("swordhavengardens", "Noble Ghost", "Antique Brooch", 14, { isTemp: true });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                //#endregion
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("swordhavengardens", 2712, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "100738",
            "Corroded Chevalier",
            'Mode: [select] only\nShould the bot buy "Corroded Chevalier" ?',
            false,
        ),
        option.bool(
            "100746",
            "Gilded Chevalier",
            'Mode: [select] only\nShould the bot buy "Gilded Chevalier" ?',
            false,
        ),
        option.bool(
            "100744",
            "Rebel's Relic Reavers",
            'Mode: [select] only\nShould the bot buy "Rebel\'s Relic Reavers" ?',
            false,
        ),
        option.bool(
            "100745",
            "Rebel's Relic Armaments",
            'Mode: [select] only\nShould the bot buy "Rebel\'s Relic Armaments" ?',
            false,
        ),
        option.bool(
            "100752",
            "Rebel's Reawakened Reavers",
            'Mode: [select] only\nShould the bot buy "Rebel\'s Reawakened Reavers" ?',
            false,
        ),
        option.bool(
            "100753",
            "Rebel's Reawakened Armaments",
            'Mode: [select] only\nShould the bot buy "Rebel\'s Reawakened Armaments" ?',
            false,
        ),
        option.bool("100747", "Gilded Visor", 'Mode: [select] only\nShould the bot buy "Gilded Visor" ?', false),
        option.bool(
            "100748",
            "Gilded Chevalier Helm",
            'Mode: [select] only\nShould the bot buy "Gilded Chevalier Helm" ?',
            false,
        ),
        option.bool(
            "100749",
            "Gilded Chevalier Armet",
            'Mode: [select] only\nShould the bot buy "Gilded Chevalier Armet" ?',
            false,
        ),
        option.bool(
            "100739",
            "Corroded Chevalier Visor",
            'Mode: [select] only\nShould the bot buy "Corroded Chevalier Visor" ?',
            false,
        ),
        option.bool(
            "100740",
            "Corroded Chevalier Helm",
            'Mode: [select] only\nShould the bot buy "Corroded Chevalier Helm" ?',
            false,
        ),
        option.bool(
            "100741",
            "Corroded Chevalier Armet",
            'Mode: [select] only\nShould the bot buy "Corroded Chevalier Armet" ?',
            false,
        ),
        option.bool(
            "100743",
            "Rebel's Relic Reaver",
            'Mode: [select] only\nShould the bot buy "Rebel\'s Relic Reaver" ?',
            false,
        ),
        option.bool(
            "100751",
            "Rebel's Reawakened Reaver",
            'Mode: [select] only\nShould the bot buy "Rebel\'s Reawakened Reaver" ?',
            false,
        ),
        option.bool(
            "100742",
            "Rebel's Relic Lance",
            'Mode: [select] only\nShould the bot buy "Rebel\'s Relic Lance" ?',
            false,
        ),
        option.bool(
            "100750",
            "Rebel's Reawakened Lance",
            'Mode: [select] only\nShould the bot buy "Rebel\'s Reawakened Lance" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: SwordhavenChevaliersMerge.select,
});

export default function main(): void {
    const script = new SwordhavenChevaliersMerge();
    Core.bankingBlackList.push("Granville Knight's Crest", "Reginolds Datura Crest", "Volkov Gold Crest");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
