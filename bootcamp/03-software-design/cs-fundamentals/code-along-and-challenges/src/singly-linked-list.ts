/**
 * SinglyLinkedList — a chain of nodes, each pointing only forward.
 *
 * Handout: docs/learning/03-software-design/software-design-cs-fundamentals/data-structures.md
 *          ("Linked lists")
 *
 * Build this on top of `Node<T>` from ./node.ts rather than redefining the
 * node shape here.
 *
 * TODO — implement `SinglyLinkedList<T>` with:
 * - `head: Node<T> | null`
 * - `addToHead(data: T): void`
 * - `addToTail(data: T): void`
 * - `removeHead(): T | undefined` — removes and returns the head's value
 * - `printList(): void` — logs something like `<head> a b c <tail>`
 *
 * Try it against a small sequence of values and log the result at each step.
 */
import { Node } from './node.ts';

export class LinkedList<T> {
  head: Node<T> | null = null;

  // add Node to head of LinkedList
  addToHead(data: T): void {
    const newHead = new Node(data);
    const currentHead = this.head;
    this.head = newHead;
    if (currentHead) {
      this.head.setNextNode(currentHead);
    }
  }

  // add Node to tail of LinkedList
  addToTail(data: T): void {
    let tail = this.head;
    if (!tail) {
      this.head = new Node(data);
    } else {
      let next = tail.getNextNode();
      while (next !== null) {
        tail = next;
        next = tail.getNextNode();
      }
      tail.setNextNode(new Node(data));
    }
  }

  // remove Node from the Head
  removeHead(): T | undefined {
    const removedHead = this.head;
    if (!removedHead) {
      return;
    }
    this.head = removedHead.getNextNode();
    return removedHead.data;
  }

  // remove Node from the Tail
  removeTail(): T | undefined {
    if (this.head === null) {
      return undefined;
    }

    if (this.head.getNextNode() === null) {
      const data = this.head.data;
      this.head = null;
      return data;
    }

    let current = this.head;

    while (true) {
      const next = current.getNextNode();

      if (next === null) {
        return undefined;
      }

      if (next.getNextNode() === null) {
        current.setNextNode(null);
        return next.data;
      }

      current = next;
    }
  }

  // print LinkedList
  printList(): void {
    let currentNode = this.head;
    let output = '<head> ';
    while (currentNode !== null) {
      output += `[${currentNode.data}], `;
      currentNode = currentNode.getNextNode();
    }
    output += '<Tail>';
    console.log(output);
  }
}
