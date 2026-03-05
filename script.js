// AI Typing Assistant for Impaired Typers
class TypingAssistant {
    constructor() {
        this.inputBox = document.getElementById('input-box');
        this.spellingList = document.getElementById('spelling-list');
        this.grammarList = document.getElementById('grammar-list');
        this.contextList = document.getElementById('context-list');
        this.autoCorrect = document.getElementById('auto-correct');
        
        this.setupEventListeners();
        this.initializeDictionaries();
    }

    setupEventListeners() {
        this.inputBox.addEventListener('input', () => this.processText());
        document.getElementById('clear-btn').addEventListener('click', () => this.clearText());
        document.getElementById('apply-all-btn').addEventListener('click', () => this.applyAllSuggestions());
    }

    initializeDictionaries() {
        this.wordFreq = {
            'the': 1000, 'and': 800, 'that': 600, 'have': 550, 'this': 520,
            'from': 500, 'with': 480, 'you': 450, 'for': 440, 'they': 420,
            'what': 400, 'when': 380, 'where': 360, 'which': 340, 'who': 320
        };
        
        this.spellingCorrections = {
            'teh': 'the', 'recieve': 'receive', 'seperate': 'separate',
            'occured': 'occurred', 'begining': 'beginning', 'untill': 'until',
            'wich': 'which', 'thier': 'their', 'beleive': 'believe',
            'acheive': 'achieve', 'thsi': 'this'
        };
        
        this.grammarRules = {
            'i am': 'I am', 'i have': 'I have', 'i can': 'I can',
            'dont': "don't", 'wont': "won't", 'cant': "can't",
            'thats': "that's", 'whats': "what's", 'youre': "you're"
        };
    }

    processText() {
        const text = this.inputBox.value;
        if (text.length === 0) {
            this.clearSuggestions();
            return;
        }

        const words = text.toLowerCase().split(/\s+/);
        const lastWord = words[words.length - 1];

        this.generateSpellingSuggestions(words);
        this.generateGrammarSuggestions(text);
        this.generateContextSuggestions(words, lastWord);

        // Auto-correct if enabled and suggestions exist
        if (this.autoCorrect.checked) {
            this.autoApplyCorrections();
        }
    }

    generateSpellingSuggestions(words) {
        const suggestions = [];
        
        words.forEach(word => {
            const cleanWord = word.replace(/[\.,!?;:]/g, '');
            if (this.spellingCorrections[cleanWord]) {
                suggestions.push({
                    original: cleanWord,
                    corrected: this.spellingCorrections[cleanWord],
                    type: 'spelling'
                });
            }
        });

        this.displaySuggestions(this.spellingList, suggestions, 'spelling');
    }

    generateGrammarSuggestions(text) {
        const suggestions = [];
        const textLower = text.toLowerCase();
        
        for (const [key, value] of Object.entries(this.grammarRules)) {
            if (textLower.includes(key)) {
                suggestions.push({
                    original: key,
                    corrected: value,
                    type: 'grammar'
                });
            }
        }

        this.displaySuggestions(this.grammarList, suggestions, 'grammar');
    }

    generateContextSuggestions(words, lastWord) {
        if (lastWord.length < 2) {
            this.displaySuggestions(this.contextList, [], 'context');
            return;
        }

        const suggestions = [];
        const wordList = Object.keys(this.wordFreq);
        
        wordList.forEach(word => {
            if (word.startsWith(lastWord.toLowerCase().substr(0, 2))) {
                suggestions.push({
                    original: lastWord,
                    corrected: word,
                    type: 'predictive',
                    confidence: 'likely'
                });
            }
        });

        const topSuggestions = suggestions.slice(0, 3);
        this.displaySuggestions(this.contextList, topSuggestions, 'context');
    }

    displaySuggestions(container, suggestions, type) {
        container.innerHTML = '';
        
        if (suggestions.length === 0) {
            const noInfo = document.createElement('div');
            noInfo.className = 'suggestion-item suggestion-item-disabled';
            noInfo.textContent = 'No suggestions currently';
            container.appendChild(noInfo);
            return;
        }

        suggestions.forEach(suggestion => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            
            item.innerHTML = `
                <span><strong>${suggestion.corrected}</strong></span>
                <span class="suggestion-context">(from: ${suggestion.original})</span>
            `;
            
            item.addEventListener('click', () => this.applySuggestion(suggestion));
            container.appendChild(item);
        });
    }

    applySuggestion(suggestion) {
        let text = this.inputBox.value;
        const regex = new RegExp(suggestion.original, 'gi');
        
        if (suggestion.type === 'predictive') {
            // Handle predictive completion
            const words = text.split(/\s+/);
            if (words.length > 0) {
                words[words.length - 1] = suggestion.corrected;
                text = words.join(' ');
            }
        } else {
            // Handle regular corrections
            text = text.replace(regex, suggestion.corrected);
        }
        
        this.inputBox.value = text;
        this.processText();
        
        // Add visual feedback
        this.inputBox.classList.add('corrected');
        setTimeout(() => this.inputBox.classList.remove('corrected'), 1000);
    }

    autoApplyCorrections() {
        // Simple auto-correction for common mistakes
        let text = this.inputBox.value;
        let corrected = false;

        this.spellingCorrections.forEach = Object.entries(this.spellingCorrections);
        this.spellingCorrections.forEach(([wrong, right]) => {
            if (text.toLowerCase().includes(wrong)) {
                const regex = new RegExp(wrong, 'gi');
                text = text.replace(regex, right);
                corrected = true;
            }
        });

        // Grammar auto-correction
        Object.entries(this.grammarRules).forEach(([wrong, right]) => {
            if (text.toLowerCase().includes(wrong)) {
                const regex = new RegExp(wrong, 'gi');
                text = text.replace(regex, right);
                corrected = true;
            }
        });

        if (corrected) {
            this.inputBox.value = text;
            this.inputBox.classList.add('corrected');
            setTimeout(() => this.inputBox.classList.remove('corrected'), 1000);
        }
    }

    applyAllSuggestions() {
        const buttons = document.querySelectorAll('.suggestion-item');
        buttons.forEach(button => button.click());
    }

    clearText() {
        this.inputBox.value = '';
        this.clearSuggestions();
    }

    clearSuggestions() {
        this.spellingList.innerHTML = '';
        this.grammarList.innerHTML = '';
        this.contextList.innerHTML = '';
        
        // Add placeholder messages
        ['spelling-list', 'grammar-list', 'context-list'].forEach(id => {
            const container = document.getElementById(id);
            const noInfo = document.createElement('div');
            noInfo.className = 'suggestion-item suggestion-item-disabled';
            noInfo.textContent = 'Start typing for suggestions...';
            container.appendChild(noInfo);
        });
    }

    // Real-time word count and stats
