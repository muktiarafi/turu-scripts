/*
name: Summer Break Merge
description: This bot will farm the items belonging to the selected mode for the Summer Break Merge [2155] in /summerbreak
tags: summer, break, merge, summerbreak, enchanted, volleyball, captain, hero, angelica, wetsuit, covenant, dark, halo, wings, buoyant, tail, , team, a, mascot, b, c, volleyballers, board, waterguns, foam, watergun, glasses, female, horns, hairband, morph, spear, pure, beach, rod, surfboard, nulgath, nation, undead, legion
*/
// Port of Scripts/Seasonal/SummerBreak/SummerBreakMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreLegion } from "../../legion/CoreLegion";
import { CoreNation } from "../../nation/CoreNation";

const Adv = new CoreAdvanced();
const Nation = new CoreNation();
const Legion = new CoreLegion();

export class SummerBreakMerge {
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
                case "Volleyball Captain":

                case "Volleyball Hero":

                case "Volleyball Hero's Hat":

                case "Volleyball Heroine's Hat":

                case "Volleyball Hero's Hat + Glasses":

                case "Volleyball Heroine's Hat + Glasses":

                case "Volleyball Hero's Glasses":

                case "Volleyball Team A Mascot":

                case "Volleyball Hero's Board Cape":

                case "Volleyball Team A Mascot Pet":

                case "Volleyball Hero's Rod":

                case "Volleyball Hero's Surfboard":

                case "Volleyball Hero's Foam Spear":

                case "Volleyball Hero's Foam Gauntlet":

                case "Volleyball Hero's WaterGun":

                case "Volleyball Hero's WaterGuns":

                case "Volleyball Hero's Hair":

                case "Volleyball Heroine's Locks":

                case "Volleyball Team B Mascot":

                case "Volleyball Team C Mascot":

                case "Volleyball Team B Mascot Pet":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.ensureAccept(8794);
                    Core.huntMonster("summerbreak", "MMMirage", "Gum Ball", 6);
                    Core.ensureComplete(8794, req.id);
                    Core.cancelRegisteredQuests();
                    break;
                case "Model Hero's Cut":

                case "Model Hero's Locks":

                case "Model Hero's Morph":

                case "Model Hero's Visage":
                    Core.buyItem(bot.map.name, 299, "Barber");
                    break;
                case "Summer Sizzle Lotion":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8794);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("summerbreak", "MMMirage", "Gum Ball", 6);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Volcanic Fragment":

                case "Dark Angelica Wetsuit":

                case "Dark Covenant Wetsuit":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.killMonster("lavarockbay", "r2", "Left", "*", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Solar Orb":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("eventhub", "Solar Elemental", req.name, quant, { isTemp: req.temp });
                    break;
                case "Diamond of Nulgath":
                    Nation.farmDiamondofNulgath(quant);
                    break;
                case "Legion Token":
                    Legion.farmLegionToken(quant);
                    break;
                //#region fill these
                case "Charcoal Beach Ball":

                case "Blue Beach Ball":
                    Core.huntMonster("summerbreak", "Cyborg Shark", req.name, quant, { isTemp: req.temp });
                    break;
                //#endregion
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("summerbreak", 2155, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "71099",
            "Enchanted Volleyball Captain",
            'Mode: [select] only\nShould the bot buy "Enchanted Volleyball Captain" ?',
            false,
        ),
        option.bool(
            "71100",
            "Enchanted Volleyball Hero",
            'Mode: [select] only\nShould the bot buy "Enchanted Volleyball Hero" ?',
            false,
        ),
        option.bool("93938", "Angelica Wetsuit", 'Mode: [select] only\nShould the bot buy "Angelica Wetsuit" ?', false),
        option.bool("93954", "Covenant Wetsuit", 'Mode: [select] only\nShould the bot buy "Covenant Wetsuit" ?', false),
        option.bool(
            "93949",
            "Dark Angelica Halo",
            'Mode: [select] only\nShould the bot buy "Dark Angelica Halo" ?',
            false,
        ),
        option.bool(
            "93950",
            "Dark Angelica Wings",
            'Mode: [select] only\nShould the bot buy "Dark Angelica Wings" ?',
            false,
        ),
        option.bool(
            "93963",
            "Buoyant Covenant Tail",
            'Mode: [select] only\nShould the bot buy "Buoyant Covenant Tail" ?',
            false,
        ),
        option.bool(
            "93964",
            "Buoyant Covenant Wings",
            'Mode: [select] only\nShould the bot buy "Buoyant Covenant Wings" ?',
            false,
        ),
        option.bool(
            "93965",
            "Buoyant Covenant Wings + Tail",
            'Mode: [select] only\nShould the bot buy "Buoyant Covenant Wings + Tail" ?',
            false,
        ),
        option.bool(
            "93973",
            "Dark Covenant Tail",
            'Mode: [select] only\nShould the bot buy "Dark Covenant Tail" ?',
            false,
        ),
        option.bool(
            "93974",
            "Dark Covenant Wings",
            'Mode: [select] only\nShould the bot buy "Dark Covenant Wings" ?',
            false,
        ),
        option.bool(
            "93975",
            "Dark Covenant Wings + Tail",
            'Mode: [select] only\nShould the bot buy "Dark Covenant Wings + Tail" ?',
            false,
        ),
        option.bool(
            "93944",
            "Buoyant Angelica Halo",
            'Mode: [select] only\nShould the bot buy "Buoyant Angelica Halo" ?',
            false,
        ),
        option.bool(
            "93945",
            "Buoyant Angelica Wings",
            'Mode: [select] only\nShould the bot buy "Buoyant Angelica Wings" ?',
            false,
        ),
        option.bool(
            "71105",
            "Enchanted Team A Mascot",
            'Mode: [select] only\nShould the bot buy "Enchanted Team A Mascot" ?',
            false,
        ),
        option.bool(
            "71106",
            "Enchanted Team B Mascot",
            'Mode: [select] only\nShould the bot buy "Enchanted Team B Mascot" ?',
            false,
        ),
        option.bool(
            "71107",
            "Enchanted Team C Mascot",
            'Mode: [select] only\nShould the bot buy "Enchanted Team C Mascot" ?',
            false,
        ),
        option.bool(
            "71108",
            "Enchanted Volleyballer's Board Cape",
            'Mode: [select] only\nShould the bot buy "Enchanted Volleyballer\'s Board Cape" ?',
            false,
        ),
        option.bool(
            "71114",
            "Enchanted Volleyballer's WaterGuns",
            'Mode: [select] only\nShould the bot buy "Enchanted Volleyballer\'s WaterGuns" ?',
            false,
        ),
        option.bool(
            "71112",
            "Enchanted Volleyballer's Foam Gauntlet",
            'Mode: [select] only\nShould the bot buy "Enchanted Volleyballer\'s Foam Gauntlet" ?',
            false,
        ),
        option.bool(
            "71113",
            "Enchanted Volleyballer's WaterGun",
            'Mode: [select] only\nShould the bot buy "Enchanted Volleyballer\'s WaterGun" ?',
            false,
        ),
        option.bool(
            "71103",
            "Enchanted Volleyballer's Hat + Glasses",
            'Mode: [select] only\nShould the bot buy "Enchanted Volleyballer\'s Hat + Glasses" ?',
            false,
        ),
        option.bool(
            "71104",
            "Enchanted Volleyballer's Female Hat + Glasses",
            'Mode: [select] only\nShould the bot buy "Enchanted Volleyballer\'s Female Hat + Glasses" ?',
            false,
        ),
        option.bool(
            "71101",
            "Enchanted Volleyballer's Hair",
            'Mode: [select] only\nShould the bot buy "Enchanted Volleyballer\'s Hair" ?',
            false,
        ),
        option.bool(
            "71102",
            "Enchanted Volleyballer's Locks",
            'Mode: [select] only\nShould the bot buy "Enchanted Volleyballer\'s Locks" ?',
            false,
        ),
        option.bool(
            "93957",
            "Buoyant Covenant Horns",
            'Mode: [select] only\nShould the bot buy "Buoyant Covenant Horns" ?',
            false,
        ),
        option.bool(
            "93958",
            "Buoyant Covenant Hairband",
            'Mode: [select] only\nShould the bot buy "Buoyant Covenant Hairband" ?',
            false,
        ),
        option.bool(
            "93961",
            "Buoyant Covenant Morph",
            'Mode: [select] only\nShould the bot buy "Buoyant Covenant Morph" ?',
            false,
        ),
        option.bool(
            "93962",
            "Buoyant Covenant Visage",
            'Mode: [select] only\nShould the bot buy "Buoyant Covenant Visage" ?',
            false,
        ),
        option.bool(
            "93969",
            "Dark Covenant Horns",
            'Mode: [select] only\nShould the bot buy "Dark Covenant Horns" ?',
            false,
        ),
        option.bool(
            "93970",
            "Dark Covenant Hairband",
            'Mode: [select] only\nShould the bot buy "Dark Covenant Hairband" ?',
            false,
        ),
        option.bool(
            "93971",
            "Dark Covenant Morph",
            'Mode: [select] only\nShould the bot buy "Dark Covenant Morph" ?',
            false,
        ),
        option.bool(
            "93972",
            "Dark Covenant Visage",
            'Mode: [select] only\nShould the bot buy "Dark Covenant Visage" ?',
            false,
        ),
        option.bool(
            "71111",
            "Enchanted Volleyballer's Foam Spear",
            'Mode: [select] only\nShould the bot buy "Enchanted Volleyballer\'s Foam Spear" ?',
            false,
        ),
        option.bool(
            "93953",
            "Pure Dark Beach Staff",
            'Mode: [select] only\nShould the bot buy "Pure Dark Beach Staff" ?',
            false,
        ),
        option.bool(
            "71109",
            "Enchanted Volleyballer's Rod",
            'Mode: [select] only\nShould the bot buy "Enchanted Volleyballer\'s Rod" ?',
            false,
        ),
        option.bool(
            "71110",
            "Enchanted Volleyballer's Surfboard",
            'Mode: [select] only\nShould the bot buy "Enchanted Volleyballer\'s Surfboard" ?',
            false,
        ),
        option.bool(
            "44211",
            "Surfboard of Nulgath Nation",
            'Mode: [select] only\nShould the bot buy "Surfboard of Nulgath Nation" ?',
            false,
        ),
        option.bool(
            "44210",
            "Surfboard of the Undead Legion",
            'Mode: [select] only\nShould the bot buy "Surfboard of the Undead Legion" ?',
            false,
        ),
        option.bool("93948", "Pure Beach Staff", 'Mode: [select] only\nShould the bot buy "Pure Beach Staff" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: SummerBreakMerge.select,
});

export default function main(): void {
    const script = new SummerBreakMerge();
    Core.bankingBlackList.push(
        "Summer Sizzle Lotion",
        "Volleyball Captain",
        "Volleyball Hero",
        "Dark Angelica Wetsuit",
        "Solar Orb",
        "Dark Covenant Wetsuit",
        "Volcanic Fragment",
        "Volleyball Team A Mascot",
        "Volleyball Team B Mascot",
        "Volleyball Team C Mascot",
        "Volleyball Hero's Board Cape",
        "Volleyball Hero's WaterGuns",
        "Volleyball Hero's Foam Gauntlet",
        "Volleyball Hero's WaterGun",
        "Volleyball Hero's Hat + Glasses",
        "Volleyball Heroine's Hat + Glasses",
        "Volleyball Hero's Glasses",
        "Volleyball Heroine's Locks",
        "Model Hero's Cut",
        "Model Hero's Locks",
        "Model Hero's Morph",
        "Model Hero's Visage",
        "Volleyball Hero's Foam Spear",
        "Charcoal Beach Ball",
        "Volleyball Hero's Rod",
        "Volleyball Hero's Surfboard",
        "Diamond of Nulgath",
        "Legion Token",
        "Blue Beach Ball",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
