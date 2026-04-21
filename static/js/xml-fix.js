// XML formatting fix: keep leaf nodes on one line
// Completely replaces prettyPrintXml from main.js
window.prettyPrintXml = function(xmlStr) {
    var result = '';
    var indent = '';
    var tab = '  ';

    // Remove existing whitespace between tags
    xmlStr = xmlStr.replace(/>\s+</g, '><').replace(/\n/g, '').replace(/\r/g, '');

    // Split into tokens
    var tokens = xmlStr.match(/<[^>]+>|[^<]+/g) || [];

    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];

        if (token.match(/^<\//)) {
            // Closing tag
            indent = indent.substring(tab.length);
            if (result && !result.endsWith('\n')) result += '\n';
            result += indent + token + '\n';
        } else if (token.match(/^<[^/].*\/>$/)) {
            // Self-closing tag
            if (result && !result.endsWith('\n')) result += '\n';
            result += indent + token + '\n';
        } else if (token.match(/^</)) {
            // Opening tag - check if it's a leaf node (no child elements)
            var nextToken = (i + 1 < tokens.length) ? tokens[i + 1] : null;
            var afterNext = (i + 2 < tokens.length) ? tokens[i + 2] : null;

            if (nextToken && !nextToken.match(/^</) && afterNext && afterNext.match(/^<\//)) {
                // Leaf node: <tag>text</tag> - output on one line
                if (result && !result.endsWith('\n')) result += '\n';
                result += indent + token + nextToken.trim() + afterNext + '\n';
                i += 2; // Skip the text and closing tag tokens
            } else {
                // Has child elements - output with indentation
                if (result && !result.endsWith('\n')) result += '\n';
                result += indent + token + '\n';
                indent += tab;
            }
        } else {
            // Text content
            var text = token.trim();
            if (text) {
                result += indent + text + '\n';
            }
        }
    }

    return result.trim();
};
