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
            Core.ensureAccept(9846);
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("chaoscave", "DracoWerePyre", "Chaotic Dragon Blade", 1, { isTemp: false });
            Core.huntMonster("darkoviaforest", "Lich of the Stone", "Lich Crown", 1, { isTemp: false });
            Core.huntMonster("borgars", "Burglinster", "Deep Fried Mecha Mace", 1, { isTemp: false });
            Core.huntMonster("firewar", "Uriax", "Uriax's Tail", 1, { isTemp: false });
            Core.huntMonster("maul", "Creature Creation", "Axe of Creation", 1, { isTemp: false });
            Core.huntMonster("techdungeon", "Kalron the Cryptborg", "Zealous Cherubs", 1, { isTemp: false });
            Core.ensureComplete(9846);
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
