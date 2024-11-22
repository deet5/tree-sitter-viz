const MaxPathLength = 8;
const MaxPathWidth = 2;

ParentTypeToAddChildId = new Set(["assignment_expression", "array_access", "method_invocation"]);

class PathExtractor {
    constructor(tree) {
        this.tree = tree;
    }

    extractPath(source, target) {
        const sourceStack = this.getPathStack(source);
        const targetStack = this.getPathStack(target);

        const lenCommonPrefix = this.lenCommonPrefix(sourceStack, targetStack);

        /*
        Calculate the path length.
        The path length is sourceStack.length + targetStack.length - 2 * lenCommonPrefix.
        The path length is within MaxPathLength.
        */
        const pathLength = sourceStack.length + targetStack.length - 2 * lenCommonPrefix;
        if (pathLength > MaxPathLength) {
            return "The path length exceeds MaxPathLength=8.";
        }


        /*
        Calculate the path width. 
        The path width is the difference between the child ids of the first nodes that differ.
        The path width is within MaxPathWidth.
        */ 
        
        if (sourceStack.length > lenCommonPrefix && targetStack.length > lenCommonPrefix) {
            const sourceSibling = sourceStack[lenCommonPrefix];
            const targetSibling = targetStack[lenCommonPrefix];

            const pathWidth = Math.abs(sourceSibling.childId - targetSibling.childId);
            if (pathWidth > MaxPathWidth) {
                console.log(targetSibling);
                return "The path width exceeds MaxPathWidth=2.";
            }
        }

        let p = "";
        const cpIdx = sourceStack.length - lenCommonPrefix;
        const sourceStackTruncated = sourceStack.slice(lenCommonPrefix).reverse();

        for (let i = 0; i < cpIdx; i++) {
            let srcChildId = "";
            
            if (i === 0 || ParentTypeToAddChildId.has(sourceStackTruncated[i - 1].name)) {
                srcChildId = `${sourceStackTruncated[i].childId}`;
            }

            p += `(${sourceStackTruncated[i].name}${srcChildId})^`;
        }

        // construct common prefix
        const cpNode = sourceStack[lenCommonPrefix - 1];
        let cpChildId = "";
        if (ParentTypeToAddChildId.has(cpNode.name)) {
            cpChildId = `${cpNode.childId}`;
        }
        p += `(${cpNode.name}${cpChildId})`;

        // construct the path from the common prefix to the target node
        const targetStackTruncated = targetStack.slice(lenCommonPrefix);
        for (let i = 0; i < targetStackTruncated.length; i++) {
            let tgtChildId = "";
            if (i > 0 && (i === targetStackTruncated.length - 1 || ParentTypeToAddChildId.has(targetStackTruncated[i].name))) {
                tgtChildId = `${targetStackTruncated[i].childId}`;
            }

            if (targetStackTruncated.length === 1 || ParentTypeToAddChildId.has(targetStackTruncated[i].name)) {
                tgtChildId = `${targetStackTruncated[i].childId}`;
            }

            p += `_(${targetStackTruncated[i].name}${tgtChildId})`;
        }

        return p;
    }

    getPathStack(node) {
        const path = [];

        const findNode = (node, find) => {
            if (node.name === find.name 
                && node.text === find.text 
                && node.children.length == 0
                && node.childId === find.childId) {
                path.push(node);
                return path;
            }

            path.push(node);

            for (let i = 0; i < node.children.length; i++) {
                const child = node.children[i];
                const result = findNode(child, find);
                if (result) {
                    return result;
                }
            }

            path.pop();
        }

        findNode(this.tree, node);
        return path;
    }

    lenCommonPrefix(sourceStack, targetStack) {
        let lenCommonPrefix = 0;

        while (lenCommonPrefix < sourceStack.length && lenCommonPrefix < targetStack.length) {
            if (sourceStack[lenCommonPrefix] !== targetStack[lenCommonPrefix]) {
                break;
            }

            lenCommonPrefix++;
        }

        return lenCommonPrefix;
    }
}

module.exports = PathExtractor;
