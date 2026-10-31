/*
name: Mirror Realm Merge
description: This bot will farm the items belonging to the selected mode for the Mirror Realm Merge [618] in /mirrorportal
tags: mirror, realm, merge, mirrorportal, undead, paladin, duality, mage, , good, evil, really, boneafied, life, taker, cleric, nulgath, shadowreaper, doom, lunar, sand, salvage, runecape, archangels, protection, assault, pack, twin, sunlight, lifetaking, paladins, curse, beard, morph, bearded, female, archangel, enticing, intimidating, destiny, kitten, holy, blessing, spear, evilnator, skullstaff, cloud, shifter, force, dishonored, mind, expulsion, ashes, underfriend
*/
// Port of Scripts/Other/MergeShops/MirrorRealmMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { Core13LoC } from "../../story/lordsofchaos/Core13LoC";

const Adv = new CoreAdvanced();
const LoC = new Core13LoC();

export class MirrorRealmMerge {
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
                case "Mirror Realm Token":
                    LoC.xiang();
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonsterMapID("mirrorportal", 1, req.name, quant, { isTemp: false });
                    Core.cancelRegisteredQuests();
                    break;
                case "Undead Paladin Token":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("OverWorld", "Undead Artix", req.name, quant, { isTemp: false });
                    break;
                case "Chaos Shifter":
                    Core.farmingLogger(req.name, quant);
                    Adv.buyItem("mountdoomskull", 776, req.name);
                    break;
                case "Purification Orb":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("Doomwood", "Undead Paladin", req.name, quant, { isTemp: false });
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("mirrorportal", 618, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("17489", "Undead Paladin", 'Mode: [select] only\nShould the bot buy "Undead Paladin" ?', false),
        option.bool(
            "20843",
            "Duality Mage - Good",
            'Mode: [select] only\nShould the bot buy "Duality Mage - Good" ?',
            false,
        ),
        option.bool(
            "20844",
            "Duality Mage - Evil",
            'Mode: [select] only\nShould the bot buy "Duality Mage - Evil" ?',
            false,
        ),
        option.bool("20764", "Duality Mage", 'Mode: [select] only\nShould the bot buy "Duality Mage" ?', false),
        option.bool(
            "20797",
            "REALLY Undead Paladin",
            'Mode: [select] only\nShould the bot buy "REALLY Undead Paladin" ?',
            false,
        ),
        option.bool(
            "20798",
            "BONE-afied Paladin",
            'Mode: [select] only\nShould the bot buy "BONE-afied Paladin" ?',
            false,
        ),
        option.bool("17412", "Life Taker", 'Mode: [select] only\nShould the bot buy "Life Taker" ?', false),
        option.bool(
            "17505",
            "Cleric Of Nulgath",
            'Mode: [select] only\nShould the bot buy "Cleric Of Nulgath" ?',
            false,
        ),
        option.bool(
            "17488",
            "ShadowReaper Of Doom",
            'Mode: [select] only\nShould the bot buy "ShadowReaper Of Doom" ?',
            false,
        ),
        option.bool("20918", "Lunar Sand Axe", 'Mode: [select] only\nShould the bot buy "Lunar Sand Axe" ?', false),
        option.bool("20760", "Salvage", 'Mode: [select] only\nShould the bot buy "Salvage" ?', false),
        option.bool(
            "20853",
            "Duality Mage Good Runecape",
            'Mode: [select] only\nShould the bot buy "Duality Mage Good Runecape" ?',
            false,
        ),
        option.bool(
            "20852",
            "Duality Mage Evil Runecape",
            'Mode: [select] only\nShould the bot buy "Duality Mage Evil Runecape" ?',
            false,
        ),
        option.bool(
            "17506",
            "ArchAngel's Protection",
            'Mode: [select] only\nShould the bot buy "ArchAngel\'s Protection" ?',
            false,
        ),
        option.bool(
            "20765",
            "Duality Mage Runecape",
            'Mode: [select] only\nShould the bot buy "Duality Mage Runecape" ?',
            false,
        ),
        option.bool("17413", "Assault Pack", 'Mode: [select] only\nShould the bot buy "Assault Pack" ?', false),
        option.bool(
            "20919",
            "Lunar Sand Daggers",
            'Mode: [select] only\nShould the bot buy "Lunar Sand Daggers" ?',
            false,
        ),
        option.bool(
            "101773",
            "Twin Blades of Doom",
            'Mode: [select] only\nShould the bot buy "Twin Blades of Doom" ?',
            false,
        ),
        option.bool(
            "20763",
            "Dual Sunlight Daggers",
            'Mode: [select] only\nShould the bot buy "Dual Sunlight Daggers" ?',
            false,
        ),
        option.bool(
            "17418",
            "Blades of Life-Taking",
            'Mode: [select] only\nShould the bot buy "Blades of Life-Taking" ?',
            false,
        ),
        option.bool("17490", "Paladin's Curse", 'Mode: [select] only\nShould the bot buy "Paladin\'s Curse" ?', false),
        option.bool(
            "20851",
            "Duality Mage Evil Beard",
            'Mode: [select] only\nShould the bot buy "Duality Mage Evil Beard" ?',
            false,
        ),
        option.bool(
            "20849",
            "Duality Mage Good Morph",
            'Mode: [select] only\nShould the bot buy "Duality Mage Good Morph" ?',
            false,
        ),
        option.bool(
            "20848",
            "Duality Mage Evil Morph",
            'Mode: [select] only\nShould the bot buy "Duality Mage Evil Morph" ?',
            false,
        ),
        option.bool(
            "20766",
            "Bearded Duality Mage Morph",
            'Mode: [select] only\nShould the bot buy "Bearded Duality Mage Morph" ?',
            false,
        ),
        option.bool(
            "20769",
            "Female Duality Mage Morph",
            'Mode: [select] only\nShould the bot buy "Female Duality Mage Morph" ?',
            false,
        ),
        option.bool("17414", "Life Taker Hair", 'Mode: [select] only\nShould the bot buy "Life Taker Hair" ?', false),
        option.bool("17415", "Life Taker Locks", 'Mode: [select] only\nShould the bot buy "Life Taker Locks" ?', false),
        option.bool(
            "17507",
            "Hood of the ArchAngel",
            'Mode: [select] only\nShould the bot buy "Hood of the ArchAngel" ?',
            false,
        ),
        option.bool(
            "17508",
            "Enticing Hood of the ArchAngel",
            'Mode: [select] only\nShould the bot buy "Enticing Hood of the ArchAngel" ?',
            false,
        ),
        option.bool(
            "17509",
            "Intimidating Hood of the ArchAngel",
            'Mode: [select] only\nShould the bot buy "Intimidating Hood of the ArchAngel" ?',
            false,
        ),
        option.bool("17510", "Destiny Kitten", 'Mode: [select] only\nShould the bot buy "Destiny Kitten" ?', false),
        option.bool(
            "20811",
            "Holy Blessing Spear",
            'Mode: [select] only\nShould the bot buy "Holy Blessing Spear" ?',
            false,
        ),
        option.bool("20762", "Evilnator", 'Mode: [select] only\nShould the bot buy "Evilnator" ?', false),
        option.bool(
            "101774",
            "SkullStaff of Doom",
            'Mode: [select] only\nShould the bot buy "SkullStaff of Doom" ?',
            false,
        ),
        option.bool(
            "20847",
            "Duality Mage Evil Staff",
            'Mode: [select] only\nShould the bot buy "Duality Mage Evil Staff" ?',
            false,
        ),
        option.bool(
            "20846",
            "Duality Mage Good Staff",
            'Mode: [select] only\nShould the bot buy "Duality Mage Good Staff" ?',
            false,
        ),
        option.bool(
            "20770",
            "Duality Mage Staff",
            'Mode: [select] only\nShould the bot buy "Duality Mage Staff" ?',
            false,
        ),
        option.bool("21166", "Cloud Shifter", 'Mode: [select] only\nShould the bot buy "Cloud Shifter" ?', false),
        option.bool("20761", "Force Of Evil", 'Mode: [select] only\nShould the bot buy "Force Of Evil" ?', false),
        option.bool("20810", "Dishonored Sword", 'Mode: [select] only\nShould the bot buy "Dishonored Sword" ?', false),
        option.bool(
            "17434",
            "Blade of Life-Taking",
            'Mode: [select] only\nShould the bot buy "Blade of Life-Taking" ?',
            false,
        ),
        option.bool(
            "17504",
            "Mind Expulsion Blade",
            'Mode: [select] only\nShould the bot buy "Mind Expulsion Blade" ?',
            false,
        ),
        option.bool("17429", "Blade of Ashes", 'Mode: [select] only\nShould the bot buy "Blade of Ashes" ?', false),
        option.bool(
            "17427",
            "Underfriend Blade of Nulgath",
            'Mode: [select] only\nShould the bot buy "Underfriend Blade of Nulgath" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: MirrorRealmMerge.select,
});

export default function main(): void {
    const script = new MirrorRealmMerge();
    Core.bankingBlackList.push("Mirror Realm Token", "Undead Paladin Token", "Chaos Shifter", "Purification Orb");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
