/*
name: Complete All Seasonal Story
description: This will finish all of seasonal story on current month.
tags: seasonal, story, complete, all
*/
// Port of Scripts/Seasonal/AllSeasonal.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../core/CoreBots";
import { DERPBadge } from "./aprilfools/DERP!Badge";
import { MeateorHunt } from "./aprilfools/MeateorHunt";
import { MmmmMeatyQuest } from "./aprilfools/Mmmm,Meaty(or)(MeatyShard)";
import { SuperSLAYINBadge } from "./aprilfools/SuperSLAYIN'Badge(GardenQuest)";
import { CoreFrostvale } from "./frostvale/story/CoreFrostvale";
import { FezziniStory } from "./herosheartday/Fezzini";
import { LoveSpell } from "./herosheartday/LoveSpellStory";
import { WheeleOfLove } from "./herosheartday/WheelOfLove";
import { PookaStory } from "./luckyday/Pooka";
import { DarkLord } from "./maythe4th/DarkLord";
import { MurderMoon } from "./maythe4th/MurderMoonStory";
import { CoreMogloween } from "./mogloween/CoreMogloween";
import { VampireLord } from "./mogloween/VampireLord(Class)";
import { CoreDageBirthday } from "./staffbirthdays/dagetheevil/CoreDageBirthday";
import { StarFestival } from "./starfestival/StarFestival";
import { BlazingBeachStory } from "./summerbreak/BlazingBeach";
import { BurningBeachStory } from "./summerbreak/BurningBeach";
import { AluteaNursery } from "./talklikeapirateday/AluteaNursery";
import { BlazeBeard } from "./talklikeapirateday/BlazeBeardStory";
import { CelestialPirateCommander, CPCReward } from "./talklikeapirateday/CelestialPirateCommander[PollyRogers]";
import { CetoleonWarStory } from "./talklikeapirateday/CetoleonWarStory";
import { DragonCapitalStory } from "./talklikeapirateday/DragonCapitalStory";
import { DragonPirateStory } from "./talklikeapirateday/DragonPirateStory";
import { HeartOfTheSeaStory } from "./talklikeapirateday/HeartOfTheSeaStory";
import { KaijuWar } from "./talklikeapirateday/KaijuWar";
import { LowTideStory } from "./talklikeapirateday/LowTideStory";
import { DageRecruitStory } from "../story/legion/DageRecruit";
import { CoreSummer } from "../story/summer2015adventuremap/CoreSummer";

const Derp = new DERPBadge();
const meateorHunt = new MeateorHunt();
const SSB = new SuperSLAYINBadge();
const Frostvale = new CoreFrostvale();
const Fezzini = new FezziniStory();
const loveSpell = new LoveSpell();
const wheeleOfLove = new WheeleOfLove();
const Pooka = new PookaStory();
const Meaty = new MmmmMeatyQuest();
const darkLord = new DarkLord();
const murderMoon = new MurderMoon();
const coreMogloween = new CoreMogloween();
const VPL = new VampireLord();
const DageRecruit = new DageRecruitStory();
const Dage = new CoreDageBirthday();
const starFestival = new StarFestival();
const BlazingBeach = new BlazingBeachStory();
const BurningBeach = new BurningBeachStory();
const LunaCove = new CoreSummer();
const celestialPirateCommander = new CelestialPirateCommander();
const kaijuWar = new KaijuWar();
const heartOfTheSeaStory = new HeartOfTheSeaStory();
const cetoleonWarStory = new CetoleonWarStory();
const dragonPirateStory = new DragonPirateStory();
const dragonCapitalStory = new DragonCapitalStory();
const lowTideStory = new LowTideStory();
const aluteaNursery = new AluteaNursery();
const blazeBeard = new BlazeBeard();

export class AllSeasonal {
    // public BlazingBeachMerge BlazingBeachMerge = new();

    // public CoralBeachMerge CoralBeachMerge = new();

    // public LunaCoveMerge LunaCoveMerge = new();

    seasonals(): void {
        switch (new Date(Date.now()).getMonth() + 1) {
            default:
                DageRecruit.completeDageRecruit();
                if (bot.quests.isAvailable(7713)) {
                    celestialPirateCommander.getCPC(CPCReward.All);
                }
                break;
            case 1:
                Core.logger("Starting Scripts for January");
                //insert script voids here
                Core.logger(`Scripts Finished for ${new Date(Date.now()).toLocaleString("en-US", { month: "long" })}`);
                break;
            case 2:
                Core.logger("Starting Scripts for Febuary");
                //insert script voids here
                Fezzini.fezziniScript();
                loveSpell.loveSpellScript();
                wheeleOfLove.doWheeleOfLove();
                Core.logger(`Scripts Finished for ${new Date(Date.now()).toLocaleString("en-US", { month: "long" })}`);
                break;
            case 3:
                Core.logger("Starting Scripts for March");
                //insert script voids here
                Pooka.completePooka();
                darkLord.getDL();
                murderMoon.murderMoonStory();
                Dage.doAll();
                Core.logger(`Scripts Finished for ${new Date(Date.now()).toLocaleString("en-US", { month: "long" })}`);
                break;
            case 4:
                Core.logger("Starting Scripts for April");
                //insert script voids here
                Derp.getBadge();
                meateorHunt.storyLine();
                SSB.getBadgeANDDoStory();
                Meaty.completeQuests();
                Core.logger(`Scripts Finished for ${new Date(Date.now()).toLocaleString("en-US", { month: "long" })}`);
                break;
            case 5:
                Core.logger("Starting Scripts for May");
                //insert script voids here
                Core.logger(`Scripts Finished for ${new Date(Date.now()).toLocaleString("en-US", { month: "long" })}`);
                break;
            case 6:
                Core.logger("Starting Scripts for June");
                // BeachPartyTokenItems.TokenItems();
                BlazingBeach.storyLine();
                // BlazingBeachMerge.BuyAllMerge();
                BurningBeach.storyline();
                // CoralBeachMerge.BuyAllMerge();
                LunaCove.lunaCove();
                // LunaCoveMerge.BuyAllMerge();
                // SweetSummerTreats.GetTreats();
                // UnLifeguardQuest.GetItems();
                Core.logger(`Scripts Finished for ${new Date(Date.now()).toLocaleString("en-US", { month: "long" })}`);
                break;
            case 7:
                Core.logger("Starting Scripts for July");
                Frostvale.doAll();
                // BeachPartyTokenItems.TokenItems();
                BlazingBeach.storyLine();
                // BlazingBeachMerge.BuyAllMerge();
                BurningBeach.storyline();
                // CoralBeachMerge.BuyAllMerge();
                LunaCove.lunaCove();
                // LunaCoveMerge.BuyAllMerge();
                // SweetSummerTreats.GetTreats();
                // UnLifeguardQuest.GetItems();
                starFestival.storyLine();
                Core.logger(`Scripts Finished for ${new Date(Date.now()).toLocaleString("en-US", { month: "long" })}`);
                break;
            case 8:
                Core.logger("Starting Scripts for August");
                //insert script voids here
                Frostvale.doAll();
                Core.logger(`Scripts Finished for ${new Date(Date.now()).toLocaleString("en-US", { month: "long" })}`);
                break;
            case 9:
                Core.logger("Starting Scripts for September");
                //insert script voids here
                celestialPirateCommander.getCPC(CPCReward.All);
                kaijuWar.kaijuItems();
                heartOfTheSeaStory.heartOfTheSea();
                cetoleonWarStory.cetoleonWar();
                dragonPirateStory.dragonPirate();
                dragonCapitalStory.dragonCapital();
                lowTideStory.storyline();
                aluteaNursery.doAll();
                blazeBeard.tokenQuests();
                Core.logger(`Scripts Finished for ${new Date(Date.now()).toLocaleString("en-US", { month: "long" })}`);
                break;
            case 10:
                Core.logger("Starting Scripts for October");
                coreMogloween.doAll();
                Core.logger(`Scripts Finished for ${new Date(Date.now()).toLocaleString("en-US", { month: "long" })}`);
                break;
            case 11:
                Core.logger("Starting Scripts for November");
                //insert script voids here
                VPL.getClass(false);
                Core.logger(`Scripts Finished for ${new Date(Date.now()).toLocaleString("en-US", { month: "long" })}`);
                break;
            case 12:
                Core.logger("Starting Scripts for December");
                //insert script voids here
                Frostvale.doAll();
                Core.logger(`Scripts Finished for ${new Date(Date.now()).toLocaleString("en-US", { month: "long" })}`);
                break;
        }
    }
}

export default function main(): void {
    const script = new AllSeasonal();
    Core.setOptions();

    script.seasonals();

    Core.setOptions(false);
}
