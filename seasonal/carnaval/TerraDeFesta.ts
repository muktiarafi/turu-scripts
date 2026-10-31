/*
name: Terra de Festa
description: Completes Frevo's Quests in terradefesta.
tags: freva, terra de festa, seasonal, carnaval, story
*/
// Port of Scripts/Seasonal/Carnaval/TerraDeFesta.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";
import { Batista } from "./Batista";

const Story = new CoreStory();
const Bat = new Batista();

export class TerraDeFesta {
    storyline(): void {
        if (Core.isCompletedBefore(3392) || !Core.isSeasonalMapActive("terradefesta")) {
            return;
        }

        Bat.storyline();

        Story.preLoad(this.storyline);

        //Frevo's Dancers Need Feathers! (3398)
        Story.killQuest(3398, "carnaval", "Cuco");

        //Dancers Need Feathers (3382)
        Story.killQuest(3382, "carnaval", "Cuco");

        //And Dolls Need Heads (3383)
        Story.killQuest(3383, "terradefesta", "GreenRat");

        //A Head Needs A Body (3384)
        if (!Story.questProgression(3384)) {
            Core.ensureAccept(3384);
            Core.huntMonster("terradefesta", "Crow", "Scrap of Fabric", 4);
            Core.huntMonster("terradefesta", "Crow", "Bundle of Straw", 4);
            Core.ensureComplete(3384);
        }

        //Bind It All Together (3385)
        Story.killQuest(3385, "carnaval", "Mulher de Branco");

        //Take 'Em Apart (3386)
        if (!Story.questProgression(3386)) {
            Core.ensureAccept(3386);
            Core.huntMonster("terradefesta", "Voodoo Doll", "Feathered Topknot", 4);
            Core.huntMonster("terradefesta", "Voodoo Doll", "Little Cloth Bodies", 4);
            Core.huntMonster("terradefesta", "Voodoo Doll", "Straw Stuffing", 4);
            Core.huntMonster("terradefesta", "Voodoo Doll", "Skully Head", 4);
            Core.ensureComplete(3386);
        }

        //Who Could It Be? (3387)
        if (!Story.questProgression(3387)) {
            Core.ensureAccept(3387);
            Core.huntMonster("terradefesta", "Party Zombie", "Seriously Bad Mojo", 1);
            Core.huntMonster("terradefesta", "Party Zombie", "A Dramatic Flair", 1);
            Core.huntMonster("terradefesta", "Party Zombie", "The Smell Of Death", 1);
            Core.huntMonster("terradefesta", "Party Zombie", "Distinctive Talisman", 1);
            Core.ensureComplete(3387);
        }

        //A Bag For A Talisman (3388)
        Story.killQuest(3388, "terradefesta", "GreenRat");

        //Their... third eyes? (3389)
        Story.killQuest(3389, "terradefesta", "Crow");

        //Hexy Ladies (3390)
        Story.killQuest(3390, "terradefesta", "Dancing Zombie");

        //Tracking Down A Baron (3391)
        if (!Story.questProgression(3391)) {
            Core.ensureAccept(3391);
            Core.huntMonster("terradefesta", "GreenRat", "Rat Guts", 4);
            Core.huntMonster("terradefesta", "Crow", "Crow Entrails", 4);
            Core.ensureComplete(3391);
        }

        //Defeat Baron Sunday (3392)
        Story.killQuest(3392, "terradefesta", "Baron Sunday");
    }
}

export default function main(): void {
    const script = new TerraDeFesta();
    Core.setOptions();

    script.storyline();
    Core.setOptions(false);
}
