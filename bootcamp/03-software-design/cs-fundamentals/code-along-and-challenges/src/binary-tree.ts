export class BinaryTreeNode<T> {
  value: T;
  left: BinaryTreeNode<T> | null = null;
  right: BinaryTreeNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }

  // attach a value wherever there's room, filling left before right —
  // without ordering rule
  insert(value: T): void {
    if (!this.left) {
      this.left = new BinaryTreeNode(value);
    } else if (!this.right) {
      this.right = new BinaryTreeNode(value);
    } else {
      this.left.insert(value);
    }
  }

  // pretty print
  print(level = 0, side = 'root'): void {
    const indentation = '-- '.repeat(level);
    console.log(`${indentation}[${side}] ${this.value}`);

    if (this.left) {
      this.left.print(level + 1, 'L');
    }

    if (this.right) {
      this.right.print(level + 1, 'R');
    }
  }

  // pre-order: node, then left subtree, then right subtree
  preOrderTraversal(): void {
    console.log(this.value);
    this.left?.preOrderTraversal();
    this.right?.preOrderTraversal();
  }

  // in-order: left subtree, then node, then right subtree
  inOrderTraversal(): void {
    this.left?.inOrderTraversal();
    console.log(this.value);
    this.right?.inOrderTraversal();
  }

  // post-order: left subtree, then right subtree, then node
  postOrderTraversal(): void {
    this.left?.postOrderTraversal();
    this.right?.postOrderTraversal();
    console.log(this.value);
  }

  // find: node / leaf
  find(value: T): boolean {
    if (this.value === value) {
      return true;
    }

    return (this.left?.find(value) ?? false) || (this.right?.find(value) ?? false);
  }

  // remove: node / leaf
  remove(value: T): boolean {
    if (this.left?.value === value) {
      this.left = null;
      return true;
    }

    if (this.right?.value === value) {
      this.right = null;
      return true;
    }

    return (
      (this.left?.remove(value) ?? false) || (this.right?.remove(value) ?? false)
    );
  }

  // height: number of edges from this node down to its deepest leaf 
  height(): number {
    const leftHeight = this.left ? this.left.height() : -1;
    const rightHeight = this.right ? this.right.height() : -1;

    return 1 + Math.max(leftHeight, rightHeight);
  }

  // size: total number of nodes in this subtree, including this one
  size(): number {
    const leftSize = this.left ? this.left.size() : 0;
    const rightSize = this.right ? this.right.size() : 0;

    return 1 + leftSize + rightSize;
  }
}
