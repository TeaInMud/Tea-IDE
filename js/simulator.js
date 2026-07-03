// Python simulator for browser execution

const Simulator = {
    
    run(pythonCode) {
        const vars = {};
        let output = '';
        const lines = pythonCode.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (!line || line.startsWith('#')) continue;
            
            // Assignment
            const assignMatch = line.match(/^(\w+)\s*=\s*(.+)$/);
            if (assignMatch && !line.includes('input(') && !line.includes('def ')) {
                let value = assignMatch[2].trim();
                for (const [name, val] of Object.entries(vars)) {
                    value = value.replace(new RegExp('\\b' + name + '\\b', 'g'), String(val));
                }
                try {
                    if (/^[\d\s+\-*\/()%.]+$/.test(value)) {
                        vars[assignMatch[1]] = eval(value);
                    } else if (this.isQuoted(value)) {
                        vars[assignMatch[1]] = value.slice(1, -1);
                    } else if (!isNaN(value)) {
                        vars[assignMatch[1]] = Number(value);
                    } else {
                        vars[assignMatch[1]] = value;
                    }
                } catch (e) {
                    vars[assignMatch[1]] = value;
                }
                continue;
            }
            
            // Print
            const printMatch = line.match(/print\((.+)\)$/);
            if (printMatch) {
                let content = printMatch[1].trim();
                
                if (content.startsWith('f"') || content.startsWith("f'")) {
                    let str = content.slice(2, -1);
                    for (const [name, val] of Object.entries(vars)) {
                        str = str.replace(new RegExp('\\{' + name + '\\}', 'g'), String(val));
                    }
                    str = str.replace(/\{(.+?)\}/g, (_, expr) => {
                        let ev = expr;
                        for (const [name, val] of Object.entries(vars)) {
                            ev = ev.replace(new RegExp('\\b' + name + '\\b', 'g'), String(val));
                        }
                        try { return eval(ev); } catch (e) { return expr; }
                    });
                    output += str + '\n';
                } else if (this.isQuoted(content)) {
                    output += content.slice(1, -1) + '\n';
                } else {
                    let val = content;
                    for (const [name, value] of Object.entries(vars)) {
                        val = val.replace(new RegExp('\\b' + name + '\\b', 'g'), String(value));
                    }
                    output += val + '\n';
                }
                continue;
            }
            
            // For loop
            const loopMatch = line.match(/for _ in range\((\d+)\)/);
            if (loopMatch) {
                const count = parseInt(loopMatch[1]);
                const nextLine = (i + 1 < lines.length) ? lines[i + 1].trim() : '';
                const printInLoop = nextLine.match(/print\((.+)\)$/);
                
                if (printInLoop) {
                    let content = printInLoop[1].trim();
                    if (this.isQuoted(content)) content = content.slice(1, -1);
                    for (let j = 0; j < count; j++) output += content + '\n';
                    i++;
                }
            }
        }
        
        return output;
    },

    isQuoted(str) {
        return (str.startsWith('"') && str.endsWith('"')) || 
               (str.startsWith("'") && str.endsWith("'"));
    }
};
