/*
name: Low Tide Merge
description: This will farm and buy all items of Low Tide Merge Shop.
tags: farm, merge, low-tide, pirate
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/MergeShops/LowTideMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { LowTideStory } from "../LowTideStory";

const Adv = new CoreAdvanced();
const LT = new LowTideStory();

export class LowTideMerge {
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
                case "Evidence Tag":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(8846);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("lowtide", "Exiled General Miel", "Gem Encrusted Medal", 3);
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("lowtide", "Spectral Jellyfish", "Spindley Tentacles", 30);
                        Core.huntMonster("lowtide", "Ghostly Eel", "Eel Fangs", 30);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Dark Sea Corsair":

                case "Dark Sea Corsair's Mask":

                case "Dark Sea Corsair's Mask + Locks":

                case "Dark Sea Corsair's Hat":

                case "Dark Sea Corsair's Hat + Locks":

                case "Dark Sea Corsair's Battle Mask":

                case "Dark Sea Corsair's Battle Mask + Locks":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("lowtide", "Exiled General Miel", req.name, 1, { isTemp: false });
                    break;
                case "Enchanted Corsair's Rapier":

                case "Enchanted Corsair's Pistol":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("lowtide", "Spectral Jellyfish", req.name, 1, { isTemp: false });
                    break;
            }
        };
        LT.storyline();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("lowtide", 2166, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "71132",
            "Enchanted Corsair",
            'Mode: [select] only\nShould the bot buy "Enchanted Corsair" ?',
            false,
        ),
        option.bool(
            "71133",
            "Enchanted Corsair's Mask",
            'Mode: [select] only\nShould the bot buy "Enchanted Corsair\'s Mask" ?',
            false,
        ),
        option.bool(
            "71134",
            "Enchanted Corsair's Mask + Locks",
            'Mode: [select] only\nShould the bot buy "Enchanted Corsair\'s Mask + Locks" ?',
            false,
        ),
        option.bool(
            "71135",
            "Enchanted Corsair's Hat",
            'Mode: [select] only\nShould the bot buy "Enchanted Corsair\'s Hat" ?',
            false,
        ),
        option.bool(
            "71136",
            "Enchanted Corsair's Hat + Locks",
            'Mode: [select] only\nShould the bot buy "Enchanted Corsair\'s Hat + Locks" ?',
            false,
        ),
        option.bool(
            "71137",
            "Enchanted Corsair's Battle Mask",
            'Mode: [select] only\nShould the bot buy "Enchanted Corsair\'s Battle Mask" ?',
            false,
        ),
        option.bool(
            "71138",
            "Enchanted Corsair's Battle Mask + Locks",
            'Mode: [select] only\nShould the bot buy "Enchanted Corsair\'s Battle Mask + Locks" ?',
            false,
        ),
        option.bool(
            "71140",
            "Enchanted Corsair's Rapiers",
            'Mode: [select] only\nShould the bot buy "Enchanted Corsair\'s Rapiers" ?',
            false,
        ),
        option.bool(
            "71142",
            "Enchanted Corsair's Pistols",
            'Mode: [select] only\nShould the bot buy "Enchanted Corsair\'s Pistols" ?',
            false,
        ),
        option.bool(
            "71143",
            "Enchanted Corsair's Battle Gear",
            'Mode: [select] only\nShould the bot buy "Enchanted Corsair\'s Battle Gear" ?',
            false,
        ),
        option.bool(
            "72047",
            "Dark Sea Fleet Captain",
            'Mode: [select] only\nShould the bot buy "Dark Sea Fleet Captain" ?',
            false,
        ),
        option.bool(
            "72048",
            "Dark Sea Captain's Hat",
            'Mode: [select] only\nShould the bot buy "Dark Sea Captain\'s Hat" ?',
            false,
        ),
        option.bool(
            "72049",
            "Dark Sea Captain's Hat + Locks",
            'Mode: [select] only\nShould the bot buy "Dark Sea Captain\'s Hat + Locks" ?',
            false,
        ),
        option.bool(
            "72050",
            "Dark Sea Captain's Hat + Beard",
            'Mode: [select] only\nShould the bot buy "Dark Sea Captain\'s Hat + Beard" ?',
            false,
        ),
        option.bool(
            "72051",
            "Dark Sea Captain's Ship",
            'Mode: [select] only\nShould the bot buy "Dark Sea Captain\'s Ship" ?',
            false,
        ),
        option.bool("71588", "Explorer Moglin", 'Mode: [select] only\nShould the bot buy "Explorer Moglin" ?', false),
        option.bool(
            "71592",
            "Looter Crew Moglin",
            'Mode: [select] only\nShould the bot buy "Looter Crew Moglin" ?',
            false,
        ),
        option.bool("71593", "Cap'n MogBeard", 'Mode: [select] only\nShould the bot buy "Cap\'n MogBeard" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: LowTideMerge.select,
});

export default function main(): void {
    const script = new LowTideMerge();
    Core.bankingBlackList.push(
        "Evidence Tag",
        "Dark Sea Corsair",
        "Dark Sea Corsair's Mask",
        "Dark Sea Corsair's Mask + Locks",
        "Dark Sea Corsair's Hat",
        "Dark Sea Corsair's Hat + Locks",
        "Dark Sea Corsair's Battle Mask",
        "Dark Sea Corsair's Battle Mask + Locks",
        "Enchanted Corsair's Rapier",
        "Enchanted Corsair's Pistol ",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
