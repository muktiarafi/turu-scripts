/*
name: The Castle's Crown Quest Rewards
description: This script will complete "The Castle's Crown" quest
tags: legioncastle,legion,dage,birthday,castle,crown,quest,raven's curse scythe,raven,crowned axes,crowned axes of the underworld
*/
// Port of Scripts/Legion/Various/CrownedAxes.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { GetLegionCastle } from "./LegionCastle";

const LC = new GetLegionCastle();

export class CrownedAxes {
    getCrownedAxes(): void {
        if (Core.checkInventory(Core.questRewards(10102))) {
            return;
        }

        LC.allYourBaseAreBelongToUs();
        if (!Core.checkInventory("Legion Castle")) {
            Core.logger(
                "You need to have Legion Castle to complete this quest. It's daily locked, run the script tomorrow.",
            );
            return;
        }

        Core.addDrop(...Core.questRewards(10102));

        Core.equipClass(ClassType.Solo);

        Core.ensureAccept(10102);

        // King Klunk's Crown
        Core.huntMonster("evilwarnul", "Laken", "King Klunk's Crown", undefined, { isTemp: false });

        // Chaos King Crown
        Core.huntMonster("swordhavenfalls", "Chaos Lord Alteon", "Chaos King Crown", undefined, { isTemp: false });

        // Imbalanced Crown
        Core.huntMonster("brightfortress", "Imbalanced Alteon", "Imbalanced Crown", undefined, { isTemp: false });

        // Cecily's Crown
        Core.huntMonster("lust", "Lascivia", "Cecily's Crown", undefined, { isTemp: false });

        // Laurel Crown
        Core.huntMonster("goldenarena", "Queen of Hope", "Laurel Crown", undefined, { isTemp: false });

        // Northern Crown
        Core.huntMonster("snowmore", "Jon S'Nooooooo", "Northern Crown", undefined, { isTemp: false });

        Core.ensureComplete(10102);
    }
}

export default function main(): void {
    const script = new CrownedAxes();
    Core.setOptions();

    script.getCrownedAxes();

    Core.setOptions(false);
}
