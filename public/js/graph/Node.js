export class Node {
    #id;
    #x;
    #y;
    #radius;
    
    constructor(id, x = 0, y = 0) {
        this.#id = id;
        this.#x = x;
        this.#y = y;
        this.#radius = 20;
    }
    
    get id() { return this.#id; }
    get x() { return this.#x; }
    get y() { return this.#y; }
    get radius() { return this.#radius; }
    
    set x(value) { this.#x = value; }
    set y(value) { this.#y = value; }
    set radius(value) { this.#radius = value; }
    
    distanceTo(x, y) {
        const dx = this.#x-x;
        const dy = this.#y-y;
        return Math.sqrt(dx*dx + dy*dy);
    }
}