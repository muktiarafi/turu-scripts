/*
name: Legendary Naval Top Hats Merge [Member]
description: This bot will farm the items belonging to the selected mode for the Legendary Naval Top Hats Merge [1919] in /pirates
tags: tlapd, talk-like-a-pirate-day, seasonal, legendary, naval, top, hats, merge, pirates, male, galactic, bearded, chronolord, chaos, blazing, icy, platinum, legion, red, rotting, skull, scallywag, sir, miss, mr, chronolady, missy, lady, mrs, lassy, cutie, femme, goggleless, brilliant, tophat, , doom, lass, chaotic, morph, flaming, toxic, beard
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/MergeShops/LegendaryNavalTopHatsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { NavalTopHatMerge } from "./NavalTopHatMerge";

const Adv = new CoreAdvanced();
const NTHM = new NavalTopHatMerge();

export class LegendaryNavalTopHatsMerge {
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
                case "Stardust":

                case "Facial Hair":

                case "Gears":

                case "Chaos Eye":

                case "Breath of Flame":

                case "Shard of Ice":

                case "Nugget of Platinum":

                case "Blue Skull":

                case "Red Cloth":

                case "Zombie Flesh":

                case "Pink Cloth":

                case "Toxic Flame":

                case "Toxic Gas Mask":
                    Core.farmingLogger(req.name, quant);
                    Adv.buyItem("pirates", 724, req.name, quant);
                    break;
                case "Legend Top Hat":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("pirates", "Fishman Soldier", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Icy Naval Top Hat":
                    NTHM.buyAllMerge(req.name);
                    break;
                case "Scrap of Cloth":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        for (const mon of [3, 7, 15, 10]) {
                            const M = bot.monsters.mapMonsters.find((x) => x != null && x.mapId === mon) ?? null;
                            if (M == null) {
                                continue;
                            }

                            if (bot.map.name !== "tlapd") {
                                Core.join("tlapd");
                            }
                            if (bot.player.cell !== M!.cell) {
                                Core.jump(M.cell);
                            }

                            if (M != null && M.hp >= 0) {
                                bot.hunt.monster(M.mapId);
                            }

                            if (Core.checkInventory(req.name, quant)) {
                                break;
                            }
                        }
                    }
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("pirates", 1919, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "25698",
            "Male Galactic Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Male Galactic Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25699",
            "Bearded ChronoLord Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Bearded ChronoLord Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25700",
            "Bearded Chaos Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Bearded Chaos Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25701",
            "Bearded Blazing Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Bearded Blazing Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25702",
            "Bearded Icy Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Bearded Icy Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25703",
            "Bearded Galactic Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Bearded Galactic Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25705",
            "Bearded Platinum Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Bearded Platinum Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25706",
            "Bearded Legion Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Bearded Legion Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25707",
            "Bearded Red Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Bearded Red Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25708",
            "Bearded Rotting Top Naval Hat",
            'Mode: [select] only\nShould the bot buy "Bearded Rotting Top Naval Hat" ?',
            false,
        ),
        option.bool(
            "25709",
            "Bearded Rotting Skull Top Hat",
            'Mode: [select] only\nShould the bot buy "Bearded Rotting Skull Top Hat" ?',
            false,
        ),
        option.bool(
            "25710",
            "Bearded Scallywag Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Bearded Scallywag Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25711",
            "ChronoLord Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "ChronoLord Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25712",
            "Sir Legion Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Sir Legion Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25713",
            "Miss Legion Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Miss Legion Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25714",
            "Mr. Chaos Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Mr. Chaos Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25715",
            "ChronoLady Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "ChronoLady Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25716",
            "Blazing Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Blazing Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25717",
            "Missy Scallywag Top Hat",
            'Mode: [select] only\nShould the bot buy "Missy Scallywag Top Hat" ?',
            false,
        ),
        option.bool(
            "25718",
            "Lady Rotting Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Lady Rotting Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25719",
            "Miss Red Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Miss Red Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25720",
            "Mrs. Platinum Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Mrs. Platinum Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25793",
            "Lassy Icy Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Lassy Icy Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25721",
            "Cutie Chaos Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Cutie Chaos Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25722",
            "Femme Blazing Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Femme Blazing Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25723",
            "Male Rotting Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Male Rotting Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25724",
            "Mr. Red Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Mr. Red Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25725",
            "Sir Platinum Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Sir Platinum Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25726",
            "Miss Galactic Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Miss Galactic Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25730",
            "Goggle-less Bearded ChronoLord Top Hat",
            'Mode: [select] only\nShould the bot buy "Goggle-less Bearded ChronoLord Top Hat" ?',
            false,
        ),
        option.bool(
            "25731",
            "Goggle-less ChronoLady Top Hat",
            'Mode: [select] only\nShould the bot buy "Goggle-less ChronoLady Top Hat" ?',
            false,
        ),
        option.bool(
            "25732",
            "Goggle-less ChronoLord Top Hat",
            'Mode: [select] only\nShould the bot buy "Goggle-less ChronoLord Top Hat" ?',
            false,
        ),
        option.bool(
            "25579",
            "Brilliant Naval Tophat +3",
            'Mode: [select] only\nShould the bot buy "Brilliant Naval Tophat +3" ?',
            false,
        ),
        option.bool(
            "25580",
            "Brilliant Naval Tophat Locks +3",
            'Mode: [select] only\nShould the bot buy "Brilliant Naval Tophat Locks +3" ?',
            false,
        ),
        option.bool("25581", "Doom Top Hat +3", 'Mode: [select] only\nShould the bot buy "Doom Top Hat +3" ?', false),
        option.bool(
            "25582",
            "Doom Lass Tophat +3",
            'Mode: [select] only\nShould the bot buy "Doom Lass Tophat +3" ?',
            false,
        ),
        option.bool(
            "56022",
            "Chaotic Naval Top Hat + Locks Morph",
            'Mode: [select] only\nShould the bot buy "Chaotic Naval Top Hat + Locks Morph" ?',
            false,
        ),
        option.bool(
            "56023",
            "Chaotic Naval Top Hat Morph",
            'Mode: [select] only\nShould the bot buy "Chaotic Naval Top Hat Morph" ?',
            false,
        ),
        option.bool(
            "56537",
            "Flaming Toxic Top Hat",
            'Mode: [select] only\nShould the bot buy "Flaming Toxic Top Hat" ?',
            false,
        ),
        option.bool(
            "56392",
            "Flaming Toxic Top Hat + Beard",
            'Mode: [select] only\nShould the bot buy "Flaming Toxic Top Hat + Beard" ?',
            false,
        ),
        option.bool(
            "56390",
            "Flaming Toxic Top Hat + Mask",
            'Mode: [select] only\nShould the bot buy "Flaming Toxic Top Hat + Mask" ?',
            false,
        ),
        option.bool(
            "56539",
            "Flaming Toxic Naval Top Hat + Locks",
            'Mode: [select] only\nShould the bot buy "Flaming Toxic Naval Top Hat + Locks" ?',
            false,
        ),
        option.bool(
            "56541",
            "Flaming Toxic Top Hat + Locks + Mask",
            'Mode: [select] only\nShould the bot buy "Flaming Toxic Top Hat + Locks + Mask" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: LegendaryNavalTopHatsMerge.select,
});

export default function main(): void {
    const script = new LegendaryNavalTopHatsMerge();
    Core.bankingBlackList.push(
        "Stardust",
        "Legend Top Hat",
        "Facial Hair",
        "Gears",
        "Chaos Eye",
        "Breath of Flame",
        "Shard of Ice",
        "Icy Naval Top Hat",
        "Nugget of Platinum",
        "Blue Skull",
        "Red Cloth",
        "Zombie Flesh",
        "Pink Cloth",
        "Scrap of Cloth",
        "Toxic Flame",
        "Toxic Gas Mask",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
