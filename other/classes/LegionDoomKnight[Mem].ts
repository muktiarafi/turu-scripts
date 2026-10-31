/*
name: LegionDoomKnight[Mem]
description: null
tags: null
*/
// Port of Scripts/Other/Classes/LegionDoomKnight[Mem].cs.

import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreSDKA } from "../../evil/sdka/CoreSDKA";

const Adv = new CoreAdvanced();
const SDKA = new CoreSDKA();

export class LegionDoomKnight {
    getLDK(rankUpClass = true): void {
        if (Core.checkInventory(38742)) {
            return;
        }

        if (!Core.checkInventory("Sepulchure's DoomKnight Armor")) {
            SDKA.doAll();
        }

        Core.registerQuests(4099);
        Core.huntMonster("sepulchure", "Dark Sepulchure", "Dark Sepulchure's Badge", 100, { isTemp: false });
        Core.cancelRegisteredQuests();

        Core.buyItem("battleon", 1106, 38742);

        if (rankUpClass) {
            Adv.rankUpClass(38742);
        }
    }
}

export default function main(): void {
    const script = new LegionDoomKnight();
    Core.setOptions();

    script.getLDK();

    Core.setOptions(false);
}
