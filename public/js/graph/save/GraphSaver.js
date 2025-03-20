export class GraphSaver {
    #graph;

    constructor(graph){
        this.#graph = graph;
    }

    get graph(){
        return this.#graph;
    }

    #getImageSize(){
        const nodes = this.#graph.nodes();
        const canvas = this.#graph.canvas();
        const centerX = canvas.width / 2, centerY = canvas.height / 2;

        const { maxX, maxY } = nodes.reduce(({ maxX, maxY }, node) => ({
            maxX: Math.max(maxX, Math.abs(node.x - centerX)),
            maxY: Math.max(maxY, Math.abs(node.y - centerY))
        }), { maxX: 0, maxY: 0 });
        const startX = Math.round(centerX - maxX), startY = Math.round(centerY - maxY);
        const width = maxX * 2, height = maxY * 2;
        return {
            "startX" : startX,
            "startY" : startY,
            "width" : width,
            "height" : height
        }
    }

    createImage(){
        const ctx = this.#graph.ctx();
        const {startX, startY, width, height} = this.#getImageSize();
        const imageData = ctx.getImageData(startX, startY, width, height);
        const offscreenCanvas = new OffscreenCanvas(width, height);
        offscreenCanvas.getContext('2d').putImageData(imageData, 0, 0);
        offscreenCanvas.convertToBlob().then(blob => {
            const link = Object.assign(document.createElement('download'), {
                href: URL.createObjectURL(blob),
                download: 'graph.Png'
            });
            link.click();
        });
    }

}