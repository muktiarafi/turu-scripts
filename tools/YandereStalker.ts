/*
name: Player Finder
description: Finds a player in a range of roomnumbers, with a specific map name, player name, stop location (wether u want to stop at the player or your default location), and a start and stop range for room#
tags: find, player,
*/
// Port of Scripts/Tools/YandereStalker.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { Core } from "../core/CoreBots";

export class YandereStalker {
    findPlayerThroughMapNumbers(): void {
        const player = bot.config!.get<string>("Player Name");
        const map = bot.config!.get<string>("Map Name");

        if (bot.config!.get<boolean>("Stay at player")) {
            Core.customStopLocation = "None";
        }

        const lowestMapnumber = bot.config!.get<number>("Starting Room Number");
        const highestMapNumber = bot.config!.get<number>("Ending Room Number");

        Core.logger(`Lowest Map Number: ${lowestMapnumber}, Highest Map Number: ${highestMapNumber}`);

        if (player == null || map == null) {
            Core.logger("Player Name or Map Name is not specified. Stopping script.");
            return;
        }

        Core.logger("Joining whitemap to then move to the next room (in case of navigation issues)");

        for (let mapnumber = lowestMapnumber; mapnumber <= highestMapNumber; mapnumber++) {
            Core.join(`${map}-${mapnumber}`);
            bot.wait.forMapLoad(map);

            if (bot.map.playerExists(player)) {
                Core.logger(`${player} Found in ${bot.map.fullName}!`);
                return;
            } else {
                Core.logger(`${player} not found in ${bot.map.fullName}`);
                Core.join("whitemap");
            }
        }

        Core.logger(
            `${player} not found in ${bot.map.fullName}, stopping (bot will go to the default home location)`,
            undefined,
            { stopBot: true },
        );
    }
}

export const scriptOptions = defineScriptOptions(
    "FindPlayer",
    [
        option.bool("Stay at player", "Stay at player", "stay at player, or goto default stop location", false),
        option.text("Player Name", "Player Name", "Insert playername to find", ""),
        option.text("Map Name", "Map Name", "Insert map name to find", ""),
        option.int("Starting Room Number", "Starting Room Number", "RoomNumber to start at.", 0),
        option.int("Ending Room Number", "Ending Room Number", "RoomNumber to end at.", 0),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new YandereStalker();
    Core.setOptions();
    script.findPlayerThroughMapNumbers();
    Core.setOptions(false);
}
