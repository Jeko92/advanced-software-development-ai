const editor = document.querySelector<HTMLInputElement>('#editor')!;
const undoBtn = document.querySelector<HTMLButtonElement>('#undo-btn')!;
const redoBtn = document.querySelector<HTMLButtonElement>('#redo-btn')!;

const MAX_HISTORY = 100;

let current = editor.value;
const back: string[] = [];
const forward: string[] = [];

const pushToBack = (value: string): void => {
  back.push(value);

  if (back.length > MAX_HISTORY) {
    back.shift();
  }
};

const updateButtons = (): void => {
  undoBtn.disabled = back.length === 0;
  redoBtn.disabled = forward.length === 0;
};

editor.addEventListener('input', () => {
  pushToBack(current);
  current = editor.value;
  forward.length = 0;
  updateButtons();
});

undoBtn.addEventListener('click', () => {
  if (back.length === 0) {
    return;
  }

  forward.push(current);
  current = back.pop()!;
  editor.value = current;
  updateButtons();
});

redoBtn.addEventListener('click', () => {
  if (forward.length === 0) {
    return;
  }

  pushToBack(current);
  current = forward.pop()!;
  editor.value = current;
  updateButtons();
});

updateButtons();