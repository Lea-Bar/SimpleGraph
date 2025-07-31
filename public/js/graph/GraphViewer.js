import { Graph } from './Graph.js';
import { GraphRenderer } from './GraphRenderer.js';
import { FormatManager } from './save/manager/FormatManager.js';
import { debounce } from './utils/Debounce.js';
import { DEFAULT_NODE_FONT } from './constants.js';

export class GraphViewer {
    #canvas;
    #ctx;
    #editor;
    #graphTypeBtn;
    #graph;
    #renderer;
    #isDirected;
    #isDragging;
    #draggedNode;
    #saveBtn;
    #formatManager;
    
    constructor(canvasId, editorId, graphTypeId, saveBtnId) {
        this.#canvas = document.getElementById(canvasId);
        this.#ctx = this.#canvas.getContext('2d');
        this.#editor = document.getElementById(editorId);
        this.#graphTypeBtn = document.getElementById(graphTypeId);
        this.#saveBtn = document.getElementById(saveBtnId);
        this.#graph = new Graph();
        this.#renderer = new GraphRenderer(this.#ctx);
        this.#formatManager = new FormatManager();
        this.#isDirected = true;
        this.#isDragging = false;
        this.#draggedNode = null;
        
        this.#init();
    }
    
    #init() {
        this.#formatManager.registerAllFormats();
        this.#graphTypeBtn.addEventListener('click', () => this.#toggleGraphType());
        this.#editor.addEventListener('input', debounce(() => this.drawGraph(), 500));
        this.#canvas.addEventListener('mousedown', (e) => this.#startDrag(e));
        this.#canvas.addEventListener('mousemove', (e) => this.#drag(e));
        this.#canvas.addEventListener('mouseup', () => this.#endDrag());
        this.#canvas.addEventListener('mouseleave', () => this.#endDrag());
        this.#canvas.addEventListener('dblclick', (e) => this.#handleEdgeDoubleClick(e));
        this.#saveBtn.addEventListener('click', () => this.#formatManager.getSaveFormat("png").export(this.#graph, this.#canvas, this.#ctx));
        
        this.drawGraph();
    }
    
    #toggleGraphType() {
        this.#isDirected = !this.#isDirected;
        this.#graphTypeBtn.textContent = this.#isDirected ? "Directed" : "Undirected";
        this.drawGraph();
    }
    
    #startDrag(e) {
        const rect = this.#canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        this.#draggedNode = this.#graph.findNodeAt(mouseX, mouseY);
        if (this.#draggedNode) this.#isDragging = true;
    }
    
    #drag(e) {
        if (!this.#isDragging || !this.#draggedNode) return;
        const rect = this.#canvas.getBoundingClientRect();
        this.#draggedNode.x = e.clientX - rect.left;
        this.#draggedNode.y = e.clientY - rect.top;
        this.drawGraph(false);
    }
    
    #endDrag() {
        this.#isDragging = false;
        this.#draggedNode = null;
    }
    
    #handleEdgeDoubleClick(e) {
        const rect = this.#canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const edge = this.#graph.findEdgeAt(mouseX, mouseY);
        if (edge) {
            edge.bold = !edge.bold;
            this.drawGraph(false);
        }
    }
    
    drawGraph(recalculatePositions = true) {
        this.#renderer.clear(this.#canvas);
        if (recalculatePositions) this.#graph.parse(this.#editor.value);
        if (this.#graph.nodes.size === 0) return;
        if (recalculatePositions) this.#graph.calculateLayout(this.#canvas.width, this.#canvas.height);

        const font = DEFAULT_NODE_FONT;
        this.#graph.nodes.forEach(node => {
            node.radius = this.#renderer.calculateNodeRadius(node.id, font);
        });

        this.#graph.edges.forEach(edge => this.#renderer.drawEdge(edge, this.#isDirected));
        this.#graph.nodes.forEach(node => this.#renderer.drawNode(node));
    }
}