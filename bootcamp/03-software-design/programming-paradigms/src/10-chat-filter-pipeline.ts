interface Filterable {
  filter(text: string): string;
  getFilterName(): string;
}

abstract class BaseFilter implements Filterable {
  protected logApplication(text: string): void {
    console.log(`Applying ${this.getFilterName()} to: ...`, text);
  }

  filter(text: string): string {
    this.logApplication(text);
    return this.transform(text);
  }

  abstract transform(text: string): string;
  abstract getFilterName(): string;
}

class ProfanityFilter extends BaseFilter {
  override transform(text: string): string {
    const BANNED_WORDS = ['darn', 'heck', 'crap', 'shoot'];
    return text
      .split(' ')
      .map((word) =>
        BANNED_WORDS.includes(word) ? '*'.repeat(word.length) : word,
      )
      .join(' ');
  }

  override getFilterName(): string {
    return 'profanity';
  }
}

class TrimFilter extends BaseFilter {
  override transform(text: string): string {
    return text.trim();
  }

  override getFilterName(): string {
    return 'trim';
  }
}

class FilterPipeline {
  #filters: Filterable[];

  constructor(filters: Filterable[]) {
    this.#filters = filters;
  }

  run(text: string): string {
    let filteredText = text;
    for (const filter of this.#filters) {
      filteredText = filter.filter(filteredText);
    }

    return filteredText;
  }
}

const pipeline = new FilterPipeline([new TrimFilter(), new ProfanityFilter()]);

const result = pipeline.run(' darn this is broken ');
console.log(result);
