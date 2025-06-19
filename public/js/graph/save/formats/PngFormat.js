import { SaveFormat } from '../SaveFormat.js';

export class PngFormat extends SaveFormat {
  getSuggestedName() {
    return "graph.png";
  }

  getMimeType() {
    return "image/png";
  }

  getExtension() {
    return "png";
  }

  async prepare(graph, canvas, ctx) {
    if (!graph || graph.nodes.size === 0) return new Blob();
    const nodes = graph.nodes.values();
    const centerX = canvas.width / 2, centerY = canvas.height / 2;
    const { maxX, maxY } = [...nodes].reduce(({ maxX, maxY }, node) => ({
      maxX: Math.max(maxX, Math.abs(node.x - centerX)),
      maxY: Math.max(maxY, Math.abs(node.y - centerY))
    }), { maxX: 0, maxY: 0 });

    const startX = Math.round(centerX - maxX) - 50;
    const startY = Math.round(centerY - maxY) - 50;
    const width = maxX * 2 + 100;
    const height = maxY * 2 + 100;

    const imageData = ctx.getImageData(startX, startY, width, height);
    const offscreenCanvas = new OffscreenCanvas(width, height);
    const offCtx = offscreenCanvas.getContext('2d');
    offCtx.putImageData(imageData, 0, 0);

    return await offscreenCanvas.convertToBlob({ type: this.getMimeType() });
  }
}
