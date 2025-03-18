let isDirected = true;
document.addEventListener("DOMContentLoaded", () => {
    const graphtype = document.getElementById("graphtype");
    graphtype.addEventListener("click", () => {
        isDirected = !isDirected;
        graphtype.textContent = isDirected ? "Directed" : "Undirected";
    });
});
