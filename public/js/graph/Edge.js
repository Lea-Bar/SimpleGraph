export class Edge {
    #source;
    #target;
    #weight;
    
    constructor(source, target, weight = null) {
        this.#source = source;
        this.#target = target;
        this.#weight = weight;
    }
    
    get source() { return this.#source; }
    get target() { return this.#target; }
    get weight() { return this.#weight; }
    
    set weight(value) { this.#weight = value; }
}