/*
name: ChaosSlayer
description: null
tags: null
*/
// Port of Scripts/Other/Classes/REP-based/ChaosSlayer.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../../core/CoreAdvanced";
import { Core } from "../../../core/CoreBots";
import { Core13LoC } from "../../../story/lordsofchaos/Core13LoC";

const Adv = new CoreAdvanced();
const LOC = new Core13LoC();

export enum CSvariant {
    Berserker = 15402,
    Cleric = 15459,
    Mystic = 15401,
    Thief = 15403,
}

export class ChaosSlayer {
    variants: string[] = [
        "Chaos Slayer",
        "Chaos Slayer Cleric",
        "Chaos Slayer Berserker",
        "Chaos Slayer Mystic",
        "Chaos Slayer Thief",
    ];

    getCS(variant: CSvariant = CSvariant.Mystic, rankUpClass = true): void {
        if (Core.checkInventory(this.variants, undefined, { toInv: false })) {
            if (rankUpClass) {
                Adv.rankUpClass(`Chaos Slayer ${CSvariant[variant]}`);
            }
            return;
        }

        LOC.hero();
        Adv.buyItem("newfinale", 891, `Chaos Slayer ${CSvariant[variant]}`, undefined, variant);

        if (rankUpClass) {
            Adv.rankUpClass(`Chaos Slayer ${CSvariant[variant]}`);
        }
    }
}

export default function main(): void {
    const script = new ChaosSlayer();
    Core.setOptions();

    script.getCS();

    Core.setOptions(false);
}
