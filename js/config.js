// Application Configuration and Constants

export const CONFIG = {
    modes: {
        TIME: 'time',
        WORDS: 'words',
        QUOTE: 'quote'
    },
    
    defaults: {
        mode: 'time',
        timeLimit: 15,
        wordCount: 25,
        difficulty: 'easy'
    },
    
    punctuationFrequency: 0.15,
    numberFrequency: 0.08
};

// Word pools for different difficulties
export const WORD_POOLS = {
    easy: [
        'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it', 
        'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 
        'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 
        'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 
        'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 
        'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 
        'take', 'into', 'your', 'some', 'could', 'them', 'see', 'other', 
        'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 
        'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 
        'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 
        'give', 'day', 'most', 'us', 'is', 'was', 'are', 'been', 'has', 
        'had', 'were', 'said', 'did', 'may', 'should', 'must', 'might'
    ],
    
    medium: [
        'time', 'person', 'year', 'way', 'day', 'thing', 'man', 'world', 
        'life', 'hand', 'part', 'child', 'eye', 'woman', 'place', 'work', 
        'week', 'case', 'point', 'government', 'company', 'number', 'group', 
        'problem', 'fact', 'good', 'new', 'first', 'last', 'long', 'great', 
        'little', 'own', 'other', 'old', 'right', 'big', 'high', 'different', 
        'small', 'large', 'next', 'early', 'young', 'important', 'few', 
        'public', 'bad', 'same', 'able', 'water', 'house', 'book', 'story', 
        'room', 'friend', 'father', 'mother', 'area', 'money', 'business', 
        'issue', 'level', 'family', 'power', 'country', 'question', 'school', 
        'state', 'night', 'north', 'south', 'result', 'change', 'morning', 
        'reason', 'research', 'moment', 'air', 'teacher', 'force', 'education', 
        'foot', 'care', 'range', 'science', 'return', 'building', 'action', 
        'process', 'music', 'including', 'consider', 'appear', 'study', 
        'human', 'provide', 'service', 'president'
    ],
    
    hard: [
        'according', 'achieve', 'actually', 'administration', 'although', 
        'approach', 'authority', 'available', 'benefit', 'campaign', 'capacity', 
        'challenge', 'character', 'commercial', 'committee', 'community', 
        'comparison', 'competition', 'condition', 'conference', 'conscious', 
        'consequence', 'construction', 'contribution', 'conversation', 
        'decision', 'democratic', 'department', 'determine', 'development', 
        'difference', 'difficult', 'discussion', 'distribution', 'economic', 
        'education', 'environment', 'equipment', 'especially', 'establish', 
        'everybody', 'everything', 'experience', 'financial', 'generation', 
        'government', 'individual', 'institution', 'international', 'investment', 
        'opportunity', 'organization', 'particular', 'performance', 'perspective', 
        'population', 'possibility', 'production', 'professional', 'recognition', 
        'relationship', 'requirement', 'responsibility', 'significant', 
        'traditional', 'understanding', 'achievement', 'agreement', 'arrangement', 
        'assessment', 'assignment', 'assistance', 'association', 'assumption', 
        'atmosphere', 'attachment', 'background', 'beautiful', 'beginning', 
        'championship', 'characteristic', 'circumstances', 'collaboration', 
        'collection', 'combination', 'comfortable', 'commission', 'commitment', 
        'communication', 'concentration', 'conclusion', 'confidence', 
        'connection', 'consideration', 'consistent', 'contemporary', 
        'contribution', 'conventional', 'corporation', 'declaration'
    ]
};

export const QUOTES = [
    "The quick brown fox jumps over the lazy dog.",
    "Practice makes perfect, but nobody's perfect, so why practice?",
    "Typing is a skill that improves with dedication and consistent practice.",
    "Speed comes naturally when accuracy is your primary focus.",
    "Every expert was once a beginner who refused to give up.",
    "The journey of a thousand words begins with a single keystroke.",
    "Mastery is not a destination, but a continuous journey of improvement.",
    "Success is the sum of small efforts repeated day in and day out.",
    "Don't watch the clock; do what it does. Keep going.",
    "The only way to do great work is to love what you do."
];

export const PUNCTUATION_MARKS = [',', '.', '!', '?', ';', ':'];
