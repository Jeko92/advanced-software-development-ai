interface Exportable {
  export(recordCount: number): string;
  getFormatName(): string;
}

abstract class BaseExporter implements Exportable {
  #wrapHeader(recordCount: number): string {
    return `Exporting ${recordCount} records as ${this.getFormatName()}`;
  }

  abstract serialize(recordCount: number): string;

  export(recordCount: number): string {
    return `${this.#wrapHeader(recordCount)}: ${this.serialize(recordCount)}`;
  }

  abstract getFormatName(): string;
}

class JsonExporter extends BaseExporter {
  override serialize(recordCount: number): string {
    return JSON.stringify({ records: recordCount });
  }

  override getFormatName(): string {
    return 'json';
  }
}

class CsvExporter extends BaseExporter {
  override serialize(recordCount: number): string {
    return `recordNum\n${recordCount}`;
  }

  override getFormatName(): string {
    return 'csv';
  }
}

class ExportManager {
  exports: Exportable[];

  constructor(exports: Exportable[]) {
    this.exports = exports;
  }

  exportAll(recordCount: number): string[] {
    const exports: string[] = [];
    for (const exportItem of this.exports) {
      exports.push(exportItem.export(recordCount));
    }
    // console.log(exports);
    return exports;
  }
}

const exportable = new ExportManager([new JsonExporter(), new CsvExporter()]);
console.log(exportable.exportAll(12));
console.log('=============================');
console.log(exportable.exportAll(12)[0]);
console.log(exportable.exportAll(12)[1]);
