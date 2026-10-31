/*
name: Nova Omiyage Merge
description: This bot will farm the items belonging to the selected mode for the Nova Omiyage Merge [2735] in /vermillioncliffs
tags: nova, omiyage, merge, vermillioncliffs, stardiviner, suzaku, constellation, mystique, house, guard, winged
*/
// Port of Scripts/Other/MergeShops/NovaOmiyageMerge.cs.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreOasis } from "../../story/oasis/CoreOasis";

const Adv = new CoreAdvanced();
const COA = new CoreOasis();

export class NovaOmiyageMerge {
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
                case "Suzaku's Stardust":
                    Core.farmingLogger(req.name, quant);
                    // C# Enum.TryParse(Core.BossClass, ignoreCase: true, out ClassType bossClass)
                    const bossClass = Object.keys(ClassType).find(
                        (name) => isNaN(Number(name)) && name.toLowerCase() === Core.bossClass.toLowerCase(),
                    );
                    Core.equipClass(
                        Core.bossClass && bossClass ? ClassType[bossClass as keyof typeof ClassType] : ClassType.Solo,
                    );
                    Core.addDrop(req.id);
                    Core.registerQuests(Core.isMember ? 10775 : 10773);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonster("vermillioncliffs", "Vermillion Phoenix", "Phoenix Drumstick", 18);
                        Core.huntMonster("vermillioncliffs", "Suzaku", "Suzaku's Beak");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                //#endregion
            }
        };
        COA.vermillionCliffs();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("vermillioncliffs", 2735, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "101609",
            "StarDiviner of Suzaku",
            'Mode: [select] only\nShould the bot buy "StarDiviner of Suzaku" ?',
            false,
        ),
        option.bool(
            "101612",
            "Constellation of Suzaku",
            'Mode: [select] only\nShould the bot buy "Constellation of Suzaku" ?',
            false,
        ),
        option.bool(
            "101613",
            "Suzaku StarDiviner Cape",
            'Mode: [select] only\nShould the bot buy "Suzaku StarDiviner Cape" ?',
            false,
        ),
        option.bool(
            "101614",
            "Suzaku StarDiviner Mystique",
            'Mode: [select] only\nShould the bot buy "Suzaku StarDiviner Mystique" ?',
            false,
        ),
        option.bool(
            "101615",
            "Suzaku StarDiviner Aura",
            'Mode: [select] only\nShould the bot buy "Suzaku StarDiviner Aura" ?',
            false,
        ),
        option.bool(
            "101624",
            "House Guard Suzaku",
            'Mode: [select] only\nShould the bot buy "House Guard Suzaku" ?',
            false,
        ),
        option.bool(
            "101610",
            "Suzaku StarDiviner Hair",
            'Mode: [select] only\nShould the bot buy "Suzaku StarDiviner Hair" ?',
            false,
        ),
        option.bool(
            "101611",
            "Suzaku StarDiviner Locks",
            'Mode: [select] only\nShould the bot buy "Suzaku StarDiviner Locks" ?',
            false,
        ),
        option.bool(
            "101616",
            "Winged Suzaku Staff",
            'Mode: [select] only\nShould the bot buy "Winged Suzaku Staff" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: NovaOmiyageMerge.select,
});

export default function main(): void {
    const script = new NovaOmiyageMerge();
    Core.bankingBlackList.push("Suzaku's Stardust");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
