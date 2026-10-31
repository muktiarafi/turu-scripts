/*
name: Nulgath War Merge
description: This bot will farm the items belonging to the selected mode for the Nulgath War Merge [452] in /evilwarnul
tags: nulgath, war, merge, evilwarnul, redemption, barbarian, dilligaf, deathfiend, cloak, giant, treetunk, klunk, mortality, revontheus, sage, neofiend, oblivion, wings, genesis, spear, mini, golden, hanzo, void, katana, katanas, horns, nulgaths, bloodsucker, larvae, warmonger
*/
// Port of Scripts/Nation/MergeShops/NulgathWarMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreNation } from "../CoreNation";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const Nation = new CoreNation();

export class NulgathWarMerge {
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
                case "Archfiend's Favor":
                    Nation.approvalAndFavor(0, quant);
                    break;
                case "Nulgath's Approval":
                    Nation.approvalAndFavor(quant, 0);
                    break;
                case "Diamond of Nulgath":
                    Nation.farmDiamondofNulgath(quant);
                    break;
                case "Unidentified 13":
                    Nation.farmUni13(quant);
                    break;
                case "Totem of Nulgath":
                    Nation.farmTotemofNulgath(quant);
                    break;
                case "Tainted Gem":
                    Nation.farmTaintedGem(quant);
                    break;
                case "Random Weapon of Nulgath":

                case "Primal Dread Fang":
                    Nation.supplies(req.name, quant);
                    break;
                case "Blood Gem of the Archfiend":
                    Nation.farmBloodGem(quant);
                    break;
                case "Voucher of Nulgath (non-mem)":
                    Nation.farmVoucher({ member: false });
                    break;
                case "Gem of Nulgath":
                    Nation.farmGemofNulgath(quant);
                    break;
                case "Dark Crystal Shard":
                    Nation.farmDarkCrystalShard(quant);
                    break;
                case "Unidentified 27":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(584);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Nation.supplies("Unidentified 26");
                        Nation.farmTaintedGem(5);

                        Core.resetQuest(7551);
                        Core.darkMakaiItem("Dark Makai Sigil");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Bone Dust":
                    Farm.battleUnderB(undefined, quant);
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("evilwarnul", 452, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("13008", "Redemption Helm", 'Mode: [select] only\nShould the bot buy "Redemption Helm" ?', false),
        option.bool(
            "13006",
            "Barbarian Helm of Dilligaf",
            'Mode: [select] only\nShould the bot buy "Barbarian Helm of Dilligaf" ?',
            false,
        ),
        option.bool("13013", "DeathFiend Cloak", 'Mode: [select] only\nShould the bot buy "DeathFiend Cloak" ?', false),
        option.bool(
            "13028",
            "Giant Treetunk of Klunk",
            'Mode: [select] only\nShould the bot buy "Giant Treetunk of Klunk" ?',
            false,
        ),
        option.bool(
            "13026",
            "Redemption Blade of Nulgath",
            'Mode: [select] only\nShould the bot buy "Redemption Blade of Nulgath" ?',
            false,
        ),
        option.bool(
            "13167",
            "Mortality Cape of Revontheus",
            'Mode: [select] only\nShould the bot buy "Mortality Cape of Revontheus" ?',
            false,
        ),
        option.bool(
            "13206",
            "Sage Hood of Revontheus",
            'Mode: [select] only\nShould the bot buy "Sage Hood of Revontheus" ?',
            false,
        ),
        option.bool(
            "13153",
            "NeoFiend Helm of Revontheus",
            'Mode: [select] only\nShould the bot buy "NeoFiend Helm of Revontheus" ?',
            false,
        ),
        option.bool(
            "13370",
            "Oblivion of Revontheus",
            'Mode: [select] only\nShould the bot buy "Oblivion of Revontheus" ?',
            false,
        ),
        option.bool(
            "13372",
            "Oblivion Helm of Revontheus",
            'Mode: [select] only\nShould the bot buy "Oblivion Helm of Revontheus" ?',
            false,
        ),
        option.bool(
            "13373",
            "Oblivion Wings of Revontheus",
            'Mode: [select] only\nShould the bot buy "Oblivion Wings of Revontheus" ?',
            false,
        ),
        option.bool(
            "13377",
            "Genesis Wings of Revontheus",
            'Mode: [select] only\nShould the bot buy "Genesis Wings of Revontheus" ?',
            false,
        ),
        option.bool(
            "13371",
            "Oblivion Spear of Revontheus",
            'Mode: [select] only\nShould the bot buy "Oblivion Spear of Revontheus" ?',
            false,
        ),
        option.bool("13369", "Mini Dilligaf", 'Mode: [select] only\nShould the bot buy "Mini Dilligaf" ?', false),
        option.bool(
            "27849",
            "Golden Hanzo Void Katana",
            'Mode: [select] only\nShould the bot buy "Golden Hanzo Void Katana" ?',
            false,
        ),
        option.bool(
            "27850",
            "Dual Golden Hanzo Void Katanas",
            'Mode: [select] only\nShould the bot buy "Dual Golden Hanzo Void Katanas" ?',
            false,
        ),
        option.bool(
            "27851",
            "Golden Hanzo Void Mask",
            'Mode: [select] only\nShould the bot buy "Golden Hanzo Void Mask" ?',
            false,
        ),
        option.bool(
            "27852",
            "Golden Hanzo Void Horns",
            'Mode: [select] only\nShould the bot buy "Golden Hanzo Void Horns" ?',
            false,
        ),
        option.bool(
            "28031",
            "Golden Hanzo Katana Cape",
            'Mode: [select] only\nShould the bot buy "Golden Hanzo Katana Cape" ?',
            false,
        ),
        option.bool(
            "27848",
            "Golden Hanzo Void Cape",
            'Mode: [select] only\nShould the bot buy "Golden Hanzo Void Cape" ?',
            false,
        ),
        option.bool(
            "42716",
            "Nulgath's Bloodsucker Larvae",
            'Mode: [select] only\nShould the bot buy "Nulgath\'s Bloodsucker Larvae" ?',
            false,
        ),
        option.bool(
            "42717",
            "Bloodsucker of Nulgath",
            'Mode: [select] only\nShould the bot buy "Bloodsucker of Nulgath" ?',
            false,
        ),
        option.bool(
            "84617",
            "Void Warmonger Gauntlet",
            'Mode: [select] only\nShould the bot buy "Void Warmonger Gauntlet" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: NulgathWarMerge.select,
});

export default function main(): void {
    const script = new NulgathWarMerge();
    Core.bankingBlackList.push(
        "Archfiend's Favor",
        "Nulgath's Approval",
        "Diamond of Nulgath",
        "Unidentified 13",
        "Totem of Nulgath",
        "Tainted Gem",
        "Primal Dread Fang",
        "Random Weapon of Nulgath",
        "Blood Gem of the Archfiend",
        "Voucher of Nulgath (non-mem)",
        "Gem of Nulgath",
        "Dark Crystal Shard",
        "Unidentified 27",
        "Bone Dust",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
