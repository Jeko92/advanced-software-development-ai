export class TreeNode<T> {
  data: T;
  children: TreeNode<T>[] = [];

  constructor(data: T) {
    this.data = data;
  }

  // add a child to Tree
  addChild(child: TreeNode<T> | T): void {
    if (child instanceof TreeNode) {
      this.children.push(child);
    } else {
      this.children.push(new TreeNode(child));
    }
  }

  // remove a child from Tree
  removeChild(childToRemove: TreeNode<T> | T): void {
    const originalLength = this.children.length;

    this.children = this.children.filter((child) => {
      if (childToRemove instanceof TreeNode) {
        return child !== childToRemove;
      }

      return child.data !== childToRemove;
    });

    // If nothing was removed at this level,
    // search recursively through the children.
    if (originalLength === this.children.length) {
      this.children.forEach((child) => {
        child.removeChild(childToRemove);
      });
    }
  }

  // pretty print Tree
  print(level = 0): void {
    const indentation = '-- '.repeat(level);

    console.log(`${indentation}${this.data}`);

    this.children.forEach((child) => {
      child.print(level + 1);
    });
  }

  // depth-first traversal
  depthFirstTraversal(): void {
    console.log(this.data);

    this.children.forEach((child) => {
      child.depthFirstTraversal();
    });
  }

  // breadth-first traversal
  breadthFirstTraversal(): void {
    const queue: TreeNode<T>[] = [this];

    while (queue.length > 0) {
      const current = queue.shift();

      if (current === undefined) {
        return;
      }

      console.log(current.data);

      queue.push(...current.children);
    }
  }
}
