/*
name: Gramiels Merge
description: This bot will farm the items belonging to the selected mode for the Gramiels Merge [2593] in /ultragramielhub
tags: gramiels, merge, ultragramielhub, celestial, gramiel, robes, gaze, halo, ascended, wings, grace, orb, orbs, divine, enoch, pet, battle, hollowborn, vindicator, spear, empowered, grandmaster, dawn, fortress, vindicators, chosen
*/
// Port of Scripts/Hollowborn/MergeShops/GramielsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { HBVNonInsig } from "../HollowbornVindicator(NonInsignia)";
import { DawnsanctumMerge } from "./DawnsanctumMerge";

const Adv = new CoreAdvanced();
const DM = new DawnsanctumMerge();
const HBV = new HBVNonInsig();

export class GramielsMerge {
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
                case "Trygve's Testament":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    Core.huntMonster("trygve", "Gramiel", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Fortress' Faith":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    Core.huntMonster("neofortress", "Vindicator General", req.name, quant, {
                        isTemp: false,
                        log: false,
                    });
                    break;
                case "Tower's Trisagion":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    Core.huntMonster("neotower", "Vindicator Assassin", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Sanctum's Salvation":

                case "Grandmaster Gramiel":

                case "Grandmaster Gramiel Hair":

                case "Celestial Gramiel Wings":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    Core.huntMonster("dawnsanctum", "Grandmaster Gramiel", req.name, quant, {
                        isTemp: false,
                        log: false,
                    });
                    break;
                case "Gramiel the Graceful's Insignia":
                    Core.logger(`${req.name} requires army, skipping...`);
                    break;
                case "Gramiel's Glorified Enoch":

                case "Dawn Vindicator Castle":
                    DM.buyAllMerge(req.name);
                    break;
                case "Condensed Grace":
                    if (bot.quests.isAvailable(10299)) {
                        HBV.getClass(false, true, quant);
                    }
                    break;
                //#endregion
                //#region Known items
                case "Gramiel's Emblem":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("dawnsanctum", "Celestial Gramiel", req.name, quant, { isTemp: false });
                    break;
                //#endregion
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("ultragramielhub", 2593, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "94028",
            "Celestial Gramiel Robes",
            'Mode: [select] only\nShould the bot buy "Celestial Gramiel Robes" ?',
            false,
        ),
        option.bool(
            "94029",
            "Celestial Gramiel Armor",
            'Mode: [select] only\nShould the bot buy "Celestial Gramiel Armor" ?',
            false,
        ),
        option.bool(
            "94030",
            "Celestial Gramiel Gaze",
            'Mode: [select] only\nShould the bot buy "Celestial Gramiel Gaze" ?',
            false,
        ),
        option.bool(
            "94031",
            "Celestial Gramiel Halo",
            'Mode: [select] only\nShould the bot buy "Celestial Gramiel Halo" ?',
            false,
        ),
        option.bool(
            "94032",
            "Ascended Gramiel Wings",
            'Mode: [select] only\nShould the bot buy "Ascended Gramiel Wings" ?',
            false,
        ),
        option.bool(
            "94034",
            "Celestial Grace Orb",
            'Mode: [select] only\nShould the bot buy "Celestial Grace Orb" ?',
            false,
        ),
        option.bool(
            "94035",
            "Celestial Grace Orbs",
            'Mode: [select] only\nShould the bot buy "Celestial Grace Orbs" ?',
            false,
        ),
        option.bool(
            "94033",
            "Gramiel's Divine Enoch",
            'Mode: [select] only\nShould the bot buy "Gramiel\'s Divine Enoch" ?',
            false,
        ),
        option.bool(
            "94351",
            "Gramiel's Divine Enoch Pet",
            'Mode: [select] only\nShould the bot buy "Gramiel\'s Divine Enoch Pet" ?',
            false,
        ),
        option.bool(
            "94352",
            "Gramiel's Divine Enoch Battle Pet",
            'Mode: [select] only\nShould the bot buy "Gramiel\'s Divine Enoch Battle Pet" ?',
            false,
        ),
        option.bool(
            "94358",
            "Hollowborn Vindicator Armor",
            'Mode: [select] only\nShould the bot buy "Hollowborn Vindicator Armor" ?',
            false,
        ),
        option.bool(
            "94359",
            "Hollowborn Vindicator Helm",
            'Mode: [select] only\nShould the bot buy "Hollowborn Vindicator Helm" ?',
            false,
        ),
        option.bool(
            "94360",
            "Hollowborn Vindicator Wings",
            'Mode: [select] only\nShould the bot buy "Hollowborn Vindicator Wings" ?',
            false,
        ),
        option.bool(
            "94361",
            "Hollowborn Vindicator Spear",
            'Mode: [select] only\nShould the bot buy "Hollowborn Vindicator Spear" ?',
            false,
        ),
        option.bool(
            "94371",
            "Empowered Grandmaster Gramiel",
            'Mode: [select] only\nShould the bot buy "Empowered Grandmaster Gramiel" ?',
            false,
        ),
        option.bool(
            "94155",
            "Dawn Vindicator Fortress",
            'Mode: [select] only\nShould the bot buy "Dawn Vindicator Fortress" ?',
            false,
        ),
        option.bool(
            "94353",
            "Dawn Vindicator's Chosen",
            'Mode: [select] only\nShould the bot buy "Dawn Vindicator\'s Chosen" ?',
            false,
        ),
        option.bool(
            "94354",
            "Dawn Vindicator's Chosen Helm",
            'Mode: [select] only\nShould the bot buy "Dawn Vindicator\'s Chosen Helm" ?',
            false,
        ),
        option.bool(
            "94355",
            "Dawn Vindicator's Chosen Wings",
            'Mode: [select] only\nShould the bot buy "Dawn Vindicator\'s Chosen Wings" ?',
            false,
        ),
        option.bool(
            "94356",
            "Dawn Vindicator's Chosen Spear",
            'Mode: [select] only\nShould the bot buy "Dawn Vindicator\'s Chosen Spear" ?',
            false,
        ),
        option.bool(
            "94357",
            "Hollowborn Vindicator",
            'Mode: [select] only\nShould the bot buy "Hollowborn Vindicator" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: GramielsMerge.select,
});

export default function main(): void {
    const script = new GramielsMerge();
    Core.bankingBlackList.push(
        "Trygve's Testament",
        "Fortress' Faith",
        "Tower's Trisagion",
        "Sanctum's Salvation",
        "Grandmaster Gramiel",
        "Grandmaster Gramiel Hair",
        "Celestial Gramiel Wings",
        "Gramiel the Graceful's Insignia",
        "Gramiel's Glorified Enoch",
        "Gramiel's Emblem",
        "Dawn Vindicator Castle",
        "Condensed Grace",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
