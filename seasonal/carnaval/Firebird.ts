/*
name: Firebird
description: Completes Fausto's Quests in firebird.
tags: carnaval, firebird, fausto, seasonal, story
*/
// Port of Scripts/Seasonal/Carnaval/Firebird.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";
import { TerraDeFesta } from "./TerraDeFesta";

const Story = new CoreStory();
const TDF = new TerraDeFesta();

export class Firebird {
    storyline(): void {
        if (Core.isCompletedBefore(5721) || !Core.isSeasonalMapActive("firebird")) {
            return;
        }

        TDF.storyline();

        Story.preLoad(this.storyline);

        //Turn Off the Heat (5711)
        Story.killQuest(5711, "firebird", "Flaming Dancer");

        //One Man's Trash... (5712)
        Story.killQuest(5712, "firebird", "Lantern");

        //Some Fiddling and the Right Spells (5713)
        if (!Story.questProgression(5713)) {
            Core.ensureAccept(5713);
            Core.huntMonster("terradefesta", "GreenRat", "Green Fur", 8);
            Core.huntMonster("terradefesta", "Crow", "Crow Egg", 5);
            Core.huntMonster("terradefesta", "Baron Sunday", "Voodoo Dust", 1);
            Core.ensureComplete(5713);
        }

        //I Need More Time (5714)
        if (!Story.questProgression(5714)) {
            Core.ensureAccept(5714);
            Core.huntMonster("firebird", "Fire Elemental", "Elemental Out", 6);
            Core.huntMonster("firebird", "Phoenix", "Phoenix Out", 6);
            Core.ensureComplete(5714);
        }

        //Trapped Flames (5715)
        Story.mapItemQuest(5715, "firebird", 5156, 10);

        //Get Inside! (5716)
        Story.killQuest(5716, "firebird", "Flame Imp");

        //Where There is Smoke... (5717)
        Story.mapItemQuest(5717, "firebird", 5157);

        //Through the Flames (5718)
        if (!Story.questProgression(5718)) {
            Core.ensureAccept(5718);
            Core.huntMonster("carnaval", "Mulher de Branco", "Fireproof Hide", 5);
            Core.huntMonster("carnaval", "Boiuna", "Black Scales", 7);
            Core.ensureComplete(5718);
        }

        //Battling the Inferno (5719)
        Story.killQuest(5719, "firebird", "Belo Passaro");

        //Ultra Belo Battle (5721)
        Core.equipClass(ClassType.Solo);
        Story.killQuest(5721, "firebird", "Ultra Belo");
    }
}

export default function main(): void {
    const script = new Firebird();
    Core.setOptions();

    script.storyline();
    Core.setOptions(false);
}
