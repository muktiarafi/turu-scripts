/*
name: Light Merge
description: This bot will farm the items belonging to the selected mode for the Light Merge [422] in /necropolis
tags: light, merge, necropolis, armored, daimyo, battlepet, spirit, orb, destiny, broadsword, scythe, mace, bow, bright, blinding, twilly, moglinrider, twig, zorbak
*/
// Port of Scripts/Other/MergeShops/LightMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { MineCraftingMetalsEnum } from "../../core/CoreDailies";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreBLOD } from "../../good/blod/CoreBLOD";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const coreBLOD = new CoreBLOD();

export class LightMerge {
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
                case "Advanced Weapon Kit":
                    coreBLOD.advancedWK(quant);
                    break;
                case "Ultimate Weapon Kit":
                    coreBLOD.ultimateWK(undefined, quant);
                    break;
                case "Basic Weapon Kit":
                    coreBLOD.basicWK(quant);
                    break;
                case "Golden Daimyo Armor":
                    if (!Core.isMember) {
                        Core.logger("Membership Required to start the `Golden Armored Daimyo [2079] Quest.");
                        break;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAccept(2079);
                        Core.huntMonster("mafic", "Living Fire", "Heart of Flame ", 15);
                        Core.huntMonster("greenguardwest", "Black Knight", "Black Metal Armor");
                        Core.ensureComplete(2079);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Undead Energy":
                    Farm.battleUnderB("Undead Energy", quant);
                    break;
                //#region metals
                case "Sanctified Silver of Destiny":
                    coreBLOD.upgradeMetal(MineCraftingMetalsEnum.Silver);
                    break;
                case "Immortal Iron of Destiny":
                    coreBLOD.upgradeMetal(MineCraftingMetalsEnum.Iron);
                    break;
                case "Glorious Gold of Destiny":
                    coreBLOD.upgradeMetal(MineCraftingMetalsEnum.Gold);
                    break;
                case "Celestial Copper of Destiny":
                    coreBLOD.upgradeMetal(MineCraftingMetalsEnum.Copper);
                    break;
                case "Blessed Barium of Destiny":
                    coreBLOD.upgradeMetal(MineCraftingMetalsEnum.Barium);
                    break;
                case "Almighty Aluminum of Destiny":
                    coreBLOD.upgradeMetal(MineCraftingMetalsEnum.Aluminum);
                    break;
                //#endregion metals
                case "Twilly Puppy Saddle":

                case "Twig Puppy Saddle":

                case "Zorbak Puppy Saddle":
                    if (!Core.isMember) {
                        Core.logger('Membership Required to buy "daimyo (pet)" for this item.');
                        break;
                    } else {
                        Adv.buyItem("necropolis", 422, 152);
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAccept(5132);
                        Core.killMonster("castleundead", "Enter", "Left", "Skeletal Warrior", "Undead Head", 10);
                        Core.ensureComplete(5132, req.id);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("necropolis", 422, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "6673",
            "Armored Daimyo Battlepet",
            'Mode: [select] only\nShould the bot buy "Armored Daimyo Battlepet" ?',
            false,
        ),
        option.bool("12184", "Spirit Orb", 'Mode: [select] only\nShould the bot buy "Spirit Orb" ?', false),
        option.bool(
            "12513",
            "Daggers of Destiny",
            'Mode: [select] only\nShould the bot buy "Daggers of Destiny" ?',
            false,
        ),
        option.bool("12516", "Blade of Destiny", 'Mode: [select] only\nShould the bot buy "Blade of Destiny" ?', false),
        option.bool(
            "12517",
            "Broadsword of Destiny",
            'Mode: [select] only\nShould the bot buy "Broadsword of Destiny" ?',
            false,
        ),
        option.bool(
            "12512",
            "Scythe of Destiny",
            'Mode: [select] only\nShould the bot buy "Scythe of Destiny" ?',
            false,
        ),
        option.bool("12520", "Mace of Destiny", 'Mode: [select] only\nShould the bot buy "Mace of Destiny" ?', false),
        option.bool("12510", "Bow of Destiny", 'Mode: [select] only\nShould the bot buy "Bow of Destiny" ?', false),
        option.bool(
            "12689",
            "Bright Bow of Destiny",
            'Mode: [select] only\nShould the bot buy "Bright Bow of Destiny" ?',
            false,
        ),
        option.bool(
            "12691",
            "Bright Daggers of Destiny",
            'Mode: [select] only\nShould the bot buy "Bright Daggers of Destiny" ?',
            false,
        ),
        option.bool(
            "12693",
            "Bright Mace of Destiny",
            'Mode: [select] only\nShould the bot buy "Bright Mace of Destiny" ?',
            false,
        ),
        option.bool(
            "12695",
            "Bright Scythe of Destiny",
            'Mode: [select] only\nShould the bot buy "Bright Scythe of Destiny" ?',
            false,
        ),
        option.bool(
            "12697",
            "Bright Broadsword of Destiny",
            'Mode: [select] only\nShould the bot buy "Bright Broadsword of Destiny" ?',
            false,
        ),
        option.bool(
            "12742",
            "Bright Blade of Destiny",
            'Mode: [select] only\nShould the bot buy "Bright Blade of Destiny" ?',
            false,
        ),
        option.bool(
            "14468",
            "Blinding Bow of Destiny",
            'Mode: [select] only\nShould the bot buy "Blinding Bow of Destiny" ?',
            false,
        ),
        option.bool(
            "14469",
            "Blinding Daggers of Destiny",
            'Mode: [select] only\nShould the bot buy "Blinding Daggers of Destiny" ?',
            false,
        ),
        option.bool(
            "14470",
            "Blinding Mace of Destiny",
            'Mode: [select] only\nShould the bot buy "Blinding Mace of Destiny" ?',
            false,
        ),
        option.bool(
            "14471",
            "Blinding Scythe of Destiny",
            'Mode: [select] only\nShould the bot buy "Blinding Scythe of Destiny" ?',
            false,
        ),
        option.bool(
            "14472",
            "Blinding Broadsword of Destiny",
            'Mode: [select] only\nShould the bot buy "Blinding Broadsword of Destiny" ?',
            false,
        ),
        option.bool(
            "14473",
            "Blinding Blade of Destiny",
            'Mode: [select] only\nShould the bot buy "Blinding Blade of Destiny" ?',
            false,
        ),
        option.bool(
            "35248",
            "Twilly MoglinRider Daimyo",
            'Mode: [select] only\nShould the bot buy "Twilly MoglinRider Daimyo" ?',
            false,
        ),
        option.bool(
            "35249",
            "Twig MoglinRider Daimyo",
            'Mode: [select] only\nShould the bot buy "Twig MoglinRider Daimyo" ?',
            false,
        ),
        option.bool(
            "35250",
            "Zorbak MoglinRider Daimyo",
            'Mode: [select] only\nShould the bot buy "Zorbak MoglinRider Daimyo" ?',
            false,
        ),
        option.bool("152", "Daimyo", 'Mode: [select] only\nShould the bot buy "Daimyo" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: LightMerge.select,
});

export default function main(): void {
    const script = new LightMerge();
    Core.bankingBlackList.push(
        "Golden Daimyo Armor",
        "Undead Energy",
        "Basic Weapon Kit",
        "Almighty Aluminum of Destiny",
        "Blessed Barium of Destiny",
        "Glorious Gold of Destiny",
        "Immortal Iron of Destiny",
        "Celestial Copper of Destiny",
        "Sanctified Silver of Destiny",
        "Advanced Weapon Kit",
        "Ultimate Weapon Kit",
        "Twilly Puppy Saddle",
        "Twig Puppy Saddle",
        "Zorbak Puppy Saddle",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
