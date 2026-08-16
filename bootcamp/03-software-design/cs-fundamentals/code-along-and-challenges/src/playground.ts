import { DoublyNode, Node } from './node.ts';
import { LinkedList } from './singly-linked-list.ts';
import { DoublyLinkedList } from './doubly-linked-list.ts';
import { TreeNode } from './general-tree.ts';
import { BinaryTreeNode } from './binary-tree.ts';
import { BinarySearchTree } from './binary-search-tree.ts';
import { Stack } from './stack.ts';
import { BubbleSorter } from './bubble-sort.ts';

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
const numbers = new LinkedList<number>();

console.log('\n1. Empty list');
numbers.printList();

console.log('\n2. addToHead(20)');
numbers.addToHead(20);
numbers.printList();

console.log('\n3. addToHead(10)');
numbers.addToHead(10);
numbers.printList();

console.log('\n4. addToTail(30)');
numbers.addToTail(30);
numbers.printList();

console.log('\n5. addToTail(40)');
numbers.addToTail(40);
numbers.printList();

console.log('\n6. removeHead()');
const removedHead = numbers.removeHead();
console.log('Removed:', removedHead);
numbers.printList();

console.log('\n7. removeTail()');
const removedTail = numbers.removeTail();
console.log('Removed:', removedTail);
numbers.printList();

console.log('\n8. removeHead() again');
const secondRemovedHead = numbers.removeHead();
console.log('Removed:', secondRemovedHead);
numbers.printList();

console.log('\n9. removeTail() from single-node list');
const lastRemoved = numbers.removeTail();
console.log('Removed:', lastRemoved);
numbers.printList();

console.log('\n10. removeHead() from empty list');
const emptyRemoval = numbers.removeHead();
console.log('Removed:', emptyRemoval);
numbers.printList();

console.log('\n11. removeTail() from empty list');
const emptyTailRemoval = numbers.removeTail();
console.log('Removed:', emptyTailRemoval);
numbers.printList();

logSection('Doubly Linked List');
const months = new DoublyLinkedList<string>();

console.log('Initial empty list:');
months.printList();

logDivider();

console.log('addToHead("February"):');
months.addToHead('February');
months.printList();

console.log('addToHead("January"):');
months.addToHead('January');
months.printList();

logDivider();

console.log('addToTail("March"):');
months.addToTail('March');
months.printList();

console.log('addToTail("April"):');
months.addToTail('April');
months.printList();

logSection('Remove Head');

console.log('Before removing head:');
months.printList();

console.log('Removed:', months.removeHead());
console.log('After removing head:');
months.printList();

logSection('Remove Tail');

console.log('Before removing tail:');
months.printList();

console.log('Removed:', months.removeTail());
console.log('After removing tail:');
months.printList();

logSection('Remove By Data');

console.log('Rebuilding list...');

months.addToHead('January');
months.addToTail('April');
months.addToTail('May');

console.log('Current list:');
months.printList();

logDivider();

console.log('Removing "April" from the middle:');

const removedApril = months.removeByData('April');

console.log('Removed node:', removedApril?.data ?? null);
months.printList();

logSection('Remove By Data — Reversed');

console.log('Current list:');
months.printList();

logDivider();

console.log('Searching from the tail and removing "January":');

const removedJanuary = months.removeByDataReversed('January');

console.log('Removed node:', removedJanuary?.data ?? null);
months.printList();

logSection('Bidirectional Traversal');

console.log('Forward traversal:');

let current = months.head;

while (current !== null) {
  console.log(`→ ${current.data}`);
  current = current.getNextNode();
}

logDivider();

console.log('Backward traversal:');

current = months.tail;

while (current !== null) {
  console.log(`← ${current.data}`);
  current = current.getPreviousNode();
}

logSection('Single-Node Edge Case');

const singleNodeList = new DoublyLinkedList<string>();

singleNodeList.addToHead('Only-Node');

console.log('After adding one node:');
singleNodeList.printList();

logDivider();

console.log('removeHead():');
console.log('Removed:', singleNodeList.removeHead());
singleNodeList.printList();

logDivider();

console.log('addToTail("Only Node"):');
singleNodeList.addToTail('Only-Node');
singleNodeList.printList();

logDivider();

console.log('removeTail():');
console.log('Removed:', singleNodeList.removeTail());
singleNodeList.printList();

logSection('Missing Data');

const numbersDoubly = new DoublyLinkedList<number>();

numbersDoubly.addToHead(10);
numbersDoubly.addToTail(20);
numbersDoubly.addToTail(30);

console.log('Current list:');
numbersDoubly.printList();

logDivider();

console.log('Trying to remove 999:');
console.log('Removed:', numbersDoubly.removeByData(999));

numbersDoubly.printList();

logDivider();

console.log('Trying reversed search for 999:');
console.log('Removed:', numbersDoubly.removeByDataReversed(999));

numbersDoubly.printList();

logDivider();
const navigation = new DoublyLinkedList<string>();

navigation.addToTail('A');
navigation.addToTail('B');
navigation.addToTail('C');
navigation.addToTail('D');

console.log('Forward:');

let forward = navigation.head;

while (forward !== null) {
  console.log(`→ ${forward.data}`);
  forward = forward.getNextNode();
}

logDivider();

console.log('Backward:');

let backward = navigation.tail;

while (backward !== null) {
  console.log(`← ${backward.data}`);
  backward = backward.getPreviousNode();
}

logSection('General Tree');
const electronics = new TreeNode('Electronics');

const phones = new TreeNode('Phones');
const computers = new TreeNode('Computers');

electronics.addChild(phones);
electronics.print();
logDivider();
electronics.addChild(computers);
electronics.print();
logDivider();
phones.addChild('iPhone');
phones.addChild('Android');
electronics.print();
logDivider();
computers.addChild('Mac');
computers.addChild('PC');
electronics.print();
logDivider();

console.log('Depth-first traversal:');
electronics.depthFirstTraversal();
logDivider();

console.log('Breadth-first traversal:');
electronics.breadthFirstTraversal();
logDivider();

console.log('Removing Android:');
electronics.removeChild('Android');
electronics.print();

logSection('Binary Tree');
const root = new BinaryTreeNode(1);

console.log('insert(2):');
root.insert(2);
root.print();
logDivider();

console.log('insert(3):');
root.insert(3);
root.print();
logDivider();

console.log('insert(4):');
root.insert(4);
root.print();
logDivider();

console.log('insert(5):');
root.insert(5);
root.print();
logDivider();

console.log('Pre-order traversal (node, left, right):');
root.preOrderTraversal();
logDivider();

console.log('In-order traversal (left, node, right):');
root.inOrderTraversal();
logDivider();

console.log('Post-order traversal (left, right, node):');
root.postOrderTraversal();
logDivider();

console.log('height():', root.height());
console.log('size():', root.size());
logDivider();

console.log('find(5):', root.find(5));
console.log('find(99):', root.find(99));
logDivider();

console.log('Removing 2 (and its subtree):');
root.remove(2);
root.print();
logDivider();

console.log('height() after removal:', root.height());
console.log('size() after removal:', root.size());

logSection('Binary Search Tree');
const bstRoot = new BinarySearchTree<number>(50);

console.log('Building the tree: insert 30, 70, 20, 40, 60, 80');
[30, 70, 20, 40, 60, 80].forEach((value) => bstRoot.insert(value));
bstRoot.print();
logDivider();

console.log('In-order traversal (should come out sorted, unlike BinaryTree):');
bstRoot.inOrderTraversal();
logDivider();

console.log('Pre-order traversal:');
bstRoot.preOrderTraversal();
logDivider();

console.log('Post-order traversal:');
bstRoot.postOrderTraversal();
logDivider();

console.log(
  "find(60) — the ordering rule means this doesn't have to check both branches like BinaryTree.find:",
);
console.log(bstRoot.find(60)?.value);
console.log('find(999):', bstRoot.find(999));
logDivider();

console.log('height():', bstRoot.height());
console.log('size():', bstRoot.size());
logDivider();

console.log('Removing a leaf (20):');
bstRoot.remove(20);
bstRoot.print();
logDivider();

console.log('Giving 40 a single child (insert 45) then removing 40:');
bstRoot.insert(45);
bstRoot.print();
logDivider();
bstRoot.remove(40);
console.log('45 should have been promoted into 40\'s spot:');
bstRoot.print();
logDivider();

console.log('Removing a node with two children (70, whose children are 60 and 80):');
bstRoot.remove(70);
console.log(
  "70's in-order successor (80) should have taken its place:",
);
bstRoot.print();
logDivider();

console.log('height() and size() after all the removals:');
console.log('height():', bstRoot.height());
console.log('size():', bstRoot.size());

logSection('Stack');
const stack = new Stack<number>(3);

console.log('isEmpty():', stack.isEmpty());
console.log('getMaxSize():', stack.getMaxSize());
logDivider();

console.log('push(1):');
stack.push(1);
console.log('toArray() (top → bottom):', stack.toArray());
console.log('peek():', stack.peek());
console.log('size():', stack.size());
logDivider();

console.log('push(2), push(3):');
stack.push(2);
stack.push(3);
console.log('toArray() (top → bottom):', stack.toArray());
console.log('size():', stack.size());
console.log('remaining():', stack.remaining());
logDivider();

console.log('push(4) — should throw, stack is at maxSize:');
try {
  stack.push(4);
} catch (error) {
  console.log('Caught:', (error as Error).message);
}
logDivider();

console.log('pop():', stack.pop());
console.log('toArray() after pop:', stack.toArray());
console.log('remaining() after pop:', stack.remaining());
logDivider();

console.log('clear():');
stack.clear();
console.log('isEmpty() after clear():', stack.isEmpty());
console.log('pop() on empty stack:', stack.pop());
console.log('peek() on empty stack:', stack.peek());
logDivider();

console.log('Unbounded stack (no maxSize given):');
const unboundedStack = new Stack<string>();
console.log('getMaxSize():', unboundedStack.getMaxSize());
unboundedStack.push('a');
unboundedStack.push('b');
unboundedStack.push('c');
console.log('toArray() (top → bottom):', unboundedStack.toArray());
console.log('remaining():', unboundedStack.remaining());

logSection('Bubble Sort');
const numberSorter = new BubbleSorter<number>();

console.log('Sorting [5, 2, 4, 6, 1, 3]:');
console.log(numberSorter.sort([5, 2, 4, 6, 1, 3]));
logDivider();

console.log('Best case — already sorted [1, 2, 3, 4, 5] (one clean pass, no swaps):');
console.log(numberSorter.sort([1, 2, 3, 4, 5]));
logDivider();

console.log('Worst case — reverse sorted [5, 4, 3, 2, 1] (every pair swaps):');
console.log(numberSorter.sort([5, 4, 3, 2, 1]));
logDivider();

console.log('Custom comparator — descending order:');
const descendingSorter = new BubbleSorter<number>((a, b) => b - a);
console.log(descendingSorter.sort([5, 2, 4, 6, 1, 3]));
