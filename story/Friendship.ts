/*
name: Friendship Story
description: This will complete the Friendship storyline.
tags: story, quest, friendship, greyguard, battleodium, NPC
*/
// Port of Scripts/Story/Friendship.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class Friendship {
    completeStory(): void {
        const friendshipPacketReader = (packet: any): void => {
            const type = packet["params"].type;
            const data = packet["params"].dataObj;
            if (!(type == null && type === "json")) {
                const cmd = String(data.cmd);
                switch (cmd) {
                    case "friendshipInfo":

                    case "friendshipTalk":

                    case "friendshipChoice":
                        waitForPacket = true;
                        break;
                }
            }
        };
        const SendWaitedPacket = (packet: string): void => {
            waitForPacket = false;
            bot.send.packet(packet);
            bot.wait.forTrue(() => waitForPacket, 30);
        };
        if (Core.isCompletedBefore(9106)) {
            return;
        }

        Story.preLoad(this.completeStory);

        // Bad-tleon (9099)
        Story.mapItemQuest(9099, "battleodium", 11202);

        // Hello Darkness My Old Fiend (9100)
        Story.killQuest(9100, "battleodium", "Diemond");

        // Knock Knock, You’s There (9101)
        Story.mapItemQuest(9101, "battleodium", 11203, 3);

        // Befriend a Friend (9102)
        let waitForPacket = false;
        if (!Story.questProgression(9102)) {
            Core.ensureAccept(9102);
            bot.events.on("extensionPacket", friendshipPacketReader);
            Core.jumpWait();

            while (!bot.tempInv.contains("Friendship Formed")) {
                SendWaitedPacket(`%xt%zm%friendshipInfo%${bot.map.roomId}%Maya%`);
                SendWaitedPacket(`%xt%zm%friendshipTalk%${bot.map.roomId}%`);
                SendWaitedPacket(`%xt%zm%friendshipChoice%${bot.map.roomId}%1%`);
            }

            bot.events.off("extensionPacket", friendshipPacketReader);
            Core.ensureComplete(9102);
        }

        // Darkness Distress (9103)
        if (!Story.questProgression(9103)) {
            Core.ensureAccept(9103);
            Core.getMapItem(11205, 1, "greyguard");
            Core.huntMonster("greyguard", "Gloombloom", "Gloomy Monster", 1);
            Core.huntMonster("greyguard", "Carcass Creeper", "Shadowy Monster", 1);
            Core.huntMonster("greyguard", "Fearweaver", "Dim Monster", 1);
            Core.huntMonster("greyguard", "Darkbark", "Dark Monster", 1);
            Core.huntMonster("greyguard", "Twilighteeth", "Darker Monster", 1);
            Core.huntMonster("greyguard", "Maulignant", "Darkest Monster", 1);
            Core.ensureComplete(9103);
        }

        // Your New FF (9104)
        if (!Story.questProgression(9104)) {
            Core.ensureAccept(9104);
            bot.events.on("extensionPacket", friendshipPacketReader);
            Core.jumpWait();

            while (!bot.tempInv.contains("Greyguard Friendship Formed")) {
                SendWaitedPacket(`%xt%zm%friendshipInfo%${bot.map.roomId}%Xing%`);
                SendWaitedPacket(`%xt%zm%friendshipTalk%${bot.map.roomId}%`);
                SendWaitedPacket(`%xt%zm%friendshipChoice%${bot.map.roomId}%1%`);
            }

            bot.events.off("extensionPacket", friendshipPacketReader);
            Core.ensureComplete(9104);
        }

        // Enguard Greenguard (9105)
        Story.killQuest(9105, "greyguard", "Carcass Creeper");

        // Not all is Well (9106)
        Story.killQuest(9106, "greyguard", "Odium");
    }
}

export default function main(): void {
    const script = new Friendship();
    Core.setOptions();

    script.completeStory();
}
