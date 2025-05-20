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
        const font = '15px Trebuchet MS';
        this.#ctx.font = font;
        const radius = Math.max(this.#nodePadding,this.calculateNodeRadius(node.id, font));
        node.radius = radius;
        this.#ctx.beginPath();
        this.#ctx.arc(node.x, node.y, radius, 0, 2*Math.PI);
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
        if (!source.radius) {
            const font = '15px Trebuchet MS';
            source.radius = this.calculateNodeRadius(source.id, font);
        }
        if (!target.radius) {
            const font = '15px Trebuchet MS';
            target.radius = this.calculateNodeRadius(target.id, font);
        }

        const headSize = 10;
        
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const length = Math.sqrt(dx*dx+dy*dy);
        const ndx = dx/length;
        const ndy = dy/length;
        
        const startX = source.x+ndx*source.radius;
        const startY = source.y+ndy*source.radius;
        let endX, endY;
        
        if (isDirected) {
            endX = target.x - ndx*(target.radius+headSize);
            endY = target.y - ndy*(target.radius+headSize);
        } else {
            endX = target.x - ndx*target.radius;
            endY = target.y - ndy*target.radius;
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
                endX - headSize*Math.cos(angle - Math.PI/6),
                endY - headSize*Math.sin(angle - Math.PI/6)
            );
            this.#ctx.lineTo(
                endX - headSize*Math.cos(angle+Math.PI/6),
                endY - headSize*Math.sin(angle+Math.PI/6)
            );
            this.#ctx.closePath();
            this.#ctx.fillStyle = '#7f8c8d';
            this.#ctx.fill();
        }
        
        if (edge.weight !== null) {
            const midX = (startX+endX)/2;
            const midY = (startY+endY)/2;
            const offsetX = -ndy*15;
            const offsetY = ndx*15;
            const textWidth = this.#ctx.measureText(edge.weight).width;
            this.#ctx.fillStyle = '#ecf0f1';
            this.#ctx.fillRect(midX+offsetX - textWidth/2 - 2, midY+offsetY - 10, textWidth+4, 20);
            this.#ctx.fillStyle = '#2c3e50';
            this.#ctx.font = '14px Arial';
            this.#ctx.textAlign = 'center';
            this.#ctx.textBaseline = 'middle';
            this.#ctx.fillText(edge.weight, midX+offsetX, midY+offsetY);
        }
    }
    
    clear(canvas) {
        this.#ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}