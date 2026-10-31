/*
name: Atlas Dowry Treasury Merge
description: This bot will farm the items belonging to the selected mode for the Atlas Dowry Treasury Merge [2565] in /atlaskingdom
tags: atlas, dowry, treasury, merge, atlaskingdom, spell, book, light, mage, morph, wedding, attire, bell, rose, bush, arch, matrimony, pact, dias, souledge, armblades, armblade, shuriken, shadow, soulblades, soulblade, sheath, sheathed, master, shadows, veil
*/
// Port of Scripts/Legion/MergeShops/AtlasDowryTreasuryMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";
import { AtlasKingdom } from "../../story/legion/AtlasKingdom";

const Adv = new CoreAdvanced();
const AK = new AtlasKingdom();
const Legion = new CoreLegion();

export class AtlasDowryTreasuryMerge {
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
                case "Atlas Lion Pelt":
                    Core.farmingLogger(req.name, quant);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonsterQuest(
                            10126,
                            ["atlaskingdom", "Atlas Leo", ClassType.Solo],
                            ["atlaskingdom", "Atlas Elite", ClassType.Solo],
                            ["atlaskingdom", "Executioner Ladon", ClassType.Solo],
                        );
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Atlas Crest":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("atlaskingdom", "Atlas Light Magus", req.name, quant, {
                        isTemp: false,
                        log: false,
                    });
                    break;
                case "Coelho's Tome":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("atlaskingdom", "Coelho", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Blue Dye":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(5898);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        //QuarterMaster’s Supplies 5898
                        Core.huntMonster("ashfallcamp", "Lava Dragoblin", "Supply Chest", 8, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Legion Token":
                    Legion.farmLegionToken(quant);
                    break;
            }
        };
        AK.storyline();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("atlaskingdom", 2565, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("92539", "Atlas Spell Book", 'Mode: [select] only\nShould the bot buy "Atlas Spell Book" ?', false),
        option.bool(
            "92538",
            "Atlas Light Mage Visage",
            'Mode: [select] only\nShould the bot buy "Atlas Light Mage Visage" ?',
            false,
        ),
        option.bool(
            "92537",
            "Atlas Light Mage Morph",
            'Mode: [select] only\nShould the bot buy "Atlas Light Mage Morph" ?',
            false,
        ),
        option.bool("92536", "Atlas Light Mage", 'Mode: [select] only\nShould the bot buy "Atlas Light Mage" ?', false),
        option.bool(
            "92493",
            "Atlas Wedding Attire",
            'Mode: [select] only\nShould the bot buy "Atlas Wedding Attire" ?',
            false,
        ),
        option.bool(
            "92492",
            "Atlas Wedding Bell",
            'Mode: [select] only\nShould the bot buy "Atlas Wedding Bell" ?',
            false,
        ),
        option.bool("92491", "Atlas Rose Bush", 'Mode: [select] only\nShould the bot buy "Atlas Rose Bush" ?', false),
        option.bool(
            "92490",
            "Atlas Wedding Arch",
            'Mode: [select] only\nShould the bot buy "Atlas Wedding Arch" ?',
            false,
        ),
        option.bool(
            "92489",
            "Atlas Matrimony Pact",
            'Mode: [select] only\nShould the bot buy "Atlas Matrimony Pact" ?',
            false,
        ),
        option.bool(
            "92488",
            "Atlas Wedding Dias",
            'Mode: [select] only\nShould the bot buy "Atlas Wedding Dias" ?',
            false,
        ),
        option.bool(
            "92460",
            "Souledge Armblades",
            'Mode: [select] only\nShould the bot buy "Souledge Armblades" ?',
            false,
        ),
        option.bool(
            "92459",
            "Souledge Armblade",
            'Mode: [select] only\nShould the bot buy "Souledge Armblade" ?',
            false,
        ),
        option.bool(
            "92458",
            "Dual Souledge Shuriken",
            'Mode: [select] only\nShould the bot buy "Dual Souledge Shuriken" ?',
            false,
        ),
        option.bool(
            "92457",
            "Souledge Shuriken",
            'Mode: [select] only\nShould the bot buy "Souledge Shuriken" ?',
            false,
        ),
        option.bool(
            "92456",
            "Shadow Soulblades",
            'Mode: [select] only\nShould the bot buy "Shadow Soulblades" ?',
            false,
        ),
        option.bool("92455", "Shadow Soulblade", 'Mode: [select] only\nShould the bot buy "Shadow Soulblade" ?', false),
        option.bool("92454", "Soulblade Sheath", 'Mode: [select] only\nShould the bot buy "Soulblade Sheath" ?', false),
        option.bool(
            "92453",
            "Sheathed Soulblade",
            'Mode: [select] only\nShould the bot buy "Sheathed Soulblade" ?',
            false,
        ),
        option.bool(
            "92452",
            "Soulblade Master Mask",
            'Mode: [select] only\nShould the bot buy "Soulblade Master Mask" ?',
            false,
        ),
        option.bool(
            "92451",
            "Soulblade Master of Shadows",
            'Mode: [select] only\nShould the bot buy "Soulblade Master of Shadows" ?',
            false,
        ),
        option.bool(
            "92775",
            "Atlas Wedding Veil",
            'Mode: [select] only\nShould the bot buy "Atlas Wedding Veil" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: AtlasDowryTreasuryMerge.select,
});

export default function main(): void {
    const script = new AtlasDowryTreasuryMerge();
    Core.bankingBlackList.push("Atlas Lion Pelt", "Atlas Crest", "Coelho's Tome", "Blue Dye", "Legion Token");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
