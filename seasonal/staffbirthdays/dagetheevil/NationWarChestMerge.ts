/*
name: Nation War Chest Merge
description: This will complete the Nation War Chest story and farm Nation Defender Medals.
tags: story, quest, nation, war, chest, merge, staff, birthday
*/
// Port of Scripts/Seasonal/StaffBirthdays/DageTheEvil/NationWarChestMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { Core } from "../../../core/CoreBots";
import { CoreNation } from "../../../nation/CoreNation";
import { JuggernautItemsofNulgath, RewardsSelection } from "../../../nation/various/JuggernautItems";

const Nation = new CoreNation();
const Jug = new JuggernautItemsofNulgath();
const Adv = new CoreAdvanced();

export class NationWarChestMerge {
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
                case "Unidentified 13":
                    Nation.farmUni13(quant);
                    break;
                case "Tainted Gem":
                    Nation.forgeTaintedGems(quant);
                    Nation.farmTaintedGem(quant);
                    break;
                case "Dark Crystal Shard":
                    Nation.forgeDarkCrystalShards(quant);
                    Nation.farmDarkCrystalShard(quant);
                    break;
                case "Diamond of Nulgath":
                    Nation.farmDiamondofNulgath(quant);
                    break;
                case "Voucher of Nulgath":
                    Nation.farmVoucher({ member: true });
                    break;
                case "Voucher of Nulgath (non-mem)":
                    Nation.farmVoucher({ member: false });
                    break;
                case "Overfiend Blade of Nulgath":
                    Jug.juggItems(RewardsSelection.Overfiend_Blade_of_Nulgath);
                    break;
            }
        };
        //Only edit the map and shopID here
        if (!Core.isSeasonalMapActive("darkwarnation")) {
            return;
        }

        Adv.startBuyAllMerge("darkwarnation", 2123, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("69698", "Wrath of Nulgath", 'Mode: [select] only\nShould the bot buy "Wrath of Nulgath" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: NationWarChestMerge.select,
});

export default function main(): void {
    const script = new NationWarChestMerge();
    Core.bankingBlackList.push(
        "Unidentified 13",
        "Tainted Gem",
        "Dark Crystal Shard",
        "Diamond of Nulgath",
        "Voucher of Nulgath",
        "Voucher of Nulgath (non-mem)",
        "Overfiend Blade of Nulgath",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
