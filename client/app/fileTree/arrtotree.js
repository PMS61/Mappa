export function buildTree(paths) {
  let root = {};
  
  paths.forEach(path => {
      let parts = path.split('/');
      let current = root;

      parts.forEach((part, index) => {
          if (!current.children) current.children = [];
          
          let node = current.children.find(n => n.name === part);
          
          if (!node) {
              node = { name: part, children: [] };
              current.children.push(node);
          }
          
          if (index === parts.length - 1) {
              node.roomId = path; // Assign room ID to leaf nodes
              if (node.children.length === 0) node.children = null; // Leaf node
          }
          
          current = node;
      });
  });
  
  return root.children;
}

// Example usage
const paths = ["F1/f2/file1", "F1/f2/file2", "F2/file21"];
console.log(JSON.stringify(buildTree(paths), null, 2));
