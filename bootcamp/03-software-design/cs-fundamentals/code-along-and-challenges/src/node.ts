export class Node<T> {
  next: Node<T> | null = null;
  data: T;

  constructor(data: T) {
    this.data = data;
  }

  setNextNode(node: Node<T> | null): void {
    if (!(node instanceof Node) && node !== null) {
      throw new Error('Next node must be a member of the Node class.');
    }

    this.next = node;
  }

  getNextNode(): Node<T> | null {
    return this.next;
  }
}

export class DoublyNode<T> extends Node<T> {
  override next: DoublyNode<T> | null = null;
  previous: DoublyNode<T> | null = null;

  override setNextNode(node: DoublyNode<T> | null): void {
    if (!(node instanceof DoublyNode) && node !== null) {
      throw new Error('Next node must be a member of the DoublyNode class.');
    }

    this.next = node;
  }

  setPreviousNode(node: DoublyNode<T> | null): void {
    if (!(node instanceof DoublyNode) && node !== null) {
      throw new Error(
        'Previous node must be a member of the DoublyNode class.',
      );
    }

    this.previous = node;
  }

  override getNextNode(): DoublyNode<T> | null {
    return this.next;
  }

  getPreviousNode(): DoublyNode<T> | null {
    return this.previous;
  }
}
