import { Graph } from './Graph.js';
import { GraphRenderer } from './GraphRenderer.js';
import { GraphSaver } from './save/GraphSaver.js';

export class GraphViewer {
    #canvas;
    #ctx;
    #editor;
    #graphTypeBtn;
    #graph;
    #renderer;
    #isDirected;
    #updateTimer;
    #isDragging;
    #draggedNode;
    #saveBtn;
    #graphSaver;
    
    constructor(canvasId, editorId, graphTypeId, saveBtnId) {
        this.#canvas = document.getElementById(canvasId);
        this.#ctx = this.#canvas.getContext('2d');
        this.#editor = document.getElementById(editorId);
        this.#graphTypeBtn = document.getElementById(graphTypeId);
        this.#saveBtn =  document.getElementById(saveBtnId);
        this.#graph = new Graph();
        this.#renderer = new GraphRenderer(this.#ctx);
        this.#graphSaver = new GraphSaver(this.#graph, this.#ctx, this.#canvas);
        this.#isDirected = true;
        this.#updateTimer = null;
        this.#isDragging = false;
        this.#draggedNode = null;
        
        this.#init();
    }
    
    get isDirected() { return this.#isDirected; }
    set isDirected(value) { this.#isDirected = value; }
    
    #init() {
        this.#graphTypeBtn.addEventListener("click", () => this.#toggleGraphType());
        this.#editor.addEventListener("input", () => this.#handleTextInput());
        this.#canvas.addEventListener('mousedown', (e) => this.#startDrag(e));
        this.#canvas.addEventListener('mousemove', (e) => this.#drag(e));
        this.#canvas.addEventListener('mouseup', () => this.#endDrag());
        this.#canvas.addEventListener('mouseleave', () => this.#endDrag());
        this.#saveBtn.addEventListener('click', () => this.#graphSaver.downloadImage());
        
        this.drawGraph();
    }
    
    #toggleGraphType() {
        this.#isDirected = !this.#isDirected;
        this.#graphTypeBtn.textContent = this.#isDirected ? "Directed" : "Undirected";
        this.drawGraph();
    }
    
    #handleTextInput() {
        if (this.#updateTimer) {
            clearTimeout(this.#updateTimer);
        }
        this.#updateTimer = setTimeout(() => this.drawGraph(), 500);
    }
    
    #startDrag(e) {
        const rect = this.#canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        this.#draggedNode = this.#graph.findNodeAt(mouseX, mouseY);
        if (this.#draggedNode) {
            this.#isDragging = true;
        }
    }
    
    #drag(e) {
        if (!this.#isDragging || !this.#draggedNode) return;
        const rect = this.#canvas.getBoundingClientRect();
        const mouseX = e.clientX-rect.left;
        const mouseY = e.clientY-rect.top;
        this.#draggedNode.x = mouseX;
        this.#draggedNode.y = mouseY;
        
        this.drawGraph(false);
    }
    
    #endDrag() {
        this.#isDragging = false;
        this.#draggedNode = null;
    }
    
    drawGraph(recalculatePositions = true) {
        this.#renderer.clear(this.#canvas);
        if(recalculatePositions){
            this.#graph.parse(this.#editor.value);
        }

        if (this.#graph.nodes.size === 0) return;

        if (recalculatePositions) {
            this.#graph.calculateLayout(this.#canvas.width, this.#canvas.height);
        }
        
        this.#graph.edges.forEach(edge => {
            this.#renderer.drawEdge(edge, this.#isDirected);
        });
        
        this.#graph.nodes.forEach(node => {
            this.#renderer.drawNode(node);
        });
    }
}
