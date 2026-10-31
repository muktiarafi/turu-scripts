/*
name: Treasure Chest Spam
description: Wastes (with a warning) your extra ACs on opening Treasure Chests
tags: treasure, chest, key, dark, box, waste, AC
*/
// Port of Scripts/Tools/TreasureChestSpam.cs.
// Turu: C# asks for the amount in Skua's text-input dialog; Turu has none, so it's the Amount
// option, edited in the Script Options window the script opens at that point.

import { bot, defineScriptOptions, option } from "turu";
import { Core } from "../core/CoreBots";

export class TreasureChestSpam {
    whalingTime(stopForDarkBoxAndKey: boolean | null = null): void {
        const LoadShop = (): void => {
            // Load shop data
            let retry = 0;
            while (!bot.shouldExit && bot.shops.id !== 314) {
                bot.shops.load(314);
                bot.wait.forActionCooldown("loadShop");
                bot.wait.forTrue(() => bot.shops.isLoaded && bot.shops.id === 314, 20);
                Core.sleep(1000);
                if (bot.shops.id === 314 || retry === 20) {
                    break;
                } else {
                    retry++;
                }
            }
            retry = 0;
        };
        bot.bank.open();
        const rewards = Core.ensureLoad(1238).rewards.map((x) => x.id);
        if (Core.checkInventory([...rewards], undefined, { toInv: false })) {
            return;
        }

        Core.logger("Pay attention to the popup's, they are crucial to this bot");
        const accept = bot.showMessageBox(
            "This bot will use up a lot of your ACs (which costs real money).\n" +
                "We are not liable for any loss of ACs whilst using this bot.\n\n" +
                "Do you wish to proceed?",
            "Your AC is about to be spend",
            "Yes",
            "No",
            "Just crunch the numbers",
        );
        if (accept == null || accept.text === "No") {
            return;
        }

        const obtainedCount = bot.inventory.items
            .concat(...bot.bank.items)
            .filter((item) => rewards.includes(item.id)).length;
        const maxKeys = rewards.length - obtainedCount;

        if (Core.checkInventory(["Dark Key", "Dark Box"], undefined, { toInv: false })) {
            stopForDarkBoxAndKey = false;
        } else if (stopForDarkBoxAndKey == null) {
            const oneEst = 100 / ((rewards.length - obtainedCount) / rewards.length);
            const twoEst = 100 / ((obtainedCount + oneEst) / rewards.length);

            const buttons: [string, ...string[]] = accept.text !== "Just crunch the numbers" ? ["Yes", "No"] : ["OK"];
            const result = bot.showMessageBox(
                "Do you wish for the bot to stop after the Dark Key and Dark Box have been obtained?\n\n" +
                    `Estimation:\t${Math.ceil(oneEst)} times for one\t\t(${Math.ceil(oneEst) * 200} ACs)\n` +
                    `Estimation:\t${Math.ceil(twoEst)} times for both\t(${Math.ceil(twoEst) * 200} ACs)\n` +
                    `Guaranteed:\t${maxKeys} times for both\t(${maxKeys * 200} ACs)`,
                "Dark Items?",
                ...buttons,
            );

            if (result == null) {
                return;
            }

            stopForDarkBoxAndKey = result.text === "Yes";
        }

        const goForbroke = bot.showMessageBox(
            "Do you wish to use select how many keys to use?\n" + "Or maybe you wanna go for broke",
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
                            `Your input: ${amount} keys\n` +
                                `This will cost you ${amount * 200} ACs. (200 ACs per key)\n` +
                                `This would leave you with ${afterAC} ACs afterwards, which is impossible.\n\n` +
                                "Please choose a different amount of keys",
                            `Calculating based on ${amount} keys`,
                        );
                    } else {
                        const acceptResult = bot.showMessageBox(
                            `Your input: ${amount} keys\n` +
                                `This will cost you ${amount * 200} ACs. (200 ACs per key)\n` +
                                `This would leave you with ${afterAC} ACs afterwards.\n\n` +
                                "Do you wish to proceed?",
                            `Calculating based on ${amount} keys`,
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

        amount = amount > maxKeys ? maxKeys : amount;
        Core.killMonster("swordhavenundead", "Left", "Right", "*", "Treasure Chest", amount > 250 ? 250 : amount, {
            isTemp: false,
        });

        Core.join("battleon");

        for (let i = 0; i < amount; i++) {
            if (!Core.checkInventory("Treasure Chest", 1)) {
                Core.killMonster(
                    "swordhavenundead",
                    "Left",
                    "Right",
                    "*",
                    "Treasure Chest",
                    amount - i > 250 ? 250 : amount - i,
                    { isTemp: false },
                );
            }

            if (bot.map.name !== "battleon") {
                Core.join("battleon");
            }
            LoadShop();
            if (!bot.shops.isLoaded || bot.shops.id !== 314) {
                Core.logger("Shop not loaded, retrying...");
                LoadShop();
            } else {
                bot.shops.buyItem(8939, -1, 6483);
            }
            bot.wait.forItemBuy();
            Core.sleep();
            const preKeyItems = bot.inventory.items;

            Core.chainComplete(1238);
            Core.sleep();

            const newItems = bot.inventory.items.filter((x) => !preKeyItems.some((y) => y.id === x.id));
            for (const item of newItems) {
                Core.logger("New Item: " + item.name);
            }

            if (stopForDarkBoxAndKey === true && Core.checkInventory(["Dark Key", "Dark Box"])) {
                bot.showMessageBox("Dark Box and Dark Key obtained!", "Dark Items!");
                break;
            }

            if (Core.checkInventory([...rewards], undefined, { toInv: false })) {
                bot.showMessageBox("All Treasure Chest items obtained!", "You maxed out the Treasure Chests");
                break;
            }
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "TreasureChestSpam",
    [option.int("Amount", "Amount of keys", "How many keys to use (200 ACs each).", 0)],
    true,
);

export default function main(): void {
    const script = new TreasureChestSpam();
    script.whalingTime();
}
