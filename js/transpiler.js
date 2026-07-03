// Tea → Python transpiler

const Transpiler = {
    
    convert(teaCode) {
        const lines = teaCode.split('\n');
        const output = ['# Tea → Python'];
        
        for (const rawLine of lines) {
            const line = rawLine.trim();
            
            if (!line) {
                output.push('');
                continue;
            }
            
            if (line.startsWith('<') && line.endsWith('>')) {
                output.push('# ' + line.slice(1, -1).trim());
                continue;
            }
            
            output.push(this.parseLine(line));
        }
        
        return output.join('\n');
    },

    parseLine(line) {
        // Import
        const importMatch = line.match(/tea\.import\s*:\s*(.+)/);
        if (importMatch) return importMatch[1].trim();
        
        // Print
        if (line.includes('tea.system') && line.includes('print')) {
            return this.parsePrint(line);
        }
        
        // Input with variable
        if (line.includes('tea.system') && line.includes('input') && line.includes('>>')) {
            return this.parseInputVar(line);
        }
        
        // Variable
        if (line.includes('tea.variables')) {
            return this.parseVariable(line);
        }
        
        // Condition
        if (line.includes('tea.conditions')) {
            return this.parseCondition(line);
        }
        
        // While loop
        if (line.includes('tea.loop while')) {
            return this.parseWhile(line);
        }
        
        // Repeat loop
        if (line.startsWith('repeat ')) {
            return this.parseRepeat(line);
        }
        
        // Function
        if (line.includes('tea.functions')) {
            return this.parseFunction(line);
        }
        
        return '# ' + line;
    },

    cleanQuotes(str) {
        return str.replace(/[\u201C\u201D]/g, '"');
    },

    isQuoted(str) {
        return (str.startsWith('"') && str.endsWith('"')) || 
               (str.startsWith("'") && str.endsWith("'"));
    },

    parsePrint(line) {
        const match = line.match(/print\s+(.+)/);
        if (!match) return '# ' + line;
        
        let content = this.cleanQuotes(match[1].trim());
        
        if (content.includes('{') && content.includes('}')) {
            if (this.isQuoted(content)) content = content.slice(1, -1);
            return 'print(f"' + content + '")';
        }
        
        if (this.isQuoted(content)) {
            return 'print(' + content + ')';
        }
        
        return 'print(' + content + ')';
    },

    parseInputVar(line) {
        const match = line.match(/input\s+(.+?)\s*>>\s*(.+)/);
        if (!match) return '# ' + line;
        
        let prompt = this.cleanQuotes(match[1].trim());
        if (this.isQuoted(prompt)) prompt = prompt.slice(1, -1);
        
        return match[2].trim() + ' = input("' + prompt + '")';
    },

    parseVariable(line) {
        const match = line.match(/:\s*(.+?)\s+is\s+(.+)/);
        if (!match) return '# ' + line;
        
        const name = match[1].trim();
        const value = this.cleanQuotes(match[2].trim());
        return name + ' = ' + value;
    },

    parseCondition(line) {
        const match = line.match(/:\s*(.+?)\s*\{(.+)\}/);
        if (!match) return '# ' + line;
        
        return 'if ' + match[1].trim() + ':\n    ' + match[2].trim();
    },

    parseWhile(line) {
        const match = line.match(/while\s+(.+?)\s*\{(.+)\}/);
        if (!match) return '# ' + line;
        
        return 'while ' + match[1].trim() + ':\n    ' + match[2].trim();
    },

    parseRepeat(line) {
        const match = line.match(/repeat\s+(\d+)\s*(.*)/);
        if (!match) return '# ' + line;
        
        const action = match[2].trim() || 'pass';
        return 'for _ in range(' + match[1] + '):\n    ' + action;
    },

    parseFunction(line) {
        const match = line.match(/fun\s+(.+?)\((.*?)\)/);
        if (!match) return '# ' + line;
        
        return 'def ' + match[1].trim() + '(' + match[2].trim() + '):\n    pass';
    }
};
