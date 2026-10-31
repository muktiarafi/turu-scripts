/*
name: Akiba New Year DoAll
description: Completes all of the akiba new year quests
tags: seasonal, yokai, akibacny, akiba new year, story, bingwen, fausto, lengjing, senlin-mas, zhu, yokaihunt, ladyluna
*/
// Port of Scripts/Seasonal/AkibaNewYear/AkibaNewYear0DoAll.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { Bingwen } from "./Bingwen";
import { LadyLua } from "./LadyLua";
import { Parades } from "./Parades";
import { SenlinMas } from "./SenlinMas";
import { YokaiHunt } from "./YokaiHunt";
import { Zhu } from "./Zhu";

const bingwen = new Bingwen();
const ladyLua = new LadyLua();
const parades = new Parades();
const yokaiHunt = new YokaiHunt();
const zhu = new Zhu();
const senlinMas = new SenlinMas();

export class AkibaNewYear0DoAll {
    doAll(): void {
        bingwen.storyline();
        ladyLua.storyline();
        parades.storyline();
        yokaiHunt.doAll();
        zhu.storyline();
        senlinMas.storyline();
    }
}

export default function main(): void {
    const script = new AkibaNewYear0DoAll();
    Core.setOptions();

    script.doAll();

    Core.setOptions(false);
}
