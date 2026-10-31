/*
name: Descendants Design Merge
description: This bot will farm the items belonging to the selected mode for the Descendants Design Merge [2233] in /yokaihunt
tags: descendants, design, merge, yokaihunt, oni, hatamoto, honored, horned, accessory, tassels, sheathed, katana, katanas, sheath, naginata, lunarian, astromancer, visor, terran, dragonlord, naturebound, qiang, prosperity, prosperous, fortune
*/
// Port of Scripts/Seasonal/AkibaNewYear/DescendantsDesignMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { YokaiHunt } from "./YokaiHunt";

const Adv = new CoreAdvanced();
const YH = new YokaiHunt();

export class DescendantsDesignMerge {
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
                case "Lunar Fragment":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(9094);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("guardiantree", "Blossoming Treeant", "Fresh Blossoms", 8, { log: false });
                        Core.huntMonster("guardiantree", "Seed Spitter", "Fresh Seeds", 8, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Etokoun Residue":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAccept(9097);
                        Core.killMonster("yokaihunt", "r6a", "Left", "*", "Etokoun Wrangled", undefined, {
                            log: false,
                        });
                        Core.ensureComplete(9097);
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Baoyu's Red Envelope":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(9572);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("shipwreck", "Gilded Merdraconian", "Merdraconian Coins", 15, { log: false });
                        Core.huntMonster("shipwreck", "Lobthulhu", "Lobthulu's Gold Bar", undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Baoyu's Flaming Envelope":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(9574);
                    Core.huntMonster("ashfallcamp", "Smoldur", req.name, req.quantity, { isTemp: req.temp });
                    Core.cancelRegisteredQuests();
                    break;
                case "Baoyu's Rainbow Envelope":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(9575);
                    Core.huntMonster("yokaihunt", "Mutou Hong", req.name, req.quantity, { isTemp: req.temp });
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("yokaihunt", 2233, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("73045", "Oni Hatamoto", 'Mode: [select] only\nShould the bot buy "Oni Hatamoto" ?', false),
        option.bool(
            "73046",
            "Honored Oni Hatamoto",
            'Mode: [select] only\nShould the bot buy "Honored Oni Hatamoto" ?',
            false,
        ),
        option.bool(
            "73047",
            "Oni Hatamoto Hair",
            'Mode: [select] only\nShould the bot buy "Oni Hatamoto Hair" ?',
            false,
        ),
        option.bool(
            "73048",
            "Oni Hatamoto Horned Hair",
            'Mode: [select] only\nShould the bot buy "Oni Hatamoto Horned Hair" ?',
            false,
        ),
        option.bool(
            "73049",
            "Oni Hatamoto Locks",
            'Mode: [select] only\nShould the bot buy "Oni Hatamoto Locks" ?',
            false,
        ),
        option.bool(
            "73050",
            "Oni Hatamoto Mask Accessory",
            'Mode: [select] only\nShould the bot buy "Oni Hatamoto Mask Accessory" ?',
            false,
        ),
        option.bool(
            "73051",
            "Oni Hatamoto Tassels",
            'Mode: [select] only\nShould the bot buy "Oni Hatamoto Tassels" ?',
            false,
        ),
        option.bool(
            "73052",
            "Sheathed Oni Hatamoto Katana",
            'Mode: [select] only\nShould the bot buy "Sheathed Oni Hatamoto Katana" ?',
            false,
        ),
        option.bool(
            "73053",
            "Oni Hatamoto Katana",
            'Mode: [select] only\nShould the bot buy "Oni Hatamoto Katana" ?',
            false,
        ),
        option.bool(
            "73054",
            "Oni Hatamoto Katanas",
            'Mode: [select] only\nShould the bot buy "Oni Hatamoto Katanas" ?',
            false,
        ),
        option.bool(
            "73055",
            "Oni Hatamoto Katana and Sheath",
            'Mode: [select] only\nShould the bot buy "Oni Hatamoto Katana and Sheath" ?',
            false,
        ),
        option.bool(
            "73056",
            "Oni Hatamoto Naginata",
            'Mode: [select] only\nShould the bot buy "Oni Hatamoto Naginata" ?',
            false,
        ),
        option.bool(
            "76150",
            "Lunarian Astromancer",
            'Mode: [select] only\nShould the bot buy "Lunarian Astromancer" ?',
            false,
        ),
        option.bool(
            "76153",
            "Lunarian Astromancer Helmet",
            'Mode: [select] only\nShould the bot buy "Lunarian Astromancer Helmet" ?',
            false,
        ),
        option.bool(
            "76154",
            "Lunarian Astromancer Helmet and Locks",
            'Mode: [select] only\nShould the bot buy "Lunarian Astromancer Helmet and Locks" ?',
            false,
        ),
        option.bool(
            "76155",
            "Lunarian Astromancer Visor",
            'Mode: [select] only\nShould the bot buy "Lunarian Astromancer Visor" ?',
            false,
        ),
        option.bool(
            "83883",
            "Terran Dragonlord",
            'Mode: [select] only\nShould the bot buy "Terran Dragonlord" ?',
            false,
        ),
        option.bool(
            "83884",
            "Terran Dragonlord Helm",
            'Mode: [select] only\nShould the bot buy "Terran Dragonlord Helm" ?',
            false,
        ),
        option.bool(
            "83886",
            "Naturebound Qiang",
            'Mode: [select] only\nShould the bot buy "Naturebound Qiang" ?',
            false,
        ),
        option.bool(
            "83887",
            "Terran Dragonlord of Prosperity",
            'Mode: [select] only\nShould the bot buy "Terran Dragonlord of Prosperity" ?',
            false,
        ),
        option.bool(
            "83888",
            "Prosperous Terran Dragonlord Helm",
            'Mode: [select] only\nShould the bot buy "Prosperous Terran Dragonlord Helm" ?',
            false,
        ),
        option.bool("83890", "Qiang of Fortune", 'Mode: [select] only\nShould the bot buy "Qiang of Fortune" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DescendantsDesignMerge.select,
});

export default function main(): void {
    const script = new DescendantsDesignMerge();
    YH.doAll();
    Core.bankingBlackList.push(
        "Lunar Fragment",
        "Etokoun Residue",
        "Baoyu's Red Envelope",
        "Baoyu's Flaming Envelope",
        "Baoyu's Rainbow Envelope",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
