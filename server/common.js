const BLANK_WORD = "BLANK";

class MethodContents {
    constructor(leaves, methodName, methodLength) {
        this.leaves = leaves;
        this.methodName = methodName;
        this.methodLength = methodLength;
    }
}

class NodeDataManager {
    constructor() {
        this.nodeData = new Map();
    }

    setNodeData(node, data) {
        this.nodeData.set(node, data);
    }

    getNodeData(node) {
        return this.nodeData.get(node);
    }
}

function normalizeName(original, defaultString) {
    original = original
        .toLowerCase()
        .replace(/\\n/g, "") // escaped new lines
        .replace(/\s+/g, "") // whitespace
        .replace(/["\',]/g, "") // quotes, apostrophes, commas
        .replace(/[^\x20-\x7E]/g, ""); // weird characters

    const stripped = original.replace(/[^A-Za-z]/g, "");

    if (stripped.length === 0) {
        const carefulStripped = original.replace(/ /g, "_");
        return carefulStripped.length > 0 ? carefulStripped : defaultString;
    } else {
        return stripped;
    }
}

function splitToSubtokens(inputStr) {
    // Trim input string
    const str2 = inputStr.trim(); 

    const pattern = /(?<=[a-z])(?=[A-Z])|_|[0-9]|(?<=[A-Z])(?=[A-Z][a-z])|\s+/;
    const subtokens = str2.split(pattern); // Split based on the pattern

    // Normalize and filter out empty subtokens
    return subtokens.map(token => normalizeName(token, ''));
}

const nodeIdManager = new NodeDataManager();
const nodePropertyManager = new NodeDataManager();

module.exports = {
    MethodContents,
    nodeIdManager,
    nodePropertyManager,
    normalizeName,
    splitToSubtokens,
    BLANK_WORD
};
