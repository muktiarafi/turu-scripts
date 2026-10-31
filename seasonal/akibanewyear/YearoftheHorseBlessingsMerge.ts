/*
name: Year of the Horse Blessings Merge
description: This bot will farm the items belonging to the selected mode for the Year of the Horse Blessings Merge [2679] in /yokaihunt
tags: year, of, the, horse, blessings, merge, yokaihunt, passionate, qipao, royal, equine, vanguard, ancestral, dao, stallions, passion, fan, propserity, bamboo, ink, painting, lady, suzhens, bridge, prosperity
*/
// Port of Scripts/Seasonal/AkibaNewYear/YearoftheHorseBlessingsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { YokaiHunt } from "./YokaiHunt";

const Adv = new CoreAdvanced();
const YH = new YokaiHunt();

export class YearoftheHorseBlessingsMerge {
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
                case "Shi Wa Lam's Blessing":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonsterQuest(10589, "shadowbattleon", "Ouro Spawn");
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Flaming Horseshoe":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonsterQuest(10590, "yokaihunt", "Red Hare");
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Stallion's Warmth Fan":

                case "Stallion's Vitality Fan":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    Core.huntMonster("yokaihunt", "Red Hare", req.name, quant, { isTemp: req.temp, log: false });
                    break;
                //#endregion
            }
        };
        YH.shiWaLam();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("yokaihunt", 2679, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("99140", "Passionate Qipao", 'Mode: [select] only\nShould the bot buy "Passionate Qipao" ?', false),
        option.bool(
            "99141",
            "Royal Equine Vanguard",
            'Mode: [select] only\nShould the bot buy "Royal Equine Vanguard" ?',
            false,
        ),
        option.bool(
            "99142",
            "Royal Equine Vanguard Helm",
            'Mode: [select] only\nShould the bot buy "Royal Equine Vanguard Helm" ?',
            false,
        ),
        option.bool("99143", "Ancestral Dao", 'Mode: [select] only\nShould the bot buy "Ancestral Dao" ?', false),
        option.bool(
            "99144",
            "Dual Ancestral Dao",
            'Mode: [select] only\nShould the bot buy "Dual Ancestral Dao" ?',
            false,
        ),
        option.bool(
            "99176",
            "Stallion's Passion Fan",
            'Mode: [select] only\nShould the bot buy "Stallion\'s Passion Fan" ?',
            false,
        ),
        option.bool(
            "99178",
            "Stallion's Propserity Fan",
            'Mode: [select] only\nShould the bot buy "Stallion\'s Propserity Fan" ?',
            false,
        ),
        option.bool(
            "99185",
            "Bamboo Ink Painting",
            'Mode: [select] only\nShould the bot buy "Bamboo Ink Painting" ?',
            false,
        ),
        option.bool(
            "99186",
            "Lady Suzhen's Bridge",
            'Mode: [select] only\nShould the bot buy "Lady Suzhen\'s Bridge" ?',
            false,
        ),
        option.bool("99179", "Prosperity Qipao", 'Mode: [select] only\nShould the bot buy "Prosperity Qipao" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: YearoftheHorseBlessingsMerge.select,
});

export default function main(): void {
    const script = new YearoftheHorseBlessingsMerge();
    Core.bankingBlackList.push(
        "Shi Wa Lam's Blessing",
        "Flaming Horseshoe",
        "Stallion's Warmth Fan",
        "Stallion's Vitality Fan",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
