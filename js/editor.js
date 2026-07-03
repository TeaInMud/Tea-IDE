// Editor management

const Editor = {
    
    init() {
        const editor = document.getElementById('editor');
        const lineNums = document.getElementById('lineNums');
        
        const saved = FileManager.load();
        editor.value = saved || this.defaultCode();
        UI.updateLineNumbers(editor.value);
        
        editor.addEventListener('input', () => this.onChange());
        editor.addEventListener('scroll', () => {
            lineNums.scrollTop = editor.scrollTop;
        });
        editor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                this.insertTab();
            }
        });
    },

    defaultCode() {
        return '< Hello World in Tea >\ntea.system : print "Hello, Tea World! 🍵"\n';
    },

    onChange() {
        const editor = document.getElementById('editor');
        UI.updateLineNumbers(editor.value);
        FileManager.saveLocal(editor.value);
    },

    insertTab() {
        const editor = document.getElementById('editor');
        const start = editor.selectionStart;
        
        editor.value = editor.value.slice(0, start) + '    ' + editor.value.slice(editor.selectionEnd);
        editor.selectionStart = editor.selectionEnd = start + 4;
        this.onChange();
    },

    getCode() {
        return document.getElementById('editor').value;
    }
};
