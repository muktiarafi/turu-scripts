/*
name: Festival of Victors Rewards Merge
description: This bot will farm the items belonging to the selected mode for the Festival of Victors Rewards Merge [2592] in /victormatsuri
tags: festival, of, victors, rewards, merge, victormatsuri, elvish, yukata, vampiric, crimson, midnight, sunaxe, antares, suncleaver, spectral, staraxe, alnilam, starcleaver, floating, chochin, matsuri, wings, , sensu, sunaxes, suncleavers, starblades, naos, starcleavers, staraxes, morph, novascythe, omicron, novaaxe, sunscythe, cygni, solaxe, higasa, starblade
*/
// Port of Scripts/Other/MergeShops/FestivalofVictorsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { VictorMatsuri } from "../../story/VictorMatsuri";

const Adv = new CoreAdvanced();
const VM = new VictorMatsuri();

export class FestivalofVictorsMerge {
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
                case "Jade Silk":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonsterQuest(10292, ["victormatsuri", "Narcis Arrhythmia", ClassType.Solo]);
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Crimson Silk":

                case "Midnight Silk":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonsterQuest(10290, ["victormatsuri", "Kitsune Himawari", ClassType.Solo]);
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Stellar Wish":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonsterQuest(10788, "victormatsuri", "Doomknight Prince");
                        bot.wait.forPickup(req.name);
                    }
                    break;
                //#endregion
            }
        };
        VM.storyline(true);
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("victormatsuri", 2592, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("94256", "Elvish Yukata", 'Mode: [select] only\nShould the bot buy "Elvish Yukata" ?', false),
        option.bool(
            "94260",
            "Vampiric Crimson Yukata",
            'Mode: [select] only\nShould the bot buy "Vampiric Crimson Yukata" ?',
            false,
        ),
        option.bool(
            "94261",
            "Vampiric Midnight Yukata",
            'Mode: [select] only\nShould the bot buy "Vampiric Midnight Yukata" ?',
            false,
        ),
        option.bool(
            "91474",
            "Crimson SunAxe Antares",
            'Mode: [select] only\nShould the bot buy "Crimson SunAxe Antares" ?',
            false,
        ),
        option.bool(
            "91476",
            "Crimson SunCleaver Antares",
            'Mode: [select] only\nShould the bot buy "Crimson SunCleaver Antares" ?',
            false,
        ),
        option.bool(
            "91487",
            "Spectral StarAxe Alnilam",
            'Mode: [select] only\nShould the bot buy "Spectral StarAxe Alnilam" ?',
            false,
        ),
        option.bool(
            "91489",
            "Spectral StarCleaver Alnilam",
            'Mode: [select] only\nShould the bot buy "Spectral StarCleaver Alnilam" ?',
            false,
        ),
        option.bool(
            "94274",
            "Floating Midnight Chochin",
            'Mode: [select] only\nShould the bot buy "Floating Midnight Chochin" ?',
            false,
        ),
        option.bool(
            "94267",
            "Vampiric Matsuri Wings + Midnight Chochin",
            'Mode: [select] only\nShould the bot buy "Vampiric Matsuri Wings + Midnight Chochin" ?',
            false,
        ),
        option.bool(
            "94272",
            "Vampiric Matsuri Wings",
            'Mode: [select] only\nShould the bot buy "Vampiric Matsuri Wings" ?',
            false,
        ),
        option.bool(
            "94273",
            "Floating Crimson Chochin",
            'Mode: [select] only\nShould the bot buy "Floating Crimson Chochin" ?',
            false,
        ),
        option.bool(
            "94266",
            "Vampiric Matsuri Wings + Crimson Chochin",
            'Mode: [select] only\nShould the bot buy "Vampiric Matsuri Wings + Crimson Chochin" ?',
            false,
        ),
        option.bool(
            "94269",
            "Dual Vampiric Crimson Sensu",
            'Mode: [select] only\nShould the bot buy "Dual Vampiric Crimson Sensu" ?',
            false,
        ),
        option.bool(
            "91475",
            "Crimson SunAxes Antares",
            'Mode: [select] only\nShould the bot buy "Crimson SunAxes Antares" ?',
            false,
        ),
        option.bool(
            "91477",
            "Crimson SunCleavers Antares",
            'Mode: [select] only\nShould the bot buy "Crimson SunCleavers Antares" ?',
            false,
        ),
        option.bool(
            "91479",
            "Spectral StarBlades Naos",
            'Mode: [select] only\nShould the bot buy "Spectral StarBlades Naos" ?',
            false,
        ),
        option.bool(
            "91490",
            "Spectral StarCleavers Alnilam",
            'Mode: [select] only\nShould the bot buy "Spectral StarCleavers Alnilam" ?',
            false,
        ),
        option.bool(
            "91488",
            "Spectral StarAxes Alnilam",
            'Mode: [select] only\nShould the bot buy "Spectral StarAxes Alnilam" ?',
            false,
        ),
        option.bool(
            "94271",
            "Dual Vampiric Midnight Sensu",
            'Mode: [select] only\nShould the bot buy "Dual Vampiric Midnight Sensu" ?',
            false,
        ),
        option.bool(
            "94264",
            "Vampiric Matsuri Morph",
            'Mode: [select] only\nShould the bot buy "Vampiric Matsuri Morph" ?',
            false,
        ),
        option.bool(
            "94265",
            "Vampiric Matsuri Visage",
            'Mode: [select] only\nShould the bot buy "Vampiric Matsuri Visage" ?',
            false,
        ),
        option.bool(
            "94262",
            "Vampiric Matsuri Hair",
            'Mode: [select] only\nShould the bot buy "Vampiric Matsuri Hair" ?',
            false,
        ),
        option.bool(
            "94263",
            "Vampiric Matsuri Locks",
            'Mode: [select] only\nShould the bot buy "Vampiric Matsuri Locks" ?',
            false,
        ),
        option.bool(
            "94257",
            "Elvish Matsuri Hair",
            'Mode: [select] only\nShould the bot buy "Elvish Matsuri Hair" ?',
            false,
        ),
        option.bool(
            "94258",
            "Elvish Matsuri Locks",
            'Mode: [select] only\nShould the bot buy "Elvish Matsuri Locks" ?',
            false,
        ),
        option.bool(
            "94268",
            "Vampiric Crimson Sensu",
            'Mode: [select] only\nShould the bot buy "Vampiric Crimson Sensu" ?',
            false,
        ),
        option.bool(
            "94270",
            "Vampiric Midnight Sensu",
            'Mode: [select] only\nShould the bot buy "Vampiric Midnight Sensu" ?',
            false,
        ),
        option.bool(
            "91484",
            "Spectral NovaScythe Omicron",
            'Mode: [select] only\nShould the bot buy "Spectral NovaScythe Omicron" ?',
            false,
        ),
        option.bool(
            "91485",
            "Spectral NovaAxe Omicron",
            'Mode: [select] only\nShould the bot buy "Spectral NovaAxe Omicron" ?',
            false,
        ),
        option.bool(
            "91471",
            "Crimson SunScythe Cygni",
            'Mode: [select] only\nShould the bot buy "Crimson SunScythe Cygni" ?',
            false,
        ),
        option.bool(
            "91472",
            "Crimson SolAxe Cygni",
            'Mode: [select] only\nShould the bot buy "Crimson SolAxe Cygni" ?',
            false,
        ),
        option.bool("94259", "Elvish Higasa", 'Mode: [select] only\nShould the bot buy "Elvish Higasa" ?', false),
        option.bool(
            "91478",
            "Spectral StarBlade Naos",
            'Mode: [select] only\nShould the bot buy "Spectral StarBlade Naos" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: FestivalofVictorsMerge.select,
});

export default function main(): void {
    const script = new FestivalofVictorsMerge();
    Core.bankingBlackList.push("Jade Silk", "Crimson Silk", "Midnight Silk", "Stellar Wish");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
