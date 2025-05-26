export function findNavById(tree, id) {
  for (const node of tree) {
    if (node.id === id) return node;
    if (node.children?.length) {
      const found = findNavById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}
