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
    #formatSelect;
    #loadBtn;
    #fileInput;

    constructor(canvasId, editorId, graphTypeId, saveBtnId) {
        this.#canvas = document.getElementById(canvasId);
        this.#ctx = this.#canvas.getContext('2d');
        this.#editor = document.getElementById(editorId);
        this.#graphTypeBtn = document.getElementById(graphTypeId);
        this.#saveBtn = document.getElementById(saveBtnId);
        this.#formatSelect = document.getElementById('formatSelect');
        this.#loadBtn = document.getElementById('load');
        this.#fileInput = document.getElementById('fileInput');
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
        this.#saveBtn.addEventListener('click', () => {
            const ext = this.#formatSelect.value;
            this.#formatManager.getSaveFormat(ext).export(this.#graph, this.#canvas, this.#ctx, this.#isDirected);
        });
        this.#loadBtn.addEventListener('click', () => this.#fileInput.click());
        this.#fileInput.addEventListener('change', (e) => this.#handleFileLoad(e));

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

    async #handleFileLoad(event) {
      const file = event.target.files[0];
      if (!file) return;
      let ext = file.name.split('.').pop().toLowerCase();
      if (ext === 'dot') ext = 'gv';
      if (ext === 'csv') {
        const reader = new FileReader();
        reader.onload = () => {
          const text = reader.result;
          let content = '';
          text.split(/\r?\n/).forEach(line => {
            if (!line.trim()) return;
            const [sourceId, targetId, weightValue] = line.split(',');
            const weightTxt = weightValue || '';
            content += `${sourceId} ${targetId}${weightTxt ? ' ' + weightTxt : ''}\n`;
          });
          this.#editor.value = content;
          this.drawGraph();
        };
        reader.readAsText(file);
      } else if (ext === 'gv') {
        const reader = new FileReader();
        reader.onload = () => {
          const text = reader.result;
          let content = '';
          text.split(/\r?\n/).forEach(line => {
            const dotEntryMatch = line.match(/(\w+)\s*(->|--)\s*(\w+)(?:\s*\[label="(.*?)"])?;/);
            if (dotEntryMatch) {
              const sourceId = dotEntryMatch[1];
              const targetId = dotEntryMatch[3];
              const weightTxt = dotEntryMatch[4] || '';
              content += `${sourceId} ${targetId}${weightTxt ? ' ' + weightTxt : ''}\n`;
            }
          });
          this.#editor.value = content;
          this.drawGraph();
        };
        reader.readAsText(file);
      } else if (ext === 'yaml' || ext === 'yml') {
        const reader = new FileReader();
        reader.onload = () => {
          const text = reader.result;
          const lines = text.split(/\r?\n/);
          let parsingEdges = false;
          let parsingWedges = false;
          let content = '';
          lines.forEach(raw => {
            const line = raw.trim();
            if (!line || line.startsWith('#')) return;
            if (line.startsWith('edges:')) {
              parsingEdges = true; parsingWedges = false; return;
            }
            if (line.startsWith('wedges:')) {
              parsingWedges = true; parsingEdges = false; return;
            }
            if (parsingEdges) {
              const edgeListMatch = line.match(/^(\w+):\s*\[(.*)]/);
              if (edgeListMatch) {
                const src = edgeListMatch[1];
                edgeListMatch[2].split(',').forEach(item => {
                  const target = item.trim();
                  if (target) content += `${src} ${target}\n`;
                });
              }
            } else if (parsingWedges) {
              const weightedEdgesMatch = line.match(/^(\w+):\s*\{(.*)}/);
              if (weightedEdgesMatch) {
                const src = weightedEdgesMatch[1];
                weightedEdgesMatch[2].split(',').forEach(pair => {
                  const [target, weight] = pair.split(':').map(s => s.trim());
                  if (target && weight) content += `${src} ${target} ${weight}\n`;
                });
              }
            }
          });
          this.#editor.value = content;
          this.drawGraph();
        };
        reader.readAsText(file);
      }
      this.#fileInput.value = '';
    }
}