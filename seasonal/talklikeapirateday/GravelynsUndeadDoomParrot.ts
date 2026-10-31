/*
name: Gravelyn's Undead Doom Parrot
description: This script will complete the quest to obtain Gravelyn's Undead Doom Parrot pet.
tags: undead doom parrot, gravelyn, seasonal,tlapd, talk like a pirate day, pet, celebrate the successful siege,doom pirate, dusk
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/GravelynsUndeadDoomParrot.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class UndeadDoomParrot {
    getItem(): void {
        if (Core.checkInventory(79501)) {
            return;
        }

        // Celebrate the Successful Siege (10425)
        Core.ensureAccept(10425);
        Core.addDrop(...Core.questRewards(10425));

        // Drink Shipment Found!
        Core.huntMonster("piratewar", "Blazing Commander", "Drink Shipment Found!");

        // Doomknight Commander Defeated
        Core.huntMonster("piratewar", "Doomknight Commander", "Doomknight Commander Defeated", 10);

        // Gallaeon Defeated for Fun
        Core.huntMonster("doompirate", "Gallaeon", "Gallaeon Defeated for Fun");

        // Shard of Ice
        Adv.buyItem("pirates", 724, "Shard of Ice");

        Core.ensureComplete(10425);
        bot.wait.forPickup("Gravelyn's Undead Doom Parrot");
        Core.toBank(...Core.questRewards(10425));
    }
}

export default function main(): void {
    const script = new UndeadDoomParrot();
    Core.setOptions();

    script.getItem();

    Core.setOptions(false);
}
