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
`;
document.head.appendChild(style);
