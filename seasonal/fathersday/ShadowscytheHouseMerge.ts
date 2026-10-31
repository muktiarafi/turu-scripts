/*
name: Shadowscythe House Merge
description: This bot will farm the items belonging to the selected mode for the Shadowscythe House Merge [1731] in /nursery
tags: shadowscythe, house, merge, nursery, sepulchures, wing, shadow, family, quarters, moglinster, rug, desk, doom, crib, world, domination, globe, totally, dead, plant, experiments, toxic, cauldron, scattered, legows, bone, blocks, phone, chattering, teeth, pyramid, jackinthebox, green, floor, sludge, side, table, bottles, l, r, kitchen
*/
// Port of Scripts/Seasonal/FathersDay/ShadowscytheHouseMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { HoratioQuests } from "./HoratioQuests";

const Adv = new CoreAdvanced();
const HQ = new HoratioQuests();

export class ShadowscytheHouseMerge {
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
                case "Bones":
                    Core.farmingLogger(req.name, quant);
                    Core.huntMonster("nursery", "Skeletal Minion", req.name, quant, { isTemp: false, log: true });
                    bot.wait.forPickup(req.name);
                    break;
                case "Glue":
                    Core.farmingLogger(req.name, quant);
                    Core.huntMonster("nursery", "Flesh Golem", req.name, quant, { isTemp: false, log: true });
                    bot.wait.forPickup(req.name);
                    break;
                case "Darkness":
                    Core.farmingLogger(req.name, quant);
                    Core.huntMonster("nursery", "Spilled Ink", req.name, quant, { isTemp: false, log: true });
                    bot.wait.forPickup(req.name);
                    break;
            }
        };
        HQ.horatio();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("nursery", 1731, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "48874",
            "Sepulchure's Wing House",
            'Mode: [select] only\nShould the bot buy "Sepulchure\'s Wing House" ?',
            false,
        ),
        option.bool(
            "48875",
            "Shadow Family Quarters",
            'Mode: [select] only\nShould the bot buy "Shadow Family Quarters" ?',
            false,
        ),
        option.bool("48845", "Moglinster Rug", 'Mode: [select] only\nShould the bot buy "Moglinster Rug" ?', false),
        option.bool("48844", "Desk of Doom", 'Mode: [select] only\nShould the bot buy "Desk of Doom" ?', false),
        option.bool("48846", "Crib of Doom", 'Mode: [select] only\nShould the bot buy "Crib of Doom" ?', false),
        option.bool(
            "48847",
            "World Domination Globe",
            'Mode: [select] only\nShould the bot buy "World Domination Globe" ?',
            false,
        ),
        option.bool(
            "48851",
            "Totally Dead Plant",
            'Mode: [select] only\nShould the bot buy "Totally Dead Plant" ?',
            false,
        ),
        option.bool("48848", "Experiments", 'Mode: [select] only\nShould the bot buy "Experiments" ?', false),
        option.bool("48850", "Toxic Cauldron", 'Mode: [select] only\nShould the bot buy "Toxic Cauldron" ?', false),
        option.bool("48852", "Scattered LegOWs", 'Mode: [select] only\nShould the bot buy "Scattered LegOWs" ?', false),
        option.bool("48856", "Bone Blocks", 'Mode: [select] only\nShould the bot buy "Bone Blocks" ?', false),
        option.bool("48857", "Bone Phone", 'Mode: [select] only\nShould the bot buy "Bone Phone" ?', false),
        option.bool("48853", "Chattering Teeth", 'Mode: [select] only\nShould the bot buy "Chattering Teeth" ?', false),
        option.bool("48855", "Bone Pyramid", 'Mode: [select] only\nShould the bot buy "Bone Pyramid" ?', false),
        option.bool("48854", "Jack-in-the-Box", 'Mode: [select] only\nShould the bot buy "Jack-in-the-Box" ?', false),
        option.bool(
            "48860",
            "Green Floor Sludge",
            'Mode: [select] only\nShould the bot buy "Green Floor Sludge" ?',
            false,
        ),
        option.bool(
            "48863",
            "Shadow Side Table",
            'Mode: [select] only\nShould the bot buy "Shadow Side Table" ?',
            false,
        ),
        option.bool(
            "48865",
            "Bottles Table (L)",
            'Mode: [select] only\nShould the bot buy "Bottles Table (L)" ?',
            false,
        ),
        option.bool(
            "48864",
            "Bottles Table (R)",
            'Mode: [select] only\nShould the bot buy "Bottles Table (R)" ?',
            false,
        ),
        option.bool("48866", "Shadow Kitchen", 'Mode: [select] only\nShould the bot buy "Shadow Kitchen" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ShadowscytheHouseMerge.select,
});

export default function main(): void {
    const script = new ShadowscytheHouseMerge();
    Core.bankingBlackList.push("Bones", "Glue", "Darkness");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
