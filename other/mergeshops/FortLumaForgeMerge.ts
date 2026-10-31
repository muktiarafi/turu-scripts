/*
name: Fort Luma Forge Merge
description: This bot will farm the items belonging to the selected mode for the Fort Luma Forge Merge [2684] in /fortluma
tags: fort, luma, forge, merge, fortluma, sol, gloria, proxima, imperator, nova, fomalhaut, luminary, white, knight, armet, lumiel, spinsaw, spinsaws, torch, celerity, gold, celeritas, statue, brasier, golden, geopetal, rubble
*/
// Port of Scripts/Other/MergeShops/FortLumaForgeMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CarcossaCanteenMerge } from "./CarcossaCanteenMerge";
import { CoreAOR } from "../../story/ageofruin/CoreAOR";

const Adv = new CoreAdvanced();
const AOR = new CoreAOR();
const CCM = new CarcossaCanteenMerge();

export class FortLumaForgeMerge {
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
                case "Silver Celeritas Statue":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    Core.huntMonsterMapID("fortluma", 6, req.name, req.quantity, { isTemp: req.temp });
                    Core.cancelRegisteredQuests();
                    break;
                case "Luma Torch of Clarity":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.huntMonsterMapID("fortluma", 5, req.name, req.quantity, { isTemp: req.temp });
                    break;
                case "Yellow Flame of Citrinitas":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    Core.registerQuests(Core.isMember ? 10620 : 10619);
                    // TODO: Replace with actual quest ID
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonster("fortluma", "Flame of Citrinitas", "Citrinitas Flicker");
                        Core.huntMonster("fortluma", "Luma Dragon Twins", "Draconic Contrasoul");
                        Core.huntMonsterMapID("fortluma", 10, "King's Yellow");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Geopetal Repair Glue":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.huntMonster("fortluma", "Luma Lifeform", req.name, req.quantity, { isTemp: req.temp });
                    bot.wait.forPickup(req.name);
                    break;
                case "Yew Ember":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("warwickforest", "Rubedo Elemental", req.name, quant, { isTemp: false });
                    break;
                case "Blade of Albedo":
                    CCM.buyAllMerge(req.name);
                    break;
                case "Aiwass Diamond":
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(Core.isMember ? 10387 : 10385);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("sanctuaryaiwass", "r9", "Top", "*", "Sal Alembroth", 1, { isTemp: false });
                        Core.killMonster("sanctuaryaiwass", "r9", "Top", "*", "Milk of Sulfur", 1, { isTemp: false });
                        Core.huntMonster("sanctuaryaiwass", "Anima Animus Aiwass", "Aeon Dream", 1, { isTemp: false });
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        AOR.fortLuma();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("fortluma", 2684, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "97345",
            "Luminary White Knight",
            'Mode: [select] only\nShould the bot buy "Luminary White Knight" ?',
            false,
        ),
        option.bool(
            "100881",
            "Flame of Citrinitas",
            'Mode: [select] only\nShould the bot buy "Flame of Citrinitas" ?',
            false,
        ),
        option.bool("97350", "Lumiel Spinsaw", 'Mode: [select] only\nShould the bot buy "Lumiel Spinsaw" ?', false),
        option.bool("93396", "Sol Imperator", 'Mode: [select] only\nShould the bot buy "Sol Imperator" ?', false),
        option.bool(
            "100883",
            "Citrinitas Crown",
            'Mode: [select] only\nShould the bot buy "Citrinitas Crown" ?',
            false,
        ),
        option.bool(
            "100884",
            "Splendor Solace Cape",
            'Mode: [select] only\nShould the bot buy "Splendor Solace Cape" ?',
            false,
        ),
        option.bool(
            "100885",
            "Dawn's Splendor Cape",
            'Mode: [select] only\nShould the bot buy "Dawn\'s Splendor Cape" ?',
            false,
        ),
        option.bool(
            "94452",
            "Dual Nova Fomalhaut",
            'Mode: [select] only\nShould the bot buy "Dual Nova Fomalhaut" ?',
            false,
        ),
        option.bool(
            "93397",
            "Dual Sol Imperator",
            'Mode: [select] only\nShould the bot buy "Dual Sol Imperator" ?',
            false,
        ),
        option.bool("93389", "Dual Sol Gloria", 'Mode: [select] only\nShould the bot buy "Dual Sol Gloria" ?', false),
        option.bool("97351", "Lumiel Spinsaws", 'Mode: [select] only\nShould the bot buy "Lumiel Spinsaws" ?', false),
        option.bool(
            "99506",
            "Gold Celeritas Statue",
            'Mode: [select] only\nShould the bot buy "Gold Celeritas Statue" ?',
            false,
        ),
        option.bool(
            "99507",
            "Fort Luma Brasier",
            'Mode: [select] only\nShould the bot buy "Fort Luma Brasier" ?',
            false,
        ),
        option.bool(
            "99508",
            "Golden Geopetal Rubble",
            'Mode: [select] only\nShould the bot buy "Golden Geopetal Rubble" ?',
            false,
        ),
        option.bool("99509", "Golden Geopetal", 'Mode: [select] only\nShould the bot buy "Golden Geopetal" ?', false),
        option.bool(
            "100882",
            "Flame of Citrinitas Hood",
            'Mode: [select] only\nShould the bot buy "Flame of Citrinitas Hood" ?',
            false,
        ),
        option.bool(
            "97346",
            "Luminary White Armet",
            'Mode: [select] only\nShould the bot buy "Luminary White Armet" ?',
            false,
        ),
        option.bool(
            "99503",
            "Luma Torch of Celerity",
            'Mode: [select] only\nShould the bot buy "Luma Torch of Celerity" ?',
            false,
        ),
        option.bool("93392", "Sol Proxima", 'Mode: [select] only\nShould the bot buy "Sol Proxima" ?', false),
        option.bool("93388", "Sol Gloria", 'Mode: [select] only\nShould the bot buy "Sol Gloria" ?', false),
        option.bool("94451", "Nova Fomalhaut", 'Mode: [select] only\nShould the bot buy "Nova Fomalhaut" ?', false),
        option.bool(
            "100886",
            "Blade of Citrinitas",
            'Mode: [select] only\nShould the bot buy "Blade of Citrinitas" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: FortLumaForgeMerge.select,
});

export default function main(): void {
    const script = new FortLumaForgeMerge();
    Core.bankingBlackList.push(
        "Yew Ember",
        "Yellow Flame of Citrinitas",
        "Luma Torch of Clarity",
        "Silver Celeritas Statue",
        "Geopetal Repair Glue",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
