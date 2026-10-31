/*
name: Lucky Day Shamrock Fair Merge
description: This bot will farm the items belonging to the selected mode for the Lucky Day Shamrock Fair Merge [256] in /rainbow
tags: lucky, day, shamrock, fair, merge, rainbow, simple, celtic, three, leaf, clover, sneevos, mallet, bucket, o, gold, pot, pet, prismatic, cats, tail, mogorahilly, whack, hammer, sneevo, clown, box, head, shy, mog, heavy, william, sneevil, moglin, wallace, caledonia, chopper, shamrockin, scythe, caster, wrap, broadsword, on, your, back, destroyer, emerald, intricacy, cutthroat, double, claymore, celts, lycaena, wings, kellys, charm, viridian, twist, fortune, bringer, kismets, edge, malachite, cutter, fortunes, protector, luckee, golden, cleaver, evolved, leprechaun, luckiest, lorikeet, feathers, leprechauns, curse, scrooge, mcluck, paddle, pain, knight, knights, unicorn, noble, lady, lord, cane, rainbows, hunter, mace, reavers, bow
*/
// Port of Scripts/Seasonal/LuckyDay/LuckyDayShamrockFairMerge.cs.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreDailies } from "../../core/CoreDailies";

const Daily = new CoreDailies();
const Adv = new CoreAdvanced();

export class LuckyDayShamrockFairMerge {
    // [Can Change] This should only be changed by the author.
    //              If true, it will not stop the script if the default case triggers and the user chose to only get mats
    private dontStopMissingIng = false;

    buyAllMerge(
        buyOnlyThis: string | null = null,
        buyMode: mergeOptionsEnum | null = null,
        // C# passes it on to StartBuyAllMerge, which never reads it.
        _shopItemID = 0,
    ): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
            const quant = Adv.externalQuant;
            if (req == null) {
                Core.logger("req is NULL");
                return;
            }

            if (req.name === "Luck Clover") {
                if (!Daily.checkDailyv2(Core.checkInventory(971) ? 1761 : 1759)) {
                    Core.logger(
                        `Luck Clover Daily unavailable ${(bot.inventory.items.concat(...bot.bank.items).find((x) => x?.id === 971) ?? null)?.quantity ?? 0}/${quant}`,
                    );
                    return;
                }
            }

            switch (req.name) {
                default: {
                    const shouldStop = !Adv.matsOnly || !this.dontStopMissingIng;
                    Core.logger(
                        `The bot hasn't been taught how to get ${req.name}.` +
                            (shouldStop ? " Please report the issue." : " Skipping"),
                        undefined,
                        { messageBox: shouldStop, stopBot: shouldStop },
                    );
                    break;
                }
                //#endregion
                case "Golden Ticket":
                    Core.farmingLogger(req.name, quant);
                    Core.join("luck");
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        if (bot.map.name !== "luck") {
                            Core.join("luck");
                        }

                        Core.sendPackets("%xt%zm%getMapItem%10173%101%");
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Lucky Clover":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (
                        !bot.shouldExit &&
                        !Core.checkInventory(req.name, quant) &&
                        Daily.checkDailyv2(Core.checkInventory(971) ? 1761 : 1759)
                    ) {
                        Core.ensureAccept(Core.checkInventory(971) ? 1761 : 1759);
                        Core.huntMonster("rainbow", "Lucky Harms", "Clover Leaves");
                        Core.ensureComplete(Core.checkInventory(971) ? 1761 : 1759);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    if (!Core.checkInventory(req.name, quant)) {
                        Core.logger(`not enough ${req.name}. Run this again tomarrow!`);
                        break;
                    }
                    break;
                case "Rainbow Shard":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(1758);
                    Core.killMonster("rainbow", "Well", "Left", "Rainbow Rat", req.name, quant, {
                        isTemp: false,
                        log: false,
                    });
                    bot.wait.forPickup(req.name);
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("rainbow") || !Core.isSeasonalMapActive("luck")) {
            return;
        }

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("rainbow", 256, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "34273",
            "Simple Celtic Dagger",
            'Mode: [select] only\nShould the bot buy "Simple Celtic Dagger" ?',
            false,
        ),
        option.bool(
            "34278",
            "Three Leaf Clover",
            'Mode: [select] only\nShould the bot buy "Three Leaf Clover" ?',
            false,
        ),
        option.bool(
            "34277",
            "Snee-Vo's Mallet",
            'Mode: [select] only\nShould the bot buy "Snee-Vo\'s Mallet" ?',
            false,
        ),
        option.bool("34292", "Bucket O' Gold", 'Mode: [select] only\nShould the bot buy "Bucket O\' Gold" ?', false),
        option.bool("34302", "Pot of Gold Pet", 'Mode: [select] only\nShould the bot buy "Pot of Gold Pet" ?', false),
        option.bool(
            "34305",
            "Prismatic Cat's Tail",
            'Mode: [select] only\nShould the bot buy "Prismatic Cat\'s Tail" ?',
            false,
        ),
        option.bool("34254", "Mog-O'Rahilly", 'Mode: [select] only\nShould the bot buy "Mog-O\'Rahilly" ?', false),
        option.bool("34279", "Whack O' Mallet", 'Mode: [select] only\nShould the bot buy "Whack O\' Mallet" ?', false),
        option.bool("34276", "Lucky Hammer", 'Mode: [select] only\nShould the bot buy "Lucky Hammer" ?', false),
        option.bool(
            "34258",
            "Snee-Vo the Clown",
            'Mode: [select] only\nShould the bot buy "Snee-Vo the Clown" ?',
            false,
        ),
        option.bool("34259", "Box Head", 'Mode: [select] only\nShould the bot buy "Box Head" ?', false),
        option.bool("34256", "Shy Mog", 'Mode: [select] only\nShould the bot buy "Shy Mog" ?', false),
        option.bool("34270", "Heavy Celtic Axe", 'Mode: [select] only\nShould the bot buy "Heavy Celtic Axe" ?', false),
        option.bool("34257", "William Sneevil", 'Mode: [select] only\nShould the bot buy "William Sneevil" ?', false),
        option.bool("34255", "Moglin Wallace", 'Mode: [select] only\nShould the bot buy "Moglin Wallace" ?', false),
        option.bool(
            "34268",
            "Sword of Caledonia",
            'Mode: [select] only\nShould the bot buy "Sword of Caledonia" ?',
            false,
        ),
        option.bool("34261", "Clover Chopper", 'Mode: [select] only\nShould the bot buy "Clover Chopper" ?', false),
        option.bool(
            "34281",
            "Shamrockin' Scythe",
            'Mode: [select] only\nShould the bot buy "Shamrockin\' Scythe" ?',
            false,
        ),
        option.bool("34287", "Celtic Caster", 'Mode: [select] only\nShould the bot buy "Celtic Caster" ?', false),
        option.bool(
            "34298",
            "Celtic Caster Wrap",
            'Mode: [select] only\nShould the bot buy "Celtic Caster Wrap" ?',
            false,
        ),
        option.bool(
            "34294",
            "Celtic Caster Hood",
            'Mode: [select] only\nShould the bot buy "Celtic Caster Hood" ?',
            false,
        ),
        option.bool(
            "34300",
            "Lucky Broadsword on your Back",
            'Mode: [select] only\nShould the bot buy "Lucky Broadsword on your Back" ?',
            false,
        ),
        option.bool("34289", "Celtic Destroyer", 'Mode: [select] only\nShould the bot buy "Celtic Destroyer" ?', false),
        option.bool(
            "34295",
            "Celtic Destroyer Helm",
            'Mode: [select] only\nShould the bot buy "Celtic Destroyer Helm" ?',
            false,
        ),
        option.bool(
            "34282",
            "Emerald Intricacy Staff",
            'Mode: [select] only\nShould the bot buy "Emerald Intricacy Staff" ?',
            false,
        ),
        option.bool("34288", "Celtic Cutthroat", 'Mode: [select] only\nShould the bot buy "Celtic Cutthroat" ?', false),
        option.bool(
            "34293",
            "Celtic Cutthroat Hood",
            'Mode: [select] only\nShould the bot buy "Celtic Cutthroat Hood" ?',
            false,
        ),
        option.bool("34274", "Double RainBow", 'Mode: [select] only\nShould the bot buy "Double RainBow" ?', false),
        option.bool(
            "34260",
            "Claymore of the Celts",
            'Mode: [select] only\nShould the bot buy "Claymore of the Celts" ?',
            false,
        ),
        option.bool(
            "34304",
            "Lucky Lycaena Wings",
            'Mode: [select] only\nShould the bot buy "Lucky Lycaena Wings" ?',
            false,
        ),
        option.bool(
            "34284",
            "Kelly's Charm Staff",
            'Mode: [select] only\nShould the bot buy "Kelly\'s Charm Staff" ?',
            false,
        ),
        option.bool(
            "34269",
            "Viridian Twist Sword",
            'Mode: [select] only\nShould the bot buy "Viridian Twist Sword" ?',
            false,
        ),
        option.bool("34262", "Fortune Bringer", 'Mode: [select] only\nShould the bot buy "Fortune Bringer" ?', false),
        option.bool("34265", "Kismet's Edge", 'Mode: [select] only\nShould the bot buy "Kismet\'s Edge" ?', false),
        option.bool("34266", "Malachite Cutter", 'Mode: [select] only\nShould the bot buy "Malachite Cutter" ?', false),
        option.bool(
            "34264",
            "Fortune's Protector",
            'Mode: [select] only\nShould the bot buy "Fortune\'s Protector" ?',
            false,
        ),
        option.bool("34301", "Luckee", 'Mode: [select] only\nShould the bot buy "Luckee" ?', false),
        option.bool(
            "34280",
            "Golden Clover Cleaver",
            'Mode: [select] only\nShould the bot buy "Golden Clover Cleaver" ?',
            false,
        ),
        option.bool(
            "34283",
            "Golden Shamrock Staff",
            'Mode: [select] only\nShould the bot buy "Golden Shamrock Staff" ?',
            false,
        ),
        option.bool(
            "34286",
            "Evolved Leprechaun Armor",
            'Mode: [select] only\nShould the bot buy "Evolved Leprechaun Armor" ?',
            false,
        ),
        option.bool("34306", "Shamrock Cape", 'Mode: [select] only\nShould the bot buy "Shamrock Cape" ?', false),
        option.bool("34303", "Lucky Gold Cape", 'Mode: [select] only\nShould the bot buy "Lucky Gold Cape" ?', false),
        option.bool(
            "34299",
            "Luckiest Lorikeet Feathers",
            'Mode: [select] only\nShould the bot buy "Luckiest Lorikeet Feathers" ?',
            false,
        ),
        option.bool(
            "34272",
            "Leprechaun's Curse",
            'Mode: [select] only\nShould the bot buy "Leprechaun\'s Curse" ?',
            false,
        ),
        option.bool(
            "34271",
            "Lucky Emerald Cutter",
            'Mode: [select] only\nShould the bot buy "Lucky Emerald Cutter" ?',
            false,
        ),
        option.bool("34291", "Scrooge McLuck", 'Mode: [select] only\nShould the bot buy "Scrooge McLuck" ?', false),
        option.bool("34267", "Sword McLuck", 'Mode: [select] only\nShould the bot buy "Sword McLuck" ?', false),
        option.bool(
            "34275",
            "Celtic Paddle of Pain",
            'Mode: [select] only\nShould the bot buy "Celtic Paddle of Pain" ?',
            false,
        ),
        option.bool("34285", "Lucky Charm", 'Mode: [select] only\nShould the bot buy "Lucky Charm" ?', false),
        option.bool(
            "34307",
            "Sword McLuck Cape",
            'Mode: [select] only\nShould the bot buy "Sword McLuck Cape" ?',
            false,
        ),
        option.bool(
            "34358",
            "Scrooge McLuck Helm",
            'Mode: [select] only\nShould the bot buy "Scrooge McLuck Helm" ?',
            false,
        ),
        option.bool(
            "11460",
            "Evolved Leprechaun",
            'Mode: [select] only\nShould the bot buy "Evolved Leprechaun" ?',
            false,
        ),
        option.bool("34290", "Lucky Knight", 'Mode: [select] only\nShould the bot buy "Lucky Knight" ?', false),
        option.bool(
            "34296",
            "Lucky Knight's Helm",
            'Mode: [select] only\nShould the bot buy "Lucky Knight\'s Helm" ?',
            false,
        ),
        option.bool(
            "34297",
            "Lucky Rainbow Unicorn Hat",
            'Mode: [select] only\nShould the bot buy "Lucky Rainbow Unicorn Hat" ?',
            false,
        ),
        option.bool("34263", "Fortune's Blade", 'Mode: [select] only\nShould the bot buy "Fortune\'s Blade" ?', false),
        option.bool("43129", "Noble Leprechaun", 'Mode: [select] only\nShould the bot buy "Noble Leprechaun" ?', false),
        option.bool(
            "43131",
            "Leprechaun Lady Helm",
            'Mode: [select] only\nShould the bot buy "Leprechaun Lady Helm" ?',
            false,
        ),
        option.bool(
            "43130",
            "Leprechaun Lord Helm",
            'Mode: [select] only\nShould the bot buy "Leprechaun Lord Helm" ?',
            false,
        ),
        option.bool(
            "43132",
            "Noble Leprechaun Wrap",
            'Mode: [select] only\nShould the bot buy "Noble Leprechaun Wrap" ?',
            false,
        ),
        option.bool(
            "43133",
            "Noble Leprechaun's Cane",
            'Mode: [select] only\nShould the bot buy "Noble Leprechaun\'s Cane" ?',
            false,
        ),
        option.bool("43134", "Cape of Rainbows", 'Mode: [select] only\nShould the bot buy "Cape of Rainbows" ?', false),
        option.bool(
            "53763",
            "Celtic Hunter Staff",
            'Mode: [select] only\nShould the bot buy "Celtic Hunter Staff" ?',
            false,
        ),
        option.bool(
            "53761",
            "Celtic Hunter Mace",
            'Mode: [select] only\nShould the bot buy "Celtic Hunter Mace" ?',
            false,
        ),
        option.bool(
            "53762",
            "Celtic Hunter Reavers",
            'Mode: [select] only\nShould the bot buy "Celtic Hunter Reavers" ?',
            false,
        ),
        option.bool(
            "53760",
            "Celtic Hunter Bow",
            'Mode: [select] only\nShould the bot buy "Celtic Hunter Bow" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: LuckyDayShamrockFairMerge.select,
});

export default function main(): void {
    const script = new LuckyDayShamrockFairMerge();
    Core.bankingBlackList.push("Golden Ticket", "Lucky Clover", "Rainbow Shard");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
