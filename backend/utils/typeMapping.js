/**
 * Type ID to Part of Speech mapping
 * Extracted from the 'type' table in the database
 */

const TYPE_MAPPING = {
    1: 'ARTICLE',
    2: 'MORE',
    3: 'ADVERB',
    4: 'ADJECTIVE',
    5: 'NOUN',
    6: 'PREFIX',
    7: 'PREPOSITION',
    8: 'VERB',
    9: 'ABBREVIATION',
    10: 'CONJUNCTION',
    11: 'PRONOUN',
    12: 'PHRASE',
    13: 'INTERJECTION',
    14: '',
    15: 'AUXILIARY VERB',
    16: 'SUFFIX',
    17: 'PARTICLE'
};

function getTypeName(typeId) {
    return TYPE_MAPPING[typeId] || `Type ${typeId}`;
}

module.exports = { TYPE_MAPPING, getTypeName };
