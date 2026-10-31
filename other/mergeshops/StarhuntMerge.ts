/*
name: Starhunt Merge
description: This bot will farm the items belonging to the selected mode for the Starhunt Merge [2598] in /ariagreenhouse
tags: starhunt, merge, ariagreenhouse, astromancers, apprentice, morph, astral, compass, fireworks, qipao, star, festival, weapon, gift, i, ii, crimson, staredge, suhail, staredges, novablade, persei, novablades, spectral, saiph, alnitak, celestial
*/
// Port of Scripts/Other/MergeShops/StarhuntMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { AriaGreenhouse } from "../../story/AriaGreenhouse";

const Adv = new CoreAdvanced();
const AG = new AriaGreenhouse();

export class StarhuntMerge {
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
                case "Delta Fragment":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonsterQuest(10318, ["yokaiportal", "Kitsune Spirits", ClassType.Farm]);
                        bot.wait.forPickup(req.name);
                    }
                    break;
                //#endregion
            }
        };
        AG.kylokos();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("ariagreenhouse", 2598, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "94555",
            "Astromancer's Apprentice",
            'Mode: [select] only\nShould the bot buy "Astromancer\'s Apprentice" ?',
            false,
        ),
        option.bool(
            "94556",
            "Astromancer's Apprentice Morph",
            'Mode: [select] only\nShould the bot buy "Astromancer\'s Apprentice Morph" ?',
            false,
        ),
        option.bool(
            "94557",
            "Astromancer's Apprentice Visage",
            'Mode: [select] only\nShould the bot buy "Astromancer\'s Apprentice Visage" ?',
            false,
        ),
        option.bool(
            "94558",
            "Astral Apprentice Compass",
            'Mode: [select] only\nShould the bot buy "Astral Apprentice Compass" ?',
            false,
        ),
        option.bool("94559", "Fireworks Qipao", 'Mode: [select] only\nShould the bot buy "Fireworks Qipao" ?', false),
        option.bool(
            "94560",
            "Astromancer's Apprentice Hair",
            'Mode: [select] only\nShould the bot buy "Astromancer\'s Apprentice Hair" ?',
            false,
        ),
        option.bool(
            "94561",
            "Astromancer's Apprentice Locks",
            'Mode: [select] only\nShould the bot buy "Astromancer\'s Apprentice Locks" ?',
            false,
        ),
        option.bool(
            "94562",
            "Star Festival Weapon Gift I",
            'Mode: [select] only\nShould the bot buy "Star Festival Weapon Gift I" ?',
            false,
        ),
        option.bool(
            "94563",
            "Star Festival Weapon Gift II",
            'Mode: [select] only\nShould the bot buy "Star Festival Weapon Gift II" ?',
            false,
        ),
        option.bool(
            "91467",
            "Crimson StarEdge Suhail",
            'Mode: [select] only\nShould the bot buy "Crimson StarEdge Suhail" ?',
            false,
        ),
        option.bool(
            "91468",
            "Crimson StarEdges Suhail",
            'Mode: [select] only\nShould the bot buy "Crimson StarEdges Suhail" ?',
            false,
        ),
        option.bool(
            "91469",
            "Crimson NovaBlade Persei",
            'Mode: [select] only\nShould the bot buy "Crimson NovaBlade Persei" ?',
            false,
        ),
        option.bool(
            "91470",
            "Crimson NovaBlades Persei",
            'Mode: [select] only\nShould the bot buy "Crimson NovaBlades Persei" ?',
            false,
        ),
        option.bool(
            "91480",
            "Spectral StarEdge Saiph",
            'Mode: [select] only\nShould the bot buy "Spectral StarEdge Saiph" ?',
            false,
        ),
        option.bool(
            "91481",
            "Spectral StarEdges Saiph",
            'Mode: [select] only\nShould the bot buy "Spectral StarEdges Saiph" ?',
            false,
        ),
        option.bool(
            "91482",
            "Spectral NovaBlade Alnitak",
            'Mode: [select] only\nShould the bot buy "Spectral NovaBlade Alnitak" ?',
            false,
        ),
        option.bool(
            "91483",
            "Spectral NovaBlades Alnitak",
            'Mode: [select] only\nShould the bot buy "Spectral NovaBlades Alnitak" ?',
            false,
        ),
        option.bool("94574", "Celestial Qipao", 'Mode: [select] only\nShould the bot buy "Celestial Qipao" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: StarhuntMerge.select,
});

export default function main(): void {
    const script = new StarhuntMerge();
    Core.bankingBlackList.push("Delta Fragment");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
