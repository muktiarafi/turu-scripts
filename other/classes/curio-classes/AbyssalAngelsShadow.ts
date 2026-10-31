/*
name: AbyssalAngelsShadow
description: null
tags: null
*/
// Port of Scripts/Other/Classes/Curio-Classes/AbyssalAngelsShadow.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../../core/CoreAdvanced";
import { Core } from "../../../core/CoreBots";

const Adv = new CoreAdvanced();

export class AbyssalAngelsShadow {
    getAbyssal(rankUpClass = true): void {
        if (Core.checkInventory("Abyssal Angel Shadow")) {
            return;
        }

        if (!Core.checkInventory(34584)) {
            Core.logger(`This bot requires "Abyssal Angel [34584]", stopping the bot`);
            return;
        }

        Adv.rankUpClass("Abyssal Angel");
        Core.buyItem("curio", 1657, "Abyssal Angel Shadow");

        if (rankUpClass) {
            Adv.rankUpClass("Abyssal Angel Shadow");
        }
    }
}

export default function main(): void {
    const script = new AbyssalAngelsShadow();
    Core.setOptions();

    script.getAbyssal();

    Core.setOptions(false);
}
