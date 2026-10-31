/*
name: Grim Gift Merge
description: This bot will farm the items belonging to the selected mode for the Grim Gift Merge [655] in /doomvault
tags: grim, gift, merge, doomvault, heroblade, lvl, , knight, errants, plate, broken, zweihander, battleworn, shield, mantle, rot, attached, pain, scythe, red, skull, blood, maul, weapon, enhancement, grimskull, ragged, rogue, grimhero, long
*/
// Port of Scripts/Other/MergeShops/GrimGiftMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { DoomVaultB } from "../../story/DoomVaultB";

const Adv = new CoreAdvanced();
const DVB = new DoomVaultB();

export class GrimGiftMerge {
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
                case "Hero's Hilt Fragment":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(3002);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("doomvaultb", "Grim Shelleton", "Relic of Strength", 3);
                        Core.huntMonster("doomvaultb", "Grim Fire Mage", "Relic of Heart ", 3);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Hero's Blade Fragment":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(3001);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("doomvaultb", "Grim Lich", "Relic of Courage", 3);
                        Core.huntMonster("doomvaultb", "Grim Ectomancer", "Relic of Will", 3);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Grime Token":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("doomvault", "Grim Shelleton", req.name, quant);
                    break;
                case "Binky's Uni-horn":
                    Core.equipClass(ClassType.Solo);
                    Core.killMonster("doomvault", "r5", "Left", "Binky", req.name, quant, {
                        isTemp: req.temp,
                        publicRoom: true,
                    });
                    break;
                case "Grimskull's Face":
                    Core.huntMonsterMapID("doomvaultb", 48, req.name, undefined, { isTemp: req.temp });
                    break;
                case "GrimBlade":
                    if (!Core.isCompletedBefore(3004)) {
                        DVB.storyLine();
                    }
                    if (!Core.checkInventory("GrimBlade")) {
                        Core.ensureAccept(3004);
                        Core.huntMonsterMapID("doomvaultb", 48, "Raxgore Slain");
                        Core.ensureComplete(3004);
                        bot.wait.forPickup("GrimBlade");
                    }
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("doomvault", 655, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("18157", "HeroBlade Lvl 1", 'Mode: [select] only\nShould the bot buy "HeroBlade Lvl 1" ?', false),
        option.bool(
            "17958",
            "Knight Errant's Plate",
            'Mode: [select] only\nShould the bot buy "Knight Errant\'s Plate" ?',
            false,
        ),
        option.bool(
            "17959",
            "Broken Zweihander",
            'Mode: [select] only\nShould the bot buy "Broken Zweihander" ?',
            false,
        ),
        option.bool(
            "17960",
            "Battleworn Shield and Mantle",
            'Mode: [select] only\nShould the bot buy "Battleworn Shield and Mantle" ?',
            false,
        ),
        option.bool("18003", "The Rot", 'Mode: [select] only\nShould the bot buy "The Rot" ?', false),
        option.bool("18004", "Attached", 'Mode: [select] only\nShould the bot buy "Attached" ?', false),
        option.bool("18005", "The Pain Scythe", 'Mode: [select] only\nShould the bot buy "The Pain Scythe" ?', false),
        option.bool("18006", "Red Skull", 'Mode: [select] only\nShould the bot buy "Red Skull" ?', false),
        option.bool("18063", "Blood Maul", 'Mode: [select] only\nShould the bot buy "Blood Maul" ?', false),
        option.bool(
            "18196",
            "Grim Weapon Enhancement",
            'Mode: [select] only\nShould the bot buy "Grim Weapon Enhancement" ?',
            false,
        ),
        option.bool(
            "18197",
            "Grim 100 Weapon Enhancement",
            'Mode: [select] only\nShould the bot buy "Grim 100 Weapon Enhancement" ?',
            false,
        ),
        option.bool("18199", "HeroBlade", 'Mode: [select] only\nShould the bot buy "HeroBlade" ?', false),
        option.bool("18200", "HeroBlade", 'Mode: [select] only\nShould the bot buy "HeroBlade" ?', false),
        option.bool("18201", "HeroBlade", 'Mode: [select] only\nShould the bot buy "HeroBlade" ?', false),
        option.bool("18202", "HeroBlade", 'Mode: [select] only\nShould the bot buy "HeroBlade" ?', false),
        option.bool("18203", "HeroBlade", 'Mode: [select] only\nShould the bot buy "HeroBlade" ?', false),
        option.bool(
            "18139",
            "Grimskull Ragged Rogue",
            'Mode: [select] only\nShould the bot buy "Grimskull Ragged Rogue" ?',
            false,
        ),
        option.bool(
            "18140",
            "Grimskull Rogue Daggers",
            'Mode: [select] only\nShould the bot buy "Grimskull Rogue Daggers" ?',
            false,
        ),
        option.bool(
            "18142",
            "Grimskull Ragged Rogue Mask",
            'Mode: [select] only\nShould the bot buy "Grimskull Ragged Rogue Mask" ?',
            false,
        ),
        option.bool(
            "18143",
            "Grimskull Rogue Locks",
            'Mode: [select] only\nShould the bot buy "Grimskull Rogue Locks" ?',
            false,
        ),
        option.bool("18205", "GrimHero Blade", 'Mode: [select] only\nShould the bot buy "GrimHero Blade" ?', false),
        option.bool("18207", "GrimHero Blade", 'Mode: [select] only\nShould the bot buy "GrimHero Blade" ?', false),
        option.bool("18208", "GrimHero Blade", 'Mode: [select] only\nShould the bot buy "GrimHero Blade" ?', false),
        option.bool("18209", "GrimHero Blade", 'Mode: [select] only\nShould the bot buy "GrimHero Blade" ?', false),
        option.bool("18210", "GrimHero Blade", 'Mode: [select] only\nShould the bot buy "GrimHero Blade" ?', false),
        option.bool("18211", "GrimHero Blade", 'Mode: [select] only\nShould the bot buy "GrimHero Blade" ?', false),
        option.bool(
            "18228",
            "Grimskull Rogue Long Hair",
            'Mode: [select] only\nShould the bot buy "Grimskull Rogue Long Hair" ?',
            false,
        ),
        option.bool(
            "18141",
            "Grimskull Ragged Rogue Cape",
            'Mode: [select] only\nShould the bot buy "Grimskull Ragged Rogue Cape" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: GrimGiftMerge.select,
});

export default function main(): void {
    const script = new GrimGiftMerge();
    Core.bankingBlackList.push(
        "Hero's Hilt Fragment",
        "Hero's Blade Fragment",
        "Grime Token",
        "Binky's Uni-horn",
        "Grimskull's Face",
        "GrimBlade",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
