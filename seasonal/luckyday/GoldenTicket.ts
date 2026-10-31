/*
name: MaxGoldenTicket
description: Will max the Golden Ticket from lucky day.
tags: lucky day, shamrock, golden, ticket, golden ticket, goldenticket, max
*/
// Port of Scripts/Seasonal/LuckyDay/GoldenTicket.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";

export class GoldenTicket {
    maxTickets(): void {
        if (!Core.isSeasonalMapActive("luck")) {
            return;
        }

        bot.events.on("playerAFK", Core.playerAFK);

        let CurrentQuant = bot.inventory.getQuantity("Golden Ticket");
        let UpdatedQuant: number;
        let SendNextPacket = true;

        Core.join("luck");

        while (!bot.shouldExit && !Core.checkInventory("Golden Ticket", 65000)) {
            if (bot.map.name !== "luck") {
                Core.join("luck");
            }

            if (SendNextPacket) {
                Core.sendPackets("%xt%zm%getMapItem%10173%101%");
                SendNextPacket = false;
            }

            UpdatedQuant = bot.inventory.getQuantity("Golden Ticket");

            if (UpdatedQuant > CurrentQuant) {
                SendNextPacket = true;

                // log every 100
                if (UpdatedQuant / 100 > CurrentQuant / 100) {
                    Core.farmingLogger("Golden Ticket", 65000);
                }

                CurrentQuant = UpdatedQuant;
            }
        }

        bot.events.off("playerAFK", Core.playerAFK);
    }
}

export default function main(): void {
    const script = new GoldenTicket();
    Core.bankingBlackList.push("Golden Ticket");
    Core.setOptions(undefined, { disableClassSwap: true });

    script.maxTickets();

    Core.setOptions(false);
}
