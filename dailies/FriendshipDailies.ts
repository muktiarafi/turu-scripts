/*
name: Friendship Dailies
description: This bot does all the friendship based dailies in battleodium and greyguard
tags: daily, dailies, friendship, battleodium, greyguard
*/
// Port of Scripts/Dailies/FriendshipDailies.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreDailies } from "../core/CoreDailies";
import { Friendship } from "../story/Friendship";

const Daily = new CoreDailies();
const FR = new Friendship();

export class FriendshipDailies {
    doFriendShipDailies(): void {
        FR.completeStory();
        Daily.friendships();
    }
}

export default function main(): void {
    const script = new FriendshipDailies();
    Core.bankingBlackList.push(...Daily.frGiftNames.concat(...Daily.frRewards));
    Core.setOptions();

    script.doFriendShipDailies();
}
