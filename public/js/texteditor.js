function updateLineNumbers() {
    const editor = document.getElementById("editor");
    const lineNumbers = document.getElementById("lineNumbers");
    if(editor && lineNumbers){
        const lines = editor.value.split("\n").length;
        lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join("<br>");
    }
}

function syncScroll() {
    if(document.getElementById("lineNumbers").scrollTop && document.getElementById("editor").scrollTop){
        document.getElementById("lineNumbers").scrollTop = document.getElementById("editor").scrollTop;
    }
}

updateLineNumbers();