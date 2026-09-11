# Next.js App Router - Optimizations

One big advantage of Next.js is the built in optimizations. The framework ships with out of the box optimizations for common tasks. We want to look at three of them: routing, images, and fonts. Next.js provides components and APIs for each one: `next/link` for navigation, `next/image` for images, and `next/font` for fonts.

## Navigation with `next/link`

A normal `<a>` tag triggers a full page load. The browser throws away the current page, requests the next one from scratch, and rebuilds everything, including the parts that did not change, like the header in your layout. Next.js provides a `Link` component that navigates on the client instead: it swaps in the new page without discarding the rest as well as prefetching the page that it points to, so navigation feels instant and the layout stays put.

```tsx
import Link from "next/link";

export default function DeliveriesPage() {
  return (
    <ul>
      {deliveries.map((delivery) => (
        <li key={delivery.id}>
          <Link href={`/deliveries/${delivery.id}`}>
            {delivery.pickup} to {delivery.destination}
          </Link>
        </li>
      ))}
    </ul>
  );
}
```

What `Link` does under the hood:

- `href` works like the `href` on an `<a>`, pointing at one of your routes, here the dynamic `/deliveries/[id]` page
- Navigation happens without a full reload, so shared layout is not re-rendered
- Links are prefetched: when a `Link` is visible on screen, Next.js quietly loads the target route in the background, so the page is often ready before the user clicks

## Images with `next/image`

The `<img>` tag has two problems. It loads every image at full file size even when displayed small, and the browser does not know the image's dimensions until it arrives, so the page jumps as each one loads. That jump is called layout shift, and it is one of the most irritating things a page can do. The `Image` component from `next/image` serves a correctly sized, modern-format version of the image and reserves its space ahead of time so nothing shifts.

```tsx
import Image from "next/image";

export default function DeliveryPhoto() {
  return (
    <Image
      src="/kiki.png"
      alt="A courier on a delivery"
      width={320}
      height={240}
    />
  );
}
```

A brief overview of the properties required:

- `src` and `alt` are the same as on a normal `<img>`, the source and the accessibility text
- `width` and `height` tell Next.js the image's aspect ratio so it can reserve the right amount of space before the image loads, which prevents layout shifts
- Next.js automatically serves a resized, optimized version rather than the original file, and waits to load images that are off screen until they are needed

When you do not know an image's dimensions ahead of time, such as a photo whose size varies, you can use the `fill` property instead of `width` and `height` to make the image fill its parent container.

## Fonts with `next/font`

Loading a custom font from a third party usually means the browser requests it after the page has started rendering. Until it arrives, text shows in a fallback font and then jumps when the real one swaps in, and the request itself adds a round trip to another server. The `next/font` tool removes both problems by downloading the font at build time, hosting it from your own site, and setting it up so text does not shift when it loads.

```tsx
import { Cherry_Bomb_One } from "next/font/google";

const cherryBomb = Cherry_Bomb_One({
  weight: "400",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cherryBomb.className}>
      <body>{children}</body>
    </html>
  );
}
```

Further details on this code block

- `Inter` is imported from `next/font/google`, which gives you Google Fonts without a request to Google at runtime
- Calling `Cherry_Bomb_One({ weight: "400", subsets: ["latin"] })` selects the character sets and weights to include, keeping the font file small by leaving out alphabets you do not use
- The returned object's `className` is applied to an element, here the root `<html>`, so every element inside uses the font
- Alternatively you can use `cherryBomb.variable` to manually apply the font to elements in css with `font-family: var(--font-cherry-bomb-one);`
- The font is downloaded and self-hosted when the app is built, so there is no extra network request and no font swap when the page loads

## Other optimizations

Next.js does not stop there. It includes a range of optimizations to make your app fast and performant. See the [Next.js documentation](https://nextjs.org/docs) for more details.

## Resources

[next/link](https://nextjs.org/docs/app/api-reference/components/link)

[next/image](https://nextjs.org/docs/app/api-reference/components/image)

[next/font](https://nextjs.org/docs/app/api-reference/components/font)
