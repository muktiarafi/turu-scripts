/*
name: Muddled Past
description: Completes the 'MuddledPast' quest [10789] for the selected reward(s), drops Void Soul.
tags: hollowborn, hollowborn nation, Muddled Past, void soul
*/
// Port of Scripts/Hollowborn/HollowbornNation/3MuddledPast.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreHollowborn } from "../CoreHollowborn";
import { InTheFiendsShadow, Rewards as InTheFiendsShadowRewards } from "./1InTheFiendsShadow";
import { FiendsPurgatory, Rewards } from "./2FiendsPurgatory";
import { HollowbornOblivionBlade } from "../HollowbornOblivionBlade";
import { HollowSoul } from "../materials/HollowSoul";
import { CoreNation } from "../../nation/CoreNation";
import { ShadowLegacyofNulgath } from "../../nation/various/ShadowLegacyofNulgath";

const Nation = new CoreNation();
const HB = new CoreHollowborn();
const HSoul = new HollowSoul();
const FP = new FiendsPurgatory();
const HOB = new HollowbornOblivionBlade();
const SLoN = new ShadowLegacyofNulgath();
const Adv = new CoreAdvanced();
const ITFS = new InTheFiendsShadow();

export class MuddledPast {
    doMuddledPast(QuestOnly = false): void {
        if (QuestOnly && Core.isCompletedBefore(MuddledPast.questID)) {
            Core.logger('"Muddle Past" Already complete');
            return;
        }

        if (!Core.isCompletedBefore(MuddledPast.questID)) {
            Core.logger("Completing previous quest *once*");
            FP.purgatory(Rewards.None, true);
        }

        //Get Quest Requirement
        HOB.getBlade();
        HB.hardcoreContract();

        bot.drops.add(...Core.questRewards(MuddledPast.questID));

        if (QuestOnly) {
            Core.ensureAccept(MuddledPast.questID);

            ITFS.fiendsShadow(InTheFiendsShadowRewards.None, false, true, 50);
            Adv.buyItem("tercessuinotlim", 68, "Fiend Cloak of Nulgath");
            SLoN.getSLoN();
            HSoul.getYaSoulsHeeeere(50);
            Nation.farmTaintedGem(350);
            Nation.farmDarkCrystalShard(150);
            Nation.farmDiamondofNulgath(700);
            Nation.farmGemofNulgath(150);

            Core.ensureComplete(MuddledPast.questID);
            return;
        }

        while (
            !bot.shouldExit &&
            !Core.checkInventory(Core.initializeWithRetries(() => Core.questRewards(MuddledPast.questID)))
        ) {
            Core.ensureAccept(MuddledPast.questID);

            ITFS.fiendsShadow(InTheFiendsShadowRewards.None, false, true, 50);
            Adv.buyItem("tercessuinotlim", 68, "Fiend Cloak of Nulgath");
            SLoN.getSLoN();
            HSoul.getYaSoulsHeeeere(50);
            Nation.farmTaintedGem(350);
            Nation.farmDarkCrystalShard(150);
            Nation.farmDiamondofNulgath(700);
            Nation.farmGemofNulgath(150);

            Core.ensureComplete(MuddledPast.questID);
        }
    }

    private static readonly questID = 10791;
}

export default function main(): void {
    const script = new MuddledPast();
    Core.setOptions();

    script.doMuddledPast();

    Core.setOptions(false);
}
