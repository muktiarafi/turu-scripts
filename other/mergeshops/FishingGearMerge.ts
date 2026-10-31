/*
name: Fishing Gear Merge
description: This bot will farm the items belonging to the selected mode for the Fishing Gear Merge [363] in /greenguardwest
tags: fishing, gear, merge, greenguardwest, super, pole, crabcake, yaga, hatfish, rod, backstrap, shrimp, fishin, hooks, fishy, amp, shield, old, boot, tackle, box, fish, suit, tail, floppy, mystery, gaping, head, hillbilly, overalls, fishermans, fisherwomans, xtreme, jersey, fisher, for, food, lure, order
*/
// Port of Scripts/Other/MergeShops/FishingGearMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();

export class FishingGearMerge {
    // [Can Change] This should only be changed by the author.
    //              If true, it will not stop the script if the default case triggers and the user chose to only get mats
    private dontStopMissingIng = false;

    waitTimer = 3500;
    startingRep: number = Farm.factionRep("Fishing");
    currentRep: number = Farm.factionRep("Fishing");

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
                case "Fishin' Chips": {
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    let legendDailyDone = !Core.isMember || bot.quests.isDailyComplete(1684);
                    let nonLegendDailyDone = bot.quests.isDailyComplete(1683);
                    if (!legendDailyDone) {
                        Core.ensureAccept(1684);
                    }
                    if (!nonLegendDailyDone) {
                        Core.ensureAccept(1683);
                    }
                    bot.events.on("extensionPacket", FishingWaiter);
                    Core.registerQuests(1682, 1614, 1615);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Farm.getBaitandDynamite(0, 20);
                        Core.join("fishing");
                        while (!bot.shouldExit && !bot.player.loaded) {
                            let i = 0;
                            Core.logger(`Waiting for play to load ${i++}`);
                            Core.sleep();
                        }
                        while (
                            !bot.shouldExit &&
                            !Core.checkInventory(req.name, quant) &&
                            Core.checkInventory("Fishing Dynamite")
                        ) {
                            Core.sleep();
                            bot.send.packet("%xt%zm%FishCast%1%Dynamite%30%");
                            Core.logger(`CatchTimer™ Delay: ${this.waitTimer}ms`);
                            Core.sleep(this.waitTimer);
                            bot.send.packet("%xt%zm%getFish%1%false%");
                        }
                        bot.events.off("extensionPacket", FishingWaiter);
                        this.waitTimer = 0;

                        // Hunt monsters based on temporary inventory
                        while (!bot.shouldExit && bot.tempInv.contains("Fish Caught", 30)) {
                            Core.huntMonster("greenguardwest", "Slime", undefined, undefined, { log: false });
                        }
                        while (!bot.shouldExit && bot.tempInv.contains("Endangered Fish", 5)) {
                            Core.huntMonster("greenguardwest", "Frogzard", undefined, undefined, { log: false });
                        }

                        // Complete daily quests if conditions are met
                        if (!legendDailyDone && bot.quests.canCompleteFullCheck(1684)) {
                            Core.ensureComplete(1684);
                            legendDailyDone = true;
                        }
                        if (!nonLegendDailyDone && bot.quests.canCompleteFullCheck(1683)) {
                            Core.ensureComplete(1683);
                            nonLegendDailyDone = true;
                        }

                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                }
            }
        };
        const FishingWaiter = (packet: any): void => {
            const type = packet["params"].type;
            const data = packet["params"].dataObj;

            if (!(type === null && type === "json")) {
                const cmd = String(data.cmd);

                switch (cmd) {
                    case "castWait":
                        if (data.wait != null) {
                            this.waitTimer = data.wait;
                            Core.logger(`Derp Moosefish: ${data.derp}, Set CatchTimer™: ${this.waitTimer}ms`);
                        }
                        break;
                    //idt this one works
                    case "CatchResult":
                        for (const c of data.catchResult) {
                            if (c === null || c["act"] == null || c["myRep"] === 0) {
                                continue;
                            }

                            switch (c["act"]) {
                                case "Miss":

                                case "CatchPole":
                                    Core.logger(`${c["act"]}`);
                                    break;
                            }

                            if (c["myRep"] !== 0) {
                                Core.logger(`${c["myRep"]}`);
                            }
                        }
                        break;
                }
            }
        };
        Farm.fishingREP(2);
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("greenguardwest", 363, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("9916", "The Super Pole", 'Mode: [select] only\nShould the bot buy "The Super Pole" ?', false),
        option.bool("10903", "Crabcake Hat", 'Mode: [select] only\nShould the bot buy "Crabcake Hat" ?', false),
        option.bool("10904", "Fishing Hat", 'Mode: [select] only\nShould the bot buy "Fishing Hat" ?', false),
        option.bool("10905", "Yaga Hatfish Hat", 'Mode: [select] only\nShould the bot buy "Yaga Hatfish Hat" ?', false),
        option.bool(
            "10906",
            "Fishing Rod Backstrap",
            'Mode: [select] only\nShould the bot buy "Fishing Rod Backstrap" ?',
            false,
        ),
        option.bool("10907", "Shrimp Axe", 'Mode: [select] only\nShould the bot buy "Shrimp Axe" ?', false),
        option.bool("10908", "Fishin' Hooks", 'Mode: [select] only\nShould the bot buy "Fishin\' Hooks" ?', false),
        option.bool(
            "10909",
            "Fishy Sword &amp; Shield",
            'Mode: [select] only\nShould the bot buy "Fishy Sword &amp; Shield" ?',
            false,
        ),
        option.bool("10910", "Old Boot", 'Mode: [select] only\nShould the bot buy "Old Boot" ?', false),
        option.bool("10911", "Tackle Box", 'Mode: [select] only\nShould the bot buy "Tackle Box" ?', false),
        option.bool("10912", "Fishin' Rod", 'Mode: [select] only\nShould the bot buy "Fishin\' Rod" ?', false),
        option.bool("11087", "Fish Suit", 'Mode: [select] only\nShould the bot buy "Fish Suit" ?', false),
        option.bool("11089", "Fish Tail", 'Mode: [select] only\nShould the bot buy "Fish Tail" ?', false),
        option.bool("11090", "Floppy Fish", 'Mode: [select] only\nShould the bot buy "Floppy Fish" ?', false),
        option.bool(
            "11091",
            "Mystery Floppy Fish",
            'Mode: [select] only\nShould the bot buy "Mystery Floppy Fish" ?',
            false,
        ),
        option.bool("11092", "Gaping Fish Head", 'Mode: [select] only\nShould the bot buy "Gaping Fish Head" ?', false),
        option.bool(
            "11093",
            "Hillbilly Overalls",
            'Mode: [select] only\nShould the bot buy "Hillbilly Overalls" ?',
            false,
        ),
        option.bool("11097", "Fisherman's Hat", 'Mode: [select] only\nShould the bot buy "Fisherman\'s Hat" ?', false),
        option.bool(
            "11098",
            "Fisherwoman's Hat",
            'Mode: [select] only\nShould the bot buy "Fisherwoman\'s Hat" ?',
            false,
        ),
        option.bool(
            "11102",
            "Xtreme Fishing Jersey",
            'Mode: [select] only\nShould the bot buy "Xtreme Fishing Jersey" ?',
            false,
        ),
        option.bool("11133", "Fisher Cape", 'Mode: [select] only\nShould the bot buy "Fisher Cape" ?', false),
        option.bool(
            "11135",
            "Fishin' for Food",
            'Mode: [select] only\nShould the bot buy "Fishin\' for Food" ?',
            false,
        ),
        option.bool("50724", "Lure of Order", 'Mode: [select] only\nShould the bot buy "Lure of Order" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: FishingGearMerge.select,
});

export default function main(): void {
    const script = new FishingGearMerge();
    Core.bankingBlackList.push("Fishin' Chips");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
