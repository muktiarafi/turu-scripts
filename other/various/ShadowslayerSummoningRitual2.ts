/*
name: ShadowslayerSummoningRitual2
description: null
tags: null
*/
// Port of Scripts/Other/Various/ShadowslayerSummoningRitual2.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { ShadowslayerSummoningRitual } from "./ShadowslayerSummoningRitual";
import { ShadowSlayerK } from "../../story/ShadowSlayerK";

const ShadowStory = new ShadowSlayerK();
const SSR = new ShadowslayerSummoningRitual();

export class ShadowslayerSummoningRitual2 {
    lunateSigil(quant = 30): void {
        if (Core.checkInventory("Lunate Sigil", quant)) {
            return;
        }

        if (!Core.isCompletedBefore(9845)) {
            ShadowStory.doAll();
        }

        //Get "Sparkly Shadowslayer Relic"
        SSR.getAll(true);

        Core.addDrop("Lunate Sigil");
        Core.farmingLogger("Lunate Sigil", quant);

        while (!Core.checkInventory("Lunate Sigil", quant)) {
            Core.huntMonsterQuest(
                9846,
                ["chaoscave", "Dracowerepyre", ClassType.Solo],
                ["darkoviaforest", "Lich Of The Stone", ClassType.Solo],
                ["borgars", "Burglinster", ClassType.Solo],
                ["firewar", "Uriax", ClassType.Solo],
                ["maul", "Creature Creation ", ClassType.Solo],
                ["techdungeon", "Kalron the Cryptborg", ClassType.Solo],
            );
            bot.wait.forPickup("Lunate Sigil");
        }
    }
}

export default function main(): void {
    const script = new ShadowslayerSummoningRitual2();
    Core.setOptions();

    script.lunateSigil();

    Core.setOptions(false);
}
