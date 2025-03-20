export class GraphRenderer {
    #ctx;
    
    constructor(ctx) {
        this.#ctx = ctx;
    }
    
    drawNode(node) {
        this.#ctx.beginPath();
        this.#ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
        this.#ctx.strokeStyle = '#2c3e50';
        this.#ctx.lineWidth = 2;
        this.#ctx.stroke();
        
        this.#ctx.fillStyle = '#34495e';
        this.#ctx.font = '15px Trebuchet MS';
        this.#ctx.textAlign = 'center';
        this.#ctx.textBaseline = 'middle';
        this.#ctx.fillText(node.id, node.x, node.y);
    }
    
    drawEdge(edge, isDirected) {
        const source = edge.source;
        const target = edge.target;
        const nodeRadius = source.radius;
        const headSize = 10;
        
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const ndx = dx / length;
        const ndy = dy / length;
        
        const startX = source.x + ndx * nodeRadius;
        const startY = source.y + ndy * nodeRadius;
        let endX, endY;
        
        if (isDirected) {
            endX = target.x - ndx * (nodeRadius + headSize);
            endY = target.y - ndy * (nodeRadius + headSize);
        } else {
            endX = target.x - ndx * nodeRadius;
            endY = target.y - ndy * nodeRadius;
        }
        
        this.#ctx.beginPath();
        this.#ctx.moveTo(startX, startY);
        this.#ctx.lineTo(endX, endY);
        this.#ctx.strokeStyle = '#7f8c8d';
        this.#ctx.lineWidth = 2;
        this.#ctx.stroke();
        
        if (isDirected) {
            const angle = Math.atan2(dy, dx);
            this.#ctx.beginPath();
            this.#ctx.moveTo(endX, endY);
            this.#ctx.lineTo(
                endX - headSize * Math.cos(angle - Math.PI / 6),
                endY - headSize * Math.sin(angle - Math.PI / 6)
            );
            this.#ctx.lineTo(
                endX - headSize * Math.cos(angle + Math.PI / 6),
                endY - headSize * Math.sin(angle + Math.PI / 6)
            );
            this.#ctx.closePath();
            this.#ctx.fillStyle = '#7f8c8d';
            this.#ctx.fill();
        }
        
        if (edge.weight !== null) {
            const midX = (startX + endX) / 2;
            const midY = (startY + endY) / 2;
            const offsetX = -ndy * 15;
            const offsetY = ndx * 15;
            const textWidth = this.#ctx.measureText(edge.weight).width;
            this.#ctx.fillStyle = '#ecf0f1';
            this.#ctx.fillRect(midX + offsetX - textWidth/2 - 2, midY + offsetY - 10, textWidth + 4, 20);
            this.#ctx.fillStyle = '#2c3e50';
            this.#ctx.font = '14px Arial';
            this.#ctx.textAlign = 'center';
            this.#ctx.textBaseline = 'middle';
            this.#ctx.fillText(edge.weight, midX + offsetX, midY + offsetY);
        }
    }
    
    clear(canvas) {
        this.#ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}