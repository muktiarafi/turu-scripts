/*
name: PlagueGearMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/PlagueGearMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { Core7DD } from "../../story/7deadlydragons/Core7DD";

const Adv = new CoreAdvanced();
const DD = new Core7DD();

export class PlagueGearMerge {
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
                case "Dragon's Plague Scythe":

                case "Sloth Gem":

                case "Slime Claw":

                case "Slime Fang":

                case "Sloth Heart":

                case "Plague Badge":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("sloth", "Phlegnn", req.name, quant, { isTemp: false });
                    break;
                case "Bloody Claw":

                case "Bloodless Heart":

                case "Bloody Fang":

                case "Bloody Scale":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("sloth", "Cured Phlegnn", req.name, quant, { isTemp: false });
                    break;
                case "Slime Scale":
                    Core.equipClass(ClassType.Farm);
                    Core.killMonster("sloth", "r2", "Bottom", "*", req.name, quant, { isTemp: false });
                    break;
            }
        };
        DD.sloth();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("sloth", 1429, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("40714", "Plague Knight", 'Mode: [select] only\nShould the bot buy "Plague Knight" ?', false),
        option.bool(
            "40719",
            "Plague Knight Cape",
            'Mode: [select] only\nShould the bot buy "Plague Knight Cape" ?',
            false,
        ),
        option.bool(
            "40720",
            "Plague Knight Spiked Cape",
            'Mode: [select] only\nShould the bot buy "Plague Knight Spiked Cape" ?',
            false,
        ),
        option.bool(
            "40715",
            "Plague Knight Hood",
            'Mode: [select] only\nShould the bot buy "Plague Knight Hood" ?',
            false,
        ),
        option.bool(
            "40716",
            "Plague Knight Mask",
            'Mode: [select] only\nShould the bot buy "Plague Knight Mask" ?',
            false,
        ),
        option.bool(
            "40718",
            "Plague DragonsFang Blade",
            'Mode: [select] only\nShould the bot buy "Plague DragonsFang Blade" ?',
            false,
        ),
        option.bool("40707", "Hazmat Suit", 'Mode: [select] only\nShould the bot buy "Hazmat Suit" ?', false),
        option.bool("40708", "Hazmat Suit Helm", 'Mode: [select] only\nShould the bot buy "Hazmat Suit Helm" ?', false),
        option.bool(
            "40709",
            "BioHazard Launcher",
            'Mode: [select] only\nShould the bot buy "BioHazard Launcher" ?',
            false,
        ),
        option.bool(
            "40739",
            "Bloodborne Plague Knight",
            'Mode: [select] only\nShould the bot buy "Bloodborne Plague Knight" ?',
            false,
        ),
        option.bool(
            "40744",
            "Bloodborne Plague Knight Cape",
            'Mode: [select] only\nShould the bot buy "Bloodborne Plague Knight Cape" ?',
            false,
        ),
        option.bool(
            "40745",
            "Bloodborne Plague Knight Spikes",
            'Mode: [select] only\nShould the bot buy "Bloodborne Plague Knight Spikes" ?',
            false,
        ),
        option.bool(
            "40740",
            "Bloodborne Plague Knight Hood",
            'Mode: [select] only\nShould the bot buy "Bloodborne Plague Knight Hood" ?',
            false,
        ),
        option.bool(
            "40741",
            "Bloodborne Plague Knight Mask",
            'Mode: [select] only\nShould the bot buy "Bloodborne Plague Knight Mask" ?',
            false,
        ),
        option.bool(
            "40743",
            "Bloodborne DragonsFang Blade",
            'Mode: [select] only\nShould the bot buy "Bloodborne DragonsFang Blade" ?',
            false,
        ),
        option.bool(
            "40742",
            "Bloodborne Plague Scythe",
            'Mode: [select] only\nShould the bot buy "Bloodborne Plague Scythe" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: PlagueGearMerge.select,
});

export default function main(): void {
    const script = new PlagueGearMerge();
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
