import { SaveFormat } from '../SaveFormat.js'

export class DotFormat extends SaveFormat {
  getSuggestedName() { return 'graph.gv' }
  getMimeType() { return 'text/vnd.graphviz' }
  getExtension() { return 'gv' }
  async prepare(graph, canvas, ctx, isDirected) {
    const directive = isDirected ? 'digraph' : 'graph'
    const connector = isDirected ? '->' : '--'
    const lines = [`${directive} G {`]
    graph.edges.forEach(edge => {
      const src = edge.source.id
      const tgt = edge.target.id
      const w = edge.weight != null ? edge.weight : ''
      const label = w ? `[label="${w}"]` : ''
      lines.push(`  ${src} ${connector} ${tgt} ${label};`)
    })
    lines.push('}')
    return lines.join('\n')
  }
}
