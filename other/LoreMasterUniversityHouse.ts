/*
name: Lore Master University
description: does the Lore Master University Quests for House Items
tags: lore master university, house
*/
// Port of Scripts/Other/LoreMasterUniversityHouse.cs.

import { bot } from "turu";
import { Core } from "../core/CoreBots";
import { CoreFarms } from "../core/CoreFarms";

const Farm = new CoreFarms();

export class LoreMasterUniversity {
    university(): void {
        if (Core.checkInventory("Loremaster University")) {
            return;
        }

        this.library();
        this.getHouse("University", 6331, 5, 40, 50, 9, 6);
    }

    library(): void {
        if (Core.checkInventory("Loremaster Library")) {
            return;
        }

        this.cottage();
        this.getHouse("Library", 6330, 2, 30, 40, 6, 4);
    }

    cottage(): void {
        if (Core.checkInventory("Loremaster Cottage")) {
            return;
        }

        this.hutch();
        this.getHouse("Cottage", 6329, 1, 20, 30, 3, 2);
    }

    hutch(): void {
        if (Core.checkInventory("Loremaster Hutch")) {
            return;
        }

        this.tent();
        this.getHouse("Hutch", 6328, 1, 10, 20, 2);
    }

    tent(): void {
        if (Core.checkInventory("Loremaster Tent")) {
            return;
        }

        Core.addDrop("Loremaster Tent");
        Core.farmingLogger("Loremaster Tent", 1);
        this.mats(1, 5, 10);
        Core.buyItem("librarium", 1403, "Loremaster Tent");
    }

    private getHouse(
        type: string,
        quest: number,
        fabric: number,
        board: number,
        nail: number,
        paint = 0,
        varnish = 0,
    ): void {
        Core.addDrop("Loremaster " + type);
        Core.farmingLogger("Loremaster " + type, 1);
        Farm.loremasterREP(Core.pointsToLevel(Core.ensureLoad(quest).requiredFactionRep));
        Core.ensureAccept(quest);
        this.mats(fabric, board, nail, paint, varnish);
        Core.ensureComplete(quest);
        bot.wait.forPickup("Loremaster " + type);
    }

    private mats(fabric: number, board: number, nail: number, paint = 0, varnish = 0): void {
        Core.huntMonster("greenguardeast", "Wolf", "Fabric", fabric, { isTemp: false });
        Core.huntMonster("greenguardeast", "Toxic Treeant", "Board", board, { isTemp: false });
        Core.huntMonster("greenguardeast", "Gurushroom", "Varnish", varnish, { isTemp: false });
        Core.huntMonster("greenguardwest", "Black Knight", "Nail", nail, { isTemp: false });
        Core.huntMonster("greenguardwest", "Slime", "Paint", paint, { isTemp: false });
    }
}

export default function main(): void {
    const script = new LoreMasterUniversity();
    Core.setOptions();

    script.university();

    Core.setOptions(false);
}
