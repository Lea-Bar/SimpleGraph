export class Editor {
    constructor(editorId, lineNumbersId) {
        this.editor = document.getElementById(editorId);
        this.lineNumbers = document.getElementById(lineNumbersId);
        this.editor.addEventListener('input', () => this.updateLineNumbers());
        this.editor.addEventListener('scroll', () => this.syncScroll());
        this.updateLineNumbers();
    }

    updateLineNumbers() {
        const lines = this.editor.value.split("\n").length;
        this.lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join("<br>");
    }

    syncScroll() {
        this.lineNumbers.scrollTop = this.editor.scrollTop;
    }
}
