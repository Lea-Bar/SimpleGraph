import { Node } from './Node.js';
import { Edge } from './Edge.js';

export class Graph {
    #nodes;
    #edges;
    
    constructor() {
        this.#nodes = new Map();
        this.#edges = [];
    }
    
    get nodes() { return this.#nodes; }
    get edges() { return this.#edges; }
    
    addNode(id, x = 0, y = 0) {
        if (!this.#nodes.has(id)) {
            this.#nodes.set(id, new Node(id, x, y));
        }
        return this.#nodes.get(id);
    }
    
    addEdge(sourceId, targetId, weight = null) {
        const sourceNode = this.getNode(sourceId) || this.addNode(sourceId);
        const targetNode = this.getNode(targetId) || this.addNode(targetId);
        
        const edge = new Edge(sourceNode, targetNode, weight);
        this.#edges.push(edge);
        return edge;
    }
    
    getNode(id) {
        return this.#nodes.get(id);
    }
    
    clear() {
        this.#nodes.clear();
        this.#edges = [];
    }
    
    parse(text) {
        this.clear();
        
        text.split('\n').forEach(line => {
            line = line.trim();
            if (!line) return;
            
            const parts = line.split(/\s+/);
            if (parts.length >= 2) {
                const sourceId = parts[0];
                const targetId = parts[1];
                const weight = parts.length > 2 ? parts[2] : null;
                
                this.addEdge(sourceId, targetId, weight);
            }
        });
    }
    
    calculateLayout(canvasWidth, canvasHeight) {
        if (this.#nodes.size === 0) return;
        
        const spacing = 120;
        const nodeArray = Array.from(this.#nodes.values());
        const cols = Math.ceil(Math.sqrt(nodeArray.length));
        const rows = Math.ceil(nodeArray.length/cols);
        
        const totalWidth = cols*spacing;
        const totalHeight = rows*spacing;
        
        const offsetX = (canvasWidth-totalWidth)/2 + spacing/2;
        const offsetY = (canvasHeight-totalHeight)/2 + spacing/2;
        
        nodeArray.forEach((node, index) => {
            const row = Math.floor(index/cols);
            const col = index%cols;
            node.x = offsetX+col*spacing;
            node.y = offsetY+row*spacing;
        });
    }
    
    findNodeAt(x, y) {
        for (const node of this.#nodes.values()) {
            if (node.distanceTo(x, y) <= node.radius) {
                return node;
            }
        }
        return null;
    }
    findEdgeAt(x, y) {
        const threshold = 6;
        for (const edge of this.#edges) {
            const { source: src, target: tgt } = edge;
            const dx = tgt.x - src.x;
            const dy = tgt.y - src.y;
            const dist = Math.hypot(dx, dy);
            if (!dist) continue;
            const ndx = dx / dist;
            const ndy = dy / dist;
            const startX = src.x + ndx * src.radius;
            const startY = src.y + ndy * src.radius;
            const endX = tgt.x - ndx * tgt.radius;
            const endY = tgt.y - ndy * tgt.radius;
            const px = x - startX;
            const py = y - startY;
            const proj = px * (endX - startX) + py * (endY - startY);
            const len2 = (endX - startX)**2 + (endY - startY)**2;
            if (proj < 0 || proj > len2) continue;
            const projX = startX + (proj / len2) * (endX - startX);
            const projY = startY + (proj / len2) * (endY - startY);
            if (Math.hypot(x - projX, y - projY) < threshold) return edge;
        }
        return null;
    }
}