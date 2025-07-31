import { SaveFormat } from '../SaveFormat.js';

export class CsvFormat extends SaveFormat {
  getSuggestedName() {
    return 'graph.csv';
  }

  getMimeType() {
    return 'text/csv';
  }

  getExtension() {
    return 'csv';
  }

  async prepare(graph, canvas, ctx, ...args) {
    if (!graph || graph.nodes.size === 0) return '';
    const lines = graph.edges.map(edge => {
      const w = edge.weight != null ? edge.weight : '';
      return `${edge.source.id},${edge.target.id}${w ? ',' + w : ''}`;
    });
    return lines.join('\n');
  }
}
