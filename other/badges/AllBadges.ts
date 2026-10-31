/*
name: Get All Badges
description: This will get all badges in the game.
tags: badge, complete, all
*/
// Port of Scripts/Other/Badges/AllBadges.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { BirthdaySavior } from "./6thBirthdaySavior";
import { BattleBabysitter } from "./BattleBabysitter";
import { BattleConVIP } from "./BattleConVIP";
import { CelestialArenaChampion } from "./CelestialChampion";
import { ChaosPuppetMaster } from "./ChaosPuppetMaster";
import { Committed } from "./Committed";
import { ConZombieSlayer } from "./ConZombieSlayer";
import { CornelisRebornbadge } from "./CornelisReborn";
import { CtrlAltDelMemberBadge } from "./CtrlAltDelMemberBadge";
import { DerpMoosefishBadge } from "./DerpMoosefishBadge";
import { DesolichFreed } from "./DesolichFreed";
import { GoldenLaurel } from "./GoldenLaurel";
import { GravelynsWarrior } from "./GravelynsWarrior";
import { HordeZombieSLAYER } from "./HordeZombieSLAYER";
import { JusticeSquadBadge } from "./JusticeSquad";
import { LordOfTheWeddingRing } from "./LordOfTheWeddingRing";
import { MoglinPunt } from "./MoglinPunter";
import { MummySlayerAndCruxShadowsDefender } from "./MummySlayerAndCruxShadowsDefender";
import { RavenlossWarAndChampion } from "./RavenlossWarAndChampion";
import { ShadowVaultChampion } from "./ShadowVaultChampion";
import { SkyPirateBadge } from "./SkyPirateSlayerBadge";
import { StoneCold } from "./StoneCold";
import { StoryArcBadge } from "./StoryARC";
import { TableFlipper } from "./TableFlipper";
import { ThiefofChaosBadge } from "./ThiefofChaos";
import { UltraCarnaxBadge } from "./UltraCarnax";
import { VoidHighlordBadge } from "./VoidHighlordBadge";
import { WorldCup } from "./WorldCup";
import { YokaiAscension } from "./YokaiAscension";
import { YouMadBroBadge } from "./YouMadBroBadge";
import { ZorbakPunt } from "./ZorbakPunter";
import { FrostvaleBadges } from "../../seasonal/frostvale/FrostvaleBadges";

const CRB = new CornelisRebornbadge();
const DMF = new DerpMoosefishBadge();
const SPB = new SkyPirateBadge();
const YMBB = new YouMadBroBadge();
const MPB = new MoglinPunt();
const ZPB = new ZorbakPunt();
const CAD = new CtrlAltDelMemberBadge();
const BS = new BirthdaySavior();
const BB = new BattleBabysitter();
const BCV = new BattleConVIP();
const CAC = new CelestialArenaChampion();
const CPM = new ChaosPuppetMaster();
const C = new Committed();
const CZS = new ConZombieSlayer();
const DF = new DesolichFreed();
const GL = new GoldenLaurel();
const GW = new GravelynsWarrior();
const HZS = new HordeZombieSLAYER();
const LOTWR = new LordOfTheWeddingRing();
const MSACSD = new MummySlayerAndCruxShadowsDefender();
const RWAC = new RavenlossWarAndChampion();
const SVC = new ShadowVaultChampion();
const SC = new StoneCold();
const TF = new TableFlipper();
const VHL = new VoidHighlordBadge();
const SA = new StoryArcBadge();
const JS = new JusticeSquadBadge();
const ToC = new ThiefofChaosBadge();
const UC = new UltraCarnaxBadge();
const G = new WorldCup();
const FV = new FrostvaleBadges();
const YA = new YokaiAscension();

export class AllBadges {
    doAll(): void {
        CRB.badge();
        SPB.badge();
        MPB.badge();
        G.badge();
        ZPB.badge();
        CAD.badge();
        BS.badge();
        BB.badge();
        BCV.badge();
        CAC.badge();
        CPM.badge();
        C.badge();
        CZS.badge();
        DF.badge();
        GL.badge();
        GW.badge();
        HZS.badge();
        LOTWR.badge();
        MSACSD.badge();
        RWAC.badge();
        SVC.badge();
        SC.badge();
        TF.badge();
        DMF.badge();
        SA.badge();
        JS.badge();
        ToC.badge();
        UC.badge();
        G.badge();
        FV.badges();
        YMBB.badge(true, true);
        VHL.badge();
        YA.badge();
        //add more as they are made.
    }
}

export default function main(): void {
    const script = new AllBadges();
    Core.setOptions();

    script.doAll();

    Core.setOptions(false);
}
