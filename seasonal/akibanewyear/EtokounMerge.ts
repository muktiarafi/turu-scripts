/*
name: Etokoun Merge
description: Farms all of the items from Etokoun Merge.
tags: etokoun-merge, etokoun, seasonal, akiba-new-year, merge-shop
*/
// Port of Scripts/Seasonal/AkibaNewYear/EtokounMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { YokaiHunt } from "./YokaiHunt";

const Adv = new CoreAdvanced();
const YH = new YokaiHunt();

export class EtokounMerge {
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
                case "Ox Medallion":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(7942);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("yokaihunt", "r3", "Left", "Golden Ox Guard", "Ox Meat", 8, { log: false });
                        Core.killMonster(
                            "yokaihunt",
                            "r6",
                            "Left",
                            "Ox Yokai Spirit",
                            "Holographic Ox Meat",
                            undefined,
                            { log: false },
                        );
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        YH.aiNoMiko();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("yokaihunt", 1975, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "59230",
            "Divine Ox Garments",
            'Mode: [select] only\nShould the bot buy "Divine Ox Garments" ?',
            false,
        ),
        option.bool(
            "59231",
            "Divine Horned Hair",
            'Mode: [select] only\nShould the bot buy "Divine Horned Hair" ?',
            false,
        ),
        option.bool(
            "59232",
            "Divine Horned Headpiece",
            'Mode: [select] only\nShould the bot buy "Divine Horned Headpiece" ?',
            false,
        ),
        option.bool(
            "59233",
            "Divine Horned Headdress",
            'Mode: [select] only\nShould the bot buy "Divine Horned Headdress" ?',
            false,
        ),
        option.bool(
            "59234",
            "Divine Horned Locks",
            'Mode: [select] only\nShould the bot buy "Divine Horned Locks" ?',
            false,
        ),
        option.bool("59235", "Divine Ox Hair", 'Mode: [select] only\nShould the bot buy "Divine Ox Hair" ?', false),
        option.bool(
            "59236",
            "Divine Ox Headpiece",
            'Mode: [select] only\nShould the bot buy "Divine Ox Headpiece" ?',
            false,
        ),
        option.bool(
            "59237",
            "Divine Ox Headdress",
            'Mode: [select] only\nShould the bot buy "Divine Ox Headdress" ?',
            false,
        ),
        option.bool("59238", "Divine Ox Locks", 'Mode: [select] only\nShould the bot buy "Divine Ox Locks" ?', false),
        option.bool("59240", "Divine Ox Jian", 'Mode: [select] only\nShould the bot buy "Divine Ox Jian" ?', false),
        option.bool(
            "59241",
            "Dual Divine Ox Jians",
            'Mode: [select] only\nShould the bot buy "Dual Divine Ox Jians" ?',
            false,
        ),
        option.bool("59431", "Yokai Hanbok", 'Mode: [select] only\nShould the bot buy "Yokai Hanbok" ?', false),
        option.bool("59432", "Heeoseutail", 'Mode: [select] only\nShould the bot buy "Heeoseutail" ?', false),
        option.bool("59433", "Jeonrip", 'Mode: [select] only\nShould the bot buy "Jeonrip" ?', false),
        option.bool("59434", "Sangtugwan", 'Mode: [select] only\nShould the bot buy "Sangtugwan" ?', false),
        option.bool("59435", "Satgat", 'Mode: [select] only\nShould the bot buy "Satgat" ?', false),
        option.bool("59436", "Sonjjang", 'Mode: [select] only\nShould the bot buy "Sonjjang" ?', false),
        option.bool(
            "59437",
            "Dual Geoms on your Back",
            'Mode: [select] only\nShould the bot buy "Dual Geoms on your Back" ?',
            false,
        ),
        option.bool(
            "59438",
            "Gong Gyeog on your Back",
            'Mode: [select] only\nShould the bot buy "Gong Gyeog on your Back" ?',
            false,
        ),
        option.bool(
            "59439",
            "Jonglyu on your Back",
            'Mode: [select] only\nShould the bot buy "Jonglyu on your Back" ?',
            false,
        ),
        option.bool(
            "59440",
            "Pyojun on your Back",
            'Mode: [select] only\nShould the bot buy "Pyojun on your Back" ?',
            false,
        ),
        option.bool(
            "59441",
            "Ttogttoghan on your Back",
            'Mode: [select] only\nShould the bot buy "Ttogttoghan on your Back" ?',
            false,
        ),
        option.bool("59442", "Usan", 'Mode: [select] only\nShould the bot buy "Usan" ?', false),
        option.bool("59443", "Geom", 'Mode: [select] only\nShould the bot buy "Geom" ?', false),
        option.bool("59444", "Dual Geom", 'Mode: [select] only\nShould the bot buy "Dual Geom" ?', false),
        option.bool("59445", "Geom2", 'Mode: [select] only\nShould the bot buy "Geom2" ?', false),
        option.bool("59446", "Dual Geom2", 'Mode: [select] only\nShould the bot buy "Dual Geom2" ?', false),
        option.bool("59447", "Duo Geoms", 'Mode: [select] only\nShould the bot buy "Duo Geoms" ?', false),
        option.bool(
            "59448",
            "Dual Geom Reversed",
            'Mode: [select] only\nShould the bot buy "Dual Geom Reversed" ?',
            false,
        ),
        option.bool(
            "59449",
            "Dual Geom2 Reversed",
            'Mode: [select] only\nShould the bot buy "Dual Geom2 Reversed" ?',
            false,
        ),
        option.bool(
            "59450",
            "Gong Gyeog Moglin",
            'Mode: [select] only\nShould the bot buy "Gong Gyeog Moglin" ?',
            false,
        ),
        option.bool("59451", "Jonglyu Moglin", 'Mode: [select] only\nShould the bot buy "Jonglyu Moglin" ?', false),
        option.bool("59452", "Pyojun Moglin", 'Mode: [select] only\nShould the bot buy "Pyojun Moglin" ?', false),
        option.bool(
            "59453",
            "Ttogttoghan Moglin",
            'Mode: [select] only\nShould the bot buy "Ttogttoghan Moglin" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: EtokounMerge.select,
});

export default function main(): void {
    const script = new EtokounMerge();
    Core.bankingBlackList.push("Ox Medallion");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
