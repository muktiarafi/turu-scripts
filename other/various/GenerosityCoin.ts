/*
name: Generosity Coin
description: Donates 250 Acs to get the Generosity Coin.
tags: Generosity, Coin, Generosity Coin, GenerosityCoin, acs, ac
*/
// Port of Scripts/Other/Various/GenerosityCoin.cs.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";

export class GenerosityCoinDonation {
    generosityCoin(TestMode = false): void {
        bot.wait.forTrue(() => bot.player.loaded, 20);
        let currentAcs = bot.flash.get<number>("world.myAvatar.objData.intCoins");
        const StaticACs = currentAcs;
        Core.farmingLogger("Generosity Coin", 300);

        if (
            !Core.checkInventory("Generosity Coin", 300) &&
            currentAcs >= 250 &&
            bot.showMessageBox(
                'This Script will do a 1-time Donation of *250* Acs, click "Yes" to continue.',
                "Warning!",
                true,
            ) === true
        ) {
            Core.addDrop("Generosity Coin");
            Core.logger(`Current Acs: ${currentAcs}`);
            if (currentAcs - 250 < 250) {
                Core.logger(
                    `Current Acs: ${currentAcs}. You need ${250 - currentAcs} more acs to be elegable to donate for the coin.`,
                    undefined,
                    { stopBot: true },
                );
            } else {
                Core.sendPackets(`%xt%zm%cmd%1%giftcoins%250%`);
                Core.sleep();
                bot.wait.forPickup("Generosity Coin");
                currentAcs = bot.flash.get<number>("world.myAvatar.objData.intCoins");
                Core.sleep();
                if (currentAcs === StaticACs - 250) {
                    Core.logger(
                        "Donation Successful! Remaining Acs: " + currentAcs + ". Remember to come back tomarrow!!",
                    );
                } else {
                    Core.logger("Donation Failed!");
                }
            }
        }
    }
}

export default function main(): void {
    const script = new GenerosityCoinDonation();
    Core.setOptions();

    script.generosityCoin();

    Core.setOptions(false);
}
