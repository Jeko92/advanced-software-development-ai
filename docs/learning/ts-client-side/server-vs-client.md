# TypeScript Client-Side - Server vs. Client

When you run TypeScript in the terminal, Node.js provides the runtime environment. Node has access to the file system, network sockets, and system processes — but it has no DOM. The Document Object Model exists only inside a web browser. When code calls `document.getElementById()` or reads from `window`, it relies on objects that the browser creates when it parses an HTML page. Those objects do not exist in Node.js.

This distinction matters as soon as you write TypeScript meant for a browser. `node` would throw a `ReferenceError` at runtime when it encounters `document`, because it has no such global. Even if TypeScript's compiler does not catch it immediately, the code will fail when it runs. For browser code, the correct approach is to compile TypeScript into JavaScript with `tsc` and load the resulting file in an HTML page via a `<script>` tag.

## The browser runtime

Node.js and the browser are different JavaScript runtime environments. Both execute JavaScript, but each exposes different globals. Node provides `process`, `Buffer`, and the file system module. The browser provides `window`, `document`, and `localStorage`.

TypeScript, by default, does not include type definitions for DOM APIs. If you try to use `document` without telling the compiler you are targeting a browser, TypeScript reports "Cannot find name 'document'". You need to enable the type definitions explicitly.

## tsconfig.json for browser environments

The `compilerOptions` field in `tsconfig.json` controls what environment TypeScript expects and what JavaScript it produces. For browser code, three options matter:

- `lib` lists which built-in type definitions the compiler loads. Adding `"dom"` includes all browser API types — `document`, `window`, `HTMLElement`, and other browser globals. Without it, TypeScript does not know those globals exist.
- `target` sets the JavaScript version the compiler outputs. `"ESNext"` preserves modern syntax like `async/await` and optional chaining without down-compiling it.
- `module` controls the module syntax in the output. `"ESNext"` produces `import`/`export` statements, which browsers and modern bundlers understand natively.

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "lib": ["dom", "esnext"]
  }
}
```

With this configuration, running `tsc` compiles your TypeScript into `dist/`. You then reference those files in a `<script>` tag in your HTML. Make sure to add `type="module"` to the `<script>` tag to tell the browser it can use 'import' and 'export' statements.

```html
<html lang="en">
  <head>
    {# ... #}
    <script type="module" src="/dist/main.js"></script>
  </head>
  <body>
    {# ... #}
  </body>
</html>
```

## Resources

[TypeScript tsconfig reference](https://www.typescriptlang.org/tsconfig)

[MDN: Document Object Model](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
