/*
name: Wheel Of Doom Spam
description: Wastes (with a warning) your extra ACs on Wheel of Doom spins
tags: wheel, doom, spin, waste, AC, treasure, potions, IODA
*/
// Port of Scripts/Tools/WheelOfDoomSpam.cs.
// Turu: C# asks for the amount in Skua's text-input dialog; Turu has none, so it's the Amount
// option, edited in the Script Options window the script opens at that point.

import { bot, defineScriptOptions, option } from "turu";
import { Core } from "../core/CoreBots";

export class WheelOfDoomSpam {
    whalingTime(stopForIoDA: boolean | null = null): void {
        Core.logger("Pay attention to the popup's, they are crucial to this bot");
        const accept = bot.showMessageBox(
            "This bot will use up a lot of your ACs (which costs real money).\n" +
                "We are not liable for any loss of ACs whilst using this bot.\n\n" +
                "Do you wish to proceed?",
            "Your AC is about to be spend",
            true,
        );
        if (accept !== true) {
            return;
        }

        if (Core.checkInventory("Epic Item of Digital Awesomeness", undefined, { toInv: false })) {
            stopForIoDA = false;
        } else {
            stopForIoDA ??=
                bot.showMessageBox(
                    "Do you wish for the bot to stop after the Epic Item of Digital Awesomeness have been obtained?",
                    "EIoDA?",
                    true,
                ) === true;
        }

        const goForbroke = bot.showMessageBox(
            "Do you wish to use select how many tickets to use?\n" + "Or maybe you wanna go for broke",
            "Mode Selector",
            "Select Amount",
            "GO FOR BROKE!",
        );

        let amount = 0;
        const currentAC = bot.flash.get<number>("world.myAvatar.objData.intCoins");
        if (goForbroke.text === "Select Amount") {
            let previous: number | null = null;
            while (!bot.shouldExit) {
                bot.config.configure();
                amount = bot.config.get<number>("Amount");
                // Nobody changed it (the window was closed, or can't open): C#'s cancelled dialog.
                if (amount === previous) {
                    bot.stop();
                }
                previous = amount;
                if (amount <= 0) {
                    bot.showMessageBox(
                        "Please provide a number greater than zero (0) in order to continue.",
                        "Invalid input",
                    );
                } else {
                    const afterAC = currentAC - amount * 200;
                    if (afterAC < 0) {
                        bot.showMessageBox(
                            `Your input: ${amount} tickets\n` +
                                `This will cost you ${amount * 200} ACs. (200 ACs per ticket)\n` +
                                `This would leave you with ${afterAC} ACs afterwards, which is impossible.\n\n` +
                                "Please choose a different amount of tickets",
                            `Calculating based on ${amount} tickets`,
                        );
                    } else {
                        const acceptResult = bot.showMessageBox(
                            `Your input: ${amount} tickets\n` +
                                `This will cost you ${amount * 200} ACs. (200 ACs per ticket)\n` +
                                `This would leave you with ${afterAC} ACs afterwards.\n\n` +
                                "Do you wish to proceed?",
                            `Calculating based on ${amount} tickets`,
                            true,
                        );
                        if (acceptResult === true) {
                            break;
                        }
                    }
                }
            }
        } else if (goForbroke.text === "GO FOR BROKE!") {
            amount = Math.trunc(currentAC / 200);
        }

        Core.join("doom");
        // Load shop data
        let retry = 0;
        while (!bot.shouldExit && bot.shops.id !== 707) {
            bot.shops.load(707);
            bot.wait.forActionCooldown("loadShop");
            bot.wait.forTrue(() => bot.shops.isLoaded && bot.shops.id === 707, 20);
            Core.sleep(1000);
            if (bot.shops.id === 707 || retry === 20) {
                break;
            } else {
                retry++;
            }
        }
        const preTicketTP = bot.inventory.getQuantity("Treasure Potion");
        const rewards = Core.questRewards(3074);

        for (let i = 0; i < amount; i++) {
            bot.shops.buyItem(45252, -1, 26665);

            Core.sleep();
            const preTicketItems = bot.inventory.items;

            Core.chainComplete(3074);
            Core.sleep();

            const newItems = bot.inventory.items.filter((x) => !preTicketItems.some((y) => y.id === x.id));
            for (const item of newItems) {
                if (item.name !== "Treasure Potion") {
                    Core.logger("New Item: " + item.name);
                }
            }

            if (stopForIoDA === true && Core.checkInventory("Epic Item of Digital Awesomeness")) {
                bot.showMessageBox("Epic Item of Digital Awesomeness", "EIoDA!");
                break;
            }

            if (Core.checkInventory(rewards, undefined, { toInv: false })) {
                bot.showMessageBox("All Wheel of Doom items obtained!", "You maxed out the Wheel of Doom");
                break;
            }
        }
        Core.logger(
            // C# subtracts the other way round, logging a negative count.
            `You have earned ${bot.inventory.getQuantity("Treasure Potion") - preTicketTP} more Treasure Potions`,
        );
    }
}

export const scriptOptions = defineScriptOptions(
    "WheelOfDoomSpam",
    [option.int("Amount", "Amount of tickets", "How many tickets to use (200 ACs each).", 0)],
    true,
);

export default function main(): void {
    const script = new WheelOfDoomSpam();
    script.whalingTime();
}
