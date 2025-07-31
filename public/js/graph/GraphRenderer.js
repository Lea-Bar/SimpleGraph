import { DEFAULT_NODE_FONT, DEFAULT_WEIGHT_FONT } from './constants.js';

export class GraphRenderer {
    #ctx;
    #nodePadding = 10;
    
    constructor(ctx) {
        this.#ctx = ctx;
    }
    
    calculateNodeRadius(text, font) {
        this.#ctx.font = font;
        const metrics = this.#ctx.measureText(text);
        const textWidth = metrics.width;
        const textHeight = metrics.actualBoundingBoxAscent && metrics.actualBoundingBoxDescent
            ? metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
            : parseInt(font.split('px')[0]) * 1.2;
        return Math.max(textWidth, textHeight) / 2 + this.#nodePadding;
    }
    
    drawNode(node) {
        const font = DEFAULT_NODE_FONT;
        this.#ctx.font = font;
        const radius = node.radius ?? Math.max(this.#nodePadding, this.calculateNodeRadius(node.id, font));

        this.#ctx.beginPath();
        this.#ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
        this.#ctx.strokeStyle = '#2c3e50';
        this.#ctx.lineWidth = 2;
        this.#ctx.stroke();
        this.#ctx.fillStyle = '#34495e';
        this.#ctx.textAlign = 'center';
        this.#ctx.textBaseline = 'middle';
        this.#ctx.fillText(node.id, node.x, node.y);
    }
    
    drawEdge(edge, isDirected) {
        const source = edge.source;
        const target = edge.target;
        const font = DEFAULT_NODE_FONT;

        if (!source.radius) source.radius = this.calculateNodeRadius(source.id, font);
        if (!target.radius) target.radius = this.calculateNodeRadius(target.id, font);

        const baseHeadSize = 10;
        const headSize = edge.bold ? baseHeadSize * 1.4 : baseHeadSize;
        const gap = 4;

        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const ndx = dx / length;
        const ndy = dy / length;

        const startX = source.x + ndx * source.radius;
        const startY = source.y + ndy * source.radius;
        const tipX = target.x - ndx * (target.radius + gap);
        const tipY = target.y - ndy * (target.radius + gap);

        this.#ctx.beginPath();
        this.#ctx.moveTo(startX, startY);
        this.#ctx.lineTo(tipX, tipY);
        this.#ctx.strokeStyle = '#7f8c8d';
        this.#ctx.lineWidth = edge.bold ? 4 : 2;
        this.#ctx.stroke();

        if (isDirected) {
            const angle = Math.atan2(dy, dx);
            this.#ctx.beginPath();
            this.#ctx.moveTo(tipX, tipY);
            this.#ctx.lineTo(
                tipX - headSize * Math.cos(angle - Math.PI / 6),
                tipY - headSize * Math.sin(angle - Math.PI / 6)
            );
            this.#ctx.lineTo(
                tipX - headSize * Math.cos(angle + Math.PI / 6),
                tipY - headSize * Math.sin(angle + Math.PI / 6)
            );
            this.#ctx.closePath();
            this.#ctx.lineWidth = edge.bold ? 4 : 2;
            this.#ctx.strokeStyle = '#7f8c8d';
            this.#ctx.stroke();
            this.#ctx.fillStyle = '#7f8c8d';
            this.#ctx.fill();
        }

        if (edge.weight !== null) {
            const midX = (startX + tipX) / 2;
            const midY = (startY + tipY) / 2;
            const offsetX = -ndy * 15;
            const offsetY = ndx * 15;
            this.#ctx.font = DEFAULT_WEIGHT_FONT;
            const textWidth = this.#ctx.measureText(edge.weight).width;
            this.#ctx.fillStyle = '#ecf0f1';
            this.#ctx.fillRect(
                midX + offsetX - textWidth / 2 - 2,
                midY + offsetY - 10,
                textWidth + 4,
                20
            );
            this.#ctx.fillStyle = '#2c3e50';
            this.#ctx.font = DEFAULT_WEIGHT_FONT;
            this.#ctx.textAlign = 'center';
            this.#ctx.textBaseline = 'middle';
            this.#ctx.fillText(edge.weight, midX + offsetX, midY + offsetY);
        }
    }
    
    clear(canvas) {
        this.#ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}
