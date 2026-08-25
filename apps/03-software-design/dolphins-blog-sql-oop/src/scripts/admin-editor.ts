// Very basic Editor.js integration for the admin post form (see
// https://editorjs.io/getting-started/). Editor.js and its two tools are
// loaded globally via CDN <script> tags in _admin-base.njk; this file just
// wires them to the existing plain-HTML form flow so no controller/model
// code has to change: the `#content-field` textarea keeps the exact same
// `name="content"` the server already reads and sanitizes.

interface EditorJsBlock {
  type: string;
  data: Record<string, unknown>;
}

interface EditorJsOutput {
  blocks: EditorJsBlock[];
}

interface EditorJsConfig {
  holder: string;
  placeholder?: string;
  tools?: Record<string, unknown>;
  data?: EditorJsOutput;
}

declare class EditorJS {
  constructor(config: EditorJsConfig);
  save(): Promise<EditorJsOutput>;
}

// Attached to `window` by the CDN <script> tags loaded before this file.
declare const Header: unknown;
declare const EditorjsList: unknown;

const HEADER_LEVELS = [1, 2, 3];

// @editorjs/list stores each item as { content, items: [] } (the nested
// array supports multi-level lists) rather than a plain string — even
// though we only ever render one flat level here.
interface EditorJsListItem {
  content?: unknown;
}

function textOf(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

/**
 * Editor.js OutputData -> the small HTML subset sanitizePostContent() allows
 * (p, h1-h3, ul/ol/li, plus inline b/i/a from Editor.js's built-in toolbar).
 */
function blocksToHtml(blocks: EditorJsBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case 'header': {
          const level = HEADER_LEVELS.includes(Number(block.data['level']))
            ? Number(block.data['level'])
            : 2;
          return `<h${level}>${textOf(block.data['text'])}</h${level}>`;
        }
        case 'list': {
          const rawItems = block.data['items'];
          const items = Array.isArray(rawItems)
            ? (rawItems as EditorJsListItem[])
                .map((item) => `<li>${textOf(item.content)}</li>`)
                .join('')
            : '';
          const tag = block.data['style'] === 'ordered' ? 'ol' : 'ul';
          return `<${tag}>${items}</${tag}>`;
        }
        case 'paragraph':
        default: {
          const text = textOf(block.data['text']);
          return text ? `<p>${text}</p>` : '';
        }
      }
    })
    .join('');
}

/**
 * The reverse conversion, used to pre-fill the editor when opening the edit
 * form: the small HTML subset above -> Editor.js blocks.
 */
function htmlToBlocks(html: string): EditorJsBlock[] {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;

  return Array.from(wrapper.children).map((el): EditorJsBlock => {
    const tag = el.tagName.toLowerCase();

    if (/^h[1-3]$/.test(tag)) {
      return {
        type: 'header',
        data: { text: el.innerHTML, level: Number(tag[1]) },
      };
    }

    if (tag === 'ul' || tag === 'ol') {
      return {
        type: 'list',
        data: {
          style: tag === 'ol' ? 'ordered' : 'unordered',
          items: Array.from(el.children).map((item) => item.innerHTML),
        },
      };
    }

    return { type: 'paragraph', data: { text: el.innerHTML } };
  });
}

window.addEventListener('DOMContentLoaded', () => {
  const holder = document.getElementById('editorjs');
  if (!holder) return;

  const hiddenField = document.getElementById(
    'content-field',
  ) as HTMLTextAreaElement | null;
  if (!hiddenField) return;

  const form = holder.closest('form');
  if (!form) return;

  let editor: EditorJS;

  try {
    editor = new EditorJS({
      holder: 'editorjs',
      placeholder: 'Write your post…',
      tools: {
        header: {
          class: Header,
          config: { levels: HEADER_LEVELS, defaultLevel: 2 },
        },
        list: { class: EditorjsList, inlineToolbar: true },
      },
      data: { blocks: htmlToBlocks(hiddenField.value) },
    });
  } catch (err) {
    // Editor.js scripts failed to load/init — leave the plain textarea
    // visible as a fallback instead of hiding the only way to enter content.
    console.error('Failed to initialize Editor.js:', err);
    return;
  }

  // Only hide the fallback textarea once the editor is actually usable.
  hiddenField.hidden = true;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    editor
      .save()
      .then((output) => {
        hiddenField.value = blocksToHtml(output.blocks);
        form.submit();
      })
      .catch((err: unknown) => {
        console.error('Failed to save editor content:', err);
      });
  });
});
