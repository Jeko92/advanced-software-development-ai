import { DoublyNode } from './node.ts';

export class DoublyLinkedList<T> {
  head: DoublyNode<T> | null = null;
  tail: DoublyNode<T> | null = null;

  // add Node to head
  addToHead(data: T) {
    const newHead = new DoublyNode(data);
    const currentHead = this.head;
    if (currentHead) {
      currentHead.setPreviousNode(newHead);
      newHead.setNextNode(currentHead);
    }
    this.head = newHead;
    if (!this.tail) {
      this.tail = newHead;
    }
  }

  // add Node to tail
  addToTail(data: T) {
    const newTail = new DoublyNode(data);
    const currentTail = this.tail;
    if (currentTail) {
      currentTail.setNextNode(newTail);
      newTail.setPreviousNode(currentTail);
    }
    this.tail = newTail;
    if (!this.head) {
      this.head = newTail;
    }
  }

  // remove Node from the Head
  removeHead() {
    const removedHead = this.head;
    if (!removedHead) return;
    this.head = removedHead.getNextNode();
    if (this.head) {
      this.head.setPreviousNode(null);
    }
    if (removedHead === this.tail) this.removeTail();

    return removedHead.data;
  }

  // remove Node from the Tail
  removeTail() {
    const removedTail = this.tail;
    if (!removedTail) return;
    this.tail = removedTail.getPreviousNode();
    if (this.tail) {
      this.tail.setNextNode(null);
    }
    if (removedTail === this.head) this.removeHead();

    return removedTail.data;
  }

  // remove by Data
  removeByData(data: T) {
    let nodeToRemove;
    let currentNode = this.head;
    while (currentNode !== null) {
      if (currentNode.data === data) {
        nodeToRemove = currentNode;
        break;
      }
      currentNode = currentNode.getNextNode();
    }
    if (!nodeToRemove) return null;

    if (nodeToRemove === this.head) {
      this.removeHead();
    } else if (nodeToRemove === this.tail) {
      this.removeTail();
    } else {
      const nextNode = nodeToRemove.getNextNode();
      const previousNode = nodeToRemove.getPreviousNode();
      nextNode?.setPreviousNode(previousNode);
      previousNode?.setNextNode(nextNode);
    }
    return nodeToRemove;
  }

  // remove by Data reversed
  removeByDataReversed(data: T) {
    let nodeToRemove;
    let currentNode = this.tail;
    while (currentNode !== null) {
      if (currentNode.data === data) {
        nodeToRemove = currentNode;
        break;
      }
      currentNode = currentNode.getPreviousNode();
    }
    if (!nodeToRemove) {
      return null;
    }
    if (nodeToRemove === this.tail) {
      this.removeTail();
    } else if (nodeToRemove === this.head) {
      this.removeHead();
    } else {
      const previousNode = nodeToRemove.getNextNode();
      const nextNode = nodeToRemove.getPreviousNode();
      nextNode?.setNextNode(previousNode);
      previousNode?.setPreviousNode(nextNode);
    }
    return nodeToRemove;
  }

  // print Doubly Linked List
  printList() {
    let currentNode = this.head;
    let output = '<head> ';
    while (currentNode !== null) {
      output += currentNode.data + ' ';
      currentNode = currentNode.getNextNode();
    }
    output += '<tail>';
    console.log(output);
  }
}
