/*
name: OrbHuntMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/OrbHuntMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { OrbHunt } from "../../story/queenofmonsters/extra/OrbHunt";

const Adv = new CoreAdvanced();
const OH = new OrbHunt();

export class OrbHuntMerge {
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
                case "Ancient Astrolabe":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAccept(8349);
                        Core.huntMonster("orbhunt", "Chamat", "Chamat Defeated");
                        Core.huntMonster("orbhunt", "Horothotep", "Horothotep Defeated");
                        Core.huntMonster("orbhunt", "Kolyaban", "Kolyaban Defeated");
                        Core.huntMonster("orbhunt", "Quetzal", "Quetzal Defeated");
                        Core.ensureComplete(8349);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        OH.orbHuntSaga();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("orbhunt", 2060, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("64276", "Luminomancer", 'Mode: [select] only\nShould the bot buy "Luminomancer" ?', false),
        option.bool(
            "64277",
            "Luminomancer's Helm",
            'Mode: [select] only\nShould the bot buy "Luminomancer\'s Helm" ?',
            false,
        ),
        option.bool(
            "64278",
            "Luminomancer's Rune Cape",
            'Mode: [select] only\nShould the bot buy "Luminomancer\'s Rune Cape" ?',
            false,
        ),
        option.bool(
            "64279",
            "Luminous Beam Blade",
            'Mode: [select] only\nShould the bot buy "Luminous Beam Blade" ?',
            false,
        ),
        option.bool(
            "64639",
            "Dual Luminous Beam Blades",
            'Mode: [select] only\nShould the bot buy "Dual Luminous Beam Blades" ?',
            false,
        ),
        option.bool("64280", "Tenebral Warrior", 'Mode: [select] only\nShould the bot buy "Tenebral Warrior" ?', false),
        option.bool(
            "64281",
            "Tenebral Warrior's Helm",
            'Mode: [select] only\nShould the bot buy "Tenebral Warrior\'s Helm" ?',
            false,
        ),
        option.bool(
            "64282",
            "Tenebral Warrior's Rune Cape",
            'Mode: [select] only\nShould the bot buy "Tenebral Warrior\'s Rune Cape" ?',
            false,
        ),
        option.bool(
            "64283",
            "Tenebral Beam Sword",
            'Mode: [select] only\nShould the bot buy "Tenebral Beam Sword" ?',
            false,
        ),
        option.bool(
            "64640",
            "Dual Tenebral Beam Swords",
            'Mode: [select] only\nShould the bot buy "Dual Tenebral Beam Swords" ?',
            false,
        ),
        option.bool("64506", "Pyroclastic Mage", 'Mode: [select] only\nShould the bot buy "Pyroclastic Mage" ?', false),
        option.bool(
            "64507",
            "Pyroclastic Mage Hair",
            'Mode: [select] only\nShould the bot buy "Pyroclastic Mage Hair" ?',
            false,
        ),
        option.bool(
            "64508",
            "Pyroclastic Mage Hood",
            'Mode: [select] only\nShould the bot buy "Pyroclastic Mage Hood" ?',
            false,
        ),
        option.bool(
            "64509",
            "Pyroclastic Guardian Cape",
            'Mode: [select] only\nShould the bot buy "Pyroclastic Guardian Cape" ?',
            false,
        ),
        option.bool(
            "64510",
            "Pyroclastic Mage Staff",
            'Mode: [select] only\nShould the bot buy "Pyroclastic Mage Staff" ?',
            false,
        ),
        option.bool(
            "64511",
            "Dual Pyroclastic Mage Staves",
            'Mode: [select] only\nShould the bot buy "Dual Pyroclastic Mage Staves" ?',
            false,
        ),
        option.bool(
            "64512",
            "Pyroclastic Blaze Hands",
            'Mode: [select] only\nShould the bot buy "Pyroclastic Blaze Hands" ?',
            false,
        ),
        option.bool(
            "64645",
            "Elegant Eternal Ice Outfit",
            'Mode: [select] only\nShould the bot buy "Elegant Eternal Ice Outfit" ?',
            false,
        ),
        option.bool(
            "64648",
            "Elegant Eternal Ice Crown",
            'Mode: [select] only\nShould the bot buy "Elegant Eternal Ice Crown" ?',
            false,
        ),
        option.bool(
            "64649",
            "Elegant Ice Crown + Locks",
            'Mode: [select] only\nShould the bot buy "Elegant Ice Crown + Locks" ?',
            false,
        ),
        option.bool(
            "64650",
            "Elegant Ice Veil + Locks",
            'Mode: [select] only\nShould the bot buy "Elegant Ice Veil + Locks" ?',
            false,
        ),
        option.bool(
            "64652",
            "The Cold Shoulder",
            'Mode: [select] only\nShould the bot buy "The Cold Shoulder" ?',
            false,
        ),
        option.bool("64653", "Frozen Ring Wand", 'Mode: [select] only\nShould the bot buy "Frozen Ring Wand" ?', false),
        option.bool("64646", "Elegant Ice Cut", 'Mode: [select] only\nShould the bot buy "Elegant Ice Cut" ?', false),
        option.bool(
            "64647",
            "Elegant Ice Locks",
            'Mode: [select] only\nShould the bot buy "Elegant Ice Locks" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: OrbHuntMerge.select,
});

export default function main(): void {
    const script = new OrbHuntMerge();
    Core.setOptions();
    script.buyAllMerge();

    Core.setOptions(false);
}
