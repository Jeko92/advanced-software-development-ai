const DECORATIVE_IMAGES = [
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1620428268482-cf1851a36764?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
]

export function getDecorativeImage(auctionId: string): string {
  let hash = 0
  for (let i = 0; i < auctionId.length; i++) {
    hash = (hash * 31 + auctionId.charCodeAt(i)) >>> 0
  }
  return DECORATIVE_IMAGES[hash % DECORATIVE_IMAGES.length]
}
