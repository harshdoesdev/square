export class BoxShapeComponent {
    constructor(width, height) {
        this.type = "box";
        this.width = width;
        this.height = height;
    }
}

export class VectorComponent {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}