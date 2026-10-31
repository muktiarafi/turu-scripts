/*
name: SoulForge Merge
description: This bot will farm the items belonging to the selected mode for the SoulForge Merge [577] in /underworld
tags: soulforge, merge, underworld, classy, skullseeker, legion, beast, within, cane, death, bane, obsidian, rock, solidified, soul, pride, horrid, cleaver, spine, shanks, ancient, undead, horns, breaker, warrior, shadow, katana, fatal, keraunos
*/
// Port of Scripts/Legion/MergeShops/SoulForgeMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";
import { CoreYnR } from "../yaminoronin/CoreYnR";

const Adv = new CoreAdvanced();
const Legion = new CoreLegion();
const YnR = new CoreYnR();

export class SoulForgeMerge {
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
                        `The bot hasn't been taught how to get ${req.name}` +
                            (shouldStop ? " Please report the issue" : " Skipping"),
                        undefined,
                        { messageBox: shouldStop, stopBot: shouldStop },
                    );
                    break;
                }
                //#endregion
                case "Legion Token":
                    Legion.farmLegionToken(quant);
                    break;
                case "Yami":
                    YnR.yami(quant);
                    break;
                case "Folded Steel":
                    YnR.foldedSteel();
                    break;
                case "Platinum Paragon Medal":
                    Core.farmingLogger(req.name, quant);
                    Adv.buyItem("underworld", 238, "Platinum Paragon Medal", quant);
                    break;
                case "Dage's Favor":
                    Legion.approvalAndFavor(0, quant);
                    break;
                case "Obsidian Rock":
                    Legion.obsidianRock(quant);
                    break;
                case "Solidified Soul":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(2743);
                    while (!Core.checkInventory(req.name, req.quantity)) {
                        Core.huntMonster("ShadowFallInvasion", "Bone Creeper", "Shards of a Soul", 10, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        Core.dlEnable();
        // Adv.MergeItemisinShopExceptions.AddRange(new[] { "Obsidian Rock" });
        Legion.soulForgeHammer();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("underworld", 577, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "16421",
            "Classy SkullSeeker",
            'Mode: [select] only\nShould the bot buy "Classy SkullSeeker" ?',
            false,
        ),
        option.bool(
            "16422",
            "Legion Beast Within",
            'Mode: [select] only\nShould the bot buy "Legion Beast Within" ?',
            false,
        ),
        option.bool("16423", "SkullSeeker Cane", 'Mode: [select] only\nShould the bot buy "SkullSeeker Cane" ?', false),
        option.bool(
            "16424",
            "Classy SkullSeeker Cane",
            'Mode: [select] only\nShould the bot buy "Classy SkullSeeker Cane" ?',
            false,
        ),
        option.bool(
            "16425",
            "Death Bane of the Legion",
            'Mode: [select] only\nShould the bot buy "Death Bane of the Legion" ?',
            false,
        ),
        option.bool("16409", "Obsidian Rock", 'Mode: [select] only\nShould the bot buy "Obsidian Rock" ?', false),
        option.bool("16411", "Solidified Soul", 'Mode: [select] only\nShould the bot buy "Solidified Soul" ?', false),
        option.bool(
            "16467",
            "Pride of the Legion",
            'Mode: [select] only\nShould the bot buy "Pride of the Legion" ?',
            false,
        ),
        option.bool(
            "16534",
            "Legion Horrid Cleaver",
            'Mode: [select] only\nShould the bot buy "Legion Horrid Cleaver" ?',
            false,
        ),
        option.bool(
            "16535",
            "Legion Spine Shanks",
            'Mode: [select] only\nShould the bot buy "Legion Spine Shanks" ?',
            false,
        ),
        option.bool(
            "17275",
            "Ancient Undead Horns",
            'Mode: [select] only\nShould the bot buy "Ancient Undead Horns" ?',
            false,
        ),
        option.bool(
            "17276",
            "Ancient Undead Breaker",
            'Mode: [select] only\nShould the bot buy "Ancient Undead Breaker" ?',
            false,
        ),
        option.bool(
            "17277",
            "Dual Ancient Legion Axe",
            'Mode: [select] only\nShould the bot buy "Dual Ancient Legion Axe" ?',
            false,
        ),
        option.bool(
            "17278",
            "Ancient Undead Warrior",
            'Mode: [select] only\nShould the bot buy "Ancient Undead Warrior" ?',
            false,
        ),
        option.bool(
            "17343",
            "Ancient Undead Helm",
            'Mode: [select] only\nShould the bot buy "Ancient Undead Helm" ?',
            false,
        ),
        option.bool(
            "54104",
            "Shadow Katana Blade",
            'Mode: [select] only\nShould the bot buy "Shadow Katana Blade" ?',
            false,
        ),
        option.bool("84610", "Fatal Keraunos", 'Mode: [select] only\nShould the bot buy "Fatal Keraunos" ?', false),
        option.bool(
            "84611",
            "Dual Fatal Keraunos",
            'Mode: [select] only\nShould the bot buy "Dual Fatal Keraunos" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: SoulForgeMerge.select,
});

export default function main(): void {
    const script = new SoulForgeMerge();
    Core.bankingBlackList.push("Legion Token", "Yami", "Folded Steel", "Platinum Paragon Medal", "Dage's Favor");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
