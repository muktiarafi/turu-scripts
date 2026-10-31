/*
name: MoglinPunter
description: null
tags: null
*/
// Port of Scripts/Other/Badges/ZorbakPunter.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";

export class ZorbakPunt {
    // bool Datagood = false;
    // bool Finished = false;

    // private double RequiredPuntScore = 13; // Default; can be changed per year or event

    badge(): void {
        if (Core.hasWebBadge(this.badgeName)) {
            Core.logger(`Already have the ${this.badgeName} badge `);
            return;
        }

        if (!Core.isSeasonalMapActive("zorbakpunt")) {
            return;
        }

        // Bot.Options.LagKiller = false;
        // Core.OneTimeMessage(
        //     "Minigame Explanation",
        //     "This minigame works off of a \"value\" system for ponts, so 9999 is 99, for the quest so youll need to get a value of 10000 points which may take a while.",
        //     forcedMessageBox: true
        // );

        // int Punt = 0;

        Core.logger(`Doing quest for ${this.badgeName} badge, Purely Rng based, good luck`);
        // Always private
        // Core.Join("zorbakpunt-100000");
        // Bot.Events.ExtensionPacketReceived += puntingPacketReader;
        while (!bot.shouldExit && !Core.hasWebBadge(this.badgeName)) {
            // Datagood = false;
            // Core.Sleep();
            // Core.SendPackets("%xt%zm%ia%1%rval%btnPuntting%%");
            Core.getMapItem(7184, 1, "zorbakpunt-100000");
            Core.chainComplete(7429);
            bot.log("Waiting ~5seconds or so for the badge to register ( quest may repeat)");
            bot.sleep(5000);
            // Bot.Wait.ForCellChange("Punt");
            // Bot.Wait.ForTrue(() => Datagood, 5);

            // if (Finished || Core.CheckInventory(53911))
            // {
            //     Bot.Wait.ForDrop(53911);
            //     Bot.Wait.ForPickup(53911);

            //     Core.ChainComplete(7429);
            //     Core.Logger($"Punts to get the badge: {Punt}");
            //     break;
            // }
            // Core.Jump("Enter", "Spawn");
        }
        // Bot.Events.ExtensionPacketReceived -= puntingPacketReader;

        // void puntingPacketReader(dynamic packet)
        // {
        //     const double EPSILON = 0.0001; // Tolerance for floating-point comparisons

        //     string type = packet["params"].type;
        //     dynamic data = packet["params"].dataObj;
        //     if (type is not null and "json")
        //     {
        //         string cmd = data.cmd.ToString();
        //         if (cmd == "ia"
        //             && data.oName.ToString() == "btnPuntting"
        //             && data.unm.ToString() == Core.Username())
        //         {
        //             Datagood = true;

        //             // Score comes as integer representing hundredths (e.g., 3489 = 34.89)
        //             double score = (double)data.val / 100.0;

        //             bool win = Math.Abs(score - RequiredPuntScore) < EPSILON; // Compare to configurable score

        //             Core.Logger(
        //                 $"Punt [#{Punt++}] | Score [{score:F2}], "
        //                 + $"Win? ({(win ? "✅" : "❌")})"
        //             );

        //             if (win)
        //             {
        //                 Bot.Events.ExtensionPacketReceived -= puntingPacketReader;
        //                 Finished = true;
        //             }
        //         }
        //     }
        // }
    }

    private readonly badgeName = "Zorbak Punter";
}

export default function main(): void {
    const script = new ZorbakPunt();
    Core.setOptions();

    script.badge();

    Core.setOptions(false);
}
