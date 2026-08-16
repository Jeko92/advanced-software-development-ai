import { LinkedList } from './singly-linked-list.ts';

export class Stack<T> {
  private list: LinkedList<T>;
  private maxSize: number;
  private _size: number;

  /**
   * @param maxSize — optional fixed capacity. push() throws if exceeded.
   */
  constructor(maxSize?: number) {
    this.list = new LinkedList<T>();
    this.maxSize = maxSize ?? Infinity;
    this._size = 0;
  }

  // add an element to the top of the stack.
  push(value: T): void {
    if (this._size >= this.maxSize) {
      throw new Error(
        `Stack overflow: cannot push, maxSize of ${this.maxSize} reached.`,
      );
    }
    this.list.addToHead(value);
    this._size++;
  }

  // remove and return the top element, or undefined if empty.
  pop(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    const value = this.list.removeHead();
    this._size--;
    return value;
  }

  // read the top element without removing it, or undefined if empty.
  peek(): T | undefined {
    return this.list.head?.data;
  }

  // check if stack is empty
  isEmpty(): boolean {
    return this._size === 0;
  }

  // check stack size
  size(): number {
    return this._size;
  }

  // see configured maxSize (Infinity if none was set).
  getMaxSize(): number {
    return this.maxSize;
  }

  // how many more items can be pushed before hitting maxSize.
  remaining(): number {
    return this.maxSize === Infinity ? Infinity : this.maxSize - this._size;
  }

  // empty the stack.
  clear(): void {
    while (!this.isEmpty()) {
      this.pop();
    }
  }

  // returns a top-to-bottom array (head → tail).
  toArray(): T[] {
    const result: T[] = [];
    let current = this.list.head;
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }
}
