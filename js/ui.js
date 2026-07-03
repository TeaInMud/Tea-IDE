// UI utilities — toast, output, line numbers

const UI = {
    toastTimer: null,

    toast(msg, duration = 1800) {
        const el = document.getElementById('toast');
        el.textContent = msg;
        el.classList.add('show');
        clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => el.classList.remove('show'), duration);
    },

    out(text, className = '') {
        const el = document.getElementById('output');
        const div = document.createElement('div');
        div.textContent = text;
        if (className) div.className = className;
        el.appendChild(div);
        el.scrollTop = el.scrollHeight;
    },

    clearOutput() {
        document.getElementById('output').innerHTML = '';
    },

    updateLineNumbers(text) {
        const count = text.split('\n').length;
        let nums = '';
        for (let i = 1; i <= count; i++) nums += i + '\n';
        document.getElementById('lineNums').textContent = nums;
    },

    setFilename(name) {
        document.getElementById('filename').textContent = name;
    }
};
