// English Reminder Parser - Adapted from Swift
// This is a simplified JavaScript version of the Swift parser for demo purposes

class EnglishReminderParser {
    constructor() {
        // Quick keywords (pattern, seconds)
        this.quickKeywords = [
            [/\bnow\b/i, 1],
            [/\bright\s+now\b/i, 60],
            [/\bright\s+away\b/i, 2 * 60],
            [/\bin\s+a\s+sec(?:ond)?\b/i, 10],
            [/\bin\s+a\s+minute\b/i, 60],
            [/\bin\s+a\s+moment\b/i, 30],
            [/\bin\s+a\s+bit\b/i, 10 * 60],
            [/\b(?:soon|shortly)\b/i, 10 * 60],
            [/\blater\b/i, 30 * 60],
            [/\b(?:ASAP|asap)\b/i, 5 * 60]
        ];

        // Weekday map
        this.weekdayMap = {
            'sunday': 0, 'sun': 0,
            'monday': 1, 'mon': 1,
            'tuesday': 2, 'tue': 2, 'tues': 2,
            'wednesday': 3, 'wed': 3,
            'thursday': 4, 'thu': 4, 'thurs': 4,
            'friday': 5, 'fri': 5,
            'saturday': 6, 'sat': 6
        };

        // Number words
        this.numberWords = {
            'zero': 0, 'one': 1, 'a': 1, 'an': 1, 'single': 1,
            'two': 2, 'both': 2, 'couple': 2,
            'three': 3, 'few': 3, 'several': 3,
            'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9,
            'ten': 10, 'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
            'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19,
            'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50, 'sixty': 60
        };

        // Emoji rules
        this.emojiRules = [
            ['📞', ['call', 'ring', 'dial', 'phone', 'telephone', 'contact']],
            ['💬', ['message', 'text', 'dm', 'reply', 'chat', 'sms', 'whatsapp', 'telegram']],
            ['📧', ['email', 'mail', 'send', 'inbox', 'gmail', 'outlook']],
            ['📅', ['meeting', 'meet', 'standup', 'sync', 'zoom', 'teams', 'conference', 'appointment']],
            ['🛒', ['buy', 'order', 'shop', 'grocer', 'milk', 'bread', 'store', 'purchase', 'shopping']],
            ['🏃', ['workout', 'gym', 'run', 'yoga', 'training', 'exercise', 'fitness', 'jog']],
            ['💊', ['pill', 'medicine', 'medication', 'meds', 'drug', 'vitamin', 'doctor', 'pharmacy', 'health']],
            ['✈️', ['flight', 'airport', 'plane', 'trip', 'ticket', 'travel', 'vacation', 'fly']],
            ['🎂', ['birthday', 'bday', 'anniversary', 'party', 'cake', 'celebration', 'celebrate']],
            ['💻', ['project', 'code', 'repo', 'deploy', 'mac', 'computer', 'programming', 'development']],
            ['💼', ['document', 'contract', 'invoice', 'tax', 'report', 'presentation', 'work', 'business']],
            ['💡', ['idea', 'brainstorm', 'plan', 'concept', 'strategy', 'think', 'remember']],
            ['🏠', ['home', 'house', 'clean', 'chores', 'laundry', 'dishes']],
            ['🚗', ['drive', 'car', 'parking', 'gas', 'fuel', 'mechanic']],
            ['🎵', ['music', 'song', 'listen', 'spotify', 'concert', 'band']],
            ['☕', ['coffee', 'cafe', 'starbucks', 'drink', 'tea']],
            ['📚', ['read', 'book', 'study', 'library', 'homework', 'learn']],
            ['💰', ['pay', 'money', 'bill', 'bank', 'finance', 'budget']],
            ['🎮', ['game', 'play', 'gaming', 'xbox', 'playstation', 'nintendo']],
            ['🧘', ['meditate', 'meditation', 'relax', 'mindfulness', 'zen']]
        ];
    }

    parse(text, now = new Date()) {
        const normalized = this.normalizeText(text);
        const lowered = normalized.toLowerCase();

        // Try parsing in order of priority
        let result;

        // 1. Relative time (in 2 hours, in 30 minutes, +10m)
        result = this.parseRelative(lowered, normalized, now);
        if (result) return result;

        // 2. Absolute dates (today at 3pm, tomorrow morning, next Monday)
        result = this.parseAbsolute(lowered, normalized, now);
        if (result) return result;

        // 3. Time only (3pm, 14:30)
        result = this.parseTimeOnly(lowered, normalized, now);
        if (result) return result;

        // 4. Quick keywords (now, ASAP, soon)
        result = this.parseQuick(lowered, normalized, now);
        if (result) return result;

        // 5. Fallback: if no time expression found, default to ASAP (5 minutes)
        if (normalized.trim()) {
            const date = new Date(now.getTime() + 5 * 60 * 1000); // +5 minutes
            const actionText = this.buildActionText(normalized, '');
            const emojiText = this.prependEmoji(actionText);
            
            return {
                date,
                priority: this.detectPriority(lowered),
                emoji: this.detectEmoji(lowered),
                actionText,
                emojiText,
                timeUncertain: false
            };
        }

        return null;
    }

    // Parse relative time expressions
    parseRelative(lowered, original, now) {
        // Match patterns like "in 2 hours", "in 30 minutes", "in 1 hour 30 minutes"
        const relativePattern = /\b(?:in|after|within)\s+(.+?)(?:\s+(?:from\s+now|later))?$/i;
        const match = lowered.match(relativePattern);
        
        if (!match) return null;

        const timeStr = match[1];
        let totalSeconds = 0;

        // Parse compound times: "2 hours 30 minutes", "1h30m", "2h 15m"
        const timePattern = /(\d+(?:[.,]\d+)?)\s*([smhdw]|seconds?|secs?|minutes?|mins?|hours?|hrs?|days?|weeks?)/gi;
        let timeMatch;
        
        while ((timeMatch = timePattern.exec(timeStr)) !== null) {
            const value = parseFloat(timeMatch[1].replace(',', '.'));
            const unit = timeMatch[2].toLowerCase();
            
            if (unit.startsWith('s')) totalSeconds += value;
            else if (unit.startsWith('m') || unit === 'm') totalSeconds += value * 60;
            else if (unit.startsWith('h') || unit === 'h') totalSeconds += value * 3600;
            else if (unit.startsWith('d') || unit === 'd') totalSeconds += value * 86400;
            else if (unit.startsWith('w') || unit === 'w') totalSeconds += value * 604800;
        }

        // Parse word numbers: "in two hours", "in a minute"
        if (totalSeconds === 0) {
            const wordPattern = /\b(a|an|one|two|three|four|five|six|seven|eight|nine|ten|fifteen|twenty|thirty|forty|fifty|sixty)\s+(second|minute|hour|day|week)s?\b/i;
            const wordMatch = timeStr.match(wordPattern);
            
            if (wordMatch) {
                const numWord = wordMatch[1].toLowerCase();
                const unit = wordMatch[2].toLowerCase();
                const value = this.numberWords[numWord] || 1;
                
                if (unit === 'second') totalSeconds = value;
                else if (unit === 'minute') totalSeconds = value * 60;
                else if (unit === 'hour') totalSeconds = value * 3600;
                else if (unit === 'day') totalSeconds = value * 86400;
                else if (unit === 'week') totalSeconds = value * 604800;
            }
        }

        if (totalSeconds > 0) {
            const date = new Date(now.getTime() + totalSeconds * 1000);
            const actionText = this.buildActionText(original, match[0]);
            const emojiText = this.prependEmoji(actionText);
            
            return {
                date,
                priority: this.detectPriority(lowered),
                emoji: this.detectEmoji(lowered),
                actionText,
                emojiText,
                timeUncertain: false
            };
        }

        return null;
    }

    // Parse absolute dates
    parseAbsolute(lowered, original, now) {
        let baseDate = new Date(now);
        let hour = 9; // Default hour
        let minute = 0;
        let timeUncertain = true;
        let matchedText = '';

        // Today
        if (/\btoday\b/i.test(lowered)) {
            baseDate.setHours(0, 0, 0, 0);
            matchedText = 'today';
        }
        // Tomorrow
        else if (/\btomorrow\b/i.test(lowered)) {
            baseDate.setDate(baseDate.getDate() + 1);
            baseDate.setHours(0, 0, 0, 0);
            matchedText = 'tomorrow';
        }
        // Day after tomorrow
        else if (/\bday\s+after\s+tomorrow\b/i.test(lowered)) {
            baseDate.setDate(baseDate.getDate() + 2);
            baseDate.setHours(0, 0, 0, 0);
            matchedText = 'day after tomorrow';
        }
        // Next week
        else if (/\bnext\s+week\b/i.test(lowered)) {
            baseDate.setDate(baseDate.getDate() + 7);
            baseDate.setHours(0, 0, 0, 0);
            matchedText = 'next week';
        }
        // Weekdays
        else {
            const weekdayMatch = lowered.match(/\b(?:next\s+|this\s+)?(monday|mon|tuesday|tue|wednesday|wed|thursday|thu|friday|fri|saturday|sat|sunday|sun)\b/i);
            if (weekdayMatch) {
                const weekday = weekdayMatch[1].toLowerCase();
                const targetDay = this.weekdayMap[weekday];
                baseDate = this.getNextWeekday(now, targetDay);
                matchedText = weekdayMatch[0];
            } else {
                return null;
            }
        }

        // Time of day
        if (/\bmorning\b/i.test(lowered)) {
            hour = 9;
            matchedText += ' morning';
        } else if (/\bafternoon\b/i.test(lowered)) {
            hour = 14;
            matchedText += ' afternoon';
        } else if (/\bevening\b/i.test(lowered)) {
            hour = 19;
            matchedText += ' evening';
        } else if (/\btonight\b/i.test(lowered)) {
            hour = 20;
            matchedText = 'tonight';
        }

        // Specific time
        const timeMatch = lowered.match(/\b(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(?:o'clock)?\s*(?:(a\.?m\.?|p\.?m\.?))?/i);
        if (timeMatch) {
            hour = parseInt(timeMatch[1]);
            minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
            
            const meridian = timeMatch[3];
            if (meridian) {
                const isPM = meridian.toLowerCase().replace(/\./g, '').includes('pm');
                if (isPM && hour < 12) hour += 12;
                if (!isPM && hour === 12) hour = 0;
            }
            
            timeUncertain = false;
            // Add the full time expression to matchedText
            matchedText += (matchedText ? ' ' : '') + timeMatch[0];
        }

        // Noon/midnight
        if (/\bnoon\b/i.test(lowered)) {
            hour = 12;
            minute = 0;
            timeUncertain = false;
        } else if (/\bmidnight\b/i.test(lowered)) {
            hour = 0;
            minute = 0;
            timeUncertain = false;
        }

        baseDate.setHours(hour, minute, 0, 0);

        const actionText = this.buildActionText(original, matchedText);
        const emojiText = this.prependEmoji(actionText);

        return {
            date: baseDate,
            priority: this.detectPriority(lowered),
            emoji: this.detectEmoji(lowered),
            actionText,
            emojiText,
            timeUncertain
        };
    }

    // Parse time-only expressions
    parseTimeOnly(lowered, original, now) {
        const timeMatch = lowered.match(/\b(\d{1,2})(?::(\d{2}))?\s*(?:(am|pm|a\.m\.|p\.m\.))?/i);
        if (!timeMatch) return null;

        let hour = parseInt(timeMatch[1]);
        const minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
        const meridian = timeMatch[3];

        if (meridian) {
            const isPM = meridian.toLowerCase().includes('pm');
            if (isPM && hour < 12) hour += 12;
            if (!isPM && hour === 12) hour = 0;
        }

        const date = new Date(now);
        date.setHours(hour, minute, 0, 0);

        // If time has passed, move to tomorrow
        if (date <= now) {
            date.setDate(date.getDate() + 1);
        }

        const actionText = this.buildActionText(original, timeMatch[0]);
        const emojiText = this.prependEmoji(actionText);

        return {
            date,
            priority: this.detectPriority(lowered),
            emoji: this.detectEmoji(lowered),
            actionText,
            emojiText,
            timeUncertain: false
        };
    }

    // Parse quick keywords
    parseQuick(lowered, original, now) {
        for (const [pattern, seconds] of this.quickKeywords) {
            if (pattern.test(lowered)) {
                const date = new Date(now.getTime() + seconds * 1000);
                const match = lowered.match(pattern);
                const actionText = this.buildActionText(original, match[0]);
                const emojiText = this.prependEmoji(actionText);

                return {
                    date,
                    priority: this.detectPriority(lowered),
                    emoji: this.detectEmoji(lowered),
                    actionText,
                    emojiText,
                    timeUncertain: false
                };
            }
        }
        return null;
    }

    // Helper: Get next occurrence of weekday
    getNextWeekday(now, targetDay) {
        const date = new Date(now);
        date.setHours(0, 0, 0, 0);
        const currentDay = date.getDay();
        let daysToAdd = targetDay - currentDay;
        if (daysToAdd <= 0) daysToAdd += 7;
        date.setDate(date.getDate() + daysToAdd);
        return date;
    }

    // Helper: Detect priority from keywords
    detectPriority(text) {
        // Health-related keywords always get High priority
        const healthPriority = /\b(medication|medicine|pill|doctor|hospital|health|medical|appointment|surgery|therapy|treatment|prescription|vaccine|injection|checkup|emergency)\b/i;
        
        // Other high priority keywords
        const highPriority = /\b(urgent|urgently|important|importantly|critical|critically|asap|emergency|crucial|deadline|must|immediately|now|vital|essential)\b/i;
        
        // Low priority keywords
        const lowPriority = /\b(maybe|perhaps|possibly|sometime|eventually|optional|consider)\b/i;

        if (healthPriority.test(text)) return 'High';
        if (highPriority.test(text)) return 'High';
        if (lowPriority.test(text)) return 'Low';
        return 'Medium';
    }

    // Helper: Detect emoji from keywords
    detectEmoji(text) {
        const lc = text.toLowerCase();
        for (const [emoji, keywords] of this.emojiRules) {
            for (const keyword of keywords) {
                if (lc.includes(keyword)) {
                    return emoji;
                }
            }
        }
        return '🔔';
    }

    // Helper: Build action text by removing time expressions
    buildActionText(original, matchedText) {
        let text = original;

        // Remove matched time expression
        text = text.replace(new RegExp(matchedText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), ' ');

        // Remove service phrases (carefully ordered)
        const servicePatterns = [
            // Reminder creation phrases - must be at start
            /^(?:remind|reminder)\s+me\s+/gi,
            /^(?:set|create|make|add|schedule|put)\s+(?:a|an|up)?\s*(?:reminder|notification|alert|note)\s+(?:to|for)?\s*/gi,
            
            // Modal verbs and intentions
            /\b(?:I\s+)?(?:need\s+to|have\s+to|got\s+to|gotta|must|should|ought\s+to|want\s+to|would\s+like\s+to)\s+/gi,
            /\bdon't\s+forget\s+to\s+/gi,
            /\bremember\s+to\s+/gi,
            /\bmake\s+sure\s+(?:to|I)\s+/gi,
            
            // Politeness
            /\bplease\s+/gi,
            /\bthanks?\s+/gi,
            /\bthank\s+you\s+/gi,
            
            // "I" at the beginning
            /^I\s+/gi
        ];

        for (const pattern of servicePatterns) {
            text = text.replace(pattern, '');
        }

        // Clean up extra spaces
        text = text.replace(/\s+/g, ' ').trim();
        
        // Remove leading/trailing punctuation
        text = text.replace(/^[,.\s!?]+|[,.\s!?]+$/g, '');
        
        // Remove standalone prepositions at start
        text = text.replace(/^(?:to|at|on|in|for|by|with)\s+/gi, '');
        
        // Remove leading/trailing punctuation again (after preposition removal)
        text = text.replace(/^[,.\s!?]+|[,.\s!?]+$/g, '');

        if (!text) text = 'Reminder';

        // Capitalize first letter
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    // Helper: Prepend emoji to text
    prependEmoji(text) {
        const emoji = this.detectEmoji(text);
        return `${emoji} ${text}`;
    }

    // Helper: Normalize text
    normalizeText(text) {
        // Convert "15.00" to "15:00" (time format)
        return text.replace(/(\d{1,2})\.(\d{2})(?!\s*[ap]\.?m\.?)/g, '$1:$2');
    }
}

// Initialize parser
const parser = new EnglishReminderParser();

// Demo UI handlers
const demoInput = document.getElementById('demo-input');
const demoParseBtn = document.getElementById('demo-parse');
const demoResult = document.getElementById('demo-result');
const exampleButtons = document.querySelectorAll('.example-btn');

// Parse button click
if (demoParseBtn) {
    demoParseBtn.addEventListener('click', () => {
        const text = demoInput.value.trim();
        
        if (!text) {
            alert('Please enter a reminder text');
            return;
        }

        // Show loading
        demoParseBtn.textContent = 'Parsing...';
        demoParseBtn.disabled = true;

        setTimeout(() => {
            const result = parser.parse(text);

            if (result) {
                // Format date
                const dateStr = result.date.toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                // Display results
                document.getElementById('result-datetime').textContent = dateStr;
                document.getElementById('result-priority').textContent = result.priority;
                document.getElementById('result-priority').style.color = 
                    result.priority === 'High' ? '#FF3B30' :
                    result.priority === 'Low' ? '#34C759' : '#FF9500';
                document.getElementById('result-emoji').textContent = result.emoji;
                document.getElementById('result-text').textContent = result.actionText;

                // Render toast preview
                renderToastPreview(result);

                demoResult.style.display = 'block';
            } else {
                alert('Could not parse the reminder. Try a different format like "call mom tomorrow at 3pm"');
            }

            // Reset button
            demoParseBtn.textContent = 'Parse Reminder';
            demoParseBtn.disabled = false;
        }, 300);
    });
}

// Example buttons
if (exampleButtons) {
    exampleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const text = button.dataset.text;
            demoInput.value = text;
            demoParseBtn.click();
        });
    });
}

// Allow Enter key
if (demoInput) {
    demoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            demoParseBtn.click();
        }
    });
}


// Render toast preview
function renderToastPreview(result) {
    const toastPreview = document.getElementById('toast-preview');
    if (!toastPreview) return;

    const priorityClass = `toast-priority-${result.priority.toLowerCase()}`;
    const priorityIcon = result.priority === 'High' ? '⚠️' : result.priority === 'Low' ? '💡' : '⚡';
    
    // Format time
    const timeStr = result.date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: false 
    });
    
    const dateStr = result.date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });

    toastPreview.innerHTML = `
        <div class="toast-header">
            <div class="toast-title">
                <span>💊 Aurely Reminder</span>
            </div>
            <span class="toast-priority-badge ${priorityClass}">
                ${priorityIcon} ${result.priority}
            </span>
        </div>
        
        <div class="toast-content">
            <div class="toast-text">
                <span>${result.emoji}</span>
                <span>Saved: ${result.actionText}</span>
            </div>
            <div class="toast-time">
                <span>🕐</span>
                <span>${dateStr} ${timeStr}</span>
            </div>
        </div>
        
        <div class="toast-actions">
            <button class="toast-btn toast-btn-done">
                <span>✓</span>
                <span>Done</span>
            </button>
            <button class="toast-btn toast-btn-time">
                <span>🕐</span>
                <span>Change Time</span>
            </button>
            <button class="toast-btn toast-btn-priority">
                <span>⚠️</span>
                <span>Set Priority</span>
            </button>
            <button class="toast-btn toast-btn-dismiss">
                <span>✕</span>
                <span>Dismiss</span>
            </button>
        </div>
    `;
}
