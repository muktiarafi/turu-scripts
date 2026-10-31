/*
name: Magnum Opus Merge
description: This bot will farm the items belonging to the selected mode for the Magnum Opus Merge [2709] in /magnumopus
tags: magnum, opus, merge, magnumopus, aleister, dawnseeker, aleisters, champion, plate, magna, visio, emberkissed, son, destructions, awakaned, ars, magnus, imperio, ira, ember, crown, mantle, gloriosa, infamis
*/
// Port of Scripts/Other/MergeShops/MagnumOpusMerge.cs.

import { bot, defineScriptOptions, type EventMap, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core, randomInt } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class MagnumOpusMerge {
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
                case "Flame of the Magnum Opus":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    if (!!Core.bossClass) {
                        Core.equipClass(ClassType.Boss);
                    } else {
                        bot.log(
                            "BossClass is empty/unselected in CBO, we'll use the Solo class or if thats empty, the currently equipped class.",
                        );
                        Core.equipClass(ClassType.Solo);
                    }
                    Core.addDrop(req.id);
                    Core.registerQuests(Core.isMember ? 10706 : 10705);
                    bot.events.on("extensionPacket", this.flameoftheBeyond);
                    bot.options.attackWithoutTarget = true;
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        if (bot.map.name !== "magnumopus") {
                            Core.join("magnumopus");
                        }

                        if (bot.player.cell !== "r2") {
                            Core.jump("r2", "bottom");
                        }

                        bot.combat.attack("*");

                        bot.sleep(200);
                        if (
                            req.temp
                                ? bot.tempInv.contains(req.id, req.quantity)
                                : bot.inventory.contains(req.id, req.quantity)
                        ) {
                            break;
                        }
                    }
                    bot.options.attackWithoutTarget = false;
                    bot.events.off("extensionPacket", this.flameoftheBeyond);
                    Core.jump("Enter", "Spawn");
                    bot.wait.forPickup(req.id);
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("magnumopus", 2709, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    flameoftheBeyond = (packet: EventMap["extensionPacket"]): void => {
        if (String(packet?.["params"]?.type) !== "json") {
            return;
        }
        if (!bot.player.alive) {
            return;
        }
        const data = packet["params"].dataObj;
        if (String(data?.cmd) !== "event") {
            return;
        }
        const zoneSet = String(data?.args?.zoneSet);
        if (!zoneSet) {
            return;
        }

        const px = bot.player.x;
        const py = bot.player.y;

        // Zone A active, walk right
        if (zoneSet === "A") {
            /* box of : 
            x: 550, y: 339
            x: 678, y: 465
            */
            if (px >= 550 && px <= 678 && py >= 339 && py <= 465) {
                return;
            }

            const randX = randomInt(550, 678);
            const randY = randomInt(339, 465);
            // C# walks on a Task; walkTo waits for the walk (about a second at most) here.
            bot.player.walkTo(randX, randY);
            return;
        }

        // Zone B active, walk left
        if (zoneSet === "B") {
            /* box of : 
            x: 426, y: 359
            x: 211, y: 445
            */
            if (px >= 211 && px <= 426 && py >= 359 && py <= 445) {
                return;
            }

            const randX = randomInt(211, 426);
            const randY = randomInt(359, 445);
            // C# walks on a Task; walkTo waits for the walk (about a second at most) here.
            bot.player.walkTo(randX, randY);
            return;
        }
    };

    static readonly select = [
        option.bool(
            "100488",
            "Aleister the Dawnseeker",
            'Mode: [select] only\nShould the bot buy "Aleister the Dawnseeker" ?',
            false,
        ),
        option.bool(
            "100489",
            "Aleister's Champion Plate",
            'Mode: [select] only\nShould the bot buy "Aleister\'s Champion Plate" ?',
            false,
        ),
        option.bool("100605", "Ranger of Mana", 'Mode: [select] only\nShould the bot buy "Ranger of Mana" ?', false),
        option.bool("100420", "Magna Visio", 'Mode: [select] only\nShould the bot buy "Magna Visio" ?', false),
        option.bool(
            "100494",
            "Ember-Kissed Cape",
            'Mode: [select] only\nShould the bot buy "Ember-Kissed Cape" ?',
            false,
        ),
        option.bool(
            "100495",
            "Son of Destruction's Cape",
            'Mode: [select] only\nShould the bot buy "Son of Destruction\'s Cape" ?',
            false,
        ),
        option.bool(
            "100421",
            "Awakaned Magna Visio",
            'Mode: [select] only\nShould the bot buy "Awakaned Magna Visio" ?',
            false,
        ),
        option.bool("100413", "Dual Ars Magna", 'Mode: [select] only\nShould the bot buy "Dual Ars Magna" ?', false),
        option.bool(
            "100415",
            "Dual Magnus Imperio",
            'Mode: [select] only\nShould the bot buy "Dual Magnus Imperio" ?',
            false,
        ),
        option.bool("100417", "Dual Magna Ira", 'Mode: [select] only\nShould the bot buy "Dual Magna Ira" ?', false),
        option.bool("100490", "Aleister's Hair", 'Mode: [select] only\nShould the bot buy "Aleister\'s Hair" ?', false),
        option.bool(
            "100491",
            "Aleister's Ember Crown",
            'Mode: [select] only\nShould the bot buy "Aleister\'s Ember Crown" ?',
            false,
        ),
        option.bool("100492", "Aleister's Hood", 'Mode: [select] only\nShould the bot buy "Aleister\'s Hood" ?', false),
        option.bool(
            "100493",
            "Aleister's Mantle",
            'Mode: [select] only\nShould the bot buy "Aleister\'s Mantle" ?',
            false,
        ),
        option.bool(
            "100606",
            "Champion Tara Morph",
            'Mode: [select] only\nShould the bot buy "Champion Tara Morph" ?',
            false,
        ),
        option.bool(
            "100607",
            "Champion Tara's Locks",
            'Mode: [select] only\nShould the bot buy "Champion Tara\'s Locks" ?',
            false,
        ),
        option.bool("100419", "Ars Gloriosa", 'Mode: [select] only\nShould the bot buy "Ars Gloriosa" ?', false),
        option.bool("100418", "Ars Infamis", 'Mode: [select] only\nShould the bot buy "Ars Infamis" ?', false),
        option.bool("100416", "Magna Ira", 'Mode: [select] only\nShould the bot buy "Magna Ira" ?', false),
        option.bool("100412", "Ars Magna", 'Mode: [select] only\nShould the bot buy "Ars Magna" ?', false),
        option.bool("100414", "Magnus Imperio", 'Mode: [select] only\nShould the bot buy "Magnus Imperio" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: MagnumOpusMerge.select,
});

export default function main(): void {
    const script = new MagnumOpusMerge();
    Core.bankingBlackList.push("Flame of the Magnum Opus");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
