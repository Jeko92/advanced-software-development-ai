export class BinarySearchTree<T extends number | string> {
  value: T;
  left: BinarySearchTree<T> | null = null;
  right: BinarySearchTree<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }

  // add node / leaf
  insert(value: T): void {
    if (value === this.value) {
      return;
    }

    if (value < this.value) {
      if (this.left === null) {
        this.left = new BinarySearchTree(value);
      } else {
        this.left.insert(value);
      }
    } else {
      if (this.right === null) {
        this.right = new BinarySearchTree(value);
      } else {
        this.right.insert(value);
      }
    }
  }

  // find node / leaf
  find(value: T): BinarySearchTree<T> | null {
    if (value === this.value) {
      return this;
    }

    if (value < this.value) {
      return this.left?.find(value) ?? null;
    }

    return this.right?.find(value) ?? null;
  }

  // pretty print
  print(level = 0, side = 'root'): void {
    const indentation = '-- '.repeat(level);

    console.log(`${indentation}[${side}] ${this.value}`);

    this.left?.print(level + 1, 'L');
    this.right?.print(level + 1, 'R');
  }

  // pre-order traversal
  preOrderTraversal(): void {
    console.log(this.value);

    this.left?.preOrderTraversal();
    this.right?.preOrderTraversal();
  }

  // in-order traversal
  inOrderTraversal(): void {
    this.left?.inOrderTraversal();

    console.log(this.value);

    this.right?.inOrderTraversal();
  }

  // post-order traversal
  postOrderTraversal(): void {
    this.left?.postOrderTraversal();
    this.right?.postOrderTraversal();

    console.log(this.value);
  }

  // depth-first traversal
  depthFirstTraversal(): void {
    this.inOrderTraversal();
  }

  // remove
  remove(value: T): boolean {
    if (value < this.value) {
      if (this.left === null) {
        return false;
      }

      if (this.left.value === value) {
        this.left = this.removeNode(this.left);
        return true;
      }

      return this.left.remove(value);
    }

    if (value > this.value) {
      if (this.right === null) {
        return false;
      }

      if (this.right.value === value) {
        this.right = this.removeNode(this.right);
        return true;
      }

      return this.right.remove(value);
    }

    return false;
  }

  // remove node / leaf
  private removeNode(node: BinarySearchTree<T>): BinarySearchTree<T> | null {
    if (node.left === null && node.right === null) {
      return null;
    }

    if (node.left === null) {
      return node.right;
    }

    if (node.right === null) {
      return node.left;
    }

    let successor = node.right;

    while (successor.left !== null) {
      successor = successor.left;
    }

    node.value = successor.value;

    if (node.right.value === successor.value) {
      node.right = this.removeNode(node.right);
    } else {
      node.right.remove(successor.value);
    }

    return node;
  }

  // show height of tree
  height(): number {
    const leftHeight = this.left ? this.left.height() : -1;
    const rightHeight = this.right ? this.right.height() : -1;

    return 1 + Math.max(leftHeight, rightHeight);
  }

  // show size of tree
  size(): number {
    const leftSize = this.left ? this.left.size() : 0;
    const rightSize = this.right ? this.right.size() : 0;

    return 1 + leftSize + rightSize;
  }
}
