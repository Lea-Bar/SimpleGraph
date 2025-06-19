import { PngFormat } from "../formats/PngFormat.js";

export class FormatManager {
  #saveFormats = new Map();

  registerSaveFormat(format) {
    const ext = format.getExtension();
    if (!ext) throw new Error("Format must define an extension");
    this.#saveFormats.set(ext, format);
  }

  registerAllFormats(){
    this.registerSaveFormat(new PngFormat());
  }

  getSaveFormat(extension) {
    return this.#saveFormats.get(extension);
  }
}