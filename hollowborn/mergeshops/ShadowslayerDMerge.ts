/*
name: Shadowslayer D Merge
description: This bot will farm the items belonging to the selected mode for the Shadowslayer D Merge [2369] in /hbchallenge
tags: shadowslayer, d, merge, hbchallenge, hollowborn, vampire, knight, fanged, wings, plague, calibur, vampiric, saber, sabers, lycan, ferocious, morph, claws, lord, regal, lords, territory, cap, amulet, top, veil, beard, bearded, scarf, halo, thorns, gloria, queen, pain, penance, absolution, longinus, decimation, admonition, slayers, thorn
*/
// Port of Scripts/Hollowborn/MergeShops/ShadowslayerDMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreHollowbornStory } from "../../story/hollowborn/CoreHollowbornStory";

const Adv = new CoreAdvanced();
const CHBS = new CoreHollowbornStory();

export class ShadowslayerDMerge {
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
                case "Hollow Essence":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(9487);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("hbchallenge", "Sentient Hollow", "Hollow Essence", 9);
                    }
                    bot.wait.forPickup(req.name);
                    Core.cancelRegisteredQuests();
                    break;
                case "Hollowborn Vampire Fang":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(9488);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("hbchallenge", "Hollowborn Vampire", "Shattered Fang");
                    }
                    bot.wait.forPickup(req.name);
                    Core.cancelRegisteredQuests();
                    break;
                case "Hollowborn Lycan Claw":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(9489);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("hbchallenge", "Hollowborn Lycan", "Chipped Claw");
                    }
                    bot.wait.forPickup(req.name);
                    Core.cancelRegisteredQuests();
                    break;
                case "Hollowborn Lycan Morph":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("hbchallenge", "Hollowborn Lycan", req.name, quant, { isTemp: req.temp });
                    bot.wait.forPickup(req.name);
                    break;
                case "Hollowborn Vampire Lord Mask":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("hbchallenge", "Sentient Hollow", req.name, quant, { isTemp: req.temp });
                    bot.wait.forPickup(req.name);
                    break;
                case "Noble Hollowborn Vampire Wings":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("hbchallenge", "Hollowborn Vampire", req.name, quant, { isTemp: req.temp });
                    bot.wait.forPickup(req.name);
                    break;
            }
        };
        CHBS.shadowslayerD();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("hbchallenge", 2369, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "81426",
            "Hollowborn Vampire Knight",
            'Mode: [select] only\nShould the bot buy "Hollowborn Vampire Knight" ?',
            false,
        ),
        option.bool(
            "81427",
            "Hollowborn Vampire Knight Helm",
            'Mode: [select] only\nShould the bot buy "Hollowborn Vampire Knight Helm" ?',
            false,
        ),
        option.bool(
            "81428",
            "Fanged Hollowborn Helm",
            'Mode: [select] only\nShould the bot buy "Fanged Hollowborn Helm" ?',
            false,
        ),
        option.bool(
            "81429",
            "Hollowborn Vampire Knight Wings",
            'Mode: [select] only\nShould the bot buy "Hollowborn Vampire Knight Wings" ?',
            false,
        ),
        option.bool(
            "81430",
            "Hollowborn Plague Calibur",
            'Mode: [select] only\nShould the bot buy "Hollowborn Plague Calibur" ?',
            false,
        ),
        option.bool(
            "81431",
            "Dual Hollowborn Plague Calibur",
            'Mode: [select] only\nShould the bot buy "Dual Hollowborn Plague Calibur" ?',
            false,
        ),
        option.bool(
            "81432",
            "Vampiric Hollowborn Saber",
            'Mode: [select] only\nShould the bot buy "Vampiric Hollowborn Saber" ?',
            false,
        ),
        option.bool(
            "81433",
            "Vampiric Hollowborn Sabers",
            'Mode: [select] only\nShould the bot buy "Vampiric Hollowborn Sabers" ?',
            false,
        ),
        option.bool("81777", "Hollowborn Lycan", 'Mode: [select] only\nShould the bot buy "Hollowborn Lycan" ?', false),
        option.bool(
            "81778",
            "Ferocious Hollowborn Lycan Morph",
            'Mode: [select] only\nShould the bot buy "Ferocious Hollowborn Lycan Morph" ?',
            false,
        ),
        option.bool(
            "81781",
            "Hollowborn Lycan Claws",
            'Mode: [select] only\nShould the bot buy "Hollowborn Lycan Claws" ?',
            false,
        ),
        option.bool(
            "81782",
            "Hollowborn Vampire Lord",
            'Mode: [select] only\nShould the bot buy "Hollowborn Vampire Lord" ?',
            false,
        ),
        option.bool(
            "81783",
            "Hollowborn Vampire Lord Morph",
            'Mode: [select] only\nShould the bot buy "Hollowborn Vampire Lord Morph" ?',
            false,
        ),
        option.bool(
            "81786",
            "Regal Hollowborn Vampire Wings",
            'Mode: [select] only\nShould the bot buy "Regal Hollowborn Vampire Wings" ?',
            false,
        ),
        option.bool(
            "81788",
            "Hollowborn Vampire Lord's Territory",
            'Mode: [select] only\nShould the bot buy "Hollowborn Vampire Lord\'s Territory" ?',
            false,
        ),
        option.bool(
            "81925",
            "Hollowborn Shadowslayer",
            'Mode: [select] only\nShould the bot buy "Hollowborn Shadowslayer" ?',
            false,
        ),
        option.bool(
            "81926",
            "Hollowborn Shadowslayer Hair",
            'Mode: [select] only\nShould the bot buy "Hollowborn Shadowslayer Hair" ?',
            false,
        ),
        option.bool(
            "81927",
            "Hollowborn Shadowslayer Locks",
            'Mode: [select] only\nShould the bot buy "Hollowborn Shadowslayer Locks" ?',
            false,
        ),
        option.bool(
            "81928",
            "Hollowborn Shadowslayer Cap",
            'Mode: [select] only\nShould the bot buy "Hollowborn Shadowslayer Cap" ?',
            false,
        ),
        option.bool(
            "81929",
            "Hollowborn Shadowslayer Cap and Locks",
            'Mode: [select] only\nShould the bot buy "Hollowborn Shadowslayer Cap and Locks" ?',
            false,
        ),
        option.bool(
            "81930",
            "Hollowborn Shadowslayer Amulet",
            'Mode: [select] only\nShould the bot buy "Hollowborn Shadowslayer Amulet" ?',
            false,
        ),
        option.bool(
            "81931",
            "Hollowborn Shadowslayer Locks and Amulet",
            'Mode: [select] only\nShould the bot buy "Hollowborn Shadowslayer Locks and Amulet" ?',
            false,
        ),
        option.bool(
            "81932",
            "Hollowborn Shadowslayer Top Hat",
            'Mode: [select] only\nShould the bot buy "Hollowborn Shadowslayer Top Hat" ?',
            false,
        ),
        option.bool(
            "81933",
            "Hollowborn Shadowslayer Veil",
            'Mode: [select] only\nShould the bot buy "Hollowborn Shadowslayer Veil" ?',
            false,
        ),
        option.bool(
            "81934",
            "Hollowborn Shadowslayer Beard",
            'Mode: [select] only\nShould the bot buy "Hollowborn Shadowslayer Beard" ?',
            false,
        ),
        option.bool(
            "81935",
            "Hollowborn Shadowslayer Bearded Cap",
            'Mode: [select] only\nShould the bot buy "Hollowborn Shadowslayer Bearded Cap" ?',
            false,
        ),
        option.bool(
            "81936",
            "Hollowborn Shadowslayer Scarf and Cap",
            'Mode: [select] only\nShould the bot buy "Hollowborn Shadowslayer Scarf and Cap" ?',
            false,
        ),
        option.bool(
            "81937",
            "Hollowborn Bearded Shadowslayer Amulet",
            'Mode: [select] only\nShould the bot buy "Hollowborn Bearded Shadowslayer Amulet" ?',
            false,
        ),
        option.bool(
            "81938",
            "Hollowborn Halo of Thorns",
            'Mode: [select] only\nShould the bot buy "Hollowborn Halo of Thorns" ?',
            false,
        ),
        option.bool(
            "81939",
            "Hollowborn Gloria",
            'Mode: [select] only\nShould the bot buy "Hollowborn Gloria" ?',
            false,
        ),
        option.bool(
            "81940",
            "Hollowborn Queen of Pain",
            'Mode: [select] only\nShould the bot buy "Hollowborn Queen of Pain" ?',
            false,
        ),
        option.bool(
            "81941",
            "Hollowborn Penance",
            'Mode: [select] only\nShould the bot buy "Hollowborn Penance" ?',
            false,
        ),
        option.bool(
            "81942",
            "Dual Hollowborn Penance",
            'Mode: [select] only\nShould the bot buy "Dual Hollowborn Penance" ?',
            false,
        ),
        option.bool(
            "81943",
            "Hollowborn Absolution",
            'Mode: [select] only\nShould the bot buy "Hollowborn Absolution" ?',
            false,
        ),
        option.bool(
            "81944",
            "Dual Hollowborn Absolution",
            'Mode: [select] only\nShould the bot buy "Dual Hollowborn Absolution" ?',
            false,
        ),
        option.bool(
            "81945",
            "Hollowborn Longinus",
            'Mode: [select] only\nShould the bot buy "Hollowborn Longinus" ?',
            false,
        ),
        option.bool(
            "81946",
            "Hollowborn Decimation",
            'Mode: [select] only\nShould the bot buy "Hollowborn Decimation" ?',
            false,
        ),
        option.bool(
            "81947",
            "Dual Hollowborn Decimation",
            'Mode: [select] only\nShould the bot buy "Dual Hollowborn Decimation" ?',
            false,
        ),
        option.bool(
            "81948",
            "Hollowborn Admonition",
            'Mode: [select] only\nShould the bot buy "Hollowborn Admonition" ?',
            false,
        ),
        option.bool(
            "81949",
            "Dual Hollowborn Admonition",
            'Mode: [select] only\nShould the bot buy "Dual Hollowborn Admonition" ?',
            false,
        ),
        option.bool(
            "81950",
            "Hollowborn Slayer's Thorn",
            'Mode: [select] only\nShould the bot buy "Hollowborn Slayer\'s Thorn" ?',
            false,
        ),
        option.bool(
            "81951",
            "Hollowborn Slayer's Thorns",
            'Mode: [select] only\nShould the bot buy "Hollowborn Slayer\'s Thorns" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ShadowslayerDMerge.select,
});

export default function main(): void {
    const script = new ShadowslayerDMerge();
    Core.bankingBlackList.push(
        "Hollow Essence",
        "Hollowborn Vampire Fang",
        "Hollowborn Lycan Claw",
        "Hollowborn Lycan Morph",
        "Hollowborn Vampire Lord Mask",
        "Noble Hollowborn Vampire Wings",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
