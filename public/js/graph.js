let isDirected = true;
let updateTimer = null;

document.addEventListener("DOMContentLoaded", () => {
    const graphtype = document.getElementById("graphtype");
    graphtype.addEventListener("click", () => {
        isDirected = !isDirected;
        graphtype.textContent = isDirected ? "Directed" : "Undirected";
        drawGraph()
    });

    drawGraph();
    
    const textarea = document.getElementById('editor');
    textarea.addEventListener('input', function() {        
        if (updateTimer) {
            clearTimeout(updateTimer);
        }
        updateTimer = setTimeout(function() {
            drawGraph();
        }, 500);
    });
});


function drawGraph() {
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');
    const graphText = document.getElementById('editor').value;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const edges = [];
    const nodes = new Set();
    
    graphText.split('\n').forEach(line => {
        line = line.trim();
        if (!line) return;
        const parts = line.split(/\s+/);
        if (parts.length >= 2) {
            const a = parts[0];
            const b = parts[1];
            const weight = parts.length > 2 ? parts[2] : null;
            
            edges.push({a, b, weight});
            nodes.add(a);
            nodes.add(b);
        }
    });
    if (nodes.size === 0) {
        return;
    }
    const nodeArray = Array.from(nodes);
    const nodePositions = {};
    const cX = canvas.width / 2;
    const cY = canvas.height / 2;
    const radius = Math.min(cX, cY) - 50;

    nodeArray.forEach((node, index) => {
        const angle = (index / nodeArray.length) * 2 * Math.PI;
        nodePositions[node] = {
            x: cX + radius * Math.cos(angle),
            y: cY + radius * Math.sin(angle)
        };
    });
    
    edges.forEach(edge => {
        const sourcePos = nodePositions[edge.a];
        const targetPos = nodePositions[edge.b];
        
        if (sourcePos && targetPos) {
            drawEdge(ctx, sourcePos, targetPos, edge.weight, isDirected);
        }
    });
    
    nodeArray.forEach(node => {
        const pos = nodePositions[node];
        drawNode(ctx, pos.x, pos.y, node);
    });
}

function drawNode(ctx, x, y, label) {
    const radius = 20;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = '#34495e';
    ctx.font = '15px Trebuchet MS';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x, y);
}

function drawEdge(ctx, a, b, weight, directed) {
    const nodeRadius = 20;
    const headSize = 10;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const ndx = dx / length;
    const ndy = dy / length;
    const startX = a.x + ndx * nodeRadius;
    const startY = a.y + ndy * nodeRadius;
    let endX, endY;
    
    if (directed) {
        endX = b.x - ndx * (nodeRadius + headSize);
        endY = b.y - ndy * (nodeRadius + headSize);
    } else {
        endX = b.x - ndx * nodeRadius;
        endY = b.y - ndy * nodeRadius;
    }
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = '#7f8c8d';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    if (directed) {
        const angle = Math.atan2(dy, dx);
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
            endX - headSize * Math.cos(angle - Math.PI / 6),
            endY - headSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
            endX - headSize * Math.cos(angle + Math.PI / 6),
            endY - headSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fillStyle = '#7f8c8d';
        ctx.fill();
    }

    if (weight !== null) {
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        const offsetX = -ndy * 15;
        const offsetY = ndx * 15;
        
        ctx.fillStyle = '#2c3e50';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const textWidth = ctx.measureText(weight).width;
        ctx.fillStyle = '#ecf0f1';
        ctx.fillRect(midX + offsetX - textWidth/2 - 2, midY + offsetY - 10, textWidth + 4, 20);
        
        ctx.fillStyle = '#2c3e50';
        ctx.fillText(weight, midX + offsetX, midY + offsetY);
    }
}