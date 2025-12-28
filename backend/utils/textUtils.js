/**
 * Utility functions for text processing
 */

/**
 * Detect if text contains Bengali characters
 */
function isBengali(text) {
    // Bengali Unicode range: \u0980-\u09FF
    return /[\u0980-\u09FF]/.test(text);
}

/**
 * Detect if text contains only English characters
 */
function isEnglish(text) {
    return /^[A-Za-z\s'-]+$/.test(text);
}

/**
 * Safely parse JSON fields (def, ant which are stored as JSON strings)
 */
function safeParseJSON(jsonString) {
    if (!jsonString) return null;
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        return jsonString;
    }
}

module.exports = { isBengali, isEnglish, safeParseJSON };
