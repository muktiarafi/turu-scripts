/*
name: Buy Out Shops
description: This bot will buy all items in one or multiple shops and follow the logic of the by you selected mode.
tags: shops, items, buy, modes
*/
// Port of Scripts/Tools/BuyOut.cs.

import { bot, choices, defineScriptOptions, option } from "turu";
import { configEnum, Core } from "../core/CoreBots";

export enum BuyEnums {
    all = 0,
    zero_ac_only = 1,
    zero_ac_and_gold = 2,
    gold_only = 3,
}

export class BuyOut {
    buy(): void {
        const map_names = bot.config?.get<string>("map_names")?.split(",") ?? [];
        const shop_ids =
            bot.config
                ?.get<string>("shop_ids")
                ?.split(",")
                .map((id) => parseInt(id)) ?? [];
        const mode = configEnum("mode", BuyEnums, BuyEnums.all) ?? null;
        Core.logger(`User chose mode ${BuyEnums[mode]}.`);

        const bought: [id: number, name: string][] = [];
        // C#'s Zip: pairs up to the shorter list.
        for (const [map_name, shop_id] of map_names
            .slice(0, shop_ids.length)
            .map((m, i) => [m, shop_ids[i]] as const)) {
            const map = map_name === "-" ? bot.map.name : map_name;

            const shop_items = Core.getShopItems(map, shop_id);
            let i = 0;
            for (const item of shop_items) {
                i++;
                if (Core.checkInventory(item.id, undefined, { toInv: false })) {
                    Core.logger(`Already own, skipping item #${i} ${item.name}`);
                } else if (item.coins) {
                    if (mode === BuyEnums.all || (mode <= BuyEnums.zero_ac_and_gold && item.cost === 0)) {
                        Core.buyItem(map, shop_id, item.id, undefined, item.shopItemId);
                        bought.push([item.id, item.name]);
                        Core.toBank(item.name);
                    } else {
                        Core.logger(`Don't wanna buy AC, skipping item #${i} ${item.name}`);
                    }
                } else {
                    if (mode === BuyEnums.all || mode >= BuyEnums.zero_ac_and_gold) {
                        Core.buyItem(map, shop_id, item.id, undefined, item.shopItemId);
                        bought.push([item.id, item.name]);
                    } else {
                        Core.logger(`Don't wanna buy gold, skipping ${i} ${item.name}`);
                    }
                }
                Core.logger(`Processed ${i} / ${shop_items.length} ${item.name}`);
            }
        }
        Core.logger(`Bought ${bought.length} items.`);
        for (const [id, name] of bought) {
            Core.logger(`Bought item id ${id} ${name}`);
        }
    }
}

export const scriptOptions = defineScriptOptions("BuyOut", [
    option.text("map_names", "Map Names", "Map Name of Shop to load, - for default, comma to delimit", "battleon,-"),
    option.text("shop_ids", "Shop IDs", "Shop IDs to load, , to delimit", "1817,2104"),
    option.choice(
        "mode",
        "Select the mode to use",
        "Regardless of the mode you pick, the bot wont (attempt to) buy Legend-only items if you're not a Legend.\n" +
            "Select the Mode Explanation item to get more information",
        choices(BuyEnums),
        BuyEnums[BuyEnums.all],
    ),
    option.text("blank", " ", "", ""),
    option.text(
        " ",
        "Mode Explanation [all]",
        "Mode [all]: \t\tYou get all the items from shop, even non-AC ones and expensive AC ones, if any.",
        "click here",
    ),
    // C# lists option " " twice.
    // C# lists option " " twice.
    // C# lists option " " twice.
    // C# lists option "blank" twice.
]);

export default function main(): void {
    const script = new BuyOut();
    Core.setOptions();

    script.buy();

    Core.setOptions(false);
}
