/*
name: Ouroboros Lost and Found Merge
description: This bot will farm the items belonging to the selected mode for the Ouroboros Lost and Found Merge [2716] in /forgecitrinitas
tags: ouroboros, lost, and, found, merge, forgecitrinitas, wolfblade, leader, eye, dn, doomed, obsession, gram, prototype, eckesachs, spear, discord
*/
// Port of Scripts/Other/MergeShops/OuroborosLostandFoundMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreAOR } from "../../story/ageofruin/CoreAOR";

const Adv = new CoreAdvanced();
const AOR = new CoreAOR();

export class OuroborosLostandFoundMerge {
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
                case "Nova Gemstone":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.registerQuests(10735);
                    // TODO: Replace with actual quest ID
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonster("forgecitrinitas", "Luma Lifeform", "Lifeform's Hope", 12, {
                            isTemp: true,
                            log: false,
                        });
                        Core.huntMonster("forgecitrinitas", "Defense Droid", "Droid's Battery Acid", 9, {
                            isTemp: true,
                            log: false,
                        });
                        Core.huntMonster("forgecitrinitas", "Clematis", "Clematis' Blood Sample", 1, {
                            isTemp: true,
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                //#endregion
            }
        };
        AOR.forgeCitrinitas();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("forgecitrinitas", 2716, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "101014",
            "WolfBlade Leader",
            'Mode: [select] only\nShould the bot buy "WolfBlade Leader" ?',
            false,
        ),
        option.bool("84983", "Eye of 0D1N", 'Mode: [select] only\nShould the bot buy "Eye of 0D1N" ?', false),
        option.bool(
            "88470",
            "Doomed Eye of Obsession",
            'Mode: [select] only\nShould the bot buy "Doomed Eye of Obsession" ?',
            false,
        ),
        option.bool(
            "101018",
            "WolfBlade Leader Cape",
            'Mode: [select] only\nShould the bot buy "WolfBlade Leader Cape" ?',
            false,
        ),
        option.bool(
            "84978",
            "Dual Gram Prototype",
            'Mode: [select] only\nShould the bot buy "Dual Gram Prototype" ?',
            false,
        ),
        option.bool(
            "84980",
            "Dual Eckesachs Prototype",
            'Mode: [select] only\nShould the bot buy "Dual Eckesachs Prototype" ?',
            false,
        ),
        option.bool(
            "101015",
            "WolfBlade Leader Hair",
            'Mode: [select] only\nShould the bot buy "WolfBlade Leader Hair" ?',
            false,
        ),
        option.bool(
            "101016",
            "WolfBlade Leader Locks",
            'Mode: [select] only\nShould the bot buy "WolfBlade Leader Locks" ?',
            false,
        ),
        option.bool(
            "101017",
            "WolfBlade Leader Visage",
            'Mode: [select] only\nShould the bot buy "WolfBlade Leader Visage" ?',
            false,
        ),
        option.bool(
            "88469",
            "Doomed Spear of Discord",
            'Mode: [select] only\nShould the bot buy "Doomed Spear of Discord" ?',
            false,
        ),
        option.bool("84977", "Gram Prototype", 'Mode: [select] only\nShould the bot buy "Gram Prototype" ?', false),
        option.bool(
            "84979",
            "Eckesachs Prototype",
            'Mode: [select] only\nShould the bot buy "Eckesachs Prototype" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: OuroborosLostandFoundMerge.select,
});

export default function main(): void {
    const script = new OuroborosLostandFoundMerge();
    Core.bankingBlackList.push("Nova Gemstone");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
