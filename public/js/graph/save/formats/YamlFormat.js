import { SaveFormat } from '../SaveFormat.js';

export class YamlFormat extends SaveFormat {
  getSuggestedName() {
    return 'graph.yaml';
  }

  getMimeType() {
    return 'application/x-yaml';
  }

  getExtension() {
    return 'yaml';
  }

  async prepare(graph, canvas, ctx, isDirected) {
    if (!graph || graph.nodes.size === 0) return '';
    const nodes = Array.from(graph.nodes.keys());
    const weighted = graph.edges.some(e => e.weight != null);
    let type;
    if (isDirected && !weighted) type = 'digraph';
    else if (!isDirected && !weighted) type = 'ugraph';
    else if (isDirected && weighted) type = 'diwgraph';
    else type = 'uwgraph';
    const name = 'graph';
    let yaml = `type: ${type}\nname: ${name}\nnodes: [${nodes.join(', ')}]\n`;
    if (weighted) {
      yaml += 'wedges:\n';
      nodes.forEach(src => {
        const entries = graph.edges
          .filter(e => e.source.id === src)
          .map(e => `${e.target.id}: ${e.weight}`);
        yaml += `  ${src}: {${entries.join(', ')}}\n`;
      });
    } else {
      yaml += 'edges:\n';
      nodes.forEach(src => {
        const targets = graph.edges
          .filter(e => e.source.id === src)
          .map(e => e.target.id);
        yaml += `  ${src}: [${targets.join(', ')}]\n`;
      });
    }
    return yaml;
  }
}

