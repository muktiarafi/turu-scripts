/*
name: Smart Enhance
description: This script will enhance your equipped gear with optimal enhancements.
tags: smart, enhancement, enhance, enh, gear, equip
*/
// Port of Scripts/Enhancement/SmartEnhance.cs.

import { bot } from "turu";
import { CoreAdvanced } from "../core/CoreAdvanced";
import { Core } from "../core/CoreBots";

const Adv = new CoreAdvanced();

export class SmartEnhance {
    doSmartEnhance(): void {
        if (Core.cboBool("DisableAutoEnhance") === true) {
            return;
        }

        const className = bot.player.currentClass ?? "";
        Adv.smartEnhance(className);
    }
}

export default function main(): void {
    const script = new SmartEnhance();
    Core.setOptions(undefined, { disableClassSwap: true });

    script.doSmartEnhance();

    Core.setOptions(false);
}
