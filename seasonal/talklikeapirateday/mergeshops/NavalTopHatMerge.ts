/*
name: Naval Top Hat Merge
description: This bot will farm the items belonging to the selected mode for the Naval Top Hat Merge [723] in /pirates
tags: talk-like-a-pirate-day, seasonal, naval, top, hat, merge, pirates, bearded, icy, galactic, platinum, red, rotting, sir, legion, miss, chronolady, missy, scallywag, lady, mrs, lassy, cutie, chaos, femme, blazing, male, mr, brilliant, tophat, doom, lass, explorer, void, classy, , chaotic, toxic, commanders, masked, grim
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/MergeShops/NavalTopHatMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";

const Adv = new CoreAdvanced();

export class NavalTopHatMerge {
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
                case "Facial Hair":

                case "Blue Skull":

                case "Stardust":

                case "Gears":

                case "Pink Cloth":

                case "Zombie Flesh":

                case "Red Cloth":

                case "Nugget of Platinum":

                case "Shard of Ice":

                case "Chaos Eye":

                case "Breath of Flame":

                case "Toxic Gas Mask":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.buyItem("Pirates", 724, req.name, quant);
                    break;
                case "Top Hat":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("Pirates", "Fishman Soldier", req.name, quant, { isTemp: false });
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
        Adv.startBuyAllMerge("pirates", 723, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "25673",
            "Bearded Icy Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Bearded Icy Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25674",
            "Bearded Galactic Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Bearded Galactic Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25675",
            "Bearded Platinum Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Bearded Platinum Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25677",
            "Bearded Red Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Bearded Red Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25678",
            "Bearded Rotting Top Naval Hat",
            'Mode: [select] only\nShould the bot buy "Bearded Rotting Top Naval Hat" ?',
            false,
        ),
        option.bool(
            "25682",
            "Sir Legion Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Sir Legion Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25683",
            "Miss Legion Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Miss Legion Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25684",
            "Miss Galactic Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Miss Galactic Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25686",
            "ChronoLady Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "ChronoLady Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25688",
            "Missy Scallywag Top Hat",
            'Mode: [select] only\nShould the bot buy "Missy Scallywag Top Hat" ?',
            false,
        ),
        option.bool(
            "25689",
            "Lady Rotting Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Lady Rotting Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25690",
            "Miss Red Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Miss Red Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25691",
            "Mrs. Platinum Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Mrs. Platinum Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25692",
            "Lassy Icy Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Lassy Icy Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25693",
            "Cutie Chaos Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Cutie Chaos Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25694",
            "Femme Blazing Naval Top Hat Locks",
            'Mode: [select] only\nShould the bot buy "Femme Blazing Naval Top Hat Locks" ?',
            false,
        ),
        option.bool(
            "25695",
            "Male Rotting Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Male Rotting Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25696",
            "Mr. Red Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Mr. Red Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25697",
            "Sir Platinum Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Sir Platinum Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25669",
            "Male Galactic Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Male Galactic Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "26083",
            "Sir Icy Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Sir Icy Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "25625",
            "Brilliant Naval Tophat Locks",
            'Mode: [select] only\nShould the bot buy "Brilliant Naval Tophat Locks" ?',
            false,
        ),
        option.bool(
            "25624",
            "Brilliant Naval Tophat",
            'Mode: [select] only\nShould the bot buy "Brilliant Naval Tophat" ?',
            false,
        ),
        option.bool("25627", "Doom Lass Tophat", 'Mode: [select] only\nShould the bot buy "Doom Lass Tophat" ?', false),
        option.bool(
            "25628",
            "Explorer Naval Tophat",
            'Mode: [select] only\nShould the bot buy "Explorer Naval Tophat" ?',
            false,
        ),
        option.bool(
            "25629",
            "Explorer Naval Tophat Locks",
            'Mode: [select] only\nShould the bot buy "Explorer Naval Tophat Locks" ?',
            false,
        ),
        option.bool(
            "25630",
            "Void Naval Tophat",
            'Mode: [select] only\nShould the bot buy "Void Naval Tophat" ?',
            false,
        ),
        option.bool("25631", "Void Lass Tophat", 'Mode: [select] only\nShould the bot buy "Void Lass Tophat" ?', false),
        option.bool(
            "26084",
            "Icy Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Icy Naval Top Hat" ?',
            false,
        ),
        option.bool("25626", "Doom Top Hat", 'Mode: [select] only\nShould the bot buy "Doom Top Hat" ?', false),
        option.bool(
            "56320",
            "Classy Naval Bearded Tophat",
            'Mode: [select] only\nShould the bot buy "Classy Naval Bearded Tophat" ?',
            false,
        ),
        option.bool(
            "56321",
            "Classy Naval Tophat + Locks",
            'Mode: [select] only\nShould the bot buy "Classy Naval Tophat + Locks" ?',
            false,
        ),
        option.bool(
            "56324",
            "Classy Naval Tophat",
            'Mode: [select] only\nShould the bot buy "Classy Naval Tophat" ?',
            false,
        ),
        option.bool(
            "56020",
            "Chaotic Naval Top Hat + Locks",
            'Mode: [select] only\nShould the bot buy "Chaotic Naval Top Hat + Locks" ?',
            false,
        ),
        option.bool(
            "56021",
            "Chaotic Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Chaotic Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "56536",
            "Toxic Naval Commander's Top Hat",
            'Mode: [select] only\nShould the bot buy "Toxic Naval Commander\'s Top Hat" ?',
            false,
        ),
        option.bool(
            "56391",
            "Bearded Toxic Top Hat",
            'Mode: [select] only\nShould the bot buy "Bearded Toxic Top Hat" ?',
            false,
        ),
        option.bool(
            "56394",
            "Toxic Top Hat + Mask",
            'Mode: [select] only\nShould the bot buy "Toxic Top Hat + Mask" ?',
            false,
        ),
        option.bool(
            "56393",
            "Toxic Naval Commander's Top Hat + Locks",
            'Mode: [select] only\nShould the bot buy "Toxic Naval Commander\'s Top Hat + Locks" ?',
            false,
        ),
        option.bool(
            "56395",
            "Masked Toxic Top Hat + Locks",
            'Mode: [select] only\nShould the bot buy "Masked Toxic Top Hat + Locks" ?',
            false,
        ),
        option.bool(
            "56643",
            "Grim Naval Top Hat",
            'Mode: [select] only\nShould the bot buy "Grim Naval Top Hat" ?',
            false,
        ),
        option.bool(
            "56645",
            "Grim Naval Top Hat + Locks",
            'Mode: [select] only\nShould the bot buy "Grim Naval Top Hat + Locks" ?',
            false,
        ),
        option.bool(
            "56644",
            "Grim Naval Commander's Top Hat",
            'Mode: [select] only\nShould the bot buy "Grim Naval Commander\'s Top Hat" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: NavalTopHatMerge.select,
});

export default function main(): void {
    const script = new NavalTopHatMerge();
    Core.bankingBlackList.push(
        "Facial Hair",
        "Blue Skull",
        "Top Hat",
        "Stardust",
        "Gears",
        "Pink Cloth",
        "Zombie Flesh",
        "Red Cloth",
        "Nugget of Platinum",
        "Shard of Ice",
        "Chaos Eye",
        "Breath of Flame",
        "Scrap of Cloth",
        "Toxic Gas Mask ",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
