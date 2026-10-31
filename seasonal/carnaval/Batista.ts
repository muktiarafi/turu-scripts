/*
name: Batista's Quests
description: This script does Batista's Quests in carnaval.
tags: batista, carnaval, seasonal, story
*/
// Port of Scripts/Seasonal/Carnaval/Batista.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class Batista {
    storyline(): void {
        if (Core.isCompletedBefore(2697) || !Core.isSeasonalMapActive("carnaval")) {
            return;
        }

        Story.preLoad(this.storyline);

        //The Land of Monsters (2692)
        if (!Story.questProgression(2692)) {
            Core.ensureAccept(2692);
            Core.getMapItem(1674, 1, "carnaval");
            Core.huntMonster("carnaval", "Mapinguari", "Mapinguari Foot", 1);
            Core.ensureComplete(2692);
        }

        //Battle and the Beasts (2693)
        if (!Story.questProgression(2693)) {
            Core.ensureAccept(2693);
            Core.huntMonster("carnaval", "Mula Sem Cabeça", "Mula Sem Cabeça Defeated", 2);
            Core.huntMonster("carnaval", "Mapinguari", "Mapinguari Defeated", 2);
            Core.huntMonster("carnaval", "Cuco", "Cocu Defeated", 2);
            Core.huntMonster("carnaval", "Boiuna", "Boiúna Defeated", 2);
            Core.huntMonster("carnaval", "Mulher de Branco", "Mulher de Branco Defeated", 2);
            Core.ensureComplete(2693);
        }

        //Festooned in Feathers (2694)
        Story.killQuest(2694, "carnaval", "Boiuna");

        //Mask your Emotions (2695)
        Story.killQuest(2695, "carnaval", "Boiuna");

        //Crafting the Carranca (2696)
        if (!Story.questProgression(2696)) {
            Core.ensureAccept(2696);
            Core.getMapItem(1677, 5, "carnaval");
            Core.huntMonster("carnaval", "Mulher de Branco", "Mulher de Branco's Hair", 1);
            Core.huntMonster("carnaval", "Mula Sem Cabe\u00e7a", "Horse Tail Paint Brush", 1);
            Core.huntMonster("carnaval", "Boiuna", "Boi\u00fana Fangs", 2);
            Core.huntMonster("carnaval", "Cuco", "Cuco's Claw", 1);
            Core.ensureComplete(2696);
        }

        //Party Like a BOSS!
        Story.killQuest(2697, "carnaval", "Lobisomem");
    }
}

export default function main(): void {
    const script = new Batista();
    Core.setOptions();

    script.storyline();
    Core.setOptions(false);
}
