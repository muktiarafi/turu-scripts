/*
name: Faction Banners Merge
description: This bot will farm the items belonging to the selected mode for the Faction Banners Merge [1717] in /snowmore
tags: faction, banners, merge, snowmore, alchemy, banner, i, left, ii, arcangrove, chaos, chronospan, crystallis, doomwood, dwarfhold, evil, good, hollowborn, horc, legion, lycan, nation, ravenloss, seraphic, seraph, troll, vampire, blight, kings, winter, throne
*/
// Port of Scripts/Other/MergeShops/FactionBannersMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class FactionBannersMerge {
    // [Can Change] This should only be changed by the author.
    // If true, it will not stop the script if the default case triggers and the user chose to only get mats
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
                case "Blighted Deer's Hide":
                    Core.farmingLogger(req.name, quant);
                    Core.huntMonster("snowmore", "Blighted Deer", req.name, quant, { isTemp: false, log: false });
                    bot.wait.forPickup(req.name);
                    break;
                case "Blighted Lion's Fang":
                    Core.farmingLogger(req.name, quant);
                    Core.huntMonster("snowmore", "Blighted Lion", req.name, quant, { isTemp: false, log: false });
                    bot.wait.forPickup(req.name);
                    break;
                case "Blighted Wolf's Blood":
                    Core.farmingLogger(req.name, quant);
                    Core.huntMonster("snowmore", "Blighted Wolf", req.name, quant, { isTemp: false, log: false });
                    bot.wait.forPickup(req.name);
                    break;
                case "Blighted Dragon's Bone":
                    Core.farmingLogger(req.name, quant);
                    Core.huntMonster("snowmore", "Blighted Dragon", req.name, quant, { isTemp: false, log: false });
                    bot.wait.forPickup(req.name);
                    break;
                case "Northern Crown":

                case "Winter Throne":
                    Core.farmingLogger(req.name, quant);
                    Core.huntMonster("snowmore", "Jon S'NOOOOOOO", req.name, quant, { isTemp: false, log: false });
                    bot.wait.forPickup(req.name);
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("snowmore", 1717, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "48413",
            "Alchemy Banner I (Left)",
            'Mode: [select] only\nShould the bot buy "Alchemy Banner I (Left)" ?',
            false,
        ),
        option.bool(
            "48433",
            "Alchemy Banner II (Left)",
            'Mode: [select] only\nShould the bot buy "Alchemy Banner II (Left)" ?',
            false,
        ),
        option.bool(
            "48414",
            "Arcangrove Banner I (Left)",
            'Mode: [select] only\nShould the bot buy "Arcangrove Banner I (Left)" ?',
            false,
        ),
        option.bool(
            "48434",
            "Arcangrove Banner II (Left)",
            'Mode: [select] only\nShould the bot buy "Arcangrove Banner II (Left)" ?',
            false,
        ),
        option.bool(
            "48415",
            "Chaos Banner I (Left)",
            'Mode: [select] only\nShould the bot buy "Chaos Banner I (Left)" ?',
            false,
        ),
        option.bool(
            "48435",
            "Chaos Banner II (Left)",
            'Mode: [select] only\nShould the bot buy "Chaos Banner II (Left)" ?',
            false,
        ),
        option.bool(
            "48416",
            "Chronospan Banner I (Left)",
            'Mode: [select] only\nShould the bot buy "Chronospan Banner I (Left)" ?',
            false,
        ),
        option.bool(
            "48436",
            "Chronospan Banner II (Left)",
            'Mode: [select] only\nShould the bot buy "Chronospan Banner II (Left)" ?',
            false,
        ),
        option.bool(
            "48417",
            "Crystallis Banner I (Left)",
            'Mode: [select] only\nShould the bot buy "Crystallis Banner I (Left)" ?',
            false,
        ),
        option.bool(
            "48437",
            "Crystallis Banner II (Left)",
            'Mode: [select] only\nShould the bot buy "Crystallis Banner II (Left)" ?',
            false,
        ),
        option.bool(
            "48418",
            "Doomwood Banner I (Left)",
            'Mode: [select] only\nShould the bot buy "Doomwood Banner I (Left)" ?',
            false,
        ),
        option.bool(
            "48438",
            "Doomwood Banner II (Left)",
            'Mode: [select] only\nShould the bot buy "Doomwood Banner II (Left)" ?',
            false,
        ),
        option.bool(
            "48419",
            "Dwarfhold Banner I (Left)",
            'Mode: [select] only\nShould the bot buy "Dwarfhold Banner I (Left)" ?',
            false,
        ),
        option.bool(
            "48439",
            "Dwarfhold Banner II (Left)",
            'Mode: [select] only\nShould the bot buy "Dwarfhold Banner II (Left)" ?',
            false,
        ),
        option.bool(
            "48420",
            "Evil Banner I (Left)",
            'Mode: [select] only\nShould the bot buy "Evil Banner I (Left)" ?',
            false,
        ),
        option.bool(
            "48440",
            "Evil Banner II (Left)",
            'Mode: [select] only\nShould the bot buy "Evil Banner II (Left)" ?',
            false,
        ),
        option.bool(
            "48421",
            "Good Banner I (Left)",
            'Mode: [select] only\nShould the bot buy "Good Banner I (Left)" ?',
            false,
        ),
        option.bool(
            "48441",
            "Good Banner II (Left)",
            'Mode: [select] only\nShould the bot buy "Good Banner II (Left)" ?',
            false,
        ),
        option.bool(
            "48422",
            "Hollowborn Banner I (Left)",
            'Mode: [select] only\nShould the bot buy "Hollowborn Banner I (Left)" ?',
            false,
        ),
        option.bool(
            "48442",
            "Hollowborn Banner II (Left)",
            'Mode: [select] only\nShould the bot buy "Hollowborn Banner II (Left)" ?',
            false,
        ),
        option.bool(
            "48423",
            "Horc Banner I (Left)",
            'Mode: [select] only\nShould the bot buy "Horc Banner I (Left)" ?',
            false,
        ),
        option.bool(
            "48443",
            "Horc Banner II (Left)",
            'Mode: [select] only\nShould the bot buy "Horc Banner II (Left)" ?',
            false,
        ),
        option.bool(
            "48424",
            "Legion Banner I (Left)",
            'Mode: [select] only\nShould the bot buy "Legion Banner I (Left)" ?',
            false,
        ),
        option.bool(
            "48444",
            "Legion Banner II (Left)",
            'Mode: [select] only\nShould the bot buy "Legion Banner II (Left)" ?',
            false,
        ),
        option.bool(
            "48425",
            "Lycan Banner I (Left)",
            'Mode: [select] only\nShould the bot buy "Lycan Banner I (Left)" ?',
            false,
        ),
        option.bool(
            "48445",
            "Lycan Banner II (Left)",
            'Mode: [select] only\nShould the bot buy "Lycan Banner II (Left)" ?',
            false,
        ),
        option.bool(
            "48426",
            "Nation Banner I (Left)",
            'Mode: [select] only\nShould the bot buy "Nation Banner I (Left)" ?',
            false,
        ),
        option.bool(
            "48446",
            "Nation Banner II (Left)",
            'Mode: [select] only\nShould the bot buy "Nation Banner II (Left)" ?',
            false,
        ),
        option.bool(
            "48427",
            "Ravenloss Banner I (Left)",
            'Mode: [select] only\nShould the bot buy "Ravenloss Banner I (Left)" ?',
            false,
        ),
        option.bool(
            "48447",
            "Ravenloss Banner II (Left)",
            'Mode: [select] only\nShould the bot buy "Ravenloss Banner II (Left)" ?',
            false,
        ),
        option.bool(
            "48428",
            "Seraphic Banner I (Left)",
            'Mode: [select] only\nShould the bot buy "Seraphic Banner I (Left)" ?',
            false,
        ),
        option.bool(
            "48448",
            "Seraph Banner II (Left)",
            'Mode: [select] only\nShould the bot buy "Seraph Banner II (Left)" ?',
            false,
        ),
        option.bool(
            "48429",
            "Troll Banner I (Left)",
            'Mode: [select] only\nShould the bot buy "Troll Banner I (Left)" ?',
            false,
        ),
        option.bool(
            "48449",
            "Troll Banner II (Left)",
            'Mode: [select] only\nShould the bot buy "Troll Banner II (Left)" ?',
            false,
        ),
        option.bool(
            "48430",
            "Vampire Banner I (Left)",
            'Mode: [select] only\nShould the bot buy "Vampire Banner I (Left)" ?',
            false,
        ),
        option.bool(
            "48450",
            "Vampire Banner II (Left)",
            'Mode: [select] only\nShould the bot buy "Vampire Banner II (Left)" ?',
            false,
        ),
        option.bool(
            "48432",
            "Blight King's Winter Throne",
            'Mode: [select] only\nShould the bot buy "Blight King\'s Winter Throne" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: FactionBannersMerge.select,
});

export default function main(): void {
    const script = new FactionBannersMerge();
    Core.bankingBlackList.push(
        "Blighted Deer's Hide",
        "Blighted Lion's Fang",
        "Blighted Wolf's Blood",
        "Blighted Dragon's Bone",
        "Northern Crown",
        "Winter Throne",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
