/*
name: Blighs Collectibles Merge
description: This bot will farm the items belonging to the selected mode for the Blighs Collectibles Merge [2724] in /forgecitrinitas
tags: blighs, collectibles, merge, forgecitrinitas, syszeros, uniform, mech, guest, ebilgames, arcade, game, assault, mecha, server, ping, syszero, morph, astronomical, viewport
*/
// Port of Scripts/Other/MergeShops/BlighsCollectiblesMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreAOR } from "../../story/ageofruin/CoreAOR";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const AOR = new CoreAOR();

export class BlighsCollectiblesMerge {
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
                //#region Known items
                case "Gold Voucher 100k":
                    Farm.voucher(req.name, req.quantity);
                    break;
                //#endregion
            }
        };
        AOR.forgeCitrinitas();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("forgecitrinitas", 2724, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "98455",
            "Sys-Zero's Uniform",
            'Mode: [select] only\nShould the bot buy "Sys-Zero\'s Uniform" ?',
            false,
        ),
        option.bool("101068", "Mech Guest", 'Mode: [select] only\nShould the bot buy "Mech Guest" ?', false),
        option.bool(
            "101060",
            "EbilGames Arcade Game",
            'Mode: [select] only\nShould the bot buy "EbilGames Arcade Game" ?',
            false,
        ),
        option.bool(
            "101059",
            "Assault Mecha Arcade Game",
            'Mode: [select] only\nShould the bot buy "Assault Mecha Arcade Game" ?',
            false,
        ),
        option.bool("101063", "Server Ping...", 'Mode: [select] only\nShould the bot buy "Server Ping..." ?', false),
        option.bool("98456", "Sys-Zero Morph", 'Mode: [select] only\nShould the bot buy "Sys-Zero Morph" ?', false),
        option.bool("98457", "Sys-Zero Hair", 'Mode: [select] only\nShould the bot buy "Sys-Zero Hair" ?', false),
        option.bool(
            "101067",
            "Astronomical Viewport",
            'Mode: [select] only\nShould the bot buy "Astronomical Viewport" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: BlighsCollectiblesMerge.select,
});

export default function main(): void {
    const script = new BlighsCollectiblesMerge();
    Core.bankingBlackList.push("Gold Voucher 100k", "Nova Gemstone");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
