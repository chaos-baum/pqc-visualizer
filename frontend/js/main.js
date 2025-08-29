import { renderMainView, renderComparisonPanel, updateAlgorithmSelector } from './ui.js';
import { pqcData } from './data.js';
import * as api from './api.js';

const state = {
    schemeId: 'hqc',
    levelId: 'level1', 
    algorithm: '',
    tabId: 'setup',
    context: {
        publicKey: null,
        secretKey: null,
        ciphertext: null,
        sharedSecret: null,
        decapsulatedSharedSecret: null,
        decaps_validation_msg: '',
        current_error: null,
        is_loading: false,
    },
    supportedSchemes: Object.keys(pqcData)
};

const schemeSelector = document.getElementById('scheme-selector');
const mainView = document.getElementById('main-view');

async function loadContent() {
    const contentPromises = [];
    for (const schemeId in pqcData) {
        const scheme = pqcData[schemeId];
        if (scheme.tabs) {
            scheme.tabs.forEach(tab => {
                if (!tab.contentFile) return;
                const path = `content/${schemeId}/${tab.contentFile}`;
                const promise = fetch(path)
                    .then(res => res.ok ? res.text() : Promise.reject(`Konnte ${path} nicht laden`))
                    .then(text => { tab.content = text; });
                contentPromises.push(promise);
            });
        }
    }
    await Promise.all(contentPromises);
}

function updateStateFromSelection() {
    const scheme = pqcData[state.schemeId];
    if (!scheme) return;

    state.algorithm = scheme.levels ? scheme.levels[state.levelId] : '';

    const params = scheme.levelParams ? scheme.levelParams[state.levelId] || {} : {};
    state.context = {
        ...state.context,
        ...params,
        set_name: state.algorithm 
    };

    render();
}

function render() {
    const schemeData = pqcData[state.schemeId];
    if (!schemeData) {
        mainView.innerHTML = `<div class="status-overlay error-message"><p>Fehler: Keine UI-Metadaten für das Schema '${state.schemeId}' gefunden.</p></div>`;
        updateActiveSchemeButton(state.schemeId);
        return;
    }

    const renderContext = {
        ...state.context,
        pk_disabled: !state.context.publicKey || state.context.is_loading ? 'disabled' : '',
        decaps_disabled: !state.context.ciphertext || state.context.is_loading ? 'disabled' : '',
        decaps_validation_class: state.context.decaps_validation_msg ?
            (state.context.sharedSecret === state.context.decapsulatedSharedSecret ? 'success' : 'error') : '',
        level_selector_html: createLevelSelectorHtml(schemeData, state.levelId)
    };

    renderMainView(schemeData, state.tabId, renderContext);
    renderComparisonPanel(pqcData, state.schemeId, state.tabId);
    updateActiveSchemeButton(state.schemeId);
}

function createLevelSelectorHtml(schemeData, activeLevelId) {
    if (!schemeData || !schemeData.levels) return '';
    const options = Object.keys(schemeData.levels).map(levelKey =>
        `<option value="${levelKey}" ${levelKey === activeLevelId ? 'selected' : ''}>${levelKey}</option>`
    ).join('');
    return `<select id="level-selector">${options}</select>`;
}


function setLoading(isLoading) {
    state.context.is_loading = isLoading;
    if (isLoading) {
      state.context.current_error = null;
    }
    render();
}

async function handleKeyGen() {
    if (!state.algorithm) {
        alert("Fehler: Kein gültiger Algorithmus ausgewählt. Bitte überprüfen Sie die data.js-Konfiguration.");
        return;
    }
    setLoading(true);
    try {
        const { publicKey, secretKey } = await api.generateKeys(state.algorithm);
        state.context = {
            ...state.context,
            publicKey,
            secretKey,
            ciphertext: null,
            sharedSecret: null,
            decapsulatedSharedSecret: null,
            decaps_validation_msg: ''
        };
        state.tabId = 'keygen';
    } catch (error) {
        state.context.current_error = error.message;
    } finally {
        setLoading(false);
    }
}

async function handleEncaps() {
    if (!state.algorithm) return;
    setLoading(true);
    try {
        const { ciphertext, sharedSecret } = await api.encapsulate(state.algorithm, state.context.publicKey);
        state.context = { ...state.context, ciphertext, sharedSecret };
        state.tabId = 'encaps';
    } catch (error) {
        state.context.current_error = error.message;
    } finally {
        setLoading(false);
    }
}

async function handleDecaps() {
    if (!state.algorithm) return;
    setLoading(true);
    try {
        const { sharedSecret: decapsulated } = await api.decapsulate(
            state.algorithm,
            state.context.ciphertext,
            state.context.secretKey
        );
        state.context.decapsulatedSharedSecret = decapsulated;
        if (decapsulated === state.context.sharedSecret) {
            state.context.decaps_validation_msg = 'Erfolg: Die Schlüssel stimmen überein!';
        } else {
            state.context.decaps_validation_msg = 'Fehler: Die Schlüssel stimmen NICHT überein!';
        }
        state.tabId = 'decaps';
    } catch (error) {
        state.context.current_error = error.message;
        state.context.decaps_validation_msg = `Fehler bei der Entkapselung: ${error.message}`;
    } finally {
        setLoading(false);
    }
}


function updateActiveSchemeButton(activeSchemeId) {
    schemeSelector.querySelectorAll('button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.scheme === activeSchemeId);
    });
}

mainView.addEventListener('click', (e) => {
    const target = e.target;
    if (target.disabled || state.context.is_loading) return;

    if (target.classList.contains('tab-btn')) {
        state.tabId = target.dataset.tab;
        render();
    }
    if (target.id === 'run-keygen-btn') {
        handleKeyGen();
    }
    if (target.id === 'run-encaps-btn') {
        handleEncaps();
    }
    if (target.id === 'run-decaps-btn') {
        handleDecaps();
    }
});

mainView.addEventListener('change', (e) => {
    if (e.target.id === 'level-selector') {
        state.levelId = e.target.value;
        state.context = {
            ...state.context,
            publicKey: null, secretKey: null, ciphertext: null,
            sharedSecret: null, decapsulatedSharedSecret: null,
            decaps_validation_msg: ''
        };
        updateStateFromSelection();
    }
});


schemeSelector.addEventListener('click', (e) => {
    const target = e.target;
    if (target.tagName !== 'BUTTON' || target.dataset.scheme === state.schemeId) return;

    state.schemeId = target.dataset.scheme;
    const schemeData = pqcData[state.schemeId];
    state.tabId = schemeData.tabs[0].id;

    if (schemeData && schemeData.levels) {
        state.levelId = Object.keys(schemeData.levels)[0];
    } else {
        state.levelId = '';
        console.error(`Schema '${state.schemeId}' in pqcData.js hat keine 'levels' Eigenschaft.`);
    }

    state.context = {
        publicKey: null, secretKey: null, ciphertext: null,
        sharedSecret: null, decapsulatedSharedSecret: null,
        decaps_validation_msg: '', current_error: null, is_loading: false
    };

    updateStateFromSelection();
});

async function init() {
    setLoading(true);
    try {
        await loadContent();
        updateAlgorithmSelector(schemeSelector, state.supportedSchemes, pqcData);
        const initialScheme = pqcData[state.schemeId];
        if (initialScheme && initialScheme.levels) {
            state.levelId = Object.keys(initialScheme.levels)[0];
        } else {
            state.levelId = '';
             console.error(`Initiales Schema '${state.schemeId}' in pqcData.js hat keine 'levels' Eigenschaft.`);
        }
    } catch (error) {
        state.context.current_error = "Fehler beim Initialisieren der Anwendung: " + error.message;
        console.error(state.context.current_error);
    } finally {
        setLoading(false);
    }

    updateStateFromSelection();
}

document.addEventListener('DOMContentLoaded', init);
