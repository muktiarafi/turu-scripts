/*
name: Carcossan Armory Merge
description: Farms the Carcossan Armory Merge [2760] in /templeofdoom.
tags: templeofdoom, merge, carcossan, armory, merge
*/
// Port of Scripts/Other/MergeShops/CarcossanArmory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreSunSet } from "../../story/sunsetsaga/CoreSunSet";

const Adv = new CoreAdvanced();
const CSS = new CoreSunSet();

export class CarcossanArmory {
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
            const quant = Adv.externalQuant;
            if (req == null) {
                return;
            }

            switch (req.name) {
                case "Aegis of Order":

                case "Aegis of Order Veil":

                case "Seized Destiny":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("templeofdoom", "Aegis of Order", req.name, quant, { isTemp: req.temp });
                    break;
                case "Culla's Joyful Touch":

                case "Culled Elation":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("templeofdoom", "Doom Leech", req.name, quant, { isTemp: req.temp });
                    break;
                case "Doomed Victory":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(Core.isMember ? 10847 : 10846);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("templeofdoom", "Sentinel of Order", "Sentinel Shard", 1);
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("templeofdoom", "Aegis of Order", "Aegis Shard", 6);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Lilies of Destiny Rapier":

                case "Sentinel of Order's Dream":

                case "Sentinel of Order's Phantasm":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("templeofdoom", "Sentinel of Order", req.name, quant, { isTemp: req.temp });
                    break;
                default: {
                    const shouldStop = !Adv.matsOnly || !this.dontStopMissingIng;
                    Core.logger(`The bot hasn't been taught how to get ${req.name}.`, undefined, {
                        messageBox: shouldStop,
                        stopBot: shouldStop,
                    });
                    break;
                }
            }
        };
        CSS.templeofDoom();
        // FILL_QUEST_UNLOCK: Add the story call that completes "There's an Order to These Things" [10845] to unlock "Weapon of Choice" [10846].
        Adv.startBuyAllMerge("templeofdoom", 2760, findIngredients, buyOnlyThis, { buyMode });
    }

    static readonly select = [
        option.bool(
            "102894",
            "Ecstasy of Culla",
            'Mode: [select] only\nShould the bot buy "Ecstasy of Culla" ?',
            false,
        ),
        option.bool(
            "102895",
            "Culla, the Grip of Ecstasy",
            'Mode: [select] only\nShould the bot buy "Culla, the Grip of Ecstasy" ?',
            false,
        ),
        option.bool(
            "102902",
            "Herald of Vaugha",
            'Mode: [select] only\nShould the bot buy "Herald of Vaugha" ?',
            false,
        ),
        option.bool(
            "102937",
            "Sentinel of Order",
            'Mode: [select] only\nShould the bot buy "Sentinel of Order" ?',
            false,
        ),
        option.bool(
            "102940",
            "Sentinel of Order Cape",
            'Mode: [select] only\nShould the bot buy "Sentinel of Order Cape" ?',
            false,
        ),
        option.bool(
            "102904",
            "Herald of Vaugha's Cape",
            'Mode: [select] only\nShould the bot buy "Herald of Vaugha\'s Cape" ?',
            false,
        ),
        option.bool(
            "102899",
            "Culla's Loving Touch",
            'Mode: [select] only\nShould the bot buy "Culla\'s Loving Touch" ?',
            false,
        ),
        option.bool(
            "102901",
            "Dual Culled Elation",
            'Mode: [select] only\nShould the bot buy "Dual Culled Elation" ?',
            false,
        ),
        option.bool(
            "102942",
            "Sentinel of Order's Phantasms",
            'Mode: [select] only\nShould the bot buy "Sentinel of Order\'s Phantasms" ?',
            false,
        ),
        option.bool(
            "102935",
            "Lilies of Destiny Rapiers",
            'Mode: [select] only\nShould the bot buy "Lilies of Destiny Rapiers" ?',
            false,
        ),
        option.bool(
            "102938",
            "Sentinel of Order's Potential",
            'Mode: [select] only\nShould the bot buy "Sentinel of Order\'s Potential" ?',
            false,
        ),
        option.bool(
            "102932",
            "Aegis of Order Halo",
            'Mode: [select] only\nShould the bot buy "Aegis of Order Halo" ?',
            false,
        ),
        option.bool(
            "102903",
            "Herald of Vaugha Hood",
            'Mode: [select] only\nShould the bot buy "Herald of Vaugha Hood" ?',
            false,
        ),
        option.bool("102896", "Culla Visage", 'Mode: [select] only\nShould the bot buy "Culla Visage" ?', false),
        option.bool(
            "102897",
            "Culla's Ecstasy Visage",
            'Mode: [select] only\nShould the bot buy "Culla\'s Ecstasy Visage" ?',
            false,
        ),
        option.bool("102905", "Méadaigh Amhrán", 'Mode: [select] only\nShould the bot buy "Méadaigh Amhrán" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: CarcossanArmory.select,
});

export default function main(): void {
    const script = new CarcossanArmory();
    Core.bankingBlackList.push(
        "Aegis of Order",
        "Aegis of Order Veil",
        "Culla's Joyful Touch",
        "Culled Elation",
        "Doomed Victory",
        "Lilies of Destiny Rapier",
        "Seized Destiny",
        "Sentinel of Order's Dream",
        "Sentinel of Order's Phantasm",
    );
    Core.setOptions();
    script.buyAllMerge();
    Core.setOptions(false);
}
