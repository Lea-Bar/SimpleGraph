export class SaveFormat {
  getSuggestedName() {
    return "";
  }

  getMimeType() {
    return "";
  }

  getExtension() {
    return "";
  }

  async prepare(graph, canvas, ctx, ...args) {
    throw new Error("prepare() must be implemented by subclass");
  }

  async export(graph, canvas, ctx, ...args) {
    const blobData = await this.prepare(graph, canvas, ctx, ...args);
    const blob = blobData instanceof Blob ? blobData : new Blob([blobData], { type: this.getMimeType() });
    const suggestedName = this.getSuggestedName();
    const extension = this.getExtension();
    const mimeType = this.getMimeType();

    if (window.showSaveFilePicker) {
      const handle = await window.showSaveFilePicker({
        suggestedName,
        types: [{
          description: `${extension.toUpperCase()} file`,
          accept: { [mimeType]: [`.${extension}`] }
        }]
      });

      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = suggestedName;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }
}
