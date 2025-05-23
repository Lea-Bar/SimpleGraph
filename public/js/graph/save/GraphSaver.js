export class GraphSaver {
    #graph;
    #ctx;
    #canvas;

    constructor(graph, ctx, canvas) {
        this.#graph = graph;
        this.#ctx = ctx;
        this.#canvas = canvas;
    }

    get graph() {
        return this.#graph;
    }

    #getImageSize() {
        const nodes = this.#graph.nodes.values();
        const canvas = this.#canvas;
        const centerX = canvas.width / 2, centerY = canvas.height/2;
        const { maxX, maxY } = nodes.reduce(({ maxX, maxY }, node) => ({
            maxX: Math.max(maxX, Math.abs(node.x-centerX)),
            maxY: Math.max(maxY, Math.abs(node.y-centerY))
        }), { maxX: 0, maxY: 0 });
        const startX = Math.round(centerX-maxX)-50, startY = Math.round(centerY-maxY)-50;
        const width = maxX*2+100, height = maxY*2+100;

        return {
            "startX" : startX,
            "startY" : startY,
            "width" : width,
            "height" : height
        }
    }

    downloadImage() {
        const ctx = this.#ctx;
        console.log(this.#graph.nodes.size)
        if(this.#graph.nodes.size === 0) return;
        const {startX, startY, width, height} = this.#getImageSize();
        const imageData = ctx.getImageData(startX, startY, width, height);
        const offscreenCanvas = new OffscreenCanvas(width, height);
        offscreenCanvas.getContext('2d').putImageData(imageData, 0, 0);
        offscreenCanvas.convertToBlob().then(blob => {
            const link = Object.assign(document.createElement('a'), {
                href: URL.createObjectURL(blob),
                download: 'graph.png'
            });
            link.click();
        });
    }

}