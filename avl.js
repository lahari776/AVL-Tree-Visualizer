class Node {
    constructor(key) {
        this.key = key;
        this.left = null;
        this.right = null;
        this.height = 1;
        this.x = 0;
        this.y = 0;
    }
}

let root = null;
const svg = document.getElementById("tree");

function height(node) {
    return node ? node.height : 0;
}

function balanceFactor(node) {
    return height(node.left) - height(node.right);
}

function rightRotate(y) {
    let x = y.left;
    let T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = Math.max(height(y.left), height(y.right)) + 1;
    x.height = Math.max(height(x.left), height(x.right)) + 1;

    return x;
}

function leftRotate(x) {
    let y = x.right;
    let T2 = y.left;

    y.left = x;
    x.right = T2;

    x.height = Math.max(height(x.left), height(x.right)) + 1;
    y.height = Math.max(height(y.left), height(y.right)) + 1;

    return y;
}

function insert(node, key) {
    if (!node) return new Node(key);

    if (key < node.key)
        node.left = insert(node.left, key);
    else if (key > node.key)
        node.right = insert(node.right, key);
    else
        return node;

    node.height = 1 + Math.max(height(node.left), height(node.right));

    let balance = balanceFactor(node);

    // LL
    if (balance > 1 && key < node.left.key)
        return rightRotate(node);

    // RR
    if (balance < -1 && key > node.right.key)
        return leftRotate(node);

    // LR
    if (balance > 1 && key > node.left.key) {
        node.left = leftRotate(node.left);
        return rightRotate(node);
    }

    // RL
    if (balance < -1 && key < node.right.key) {
        node.right = rightRotate(node.right);
        return leftRotate(node);
    }

    return node;
}

function insertValue() {
    const val = parseInt(document.getElementById("value").value);
    if (isNaN(val)) return;
    root = insert(root, val);
    drawTree();
}

function resetTree() {
    root = null;
    svg.innerHTML = "";
}

function drawTree() {
    svg.innerHTML = "";
    assignPositions(root, 500, 50, 200);
    drawEdges(root);
    drawNodes(root);
}

function assignPositions(node, x, y, gap) {
    if (!node) return;
    node.x = x;
    node.y = y;
    assignPositions(node.left, x - gap, y + 70, gap / 1.5);
    assignPositions(node.right, x + gap, y + 70, gap / 1.5);
}

function drawEdges(node) {
    if (!node) return;
    if (node.left) {
        drawLine(node.x, node.y, node.left.x, node.left.y);
        drawEdges(node.left);
    }
    if (node.right) {
        drawLine(node.x, node.y, node.right.x, node.right.y);
        drawEdges(node.right);
    }
}

function drawNodes(node) {
    if (!node) return;

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", node.x);
    circle.setAttribute("cy", node.y);
    circle.setAttribute("r", 20);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", node.x);
    text.setAttribute("y", node.y);
    text.textContent = node.key;

    svg.appendChild(circle);
    svg.appendChild(text);

    drawNodes(node.left);
    drawNodes(node.right);
}
function minValueNode(node) {
    let current = node;
    while (current.left !== null)
        current = current.left;
    return current;
}
function deleteNode(root, key) {
    if (!root) return root;

    // BST delete
    if (key < root.key)
        root.left = deleteNode(root.left, key);
    else if (key > root.key)
        root.right = deleteNode(root.right, key);
    else {
        // Node with one or no child
        if (!root.left || !root.right) {
            let temp = root.left ? root.left : root.right;

            if (!temp) {
                root = null;
            } else {
                root = temp;
            }
        } 
        // Node with two children
        else {
            let temp = minValueNode(root.right);
            root.key = temp.key;
            root.right = deleteNode(root.right, temp.key);
        }
    }

    if (!root) return root;

    // Update height
    root.height = Math.max(height(root.left), height(root.right)) + 1;

    let balance = balanceFactor(root);

    // LL
    if (balance > 1 && balanceFactor(root.left) >= 0)
        return rightRotate(root);

    // LR
    if (balance > 1 && balanceFactor(root.left) < 0) {
        root.left = leftRotate(root.left);
        return rightRotate(root);
    }

    // RR
    if (balance < -1 && balanceFactor(root.right) <= 0)
        return leftRotate(root);

    // RL
    if (balance < -1 && balanceFactor(root.right) > 0) {
        root.right = rightRotate(root.right);
        return leftRotate(root);
    }

    return root;
}
function deleteValue() {
    const val = parseInt(document.getElementById("value").value);
    if (isNaN(val)) return;
    root = deleteNode(root, val);
    drawTree();
}

function drawLine(x1, y1, x2, y2) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    svg.appendChild(line);
}
