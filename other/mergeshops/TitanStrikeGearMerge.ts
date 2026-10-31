/*
name: Titan Strike Gear Merge
description: This bot will farm the items belonging to the selected mode for the Titan Strike Gear Merge [2154] in /titanstrike
tags: titan, strike, gear, merge, titanstrike, titanic, destroyer, tentacles, heroic, titans, greatswords, drakath, drakaths, antititan, corps
*/
// Port of Scripts/Other/MergeShops/TitanStrikeGearMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { TitanAttackStory } from "../../story/TitanAttack";

const Adv = new CoreAdvanced();
const TAS = new TitanAttackStory();

export class TitanStrikeGearMerge {
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
                case "Destroyer Essence":

                case "Titanic Destroyer Blade":

                case "Titanic Destroyer Morph":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("titanstrike", "Titanic Destroyer", req.name, quant, { isTemp: false });
                    break;
                case "Titanic Tincture":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("titandrakath", "Titan Drakath", req.name, quant, { isTemp: false });
                    break;
                case "Heroic Titan's Greatsword":
                    if (Core.isCompletedBefore(8776)) {
                        Core.logger(
                            `${req.name} is obtained from a One-Time only quest that you have already completed. Please check your BuyBack`,
                            undefined,
                            { messageBox: true, stopBot: true },
                        );
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.ensureAccept(8776);
                    Core.huntMonster("titanstrike", "Titanic Paladin", "Paladin Punished");
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("titanstrike", "Titanic Doomknight", "Doomknight Decimated");
                    Core.huntMonster("titanstrike", "Titanic Destroyer", "Destroyer Destroyed");
                    Core.ensureComplete(8776);
                    bot.wait.forPickup(req.name);
                    break;
                case "Titan Paladin":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("titanattack", "Chaorrupted Bandit", "AntiTitan Supplies", 100, { isTemp: false });
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("titanattack", "Titanic Vindicator", "Titanic Fluid", 40, { isTemp: false });
                    Adv.buyItem("titanattack", 2149, req.name);
                    break;
                case "Vindicator Titan XL":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("titanattack", "Chaorrupted Bandit", "AntiTitan Supplies", 100, { isTemp: false });
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("titanattack", "Titanic Vindicator", "Titanic Fluid", 40, { isTemp: false });
                    Core.huntMonster("titanattack", "Titanic Vindicator", "Vindicator Titan", undefined, {
                        isTemp: false,
                    });
                    Adv.buyItem("titanattack", 2149, req.name);
                    break;
                case "Vindicator Titan's Axes":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("titanattack", "Chaorrupted Bandit", "AntiTitan Supplies", 50, { isTemp: false });
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("titanattack", "Titanic Vindicator", "Titanic Fluid", 20, { isTemp: false });
                    Core.huntMonster("titanattack", "Titanic Vindicator", "Vindicator Titan's Axe", undefined, {
                        isTemp: false,
                    });
                    Adv.buyItem("titanattack", 2149, req.name);
                    break;
                case "Titan Paladin's Blades":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("titanattack", "Chaorrupted Bandit", "AntiTitan Supplies", 50, { isTemp: false });
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("titanattack", "Titanic Vindicator", "Titanic Fluid", 20, { isTemp: false });
                    Core.huntMonster("titanattack", "Titanic Paladin", "Titan Paladin's Blade", undefined, {
                        isTemp: false,
                    });
                    Adv.buyItem("titanattack", 2149, req.name);
                    break;
                case "Titan Drakath's Blade":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("titandrakath", "Titan Drakath", req.name, quant, { isTemp: false });
                    break;
                case "Titan Paladin's Helm":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("titanattack", "Chaorrupted Bandit", "AntiTitan Supplies", 25, { isTemp: false });
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("titanattack", "Titanic Vindicator", "Titanic Fluid", 10, { isTemp: false });
                    Adv.buyItem("titanattack", 2149, req.name);
                    break;
                case "Vindicator Titan's Helm":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("titanattack", "Chaorrupted Bandit", "AntiTitan Supplies", 25, { isTemp: false });
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("titanattack", "Titanic Vindicator", "Titanic Fluid", 10, { isTemp: false });
                    Adv.buyItem("titanattack", 2149, req.name);
                    break;
                case "Titan Drakath's Morph":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("titandrakath", "Titan Drakath", req.name, undefined, { isTemp: false });
                    break;
                case "Titan Paladin's Cloak":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("titanattack", "Chaorrupted Bandit", "AntiTitan Supplies", 25, { isTemp: false });
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("titanattack", "Titanic Vindicator", "Titanic Fluid", 10, { isTemp: false });
                    Adv.buyItem("titanattack", 2149, req.name);
                    break;
                case "Vindicator Titan's Cloak":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("titanattack", "Chaorrupted Bandit", "AntiTitan Supplies", 25, { isTemp: false });
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("titanattack", "Titanic Vindicator", "Titanic Fluid", 10, { isTemp: false });
                    Adv.buyItem("titanattack", 2149, req.name);
                    break;
                case "Chaorrupted AntiTitan Corps":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("titanattack", "AntiTitan Corps", req.name, quant, { isTemp: false });
                    break;
                case "Titan Hunter":
                    Adv.buyItem("artistalley", 729, req.name);
                    break;
            }
        };
        TAS.doAll();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("titanstrike", 2154, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "68002",
            "Titanic Destroyer",
            'Mode: [select] only\nShould the bot buy "Titanic Destroyer" ?',
            false,
        ),
        option.bool(
            "68007",
            "Titanic Destroyer Blades",
            'Mode: [select] only\nShould the bot buy "Titanic Destroyer Blades" ?',
            false,
        ),
        option.bool(
            "68003",
            "Titanic Destroyer Helm",
            'Mode: [select] only\nShould the bot buy "Titanic Destroyer Helm" ?',
            false,
        ),
        option.bool(
            "68005",
            "Titanic Destroyer Tentacles",
            'Mode: [select] only\nShould the bot buy "Titanic Destroyer Tentacles" ?',
            false,
        ),
        option.bool("71242", "Heroic Titan", 'Mode: [select] only\nShould the bot buy "Heroic Titan" ?', false),
        option.bool(
            "71243",
            "Heroic Titan's Helm",
            'Mode: [select] only\nShould the bot buy "Heroic Titan\'s Helm" ?',
            false,
        ),
        option.bool(
            "71244",
            "Heroic Titan's Cape",
            'Mode: [select] only\nShould the bot buy "Heroic Titan\'s Cape" ?',
            false,
        ),
        option.bool(
            "71246",
            "Heroic Titan's Greatswords",
            'Mode: [select] only\nShould the bot buy "Heroic Titan\'s Greatswords" ?',
            false,
        ),
        option.bool("68008", "Titan Drakath", 'Mode: [select] only\nShould the bot buy "Titan Drakath" ?', false),
        option.bool(
            "68013",
            "Titan Drakath's Blades",
            'Mode: [select] only\nShould the bot buy "Titan Drakath\'s Blades" ?',
            false,
        ),
        option.bool(
            "68009",
            "Titan Drakath's Helm",
            'Mode: [select] only\nShould the bot buy "Titan Drakath\'s Helm" ?',
            false,
        ),
        option.bool(
            "68011",
            "Titan Drakath's Tentacles",
            'Mode: [select] only\nShould the bot buy "Titan Drakath\'s Tentacles" ?',
            false,
        ),
        option.bool("71496", "AntiTitan Corps", 'Mode: [select] only\nShould the bot buy "AntiTitan Corps" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: TitanStrikeGearMerge.select,
});

export default function main(): void {
    const script = new TitanStrikeGearMerge();
    Core.bankingBlackList.push(
        "Destroyer Essence",
        "Titanic Destroyer Blade",
        "Titanic Destroyer Morph",
        "Titanic Tincture",
        "Heroic Titan's Greatsword",
        "Titan Paladin",
        "Vindicator Titan XL",
        "Vindicator Titan's Axes",
        "Titan Paladin's Blades",
        "Titan Drakath's Blade",
        "Titan Paladin's Helm",
        "Vindicator Titan's Helm",
        "Titan Drakath's Morph",
        "Titan Paladin's Cloak",
        "Vindicator Titan's Cloak",
        "Chaorrupted AntiTitan Corps",
        "Titan Hunter",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
