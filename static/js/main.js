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
    const container = document.querySelector('.container');
    if (!container) return;
    
    const searchDiv = document.createElement('div');
    searchDiv.className = 'search-box';
    searchDiv.innerHTML = `
        <input type="text" id="searchInput" placeholder="搜索员工姓名、邮箱或部门..." />
    `;
    
    const h2 = container.querySelector('h2');
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
    const statsDiv = document.querySelector('.stats');
    if (!statsDiv) return;
    
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
    
    const h2 = document.querySelector('h2');
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

    /* JSON Parser Styles */
    .json-parser { margin-top: 2rem; }
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
`;
document.head.appendChild(style);

// ========== JSON Parser Core Logic ==========

let parsedJsonData = null;

function initJsonParser() {
    var parseBtn = document.getElementById('parseBtn');
    var clearBtn = document.getElementById('clearBtn');
    var sampleBtn = document.getElementById('sampleBtn');
    var jsonInput = document.getElementById('jsonInput');

    // If no parser on this page, skip
    if (!parseBtn) return;

    parseBtn.addEventListener('click', function() { parseJson(); });
    clearBtn.addEventListener('click', function() { clearJson(); });
    sampleBtn.addEventListener('click', function() { loadSample(); });

    // Allow Ctrl+Enter to parse
    if (jsonInput) {
        jsonInput.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                parseJson();
            }
            // Tab key inserts spaces
            if (e.key === 'Tab') {
                e.preventDefault();
                var start = this.selectionStart;
                var end = this.selectionEnd;
                this.value = this.value.substring(0, start) + '  ' + this.value.substring(end);
                this.selectionStart = this.selectionEnd = start + 2;
            }
        });
    }

    // Result search
    var searchInput = document.getElementById('resultSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            var term = e.target.value.toLowerCase();
            var cards = document.querySelectorAll('#resultCardGrid .employee-card');
            cards.forEach(function(card) {
                card.style.display = card.textContent.toLowerCase().indexOf(term) >= 0 ? 'block' : 'none';
            });
        });
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

        renderCardView(parsedJsonData);
    } catch (e) {
        showError('JSON 解析错误: ' + e.message);
    }
}

function clearJson() {
    var input = document.getElementById('jsonInput');
    if (input) input.value = '';
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
        { "id": 3, "name": "王五", "email": "wangwu@example.com", "age": 25, "department": "设计部", "skills": ["UI设计", "UX设计", "Figma"] },
        { "id": 4, "name": "赵六", "email": "zhaoliu@example.com", "age": 30, "department": "技术部", "skills": ["Java", "Spring", "MySQL"] },
        { "id": 5, "name": "钱七", "email": "qianqi@example.com", "age": 27, "department": "人事部", "skills": ["招聘", "培训", "绩效考核"] }
    ];
    input.value = JSON.stringify(sampleData, null, 2);
    parseJson();
}

function showError(msg) {
    var errorDiv = document.getElementById('jsonError');
    errorDiv.textContent = msg;
    errorDiv.style.display = 'block';
}

// ========== Card View Renderer (same style as homepage) ==========

function renderCardView(data) {
    var grid = document.getElementById('resultCardGrid');
    var filterContainer = document.getElementById('resultFilterButtons');
    var statsContainer = document.getElementById('resultStats');
    var searchInput = document.getElementById('resultSearchInput');

    if (!grid) return;
    grid.innerHTML = '';
    filterContainer.innerHTML = '';
    statsContainer.innerHTML = '';

    // Determine data format
    var items = [];
    if (Array.isArray(data)) {
        items = data;
    } else if (typeof data === 'object' && data !== null) {
        items = [data];
    } else {
        grid.innerHTML = '<p>JSON 不是数组或对象，无法以卡片形式展示。</p>';
        return;
    }

    if (items.length === 0) {
        grid.innerHTML = '<p>空数组，没有数据。</p>';
        return;
    }

    // Find a "name" or title-like field for the card heading
    var nameField = findBestNameField(items[0]);

    // Auto-detect filter field (look for fields with repeated values like "department", "category", "type", "group")
    var filterField = findBestFilterField(items);

    // Render cards
    var allKeys = [];
    items.forEach(function(item, index) {
        if (typeof item !== 'object' || item === null) {
            // primitive value
            grid.innerHTML += '<div class="employee-card"><h3>项目 ' + (index + 1) + '</h3><div class="employee-info"><p><strong>值:</strong> ' + escapeHtml(String(item)) + '</p></div></div>';
            return;
        }
        var cardHtml = '<div class="employee-card" data-index="' + index + '">';
        var cardName = item[nameField] || ('项目 ' + (index + 1));
        cardHtml += '<h3>' + escapeHtml(String(cardName)) + '</h3>';
        cardHtml += '<div class="employee-info">';

        Object.keys(item).forEach(function(key) {
            if (allKeys.indexOf(key) === -1) allKeys.push(key);
            if (key === nameField) return; // already shown as heading
            var val = item[key];

            if (Array.isArray(val)) {
                // Render as skill tags (same style as homepage)
                cardHtml += '<div class="skills"><strong>' + escapeHtml(key) + ':</strong><ul>';
                val.forEach(function(v) {
                    cardHtml += '<li>' + escapeHtml(String(v)) + '</li>';
                });
                cardHtml += '</ul></div>';
            } else if (typeof val === 'object' && val !== null) {
                cardHtml += '<p><strong>' + escapeHtml(key) + ':</strong> ' + escapeHtml(JSON.stringify(val)) + '</p>';
            } else {
                cardHtml += '<p><strong>' + escapeHtml(key) + ':</strong> ' + escapeHtml(String(val)) + '</p>';
            }
        });

        cardHtml += '</div></div>';
        grid.innerHTML += cardHtml;
    });

    // Render filter buttons
    if (filterField) {
        var categories = {};
        items.forEach(function(item) {
            if (typeof item === 'object' && item !== null && item[filterField] !== undefined) {
                var cat = String(item[filterField]);
                categories[cat] = (categories[cat] || 0) + 1;
            }
        });

        var filterHtml = '<button class="filter-btn active" data-dept="all">全部</button>';
        Object.keys(categories).forEach(function(cat) {
            filterHtml += '<button class="filter-btn" data-dept="' + escapeHtml(cat) + '">' + escapeHtml(cat) + ' (' + categories[cat] + ')</button>';
        });
        filterContainer.innerHTML = filterHtml;

        // Add click handlers
        filterContainer.querySelectorAll('.filter-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                filterContainer.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');
                var selected = this.getAttribute('data-dept');
                grid.querySelectorAll('.employee-card').forEach(function(card, i) {
                    if (selected === 'all') {
                        card.style.display = 'block';
                    } else {
                        var item = items[i];
                        if (item && String(item[filterField]) === selected) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    }
                });
            });
        });
    }

    // Render stats (same style as homepage)
    var statsHtml = '<h3>统计信息</h3>';
    statsHtml += '<p>总记录数: ' + items.length + '</p>';

    if (filterField) {
        var categories = {};
        items.forEach(function(item) {
            if (typeof item === 'object' && item !== null && item[filterField] !== undefined) {
                var cat = String(item[filterField]);
                categories[cat] = (categories[cat] || 0) + 1;
            }
        });
        statsHtml += '<p>' + escapeHtml(filterField) + '分布:</p><ul>';
        Object.keys(categories).forEach(function(cat) {
            statsHtml += '<li>' + escapeHtml(cat) + ': ' + categories[cat] + '条</li>';
        });
        statsHtml += '</ul>';
    }

    statsHtml += '<p>字段列表: ' + allKeys.map(function(k) { return escapeHtml(k); }).join(', ') + '</p>';
    statsContainer.innerHTML = statsHtml;

    // Reset search
    if (searchInput) searchInput.value = '';
}

// Find the best field to use as the card heading
function findBestNameField(item) {
    if (typeof item !== 'object' || item === null) return null;
    var nameCandidates = ['name', 'title', 'label', '名称', '标题', '姓名'];
    for (var i = 0; i < nameCandidates.length; i++) {
        if (item[nameCandidates[i]] !== undefined) return nameCandidates[i];
    }
    // Fallback: first string field
    var keys = Object.keys(item);
    for (var j = 0; j < keys.length; j++) {
        if (typeof item[keys[j]] === 'string') return keys[j];
    }
    return keys[0] || null;
}

// Find the best field to use for filtering/grouping
function findBestFilterField(items) {
    if (!items.length || typeof items[0] !== 'object' || items[0] === null) return null;
    var filterCandidates = ['department', 'category', 'type', 'group', 'status', '部门', '类别', '类型', '分组'];
    for (var i = 0; i < filterCandidates.length; i++) {
        var field = filterCandidates[i];
        var hasField = false;
        var values = {};
        items.forEach(function(item) {
            if (item[field] !== undefined) {
                hasField = true;
                values[String(item[field])] = true;
            }
        });
        // Only use as filter if there are multiple different values and not all unique
        if (hasField && Object.keys(values).length > 1 && Object.keys(values).length < items.length) {
            return field;
        }
    }
    // Fallback: find any string field with repeated values
    var keys = Object.keys(items[0]);
    for (var j = 0; j < keys.length; j++) {
        var key = keys[j];
        var values2 = {};
        var count = 0;
        items.forEach(function(item) {
            if (typeof item[key] === 'string') {
                values2[item[key]] = true;
                count++;
            }
        });
        if (count > 0 && Object.keys(values2).length > 1 && Object.keys(values2).length < items.length) {
            return key;
        }
    }
    return null;
}

// ========== Utility Functions ==========

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
