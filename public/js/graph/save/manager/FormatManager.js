import { PngFormat } from "../formats/PngFormat.js";
import { CsvFormat } from "../formats/CsvFormat.js";
import { DotFormat } from "../formats/DotFormat.js";
import { YamlFormat } from "../formats/YamlFormat.js";

export class FormatManager {
  #saveFormats = new Map();

  registerSaveFormat(format) {
    const ext = format.getExtension();
    if (!ext) throw new Error("Format must define an extension");
    this.#saveFormats.set(ext, format);
  }

  registerAllFormats(){
    this.registerSaveFormat(new PngFormat());
    this.registerSaveFormat(new CsvFormat());
    this.registerSaveFormat(new DotFormat());
    this.registerSaveFormat(new YamlFormat());
  }

  getSaveFormat(extension) {
    return this.#saveFormats.get(extension);
  }
}