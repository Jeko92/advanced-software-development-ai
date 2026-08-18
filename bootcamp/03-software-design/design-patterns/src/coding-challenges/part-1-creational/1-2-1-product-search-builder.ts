/**
 * Challenge 1.2.1 — Build a Complex Search Query
 *
 * Source: bootcamp/03-software-design/design-patterns/Design_Patterns_Coding_Challenges.md
 *         (Part 1, Challenge 1.2.1)
 *
 * TODO:
 * - `ProductSearchBuilder` with fluent setters: `category`, `minPrice`,
 *   `maxPrice`, `inStockOnly`, `sortBy`, `limit`
 * - `build()` validates `minPrice <= maxPrice` and `1 <= limit <= 100`,
 *   throwing on violations
 * - returns an immutable `ProductSearch` object
 * - demonstrate: `new ProductSearchBuilder().category('electronics').minPrice(50).maxPrice(500).inStockOnly().build()`
 *
 * Focus: partial, messy state lives inside the builder; the finished object
 * is clean.
 */

interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sortBy?: string;
  limit?: number;
}

type SortOption = 'priceAsc' | 'priceDesc' | 'newest' | 'rating';

type ProductCategory = 'electronics' | 'clothing' | 'books' | 'home' | 'sports';

class ProductSearch {
  constructor(public readonly filters: Readonly<SearchFilters>) {}
}

class ProductSearchBuilder {
  private filters: Partial<SearchFilters> = {};

  category(category: ProductCategory): this {
    this.filters.category = category;
    return this;
  }

  minPrice(minPrice: number): this {
    this.filters.minPrice = minPrice;
    return this;
  }

  maxPrice(maxPrice: number): this {
    this.filters.maxPrice = maxPrice;
    return this;
  }

  inStockOnly(): this {
    this.filters.inStockOnly = true;
    return this;
  }

  sortBy(sortBy: SortOption): this {
    this.filters.sortBy = sortBy;
    return this;
  }

  limit(limit: number): this {
    this.filters.limit = limit;
    return this;
  }

  build(): ProductSearch {
    const { minPrice, maxPrice, limit } = this.filters;

    if (minPrice !== undefined && minPrice < 0) {
      throw new Error(
        `Invalid price: minPrice (${minPrice}) cannot be negative.`,
      );
    }

    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      throw new Error(
        `Invalid price range: minPrice (${minPrice}) cannot exceed maxPrice (${maxPrice}).`,
      );
    }

    if (limit !== undefined && (limit < 1 || limit > 100)) {
      throw new Error(
        `Invalid limit: ${limit}. Limit must be between 1 and 100.`,
      );
    }

    return new ProductSearch({ ...this.filters });
  }
}

const search = new ProductSearchBuilder()
  .category('electronics')
  .minPrice(50)
  .maxPrice(500)
  .inStockOnly()
  .sortBy('newest')
  .limit(7)
  .build();

console.log(search.filters);
