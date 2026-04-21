// JSON Parser and Display Utility
document.addEventListener('DOMContentLoaded', function() {
    // Add syntax highlighting to JSON display
    const jsonElement = document.getElementById('json-data');
    if (jsonElement) {
        const jsonData = jsonElement.textContent;
        try {
            const parsed = JSON.parse(jsonData);
            jsonElement.textContent = JSON.stringify(parsed, null, 2);
            syntaxHighlight(jsonElement);
        } catch (e) {
            console.log('JSON already formatted');
        }
    }
    
    // Add search functionality
    addSearchFeature();
    
    // Add filter buttons for departments
    addDepartmentFilter();

    // Initialize JSON parser
    initJsonParser();
});

// Syntax highlighting for JSON
function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'json-number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'json-key';
            } else {
                cls = 'json-string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'json-boolean';
        } else if (/null/.test(match)) {
            cls = 'json-null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
    json.innerHTML = json;
}

// Add search feature for employee cards
function addSearchFeature() {
    const container = document.querySelector('.employee-grid');
    if (!container) return;
    
    const searchDiv = document.createElement('div');
    searchDiv.className = 'search-box';
    searchDiv.innerHTML = `
        <input type="text" id="searchInput" placeholder="搜索员工姓名、邮箱或部门..." />
    `;
    
    const h2 = container.parentElement.querySelector('h2');
    if (h2) {
        h2.after(searchDiv);
    }
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.employee-card');
            
            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// Add department filter buttons
function addDepartmentFilter() {
    const grid = document.querySelector('.employee-grid');
    if (!grid) return;
    
    const departments = new Set();
    document.querySelectorAll('.employee-card').forEach(card => {
        const dept = card.querySelector('.employee-info p:nth-child(4)');
        if (dept) {
            const deptText = dept.textContent.replace('部门:', '').trim();
            departments.add(deptText);
        }
    });
    
    const filterDiv = document.createElement('div');
    filterDiv.className = 'filter-buttons';
    filterDiv.innerHTML = '<button class="filter-btn active" data-dept="all">全部</button>';
    
    departments.forEach(dept => {
        filterDiv.innerHTML += `<button class="filter-btn" data-dept="${dept}">${dept}</button>`;
    });
    
    const h2 = grid.parentElement.querySelector('h2');
    if (h2) {
        h2.after(filterDiv);
    }
    
    // Add click handlers
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const dept = this.getAttribute('data-dept');
            const cards = document.querySelectorAll('.employee-card');
            
            cards.forEach(card => {
                if (dept === 'all') {
                    card.style.display = 'block';
                } else {
                    const cardDept = card.querySelector('.employee-info p:nth-child(4)');
                    if (cardDept && cardDept.textContent.includes(dept)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });
}

// Add additional CSS for dynamic elements
const style = document.createElement('style');
style.textContent = `
    .search-box {
        margin: 1rem 0;
    }
    
    #searchInput {
        width: 100%;
        padding: 10px;
        border: 2px solid #667eea;
        border-radius: 5px;
        font-size: 1rem;
    }
    
    #searchInput:focus {
        outline: none;
        border-color: #764ba2;
        box-shadow: 0 0 5px rgba(102, 126, 234, 0.5);
    }
    
    .filter-buttons {
        margin: 1rem 0;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }
    
    .filter-btn {
        padding: 8px 16px;
        border: 2px solid #667eea;
        background: white;
        color: #667eea;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .filter-btn:hover {
        background: #667eea;
        color: white;
    }
    
    .filter-btn.active {
        background: #667eea;
        color: white;
    }
    
    .json-key { color: #f92672; }
    .json-string { color: #e6db74; }
    .json-number { color: #ae81ff; }
    .json-boolean { color: #66d9ef; }
    .json-null { color: #66d9ef; }

    /* Section divider */
    .section-divider {
        border: none;
        border-top: 2px solid #e9ecef;
        margin: 2rem 0;
    }

    /* Demo section */
    .demo-section {
        margin-bottom: 1rem;
    }

    /* JSON Parser Styles */
    .json-parser { margin-top: 1rem; }
    .json-input-section { margin: 1rem 0; }
    #jsonInput {
        width: 100%;
        min-height: 200px;
        padding: 12px;
        border: 2px solid #667eea;
        border-radius: 8px;
        font-family: 'Courier New', Consolas, monospace;
        font-size: 0.9rem;
        line-height: 1.5;
        resize: vertical;
        background: #1e1e1e;
        color: #d4d4d4;
        tab-size: 2;
    }
    #jsonInput:focus {
        outline: none;
        border-color: #764ba2;
        box-shadow: 0 0 8px rgba(102, 126, 234, 0.4);
    }
    #jsonInput::placeholder { color: #6a6a6a; }
    .json-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 10px;
    }
    .action-btn {
        padding: 8px 18px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 600;
        transition: all 0.2s;
    }
    .parse-btn { background: #667eea; color: white; }
    .parse-btn:hover { background: #5a6fd6; }
    .format-btn { background: #28a745; color: white; }
    .format-btn:hover { background: #218838; }
    .minify-btn { background: #ffc107; color: #333; }
    .minify-btn:hover { background: #e0a800; }
    .clear-btn { background: #dc3545; color: white; }
    .clear-btn:hover { background: #c82333; }
    .sample-btn { background: #17a2b8; color: white; }
    .sample-btn:hover { background: #138496; }
    .json-error {
        background: #f8d7da;
        color: #721c24;
        padding: 12px;
        border-radius: 5px;
        border: 1px solid #f5c6cb;
        margin: 1rem 0;
        font-family: monospace;
    }
    .json-result { margin-top: 1.5rem; }
    .result-tabs {
        display: flex;
        gap: 0;
        border-bottom: 2px solid #dee2e6;
        margin-bottom: 1rem;
    }
    .tab-btn {
        padding: 10px 20px;
        border: none;
        background: #f8f9fa;
        cursor: pointer;
        font-size: 0.9rem;
        border-bottom: 3px solid transparent;
        transition: all 0.2s;
    }
    .tab-btn:hover { background: #e9ecef; }
    .tab-btn.active {
        background: white;
        border-bottom-color: #667eea;
        color: #667eea;
        font-weight: 600;
    }
    .tab-content { display: none; }
    .tab-content.active { display: block; }
    .json-tree-node {
        margin-left: 20px;
        padding: 2px 0;
    }
    .json-tree-key {
        color: #f92672;
        font-weight: 600;
    }
    .json-tree-value { color: #e6db74; }
    .json-tree-number { color: #ae81ff; }
    .json-tree-bool { color: #66d9ef; }
    .json-tree-null { color: #66d9ef; font-style: italic; }
    .json-tree-toggle {
        cursor: pointer;
        user-select: none;
        display: inline-block;
        width: 16px;
        text-align: center;
        color: #888;
    }
    .json-tree-toggle:hover { color: #333; }
    .json-stats .stat-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 12px;
        border-bottom: 1px solid #eee;
    }
    .json-stats .stat-label { font-weight: 600; color: #555; }
    .json-stats .stat-value { color: #667eea; }
`;
document.head.appendChild(style);

// ========== JSON Parser Core Logic ==========

var parsedJsonData = null;
var STORAGE_KEY = 'hugoJsonInput';
var STORAGE_PARSED_KEY = 'hugoJsonParsed';

function initJsonParser() {
    var parseBtn = document.getElementById('parseBtn');
    var formatBtn = document.getElementById('formatBtn');
    var minifyBtn = document.getElementById('minifyBtn');
    var clearBtn = document.getElementById('clearBtn');
    var sampleBtn = document.getElementById('sampleBtn');
    var jsonInput = document.getElementById('jsonInput');

    // If no parser on this page, skip
    if (!parseBtn) return;

    parseBtn.addEventListener('click', function() { parseJson(); });
    formatBtn.addEventListener('click', function() { formatJson(); });
    minifyBtn.addEventListener('click', function() { minifyJson(); });
    clearBtn.addEventListener('click', function() { clearJson(); });
    sampleBtn.addEventListener('click', function() { loadSample(); });

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
            document.querySelectorAll('.tab-content').forEach(function(c) { c.classList.remove('active'); });
            btn.classList.add('active');
            document.getElementById('tab-' + btn.getAttribute('data-tab')).classList.add('active');
        });
    });

    // Allow Ctrl+Enter to parse
    if (jsonInput) {
        jsonInput.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                parseJson();
            }
            // Tab key inserts spaces instead of moving focus
            if (e.key === 'Tab') {
                e.preventDefault();
                var start = this.selectionStart;
                var end = this.selectionEnd;
                this.value = this.value.substring(0, start) + '  ' + this.value.substring(end);
                this.selectionStart = this.selectionEnd = start + 2;
            }
        });

        // Save to localStorage on every input (so it persists across page navigation)
        jsonInput.addEventListener('input', function() {
            try { localStorage.setItem(STORAGE_KEY, this.value); } catch(e) {}
        });

        // Restore from localStorage on page load
        var saved = null;
        try { saved = localStorage.getItem(STORAGE_KEY); } catch(e) {}
        if (saved) {
            jsonInput.value = saved;
            // Auto-restore parse results if previously parsed
            var wasParsed = false;
            try { wasParsed = localStorage.getItem(STORAGE_PARSED_KEY) === 'true'; } catch(e) {}
            if (wasParsed) {
                parseJson();
            }
        }
    }
}

function parseJson() {
    var input = document.getElementById('jsonInput');
    var errorDiv = document.getElementById('jsonError');
    var resultDiv = document.getElementById('jsonResult');

    if (!input || !input.value.trim()) {
        showError('请输入 JSON 文本');
        return;
    }

    try {
        parsedJsonData = JSON.parse(input.value);
        errorDiv.style.display = 'none';
        resultDiv.style.display = 'block';
        try { localStorage.setItem(STORAGE_PARSED_KEY, 'true'); } catch(e) {}

        renderFormattedView(parsedJsonData);
        renderTableView(parsedJsonData);
        renderTreeView(parsedJsonData);
        renderStatsView(parsedJsonData);
    } catch (e) {
        showError('JSON 解析错误: ' + e.message);
    }
}

function formatJson() {
    var input = document.getElementById('jsonInput');
    if (!input || !input.value.trim()) { showError('请先输入 JSON 文本'); return; }
    try {
        var parsed = JSON.parse(input.value);
        input.value = JSON.stringify(parsed, null, 2);
        try { localStorage.setItem(STORAGE_KEY, input.value); } catch(e) {}
    } catch (e) {
        showError('JSON 格式化错误: ' + e.message);
    }
}

function minifyJson() {
    var input = document.getElementById('jsonInput');
    if (!input || !input.value.trim()) { showError('请先输入 JSON 文本'); return; }
    try {
        var parsed = JSON.parse(input.value);
        input.value = JSON.stringify(parsed);
        try { localStorage.setItem(STORAGE_KEY, input.value); } catch(e) {}
    } catch (e) {
        showError('JSON 压缩错误: ' + e.message);
    }
}

function clearJson() {
    var input = document.getElementById('jsonInput');
    if (input) input.value = '';
    try { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(STORAGE_PARSED_KEY); } catch(e) {}
    document.getElementById('jsonError').style.display = 'none';
    document.getElementById('jsonResult').style.display = 'none';
    parsedJsonData = null;
}

function loadSample() {
    var input = document.getElementById('jsonInput');
    if (!input) return;
    var sampleData = [
        { "id": 1, "name": "张三", "email": "zhangsan@example.com", "age": 28, "department": "技术部", "skills": ["Go", "Python", "JavaScript"] },
        { "id": 2, "name": "李四", "email": "lisi@example.com", "age": 32, "department": "市场部", "skills": ["营销", "数据分析", "项目管理"] },
        { "id": 3, "name": "王五", "email": "wangwu@example.com", "age": 25, "department": "设计部", "skills": ["UI设计", "UX设计", "Figma"] }
    ];
    input.value = JSON.stringify(sampleData, null, 2);
    try { localStorage.setItem(STORAGE_KEY, input.value); } catch(e) {}
    parseJson();
}

function showError(msg) {
    var errorDiv = document.getElementById('jsonError');
    errorDiv.textContent = msg;
    errorDiv.style.display = 'block';
}

// ========== View Renderers ==========

function renderFormattedView(data) {
    var el = document.getElementById('jsonFormatted');
    var formatted = JSON.stringify(data, null, 2);
    el.innerHTML = syntaxHighlightString(formatted);
}

function renderTableView(data) {
    var container = document.getElementById('jsonTable');
    if (!container) return;

    if (!Array.isArray(data)) {
        if (typeof data === 'object' && data !== null) {
            var html = '<table><thead><tr><th>键 (Key)</th><th>值 (Value)</th><th>类型</th></tr></thead><tbody>';
            Object.keys(data).forEach(function(key) {
                var val = data[key];
                var type = Array.isArray(val) ? 'array[' + val.length + ']' : typeof val;
                var display = Array.isArray(val) ? '[' + val.join(', ') + ']' : (typeof val === 'object' && val !== null ? JSON.stringify(val) : String(val));
                html += '<tr><td><strong>' + escapeHtml(key) + '</strong></td><td>' + escapeHtml(display) + '</td><td>' + type + '</td></tr>';
            });
            html += '</tbody></table>';
            container.innerHTML = html;
        } else {
            container.innerHTML = '<p>该 JSON 不是数组或对象，无法生成表格。</p>';
        }
        return;
    }

    if (data.length === 0) {
        container.innerHTML = '<p>空数组</p>';
        return;
    }

    var keys = [];
    data.forEach(function(item) {
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
            Object.keys(item).forEach(function(key) {
                if (keys.indexOf(key) === -1) keys.push(key);
            });
        }
    });

    if (keys.length === 0) {
        var html = '<table><thead><tr><th>#</th><th>值</th></tr></thead><tbody>';
        data.forEach(function(item, i) {
            html += '<tr><td>' + i + '</td><td>' + escapeHtml(String(item)) + '</td></tr>';
        });
        html += '</tbody></table>';
        container.innerHTML = html;
        return;
    }

    var html = '<table><thead><tr><th>#</th>';
    keys.forEach(function(key) { html += '<th>' + escapeHtml(key) + '</th>'; });
    html += '</tr></thead><tbody>';

    data.forEach(function(item, index) {
        html += '<tr><td>' + index + '</td>';
        keys.forEach(function(key) {
            var val = item[key];
            if (val === undefined) {
                html += '<td>-</td>';
            } else if (Array.isArray(val)) {
                html += '<td>' + val.map(function(v) { return escapeHtml(String(v)); }).join(', ') + '</td>';
            } else if (typeof val === 'object' && val !== null) {
                html += '<td>' + escapeHtml(JSON.stringify(val)) + '</td>';
            } else {
                html += '<td>' + escapeHtml(String(val)) + '</td>';
            }
        });
        html += '</tr>';
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

function renderTreeView(data) {
    var container = document.getElementById('jsonTree');
    if (!container) return;
    container.innerHTML = buildTreeHtml(data, true);

    container.querySelectorAll('.json-tree-toggle').forEach(function(toggle) {
        toggle.addEventListener('click', function() {
            var children = this.parentElement.querySelector('.json-tree-node');
            if (children) {
                var isHidden = children.style.display === 'none';
                children.style.display = isHidden ? 'block' : 'none';
                this.textContent = isHidden ? '▼' : '▶';
            }
        });
    });
}

function buildTreeHtml(data, isRoot) {
    if (data === null) return '<span class="json-tree-null">null</span>';
    if (typeof data === 'boolean') return '<span class="json-tree-bool">' + data + '</span>';
    if (typeof data === 'number') return '<span class="json-tree-number">' + data + '</span>';
    if (typeof data === 'string') return '<span class="json-tree-value">"' + escapeHtml(data) + '"</span>';

    if (Array.isArray(data)) {
        var html = '<span class="json-tree-toggle">▼</span> <span style="color:#999">Array[' + data.length + ']</span>';
        html += '<div class="json-tree-node">';
        data.forEach(function(item, i) {
            html += '<div><span class="json-tree-key">' + i + '</span>: ' + buildTreeHtml(item, false) + '</div>';
        });
        html += '</div>';
        return html;
    }

    if (typeof data === 'object') {
        var keys = Object.keys(data);
        var html = '<span class="json-tree-toggle">▼</span> <span style="color:#999">Object{' + keys.length + '}</span>';
        html += '<div class="json-tree-node">';
        keys.forEach(function(key) {
            html += '<div><span class="json-tree-key">"' + escapeHtml(key) + '"</span>: ' + buildTreeHtml(data[key], false) + '</div>';
        });
        html += '</div>';
        return html;
    }

    return escapeHtml(String(data));
}

function renderStatsView(data) {
    var container = document.getElementById('jsonStats');
    if (!container) return;

    var stats = analyzeJson(data);
    var html = '<div class="stat-item"><span class="stat-label">数据类型</span><span class="stat-value">' + stats.type + '</span></div>';
    html += '<div class="stat-item"><span class="stat-label">总大小</span><span class="stat-value">' + formatBytes(JSON.stringify(data).length) + '</span></div>';
    html += '<div class="stat-item"><span class="stat-label">嵌套深度</span><span class="stat-value">' + stats.maxDepth + ' 层</span></div>';
    html += '<div class="stat-item"><span class="stat-label">键的数量</span><span class="stat-value">' + stats.totalKeys + '</span></div>';

    if (stats.type === 'array') {
        html += '<div class="stat-item"><span class="stat-label">数组长度</span><span class="stat-value">' + stats.arrayLength + '</span></div>';
        if (stats.itemTypes.length > 0) {
            html += '<div class="stat-item"><span class="stat-label">元素类型</span><span class="stat-value">' + stats.itemTypes.join(', ') + '</span></div>';
        }
    }

    if (stats.type === 'object' || stats.type === 'array') {
        html += '<div class="stat-item"><span class="stat-label">字段列表</span><span class="stat-value">' + stats.allKeys.join(', ') + '</span></div>';
    }

    if (Object.keys(stats.typeCount).length > 0) {
        html += '<div class="stat-item"><span class="stat-label">值类型分布</span><span class="stat-value">' + Object.keys(stats.typeCount).map(function(t) { return t + ': ' + stats.typeCount[t]; }).join(', ') + '</span></div>';
    }

    container.innerHTML = html;
}

function analyzeJson(data) {
    var result = { type: 'unknown', maxDepth: 0, totalKeys: 0, allKeys: [], arrayLength: 0, itemTypes: [], typeCount: {} };

    if (data === null) { result.type = 'null'; return result; }
    result.type = Array.isArray(data) ? 'array' : typeof data;

    function traverse(obj, depth) {
        if (depth > result.maxDepth) result.maxDepth = depth;
        if (obj === null || typeof obj !== 'object') {
            var t = obj === null ? 'null' : typeof obj;
            result.typeCount[t] = (result.typeCount[t] || 0) + 1;
            return;
        }
        if (Array.isArray(obj)) {
            result.arrayLength = obj.length;
            result.typeCount['array'] = (result.typeCount['array'] || 0) + 1;
            obj.forEach(function(item) {
                var itemType = item === null ? 'null' : (Array.isArray(item) ? 'array' : typeof item);
                if (result.itemTypes.indexOf(itemType) === -1) result.itemTypes.push(itemType);
                traverse(item, depth + 1);
            });
        } else {
            result.typeCount['object'] = (result.typeCount['object'] || 0) + 1;
            Object.keys(obj).forEach(function(key) {
                result.totalKeys++;
                if (result.allKeys.indexOf(key) === -1) result.allKeys.push(key);
                traverse(obj[key], depth + 1);
            });
        }
    }

    traverse(data, 0);
    return result;
}

// ========== Utility Functions ==========

function syntaxHighlightString(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'json-number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'json-key';
            } else {
                cls = 'json-string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'json-boolean';
        } else if (/null/.test(match)) {
            cls = 'json-null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    var k = 1024;
    var sizes = ['B', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
