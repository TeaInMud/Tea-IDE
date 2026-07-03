// Code templates for the toolbar

const Templates = {
    list: {
        hello:   { label: '👋 Hello',   code: '< Hello World >\ntea.system : print "Hello, World! 🍵"\n' },
        input:   { label: '📥 Input',   code: '< User Input >\ntea.system : input "Name: " >> name\ntea.system : print "Hello {name}!"\n' },
        var:     { label: '📦 Var',     code: '< Variables >\ntea.variables : x is 10\ntea.variables : y is 20\ntea.system : print "Sum: {x + y}"\n' },
        if:      { label: '🔀 If',      code: '< Conditional >\ntea.variables : age is 18\ntea.conditions : age >= 18 { tea.system : print "Adult" }\n' },
        while:   { label: '🔁 While',   code: '< While Loop >\ntea.variables : i is 0\ntea.loop while i < 3 {\n    tea.system : print "i: {i}"\n    tea.variables : i is i + 1\n}\n' },
        repeat:  { label: '🔂 Repeat',  code: '< Repeat >\nrepeat 3 tea.system : print "Looping!"\n' },
        fun:     { label: '⚙️ Fun',     code: '< Function >\ntea.functions : fun greet(name)\ntea.system : print "Hi {name}!"\n' },
        comment: { label: '💬 Comment', code: '< comment >\n' }
    },

    buildToolbar() {
        const toolbar = document.getElementById('toolbar');
        let html = '';
        
        for (const [key, tmpl] of Object.entries(this.list)) {
            html += `<button onclick="Templates.insert('${key}')">${tmpl.label}</button>`;
        }
        
        html += '<span class="sep"></span>';
        html += '<button class="btn-compile" onclick="App.compile()">🔨 Compile</button>';
        html += '<button class="btn-run" onclick="App.run()">▶ Run</button>';
        
        toolbar.innerHTML = html;
    },

    insert(name) {
        const code = this.list[name]?.code || '';
        const editor = document.getElementById('editor');
        const start = editor.selectionStart;
        
        editor.value = editor.value.slice(0, start) + code + editor.value.slice(editor.selectionEnd);
        editor.selectionStart = editor.selectionEnd = start + code.length;
        editor.focus();
        Editor.onChange();
    }
};
