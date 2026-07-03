// File operations — save, open, localStorage

const FileManager = {
    STORAGE_KEY: 'tea_source_code',
    currentFile: 'untitled.tea',

    load() {
        return localStorage.getItem(this.STORAGE_KEY) || '';
    },

    saveLocal(code) {
        localStorage.setItem(this.STORAGE_KEY, code);
    },

    save() {
        const code = document.getElementById('editor').value;
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        a.href = url;
        a.download = this.currentFile;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        UI.toast('✅ Saved ' + this.currentFile);
    },

    open() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.tea,.txt';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            this.currentFile = file.name;
            UI.setFilename(file.name);
            
            const reader = new FileReader();
            reader.onload = (ev) => {
                document.getElementById('editor').value = ev.target.result;
                Editor.onChange();
                UI.toast('📂 ' + file.name);
            };
            reader.readAsText(file);
        };
        
        input.click();
    }
};
