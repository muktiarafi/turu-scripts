/*
name: Non SpellCrafta Scroll Buyer
description: This script will buy the selected scrolls from the Terminus Temple.
tags: scroll, nsc, life steal, dark flare, nightmares, terminus temple
*/
// Port of Scripts/Other/Various/NonSpellCraftaScrollBuyer.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export enum Scrolls {
    LifeSteal = "LifeSteal",
    DarkFlare = "DarkFlare",
    Nightmares = "Nightmares",
}

export class BuyNSCScrolls {
    buyScroll(scroll: Scrolls, quant: number = -1): void {
        const scrollName = this.getScrollName(scroll);
        const currentQuantity = bot.inventory.getQuantity(scrollName);
        const maxStack = 99;
        const buyAmount = quant === -1 ? maxStack - currentQuantity : quant;
        bot.log(`Buying ${scrollName} - Current: ${currentQuantity}, Buy Amount: ${buyAmount}, Max Stack: ${maxStack}`);
        if (buyAmount < 0) {
            Core.logger("You cannot buy a negative amount of scrolls.");
            return;
        } else if (buyAmount > 0) {
            if (Core.checkInventory(scrollName, buyAmount)) {
                Core.logger(`You already have ${currentQuantity}x ${scrollName} in your inventory.`);
                return;
            }
            Core.logger(`Buying ${buyAmount}x ${scrollName}.`);
            Adv.buyItem("terminatemple", 2328, scrollName, buyAmount);
        }
    }

    private getScrollName(scroll: Scrolls): string {
        return scroll === Scrolls.LifeSteal
            ? "Scroll of Life Steal"
            : scroll === Scrolls.DarkFlare
              ? "Scroll of Dark Flare"
              : scroll === Scrolls.Nightmares
                ? "Scroll of Nightmares"
                : "";
    }
}

export const scriptOptions = defineScriptOptions(
    "BuyNSCScrolls",
    [
        option.choice("scrollSelect", "Scroll of", "Select the scroll of your choise", choices(Scrolls)),
        option.int("scrollAmount", "How many", "Write -1 to buy up to max. stack", -1),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new BuyNSCScrolls();
    Core.setOptions();

    script.buyScroll(bot.config!.get<Scrolls>("scrollSelect"), bot.config!.get<number>("scrollAmount"));

    Core.setOptions(false);
}
