/**
 * Controlador del Editor de Apuntes en 4 Secciones:
 * 1. Título y Datos de la Reunión
 * 2. Texto Clave o Base
 * 3. Desarrollo del Discurso o Tema
 * 4. Resumen y Aplicación Personal
 */

import { StorageService, MEETING_TYPES } from './storage.js';
import { ICONS } from './icons.js';

export class NoteEditor {
  constructor(options = {}) {
    this.currentNote = null;
    this.saveTimeout = null;
    this.onNoteSaved = options.onNoteSaved || (() => {});
    this.onScripturesUpdated = options.onScripturesUpdated || (() => {});
    this.onOpenBiblePicker = options.onOpenBiblePicker || (() => {});

    this.initDOM();
    this.bindEvents();
  }

  initDOM() {
    // SECCIÓN 1: Título y Datos
    this.titleInput = document.getElementById('note-title-input');
    this.meetingTypeSelect = document.getElementById('note-type-select');
    this.speakerInput = document.getElementById('note-speaker-input');
    this.locationInput = document.getElementById('note-location-input');
    this.dateInput = document.getElementById('note-date-input');

    // SECCIÓN 2: Texto Clave o Base
    this.keyScriptureRef = document.getElementById('key-scripture-ref');
    this.keyScriptureText = document.getElementById('key-scripture-text');
    this.btnPickKeyScripture = document.getElementById('btn-pick-key-scripture');
    this.btnClearKeyScripture = document.getElementById('btn-clear-key-scripture');

    // SECCIÓN 3: Desarrollo del Discurso
    this.contentArea = document.getElementById('note-editor-content');

    // SECCIÓN 4: Resumen y Aplicación Personal
    this.summaryInput = document.getElementById('note-summary-input');
    this.applicationInput = document.getElementById('note-application-input');

    // Indicadores y Bandeja
    this.saveStatusEl = document.getElementById('save-status-indicator');
    this.citedScripturesListEl = document.getElementById('cited-scriptures-list');
    this.citedScripturesCountEl = document.getElementById('cited-scriptures-count');

    // Cargar tipos de reunión en el selector
    this.meetingTypeSelect.innerHTML = '';
    Object.values(MEETING_TYPES).forEach(type => {
      const opt = document.createElement('option');
      opt.value = type.id;
      opt.textContent = type.label;
      this.meetingTypeSelect.appendChild(opt);
    });
  }

  bindEvents() {
    const triggerAutoSave = () => {
      this.showSavingStatus();
      clearTimeout(this.saveTimeout);
      this.saveTimeout = setTimeout(() => {
        this.saveCurrentNote();
      }, 500);
    };

    // Eventos Sección 1: Título y Datos
    this.titleInput.addEventListener('input', triggerAutoSave);
    this.speakerInput.addEventListener('input', triggerAutoSave);
    this.locationInput.addEventListener('input', triggerAutoSave);
    this.dateInput.addEventListener('change', triggerAutoSave);
    this.meetingTypeSelect.addEventListener('change', () => {
      this.updateTypeBadgeStyle();
      triggerAutoSave();
    });

    // Eventos Sección 2: Texto Clave
    this.keyScriptureRef.addEventListener('input', () => {
      this.extractAndUpdateScriptures();
      triggerAutoSave();
    });
    this.keyScriptureText.addEventListener('input', triggerAutoSave);

    this.btnPickKeyScripture?.addEventListener('click', () => {
      this.onOpenBiblePicker({ isKeyScripture: true });
    });

    this.btnClearKeyScripture?.addEventListener('click', () => {
      this.keyScriptureRef.value = '';
      this.keyScriptureText.value = '';
      this.extractAndUpdateScriptures();
      triggerAutoSave();
    });

    // Eventos Sección 3: Desarrollo del Discurso
    this.contentArea.addEventListener('input', () => {
      this.extractAndUpdateScriptures();
      triggerAutoSave();
    });

    this.contentArea.addEventListener('mouseup', () => this.saveSelection());
    this.contentArea.addEventListener('keyup', () => this.saveSelection());

    // Botones de formato de texto en Toolbar
    document.querySelectorAll('[data-format]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const cmd = btn.dataset.format;
        const val = btn.dataset.value || null;
        this.executeFormat(cmd, val);
      });
    });

    // Resaltador
    document.querySelectorAll('.hl-color-btn').forEach(hBtn => {
      hBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const color = hBtn.dataset.color;
        this.applyHighlight(color);
      });
    });

    // Botones para insertar texto bíblico en el desarrollo
    document.querySelectorAll('.btn-open-bible-picker').forEach(btn => {
      btn.addEventListener('click', () => {
        this.saveSelection();
        this.onOpenBiblePicker({ isKeyScripture: false });
      });
    });

    // Eventos Sección 4: Resumen y Aplicación Personal
    this.summaryInput.addEventListener('input', triggerAutoSave);
    this.applicationInput.addEventListener('input', triggerAutoSave);

    // Atajo de teclado: Ctrl+Alt+B
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b' && e.altKey) {
        e.preventDefault();
        this.saveSelection();
        this.onOpenBiblePicker({ isKeyScripture: false });
      }
    });

    // Eliminar tarjetas bíblicas
    this.contentArea.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('.btn-remove-quote');
      if (removeBtn) {
        const card = removeBtn.closest('.bible-quote-card');
        if (card) {
          card.remove();
          this.extractAndUpdateScriptures();
          triggerAutoSave();
        }
      }
    });
  }

  saveSelection() {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      this.savedRange = sel.getRangeAt(0);
    }
  }

  restoreSelection() {
    if (this.savedRange) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(this.savedRange);
    }
  }

  executeFormat(command, value = null) {
    this.contentArea.focus();
    this.restoreSelection();

    if (command === 'formatBlock') {
      document.execCommand('formatBlock', false, value);
    } else if (command === 'callout') {
      this.insertCalloutBlock(value || 'key-points');
    } else {
      document.execCommand(command, false, value);
    }
    
    this.saveSelection();
    this.saveCurrentNote();
  }

  applyHighlight(color = '#fef08a') {
    this.contentArea.focus();
    this.restoreSelection();
    
    const sel = window.getSelection();
    if (!sel.isCollapsed && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const span = document.createElement('mark');
      span.className = 'note-highlight';
      span.style.backgroundColor = color;
      span.appendChild(range.extractContents());
      range.insertNode(span);
      sel.removeAllRanges();
      this.saveCurrentNote();
    }
  }

  insertCalloutBlock(type = 'key-points') {
    const titles = {
      'key-points': 'Punto Clave del Discurso',
      'application': 'Aplicación Personal y Metas',
      'scripture-container': 'Textos Bíblicos Destacados'
    };

    const callout = document.createElement('div');
    callout.className = `note-callout ${type}`;
    callout.innerHTML = `
      <h4>${titles[type] || 'Punto Clave'}</h4>
      <p>Escribe aquí...</p>
    `;

    this.insertNodeAtCursor(callout);
  }

  /**
   * Asigna el Texto Base o Clave en la Sección 2
   */
  setKeyScripture({ citation, text }) {
    this.keyScriptureRef.value = citation || '';
    this.keyScriptureText.value = text || '';
    this.extractAndUpdateScriptures();
    this.saveCurrentNote();
    this.showToast(`Texto base asignado: ${citation}`);
  }

  /**
   * Inserta un texto bíblico secundario dentro de la Sección 3 (Desarrollo)
   */
  insertScripture({ citation, text, style = 'quote' }) {
    this.contentArea.focus();
    this.restoreSelection();

    if (style === 'quote') {
      const quoteCard = document.createElement('div');
      quoteCard.className = 'bible-quote-card';
      quoteCard.setAttribute('data-ref', citation);
      quoteCard.setAttribute('contenteditable', 'false');
      quoteCard.innerHTML = `
        <div class="quote-header">
          <span class="quote-ref">${ICONS.book(15)} ${citation} (TNM)</span>
          <div class="quote-actions">
            <span class="quote-badge">TNM · JW.ORG</span>
            <button class="btn-remove-quote" title="Quitar de la nota">&times;</button>
          </div>
        </div>
        <p class="quote-text" contenteditable="true">${text ? `"${text}"` : '<em>(Texto bíblico citado)</em>'}</p>
      `;

      this.insertNodeAtCursor(quoteCard);

      const p = document.createElement('p');
      p.innerHTML = '<br>';
      quoteCard.parentNode.insertBefore(p, quoteCard.nextSibling);

      const range = document.createRange();
      range.setStart(p, 0);
      range.collapse(true);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);

    } else if (style === 'chip') {
      const chip = document.createElement('span');
      chip.className = 'scripture-inline-chip';
      chip.setAttribute('data-ref', citation);
      chip.setAttribute('contenteditable', 'false');
      chip.innerHTML = `${ICONS.book(13)} ${citation}`;
      
      this.insertNodeAtCursor(chip);

      const space = document.createTextNode(' ');
      chip.parentNode.insertBefore(space, chip.nextSibling);
    }

    this.extractAndUpdateScriptures();
    this.saveCurrentNote();
  }

  insertNodeAtCursor(node) {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(node);
      range.setStartAfter(node);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      this.contentArea.appendChild(node);
    }
  }

  extractAndUpdateScriptures() {
    const foundScriptures = new Set();

    // 1. Texto Base (Sección 2)
    const baseRef = this.keyScriptureRef?.value?.trim();
    if (baseRef) {
      foundScriptures.add(baseRef);
    }

    // 2. Tarjetas de citas en Desarrollo (Sección 3)
    this.contentArea.querySelectorAll('.bible-quote-card').forEach(el => {
      const ref = el.getAttribute('data-ref');
      if (ref) foundScriptures.add(ref);
    });

    // 3. Chips inline en Desarrollo
    this.contentArea.querySelectorAll('.scripture-inline-chip').forEach(el => {
      const ref = el.getAttribute('data-ref');
      if (ref) foundScriptures.add(ref);
    });

    const scripturesList = Array.from(foundScriptures);
    if (this.currentNote) {
      this.currentNote.scriptures = scripturesList;
    }

    this.renderCitedScriptures(scripturesList);
    this.onScripturesUpdated(scripturesList);
  }

  renderCitedScriptures(scriptures = []) {
    this.citedScripturesCountEl.textContent = scriptures.length;
    this.citedScripturesListEl.innerHTML = '';

    if (scriptures.length === 0) {
      this.citedScripturesListEl.innerHTML = `
        <div class="empty-scriptures-msg">
          <span>Aún no hay textos registrados en esta reunión.</span>
          <button class="btn btn-sm btn-outline btn-open-bible-picker">
            ${ICONS.bookPlus(14)} Citar primer texto
          </button>
        </div>
      `;
      this.citedScripturesListEl.querySelector('.btn-open-bible-picker')?.addEventListener('click', () => {
        this.saveSelection();
        this.onOpenBiblePicker({ isKeyScripture: false });
      });
      return;
    }

    const baseRef = this.keyScriptureRef?.value?.trim();

    scriptures.forEach(sc => {
      const isBase = sc === baseRef;
      const item = document.createElement('div');
      item.className = `cited-scripture-item ${isBase ? 'is-base-scripture' : ''}`;
      item.innerHTML = `
        <div class="cited-sc-main">
          <span class="sc-icon">${isBase ? ICONS.starFilled(14) : ICONS.book(14)}</span>
          <span class="sc-text">${sc} ${isBase ? '<small style="color:var(--accent-gold);">(Texto Base)</small>' : ''}</span>
        </div>
        <div class="sc-actions">
          <button class="btn-icon-xs btn-jump-sc" title="Localizar en la nota">${ICONS.target(14)}</button>
          <button class="btn-icon-xs btn-copy-sc" title="Copiar referencia">${ICONS.copy(14)}</button>
        </div>
      `;

      item.querySelector('.btn-copy-sc').addEventListener('click', () => {
        navigator.clipboard.writeText(sc);
        this.showToast(`Copiado: ${sc}`);
      });

      item.querySelector('.btn-jump-sc').addEventListener('click', () => {
        if (isBase) {
          this.keyScriptureRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
          this.keyScriptureRef.focus();
        } else {
          const target = this.contentArea.querySelector(`[data-ref="${sc}"]`);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            target.classList.add('pulse-highlight');
            setTimeout(() => target.classList.remove('pulse-highlight'), 1600);
          }
        }
      });

      this.citedScripturesListEl.appendChild(item);
    });
  }

  loadNote(note) {
    if (!note) return;
    this.currentNote = { ...note };

    // SECCIÓN 1: Título y Datos
    this.titleInput.value = note.title || '';
    this.meetingTypeSelect.value = note.type || 'fin_semana';
    this.speakerInput.value = note.speaker || '';
    this.locationInput.value = note.location || '';
    this.dateInput.value = note.date || '';

    // SECCIÓN 2: Texto Clave
    this.keyScriptureRef.value = note.keyScripture?.ref || '';
    this.keyScriptureText.value = note.keyScripture?.text || '';

    // SECCIÓN 3: Desarrollo
    this.contentArea.innerHTML = note.content || '<p></p>';

    // SECCIÓN 4: Resumen y Aplicación
    this.summaryInput.value = note.summary || '';
    this.applicationInput.value = note.application || '';

    this.updateTypeBadgeStyle();
    this.extractAndUpdateScriptures();
    this.showSavedStatus();
  }

  saveCurrentNote() {
    if (!this.currentNote) return;

    // SECCIÓN 1
    this.currentNote.title = this.titleInput.value.trim() || 'Apunte sin título';
    this.currentNote.type = this.meetingTypeSelect.value;
    this.currentNote.speaker = this.speakerInput.value.trim();
    this.currentNote.location = this.locationInput.value.trim();
    this.currentNote.date = this.dateInput.value;

    // SECCIÓN 2
    this.currentNote.keyScripture = {
      ref: this.keyScriptureRef.value.trim(),
      text: this.keyScriptureText.value.trim()
    };

    // SECCIÓN 3
    this.currentNote.content = this.contentArea.innerHTML;

    // SECCIÓN 4
    this.currentNote.summary = this.summaryInput.value.trim();
    this.currentNote.application = this.applicationInput.value.trim();

    const saved = StorageService.saveNote(this.currentNote);
    this.currentNote = saved;

    this.showSavedStatus();
    this.onNoteSaved(saved);
  }

  showSavingStatus() {
    this.saveStatusEl.textContent = 'Guardando...';
    this.saveStatusEl.className = 'save-status saving';
  }

  showSavedStatus() {
    this.saveStatusEl.innerHTML = `Guardado ${ICONS.check(13)}`;
    this.saveStatusEl.className = 'save-status saved';
  }

  updateTypeBadgeStyle() {
    const val = this.meetingTypeSelect.value;
    const typeInfo = Object.values(MEETING_TYPES).find(t => t.id === val);
    if (typeInfo) {
      this.meetingTypeSelect.style.borderLeftColor = typeInfo.color;
    }
  }

  showToast(message) {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      toast.className = 'app-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('visible');
    setTimeout(() => {
      toast.classList.remove('visible');
    }, 2400);
  }
}
