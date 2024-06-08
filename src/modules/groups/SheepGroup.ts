import { Sheep } from "../Sheep";

export class SheepGroup {
    sheep: Sheep[] = [];

    addSheep(sheep: Sheep) {
        this.sheep.push(sheep);
    }

    removeSheep(sheep: Sheep) {
        const index = this.sheep.indexOf(sheep);
        this.sheep.splice(index, 1);
    }

    get amount () {
        return this.sheep.length
    }

}