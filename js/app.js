// Main application controller

const App = {
    
    init() {
        Templates.buildToolbar();
        Editor.init();
        console.log('🍵 Tea IDE ready');
    },

    compile() {
        UI.clearOutput();
        const code = Editor.getCode();
        
        if (!code.trim()) {
            UI.out('⚠️ No code to compile', 'warn');
            return;
        }
        
        try {
            const python = Transpiler.convert(code);
            UI.out('✅ Compilation successful\n', 'success');
            UI.out('─'.repeat(40) + '\n', 'info');
            UI.out(python);
            UI.out('─'.repeat(40) + '\n', 'info');
            UI.out('Copy this Python code or use Run to test.', 'info');
            UI.toast('🔨 Compiled!');
        } catch (err) {
            UI.out('❌ Error: ' + err.message, 'error');
            UI.toast('Compilation failed');
        }
    },

    run() {
        UI.clearOutput();
        const code = Editor.getCode();
        
        if (!code.trim()) {
            UI.out('⚠️ No code to run', 'warn');
            return;
        }
        
        try {
            const python = Transpiler.convert(code);
            UI.out('▶ Running...\n', 'info');
            
            const output = Simulator.run(python);
            if (output) UI.out(output);
            
            UI.out('\n✅ Done (browser simulation)', 'success');
            UI.out('For real Python: use Compile & run locally.', 'info');
            UI.toast('▶ Done!');
        } catch (err) {
            UI.out('❌ Error: ' + err.message, 'error');
            UI.toast('Execution failed');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
