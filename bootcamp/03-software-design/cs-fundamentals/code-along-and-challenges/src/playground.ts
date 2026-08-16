import { Node, DoublyNode } from './node.ts';

/*==========================================================*/
/*                      EXAMPLES                            */
/*==========================================================*/
const logSection = (title: string): void => {
  console.log('\n========================================');
  console.log(` ${title}`);
  console.log('========================================\n');
};

const logDivider = (): void => {
  console.log('----------------------------------------');
};

/* node*/
logSection('Node');
const strawberryNode = new Node('Berry Tasty');
const vanillaNode = new Node('Vanilla');
const coconutNode = new Node('Coconuts for Coconut');

vanillaNode.setNextNode(strawberryNode);
strawberryNode.setNextNode(coconutNode);

let currentNode: Node<string> | null = vanillaNode;
while (currentNode !== null) {
  console.log(currentNode.data);
  currentNode = currentNode.next;
}

const oldest = new Node('John');
const middle = new Node('Jacob');
const youngest = new Node('Jingleheimer');

youngest.setNextNode(middle);
middle.setNextNode(oldest);

let currentSibling: Node<string> | null = youngest;
let oldestName = '';
while (currentSibling !== null) {
  oldestName = currentSibling.data;
  currentSibling = currentSibling.getNextNode();
}

console.log(`There goes ${oldestName} Schmidt!`);

let receivedNumbersHead: Node<number> | null = null;

const storeNumber = (num: number): void => {
  const newNode = new Node(num);
  newNode.setNextNode(receivedNumbersHead);
  receivedNumbersHead = newNode;
};

const doYouHaveThisNumber = (num: number): boolean => {
  let current = receivedNumbersHead;
  while (current !== null) {
    if (current.data === num) {
      return true;
    }
    current = current.getNextNode();
  }
  return false;
};

storeNumber(1);
storeNumber(2);
storeNumber(3);
console.log(receivedNumbersHead);
logDivider();
console.log(doYouHaveThisNumber(1));
console.log(doYouHaveThisNumber(2));

/* doublyNode */
logSection('DoublyNode');
const januaryNode = new DoublyNode('January');
const februaryNode = new DoublyNode('February');
const marchNode = new DoublyNode('March');

januaryNode.setNextNode(februaryNode);
februaryNode.setPreviousNode(januaryNode);
februaryNode.setNextNode(marchNode);
marchNode.setPreviousNode(februaryNode);

let currentMonth: DoublyNode<string> | null = januaryNode;
while (currentMonth !== null) {
  console.log(currentMonth.data);
  currentMonth = currentMonth.getNextNode();
}

logDivider();

let currentMonthReversed: DoublyNode<string> | null = marchNode;
while (currentMonthReversed !== null) {
  console.log(currentMonthReversed.data);
  currentMonthReversed = currentMonthReversed.getPreviousNode();
}

logDivider();

const nodeToRemove = februaryNode;
const before = nodeToRemove.getPreviousNode();
const after = nodeToRemove.getNextNode();

before?.setNextNode(after);
after?.setPreviousNode(before);

let currentMonthAfterRemoval: DoublyNode<string> | null = januaryNode;
while (currentMonthAfterRemoval !== null) {
  console.log(currentMonthAfterRemoval.data);
  currentMonthAfterRemoval = currentMonthAfterRemoval.getNextNode();
}

/* Singly-linked-list */
logSection('Singly Linked List');
