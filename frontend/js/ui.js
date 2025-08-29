const mathjaxExtension = () => {
    let placeholders = new Map();
    let counter = 0;

    return [{
        type: 'lang',
        filter: (text) => {
            placeholders.clear();
            counter = 0;
            const mathRegex = /(\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\))/g;
            return text.replace(mathRegex, (match) => {
                const placeholder = `%%MATH_PLACEHOLDER_${counter++}%%`;
                placeholders.set(placeholder, match);
                return placeholder;
            });
        }
    }, {
        type: 'output',
        filter: (html) => {
            placeholders.forEach((math, placeholder) => {
                const pattern = new RegExp(placeholder.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
                html = html.replace(pattern, math);
            });
            return html;
        }
    }];
};

showdown.extension('mathjax', mathjaxExtension);

const mainView = document.getElementById('main-view');
const markdownConverter = new showdown.Converter({
    literalMidWordUnderscores: true, 
    extensions: ['mathjax']         
});



function replacePlaceholders(content, context) {
    return content.replace(/\{\{([\w_]+)\}\}/g, (match, key) => {
        return Object.prototype.hasOwnProperty.call(context, key) ? context[key] : match;
    });
}

function renderContent(schemeData, activeTabId, context) {
    const activeTab = schemeData.tabs.find(tab => tab.id === activeTabId);
    if (!activeTab || !activeTab.content) {
        return '<p>Inhalt wird geladen oder nicht gefunden.</p>';
    }

    const steps = activeTab.content
        .split(/\n---\n/)
        .map(s => s.trim())
        .filter(Boolean);

    const contentHtml = steps.map(stepMarkdown => {
        const processedContent = replacePlaceholders(stepMarkdown, context);
        return `<div class="step-box">${markdownConverter.makeHtml(processedContent)}</div>`;
    }).join('');
    
    let statusHtml = '';
    if (context.is_loading) {
        statusHtml = '<div class="status-overlay"><div class="spinner"></div><p>Operation wird ausgeführt...</p></div>';
    } else if (context.current_error) {
        statusHtml = `<div class="status-overlay error-message"><p>Fehler: ${context.current_error}</p></div>`;
    }

    return `<div class="tab-content-wrapper">${statusHtml}${contentHtml}</div>`;
}



function renderTabs(schemeData, activeTabId) {
    if (!schemeData || !schemeData.tabs) return '';
    const tabsHtml = schemeData.tabs.map(tab =>
        `<button class="tab-btn ${tab.id === activeTabId ? 'active' : ''}" data-tab="${tab.id}">${tab.title}</button>`
    ).join('');
    return `<nav id="process-tabs">${tabsHtml}</nav>`;
}


export function renderMainView(schemeData, activeTabId, context) {
    const tabsHtml = renderTabs(schemeData, activeTabId);
    const contentHtml = renderContent(schemeData, activeTabId, context);
    mainView.innerHTML = tabsHtml + contentHtml;
    if (window.MathJax) {
        window.MathJax.typesetPromise([mainView]);
    }
}


export function renderComparisonPanel(allData, currentSchemeId, currentTabId) {
    const panel = document.getElementById('comparison-panel');
    if (!panel) return;

    const title = currentTabId.charAt(0).toUpperCase() + currentTabId.slice(1);
    let contentHtml = `<h4>Vergleich: ${title}</h4>`;

    let hasAnyData = false;
    for (const schemeId in allData) {
        const schemeData = allData[schemeId];
        const tabData = schemeData.comparison?.[currentTabId];

        if (tabData && Object.keys(tabData).length > 0) {
            hasAnyData = true;
            const isCurrent = schemeId === currentSchemeId ? 'current-scheme' : '';
            contentHtml += `<div class="compare-item ${isCurrent}">`;
            contentHtml += `<h5>${schemeData.name}</h5>`;
            contentHtml += Object.entries(tabData).map(([key, value]) =>
                `<p><strong>${key}:</strong> ${value}</p>`
            ).join('');
            contentHtml += `</div>`;
        }
    }

    if (!hasAnyData) {
        contentHtml += '<p>Keine Vergleichsdaten für diesen Schritt verfügbar.</p>';
    }
    panel.innerHTML = contentHtml;
}

export function updateAlgorithmSelector(container, supportedAlgorithms, schemeMetadata) {
    if (!container) return;

    const buttonsHtml = supportedAlgorithms
        .filter(alg => Object.keys(schemeMetadata).includes(alg))
        .map(alg => {
            const name = schemeMetadata[alg]?.name || alg;
            return `<button data-scheme="${alg}">${name}</button>`;
        }).join('');
        
    container.innerHTML = buttonsHtml;
}
