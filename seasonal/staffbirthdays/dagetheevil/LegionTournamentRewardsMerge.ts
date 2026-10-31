/*
name: Legion Tournament Rewards Merge
description: This bot will farm the items belonging to the selected mode for the Legion Tournament Rewards Merge [2685] in /legiontournament
tags: legion, tournament, rewards, merge, legiontournament, underworld, proioxis, spiked, baetyl, ostrakon, shield, ker, berethrou, ritual, siculi, sacrificial, scythian, bow, arrows, pursuit, cloak, executioner, skull
*/
// Port of Scripts/Seasonal/StaffBirthdays/DageTheEvil/LegionTournamentRewardsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreLegion } from "../../../legion/CoreLegion";
import { CoreDageBirthday } from "./CoreDageBirthday";

const Adv = new CoreAdvanced();
const Legion = new CoreLegion();
const Dage = new CoreDageBirthday();

export class LegionTournamentRewardsMerge {
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
                case "Dark Ostrakon":

                case "Proioxis Pursuit Cloak":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.huntMonster("legiontournament", "Dark Ostrakon", req.name, quant, {
                        isTemp: req.temp,
                        log: false,
                    });
                    break;
                case "WarForge Coal":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonsterQuest(
                            Core.isMember ? 10636 : 10635,
                            ["legiontournament", "Legion Ritualist", ClassType.Solo],
                            ["legiontournament", "The WarForge", ClassType.Solo],
                            ["legiontournament", "Deathwing", ClassType.Solo],
                        );
                        bot.wait.forPickup(req.name);
                    }
                    break;
                //#endregion
                //#region Known items
                case "Legion Token":
                    Legion.farmLegionToken(quant);
                    break;
                //#endregion
            }
        };
        Dage.legionTournament();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("legiontournament", 2685, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "95589",
            "Underworld Proioxis",
            'Mode: [select] only\nShould the bot buy "Underworld Proioxis" ?',
            false,
        ),
        option.bool(
            "95590",
            "Underworld Proioxis Hair",
            'Mode: [select] only\nShould the bot buy "Underworld Proioxis Hair" ?',
            false,
        ),
        option.bool(
            "95591",
            "Underworld Proioxis Visage",
            'Mode: [select] only\nShould the bot buy "Underworld Proioxis Visage" ?',
            false,
        ),
        option.bool("95597", "Spiked Baetyl", 'Mode: [select] only\nShould the bot buy "Spiked Baetyl" ?', false),
        option.bool(
            "95598",
            "Dual Spiked Baetyl",
            'Mode: [select] only\nShould the bot buy "Dual Spiked Baetyl" ?',
            false,
        ),
        option.bool(
            "95600",
            "Ostrakon and Shield",
            'Mode: [select] only\nShould the bot buy "Ostrakon and Shield" ?',
            false,
        ),
        option.bool("99716", "Ker Berethrou", 'Mode: [select] only\nShould the bot buy "Ker Berethrou" ?', false),
        option.bool(
            "99717",
            "Dual Ker Berethrou",
            'Mode: [select] only\nShould the bot buy "Dual Ker Berethrou" ?',
            false,
        ),
        option.bool("99718", "Ritual Siculi", 'Mode: [select] only\nShould the bot buy "Ritual Siculi" ?', false),
        option.bool(
            "99720",
            "Sacrificial Siculi",
            'Mode: [select] only\nShould the bot buy "Sacrificial Siculi" ?',
            false,
        ),
        option.bool(
            "99722",
            "Scythian Bow and Arrows",
            'Mode: [select] only\nShould the bot buy "Scythian Bow and Arrows" ?',
            false,
        ),
        option.bool("99723", "Scythian Bow", 'Mode: [select] only\nShould the bot buy "Scythian Bow" ?', false),
        option.bool(
            "95594",
            "Proioxis Pursuit Cloak",
            'Mode: [select] only\nShould the bot buy "Proioxis Pursuit Cloak" ?',
            false,
        ),
        option.bool(
            "99670",
            "Underworld Executioner Skull Mask",
            'Mode: [select] only\nShould the bot buy "Underworld Executioner Skull Mask" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: LegionTournamentRewardsMerge.select,
});

export default function main(): void {
    const script = new LegionTournamentRewardsMerge();
    Core.bankingBlackList.push("WarForge Coal", "Dark Ostrakon", "Legion Token", "Proioxis Pursuit Cloak");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
