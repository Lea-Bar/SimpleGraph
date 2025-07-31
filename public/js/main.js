import { Editor } from './editor/Editor.js';
import { GraphViewer } from './graph/GraphViewer.js';

document.addEventListener('DOMContentLoaded', () => {
    new Editor('editor', 'lineNumbers');
    new GraphViewer('graphCanvas', 'editor', 'graphtype', 'save');
});
