export class Edge {
    #source;
    #target;
    #weight;
    #bold;
    
    constructor(source, target, weight = null) {
        this.#source = source;
        this.#target = target;
        this.#weight = weight;
        this.#bold = false;
    }
    
    get source() { return this.#source; }
    get target() { return this.#target; }
    get weight() { return this.#weight; }
    
    set weight(value) { this.#weight = value; }
}