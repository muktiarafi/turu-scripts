/*
name: Darkon Debris 2 [reconstructed] Prerequisites
description: Farms the non-boss items to get the Darkon debris 2 [reconstructed], may require some manualing
tags: darkon, darkon debris 2, prerequisites
*/
// Port of Scripts/Darkon/DarkonDebris2ReconstructedPrerequisites.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreDarkon } from "./CoreDarkon";

const Darkon = new CoreDarkon();

export class DarkonDebris2ReconstructedPrerequisites {
    farmAll(): void {
        let UseInsigs = false;
        if (Core.checkInventory("Darkon Insignia", 20)) {
            if (
                Core.oneTimeMessage(
                    "Insignia Warning",
                    '20 Darkon Insignia will be used to buy the "Darkon Debris 2 (Reconstructed)" item, is this ok?',
                    true,
                    true,
                    true,
                ) === true
            ) {
                Core.logger(
                    '20 Darkon Insignia will be used to buy the "Darkon Debris 2 (Reconstructed)" item, is this ok? (y/n)',
                    undefined,
                    { messageBox: true },
                );
                UseInsigs = true;
            }
        }
        if (!Core.checkInventory("Darkon's Debris 2 (Reconstructed)")) {
            if (!Core.checkInventory("Darkon's Debris 2 (Recovered)")) {
                Darkon.unfinishedMusicalScore(22);
                Core.buyItem("theworld", 2141, "Darkon's Debris 2 (Recovered)");
            }
            Darkon.banditsCorrespondence(22);
            Darkon.sukisPrestiege(22);
            Darkon.ancientRemnant(22);
            Darkon.wheelofFortune(22, 0);
            if (!Core.checkInventory("Darkon Insignia", 20)) {
                Core.logger(
                    ' x20 "Darkon Insignia" is Required to continue the quest, our Bots cannot *currently* kill this mob, use Grim (different client) & @InsertNameHere\'s ultra bot',
                    undefined,
                    { messageBox: true },
                );
                return;
            }
            if (UseInsigs) {
                Core.buyItem("ultradarkon", 2147, "Darkon's Debris 2 (Reconstructed)");
            } else {
                Core.logger(
                    'You have 20 Darkon Insignia, but you didn\'t want to use them, so we will not buy the "Darkon Debris 2 (Reconstructed)" item, do so yourself.',
                    "No Insig Use",
                    { messageBox: true },
                );
                return;
            }
        }
    }
}

export default function main(): void {
    const script = new DarkonDebris2ReconstructedPrerequisites();
    Core.setOptions();

    script.farmAll();

    Core.setOptions(false);
}
