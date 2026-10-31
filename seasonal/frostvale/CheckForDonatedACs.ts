/*
name: Donated ACs Checker
description: This will check all of the accounts you provided that stored locally for ACs recieved from the event.
tags: donated-acs-checker, seasonal, frostvale
*/
// Port of Scripts/Seasonal/Frostvale/CheckForDonatedACs.cs.
// Turu: C#'s FrostvaleDonationLog.txt and TotalACsLog.txt in Skua's options folder are
// `bot.army` shared logs of the same names.

import { bot, type EventMap } from "turu";
import { CoreArmyLite } from "../../army/CoreArmyLite";
import { Core, randomInt } from "../../core/CoreBots";
import { CoreDailies } from "../../core/CoreDailies";
import { CoreFarms } from "../../core/CoreFarms";
import { ChillysQuest } from "./ChillysParticipation";

const Army = new CoreArmyLite();
const CQ = new ChillysQuest();
const Daily = new CoreDailies();
const Farm = new CoreFarms();

export class CheckForDonatedACs {
    private readonly months: Map<string, number> = new Map([
        ["Jan", 1],
        ["Feb", 2],
        ["Mar", 3],
        ["Apr", 4],
        ["May", 5],
        ["Jun", 6],
        ["Jul", 7],
        ["Aug", 8],
        ["Sep", 9],
        ["Oct", 10],
        ["Nov", 11],
        ["Dec", 12],
    ]);

    checkACs(): void {
        const ACsListener = (packet: EventMap["extensionPacket"]): void => {
            const type = packet["params"].type;
            const data = packet["params"].dataObj;
            if (type != null && type === "str") {
                const cmd = data[0];
                switch (cmd) {
                    case "server": {
                        if (data[2] == null) {
                            break;
                        }
                        const text = String(data[2]);
                        if (text.includes("AdventureCoins from other players. Happy Frostval!")) {
                            const ac = parseInt(text.split(" ")[2]);
                            Core.logger(`${Core.username()} has received ${ac} ACs!`);
                            const acLog =
                                parseInt(
                                    (oldACs.find((x) => x.startsWith(Core.username())) ?? "a:0").split(":").at(-1)!,
                                ) + ac;

                            ACs.push(`${Core.username()}: +${ac} (received ${acLog} ACs total)`);
                            newACs.push(`${Core.username()}:${acLog}`);
                        }
                        break;
                    }
                }
            }
        };
        Core.oneTimeMessage(
            "Donated ACs Checker",
            "*Warning* this will (wether started from the manager, or from an already logged in account ingame), 100% miss the first acc. as from the manager it will log you into the game, before it compiles and starts the script (non-changeable), or from an already logged in account, well that parts obvious.\n\n" +
                "TLDR: First Acc's checked acs will 99% of the time be missed and theres nothing we can do about it.",
        );

        bot.options.reloginServer = "Twilly";

        // C# keeps these files in %appdata%/skua/options; they are shared logs here.
        const logPath = "FrostvaleDonationLog";
        const totalACsLogPath = "TotalACsLog";

        const firstTime = bot.army.readLog(logPath).length === 0;
        const firstTimeTotal = bot.army.readLog(totalACsLogPath).length === 0;
        const ACs: string[] = [];
        let oldACs: string[] = [];
        const newACs: string[] = [];
        const warnings: string[] = [];
        let totalACsLog: string[] = [];
        let TotalAcsChecked = 0;

        if (!firstTime) {
            oldACs = bot.army.readLog(logPath);
        }

        if (!firstTimeTotal) {
            totalACsLog = bot.army.readLog(totalACsLogPath);
        }

        bot.events.on("extensionPacket", ACsListener);
        while (Army.doForAll()) {
            while (!bot.shouldExit && !bot.player.loaded) {
                Core.sleep(1000);
                if (bot.wait.forMapLoad("battleon")) {
                    break;
                }
            }

            if (!bot.house.items.some((x) => x.equipped)) {
                Core.join("whitemap-100000");
            } else {
                bot.send.packet(`%xt%zm%house%1%${bot.player.username}%`);
                bot.wait.forMapLoad("house");
            }

            Daily.wheelofDoom(false);
            Daily.monthlyTreasureChestKeys(false);

            //Requierments:
            // Level 30
            Farm.experience(30);

            // Two week old account
            // C# reads the JSON text and drops its quotes; bot.flash.get returns the string itself.
            const _output = String(bot.flash.get("world.myAvatar.objData.dCreated"));
            const output = _output.replace(/^"|"$/g, "").split(" ");
            const time = output[3].split(":");
            const creationDate = new Date(
                parseInt(output[5]),
                [...this.months].find((x) => x[0] === output[1])![1] - 1,
                parseInt(output[2]),
                parseInt(time[0]),
                parseInt(time[1]),
                parseInt(time[2]),
            ).getTime();
            const accountAgeInDays = (Date.now() - creationDate) / 86400000;
            if (accountAgeInDays < 14) {
                Core.logger(`Account too young: ${Core.username()} (${accountAgeInDays}/14 days) - Skipping`);
                warnings.push(`- ${Core.username()}: account is too young (${accountAgeInDays}/14 days)`);
                continue;
            }

            // Verified Email
            if (bot.flash.callGameFunction<boolean>("world.myAvatar.isEmailVerified")) {
                //Edit for future years quests vv <- No need to edit now, just edit the quest ID in ChillysParticipation.cs
                // Participation Quest (*previous years*: 9988, 10510)

                CQ.chillysParticipation(10510);

                // Log total ACs owned
                const username = bot.player.username;
                const totalACs = parseInt(String(bot.flash.get("world.myAvatar.objData.intCoins")!));
                Core.logger(`${username}; ACs:${totalACs}`);

                // Update total ACs log
                const JoinedLegion = Core.isCompletedBefore(793, false);
                // Check if they *could* join the Legion (1200+ ACs) only if they haven't joined yet.
                const canJoinLegion = !JoinedLegion && totalACs > 1200;

                const logEntry =
                    `${username}:${totalACs}: ` +
                    `| JoinedLegion: ${JoinedLegion ? "YES" : canJoinLegion ? "CAN JOIN" : "NO"} ` +
                    `| Legion Rev. Owned: ${Core.checkInventory(["Legion Revenant", "Legion Revenant (IoDA)"], undefined, { any: true })}`;
                TotalAcsChecked += totalACs;

                // Replace old entry if exists, otherwise add new
                const existingIndex = totalACsLog.findIndex((x) => x.startsWith(username + ":"));
                if (existingIndex >= 0) {
                    totalACsLog[existingIndex] = logEntry;
                } else {
                    totalACsLog.push(logEntry);
                }

                // Save immediately after each account (only updates the specific player)
                bot.army.writeLog(totalACsLogPath, totalACsLog);
            } else {
                Core.logger(`Unverified Email: ${Core.username()} - Skipping`);
                warnings.push(
                    `- ${Core.username()}: email is unverified (${bot.flash.get<string>("world.myAvatar.objData.strEmail") /* C# strips the JSON quotes with [1..^1] */})`,
                );
                continue;
            }
        }
        totalACsLog.push(`${TotalAcsChecked}`);
        bot.events.off("extensionPacket", ACsListener);

        const writeACs: string[] = [];
        writeACs.push(...newACs);
        for (const p of oldACs) {
            const name = p.split(":")[0];
            if (!writeACs.some((x) => x.startsWith(name))) {
                writeACs.push(p);
            }
        }
        bot.army.writeLog(logPath, writeACs);
        bot.army.writeLog(totalACsLogPath, totalACsLog);

        if (newACs.length === 0) {
            bot.showMessageBox(
                `We checked ${Army.doForAllAccountDetails!.length} accounts, but none of them have gained any ${firstTime ? "ACs" : "more ACs since last time"}.` +
                    `${warnings.length > 0 ? "\n\nPlease be aware of the following things:\n" + warnings.join("\n") : ""}`,
                randomInt(1, 100) === 100 ? "No Maidens" : "No ACs",
            );
        } else {
            bot.showMessageBox(
                `${newACs.length} out of ${Army.doForAllAccountDetails!.length} accounts received ACs! Below you will find more details:\n\n` +
                    ACs.join("\n") +
                    `${warnings.length > 0 ? "\n\nPlease be aware of the following things:\n" + warnings.join("\n") : ""}`,
                "Got ACs!",
            );
        }
    }
}

export default function main(): void {
    const script = new CheckForDonatedACs();
    Core.setOptions();

    script.checkACs();

    Core.setOptions(false);
}
