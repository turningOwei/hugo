// XML formatting fix: keep inline elements on one line
// This script overrides prettyPrintXml from main.js
(function() {
    var orig = window.prettyPrintXml;
    if (!orig) return;
    window.prettyPrintXml = function(xmlStr) {
        var result = orig(xmlStr);
        // Merge <tag>\n  text\n</tag> into <tag>text</tag>
        result = result.replace(/(<[^\/!][^>]*>)\n(\s*)([^<\n]+)\n(\s*)(<\/[^>]+>)/g, function(m, open, s1, text, s2, close) {
            // Check indent matches (same level)
            if (s1.length === s2.length) {
                return open + text + close;
            }
            return m;
        });
        return result;
    };
})();
