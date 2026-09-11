export type MenuItem = {
  id: number;
  name: string;
  description: string;
  imageUrl: string | null;
  priceCents: number;
};

export const menuItems = [
  {
    id: 1,
    name: 'Espresso',
    description:
      'A single shot pulled from our house blend: dense, syrupy and finished with a hazelnut crema.',
    imageUrl: '/images/menu/espresso.jpg',
    priceCents: 250,
  },
  {
    id: 2,
    name: 'Americano',
    description:
      'Two shots of espresso lengthened with hot water. Black coffee with the body of espresso.',
    imageUrl: '/images/menu/americano.jpg',
    priceCents: 320,
  },
  {
    id: 3,
    name: 'Cappuccino',
    description:
      'Equal parts espresso, steamed milk and dense microfoam, dusted with cocoa on request.',
    imageUrl: '/images/menu/cappuccino.jpg',
    priceCents: 410,
  },
  {
    id: 4,
    name: 'Latte',
    description:
      'A gentle shot of espresso under a tall pour of silky steamed milk. Our most ordered cup.',
    imageUrl: '/images/menu/latte.jpg',
    priceCents: 480,
  },
  {
    id: 5,
    name: 'Flat White',
    description:
      'Ristretto shots with velvety milk in a small cup. Stronger and less foamy than a latte.',
    imageUrl: '/images/menu/flat-white.jpg',
    priceCents: 450,
  },
  {
    id: 6,
    name: 'Mocha',
    description:
      'Espresso stirred through dark chocolate ganache, topped with steamed milk and cream.',
    imageUrl: '/images/menu/mocha.jpg',
    priceCents: 520,
  },
  {
    id: 7,
    name: 'Iced Latte',
    description:
      'Chilled espresso poured over ice and whole milk. Served in a tall glass with a paper straw.',
    imageUrl: '/images/menu/iced-latte.jpg',
    priceCents: 490,
  },
  {
    id: 8,
    name: 'Cold Brew',
    description:
      'Steeped for 18 hours at room temperature, then filtered. Low in acid, high in caffeine.',
    imageUrl: '/images/menu/cold-brew.jpg',
    priceCents: 470,
  },
  {
    id: 9,
    name: 'Matcha Latte',
    description:
      'Ceremonial grade matcha whisked to a smooth froth and topped with steamed milk.',
    imageUrl: '/images/menu/matcha-latte.jpg',
    priceCents: 540,
  },
  {
    id: 10,
    name: 'Chai Latte',
    description:
      'Black tea simmered with cardamom, ginger, clove and cinnamon, then cut with hot milk.',
    imageUrl: null,
    priceCents: 460,
  },
  {
    id: 11,
    name: 'Butter Croissant',
    description:
      'Laminated over three days with French butter and baked each morning until shatteringly crisp.',
    imageUrl: '/images/menu/croissant.jpg',
    priceCents: 320,
  },
  {
    id: 12,
    name: 'Blueberry Muffin',
    description:
      'Buttermilk muffin folded with wild blueberries and finished with a crunch of raw sugar.',
    imageUrl: '/images/menu/blueberry-muffin.jpg',
    priceCents: 340,
  },
  {
    id: 13,
    name: 'Cinnamon Bun',
    description:
      'A soft cardamom dough rolled with cinnamon sugar and glazed while still warm from the oven.',
    imageUrl: '/images/menu/cinnamon-bun.jpg',
    priceCents: 380,
  },
  {
    id: 14,
    name: 'Banana Bread',
    description:
      'A thick slice of walnut banana bread, griddled in butter if you want it warm.',
    imageUrl: null,
    priceCents: 350,
  },
];
