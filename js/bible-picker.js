/**
 * Selector Bíblico Simplificado, 100% Funcional y sin sobrecarga
 * Muestra EXACTAMENTE la cantidad de versículos que tiene el capítulo seleccionado.
 * Basado en la Traducción del Nuevo Mundo de las Santas Escrituras (TNM)
 */

import { BIBLE_BOOKS, getVerseCount, POPULAR_VERSES, findBook } from './bible-data.js';
import { ICONS } from './icons.js';

export class BiblePickerModal {
  constructor(options = {}) {
    this.onInsert = options.onInsert || (() => {});
    this.selectedBook = null;
    this.selectedChapter = 1;
    this.selectedVerse = '1';
    this.currentTestament = 'ALL';
    this.verseRangeStart = null;
    
    this.initDOM();
    this.bindEvents();
  }

  initDOM() {
    let modal = document.getElementById('bible-picker-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'bible-picker-modal';
      modal.className = 'modal-backdrop hidden';
      modal.innerHTML = `
        <div class="modal-dialog bible-picker-dialog-clean" role="dialog" aria-modal="true" aria-labelledby="clean-picker-title">
          
          <!-- Encabezado simple -->
          <div class="modal-header">
            <div class="modal-title-group">
              <span class="modal-icon">${ICONS.bookOpen(22)}</span>
              <div>
                <h3 id="clean-picker-title">Escoger Texto Bíblico (TNM)</h3>
                <p class="modal-subtitle" id="picker-progress-subtitle">Paso 1: Selecciona un libro</p>
              </div>
            </div>
            <button class="modal-close-btn" id="btn-close-picker" aria-label="Cerrar">&times;</button>
          </div>

          <!-- Barra de navegación de pasos (1. Libro > 2. Cap > 3. Vers) -->
          <div class="picker-step-bar-clean">
            <button class="step-pill-clean active" id="pill-step-1">
              <span>1. Libro:</span> <strong id="pill-book-name">Seleccionar</strong>
            </button>
            <span class="step-arrow">›</span>
            <button class="step-pill-clean disabled" id="pill-step-2">
              <span>2. Cap:</span> <strong id="pill-chapter-num">-</strong>
            </button>
            <span class="step-arrow">›</span>
            <button class="step-pill-clean disabled" id="pill-step-3">
              <span>3. Vers:</span> <strong id="pill-verse-num">-</strong>
            </button>
          </div>

          <div class="modal-body-clean">
            
            <!-- ==============================================
                 PASO 1: SELECCIONAR LIBRO
                 ============================================== -->
            <div class="picker-step-view" id="view-step-1">
              <div class="book-search-row">
                <input type="text" id="clean-book-search" placeholder="Buscar libro bíblico (ej: Mateo, Romanos, Salmos)..." autocomplete="off">
              </div>

              <div class="testament-filter-tabs">
                <button class="testament-tab active" data-testament="ALL">Todos (66)</button>
                <button class="testament-tab" data-testament="AT">Escrituras Hebreas (39)</button>
                <button class="testament-tab" data-testament="NT">Escrituras Griegas (27)</button>
              </div>

              <div class="books-grid-clean" id="clean-books-grid">
                <!-- Se llena con los 66 libros -->
              </div>
            </div>

            <!-- ==============================================
                 PASO 2: SELECCIONAR CAPÍTULO
                 ============================================== -->
            <div class="picker-step-view hidden" id="view-step-2">
              <div class="step-header-row">
                <button class="back-link-btn" id="btn-back-to-step1">← Cambiar Libro</button>
                <h4 class="step-heading" id="selected-book-heading">Libro</h4>
              </div>
              <p class="step-hint">Toca el capítulo citado:</p>
              <div class="numbers-grid-clean" id="clean-chapters-grid">
                <!-- Se llena con 1..N capítulos -->
              </div>
            </div>

            <!-- ==============================================
                 PASO 3: SELECCIONAR VERSÍCULO(S)
                 ============================================== -->
            <div class="picker-step-view hidden" id="view-step-3">
              <div class="step-header-row">
                <button class="back-link-btn" id="btn-back-to-step2">← Cambiar Capítulo</button>
                <h4 class="step-heading" id="selected-chapter-heading">Capítulo</h4>
              </div>

              <!-- Input de versículo editable con atajos -->
              <div class="verse-selection-toolbar">
                <div class="verse-selected-box">
                  <label for="clean-verse-input">Versículo(s):</label>
                  <input type="text" id="clean-verse-input" value="1">
                </div>
                <div class="verse-helper-shortcuts">
                  <button class="shortcut-chip" data-action="all">Capítulo entero</button>
                  <button class="shortcut-chip" data-action="reset">Limpiar selección</button>
                </div>
              </div>

              <p class="step-hint" id="verses-count-hint">Toca los versículos (solo los que contiene este capítulo):</p>
              
              <!-- Cuadrícula con la cantidad EXACTA de versículos -->
              <div class="numbers-grid-clean" id="clean-verses-grid">
                <!-- Se llena con exactamente los versículos del capítulo -->
              </div>

              <!-- Vista previa clara del texto a insertar -->
              <div class="verse-preview-card-clean">
                <div class="preview-card-top">
                  <span class="preview-ref-label" id="clean-preview-citation">Mateo 24:14</span>
                  <span class="preview-tnm-tag">TNM · JW.ORG</span>
                </div>
                <textarea id="clean-preview-text" placeholder="Texto de la cita bíblica o nota..." rows="2"></textarea>
              </div>

            </div>

          </div>

          <!-- Pie del Modal con acciones simples y directas -->
          <div class="modal-footer">
            <button class="btn btn-secondary" id="btn-cancel-clean">Cancelar</button>
            <button class="btn btn-primary" id="btn-confirm-insert">
              <span>${ICONS.check(16)}</span> Insertar Texto en el Apunte
            </button>
          </div>

        </div>
      `;
      document.body.appendChild(modal);
    }

    this.modalEl = modal;
    this.booksGrid = modal.querySelector('#clean-books-grid');
    this.chaptersGrid = modal.querySelector('#clean-chapters-grid');
    this.versesGrid = modal.querySelector('#clean-verses-grid');
    this.bookSearchInput = modal.querySelector('#clean-book-search');
    this.verseInput = modal.querySelector('#clean-verse-input');
    this.previewCitation = modal.querySelector('#clean-preview-citation');
    this.previewText = modal.querySelector('#clean-preview-text');
    this.subtitleEl = modal.querySelector('#picker-progress-subtitle');

    this.renderBooks();
  }

  bindEvents() {
    // Cerrar
    this.modalEl.querySelector('#btn-close-picker').addEventListener('click', () => this.hide());
    this.modalEl.querySelector('#btn-cancel-clean').addEventListener('click', () => this.hide());
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) this.hide();
    });

    // Píldoras de pasos
    this.modalEl.querySelector('#pill-step-1').addEventListener('click', () => this.goToStep(1));
    this.modalEl.querySelector('#pill-step-2').addEventListener('click', () => {
      if (this.selectedBook) this.goToStep(2);
    });
    this.modalEl.querySelector('#pill-step-3').addEventListener('click', () => {
      if (this.selectedBook) this.goToStep(3);
    });

    // Botones "Volver"
    this.modalEl.querySelector('#btn-back-to-step1').addEventListener('click', () => this.goToStep(1));
    this.modalEl.querySelector('#btn-back-to-step2').addEventListener('click', () => this.goToStep(2));

    // Búsqueda en vivo de libros
    this.bookSearchInput.addEventListener('input', (e) => {
      this.renderBooks(e.target.value.trim().toLowerCase());
    });

    // Filtro por Testamento (Todos, AT, NT)
    this.modalEl.querySelectorAll('.testament-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.modalEl.querySelectorAll('.testament-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentTestament = tab.dataset.testament;
        this.renderBooks(this.bookSearchInput.value.trim().toLowerCase());
      });
    });

    // Cambio manual en el input de versículos
    this.verseInput.addEventListener('input', (e) => {
      this.selectedVerse = e.target.value.trim() || '1';
      this.updatePreview();
    });

    // Atajos de versículos
    this.modalEl.querySelectorAll('.shortcut-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const action = chip.dataset.action;
        if (action === 'all') {
          const totalVerses = getVerseCount(this.selectedBook.id, this.selectedChapter);
          this.selectedVerse = `1-${totalVerses}`;
          this.verseInput.value = this.selectedVerse;
          this.updatePreview();
        } else if (action === 'reset') {
          this.selectedVerse = '1';
          this.verseInput.value = '1';
          this.verseRangeStart = null;
          this.highlightSelectedVerses();
          this.updatePreview();
        }
      });
    });

    // Botón Confirmar / Insertar
    this.modalEl.querySelector('#btn-confirm-insert').addEventListener('click', () => {
      this.triggerInsert();
    });

    // Tecla ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.modalEl.classList.contains('hidden')) {
        this.hide();
      }
    });
  }

  goToStep(stepNumber) {
    const views = [
      this.modalEl.querySelector('#view-step-1'),
      this.modalEl.querySelector('#view-step-2'),
      this.modalEl.querySelector('#view-step-3')
    ];

    const pills = [
      this.modalEl.querySelector('#pill-step-1'),
      this.modalEl.querySelector('#pill-step-2'),
      this.modalEl.querySelector('#pill-step-3')
    ];

    views.forEach((v, idx) => {
      if (idx + 1 === stepNumber) {
        v.classList.remove('hidden');
      } else {
        v.classList.add('hidden');
      }
    });

    pills.forEach((p, idx) => {
      if (idx + 1 === stepNumber) {
        p.classList.add('active');
        p.classList.remove('disabled');
      } else if (idx + 1 < stepNumber) {
        p.classList.remove('active');
        p.classList.remove('disabled');
      } else {
        p.classList.remove('active');
        p.classList.add('disabled');
      }
    });

    if (stepNumber === 1) {
      this.subtitleEl.textContent = 'Paso 1: Selecciona un libro de la Biblia';
      this.bookSearchInput.focus();
    } else if (stepNumber === 2 && this.selectedBook) {
      this.subtitleEl.textContent = `${this.selectedBook.name} › Paso 2: Selecciona el capítulo (1 al ${this.selectedBook.chapters})`;
      this.modalEl.querySelector('#selected-book-heading').textContent = `${this.selectedBook.name} (${this.selectedBook.chapters} caps.)`;
      this.renderChapters(this.selectedBook);
    } else if (stepNumber === 3 && this.selectedBook) {
      const totalVerses = getVerseCount(this.selectedBook.id, this.selectedChapter);
      this.subtitleEl.textContent = `${this.selectedBook.name} ${this.selectedChapter} › Paso 3: Selecciona los versículos (1 al ${totalVerses})`;
      this.modalEl.querySelector('#selected-chapter-heading').textContent = `${this.selectedBook.name} capítulo ${this.selectedChapter}`;
      this.modalEl.querySelector('#verses-count-hint').textContent = `Toca los versículos citados (este capítulo contiene exactamente ${totalVerses} versículos):`;
      this.renderVerses(this.selectedBook.id, this.selectedChapter);
      this.updatePreview();
    }
  }

  renderBooks(query = '') {
    this.booksGrid.innerHTML = '';

    const filtered = BIBLE_BOOKS.filter(b => {
      if (this.currentTestament !== 'ALL' && b.testament !== this.currentTestament) {
        return false;
      }
      if (query) {
        const nameClean = b.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const abbrevClean = b.abbrev.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const queryClean = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const aliasMatch = b.aliases.some(a => a.includes(queryClean));
        return nameClean.includes(queryClean) || abbrevClean.includes(queryClean) || aliasMatch;
      }
      return true;
    });

    if (filtered.length === 0) {
      this.booksGrid.innerHTML = `<div class="empty-books-msg" style="grid-column: 1/-1; text-align: center; padding: 1.5rem; color: var(--text-muted);">No se encontró ningún libro con "${query}"</div>`;
      return;
    }

    filtered.forEach(book => {
      const btn = document.createElement('button');
      btn.className = `book-card-clean ${this.selectedBook?.id === book.id ? 'selected' : ''}`;
      btn.innerHTML = `
        <span class="book-name-clean">${book.name}</span>
        <span class="book-sub-clean">${book.abbrev} · ${book.chapters} caps.</span>
      `;
      btn.addEventListener('click', () => {
        this.selectBook(book);
      });
      this.booksGrid.appendChild(btn);
    });
  }

  selectBook(book) {
    this.selectedBook = book;
    this.selectedChapter = 1;
    this.selectedVerse = '1';
    this.verseRangeStart = null;
    this.verseInput.value = '1';

    this.modalEl.querySelector('#pill-book-name').textContent = book.abbrev;
    this.modalEl.querySelector('#pill-step-2').classList.remove('disabled');

    this.goToStep(2);
  }

  renderChapters(book) {
    this.chaptersGrid.innerHTML = '';
    const totalChapters = book.chapters;

    for (let c = 1; c <= totalChapters; c++) {
      const btn = document.createElement('button');
      btn.className = `num-btn-clean ${this.selectedChapter === c ? 'selected' : ''}`;
      btn.textContent = c;
      btn.addEventListener('click', () => {
        this.selectedChapter = c;
        this.modalEl.querySelector('#pill-chapter-num').textContent = c;
        this.modalEl.querySelector('#pill-step-3').classList.remove('disabled');
        this.goToStep(3);
      });
      this.chaptersGrid.appendChild(btn);
    }
  }

  /**
   * Genera los botones de versículos basándose EXACTAMENTE en la cantidad
   * real de versículos de ese capítulo según getVerseCount()
   */
  renderVerses(bookId, chapter) {
    this.versesGrid.innerHTML = '';
    const totalVerses = getVerseCount(bookId, chapter);

    if (totalVerses <= 0) {
      this.versesGrid.innerHTML = `<p style="color:var(--text-muted);">Capítulo no disponible</p>`;
      return;
    }

    for (let v = 1; v <= totalVerses; v++) {
      const btn = document.createElement('button');
      btn.className = `num-btn-clean verse-btn-clean ${this.selectedVerse === String(v) ? 'selected' : ''}`;
      btn.dataset.verse = v;
      btn.textContent = v;

      btn.addEventListener('click', () => {
        this.handleVerseClick(v);
      });

      this.versesGrid.appendChild(btn);
    }

    this.highlightSelectedVerses();
  }

  handleVerseClick(verseNum) {
    if (!this.verseRangeStart) {
      // Primer clic: versículo individual
      this.verseRangeStart = verseNum;
      this.selectedVerse = String(verseNum);
    } else {
      // Segundo clic: si es el mismo, o si es mayor para hacer rango
      if (verseNum === this.verseRangeStart) {
        this.selectedVerse = String(verseNum);
      } else {
        const start = Math.min(this.verseRangeStart, verseNum);
        const end = Math.max(this.verseRangeStart, verseNum);
        this.selectedVerse = `${start}-${end}`;
      }
      this.verseRangeStart = null; // Reiniciar para próxima selección
    }

    this.verseInput.value = this.selectedVerse;
    this.highlightSelectedVerses();
    this.updatePreview();
  }

  highlightSelectedVerses() {
    const buttons = this.versesGrid.querySelectorAll('.verse-btn-clean');
    const vStr = this.selectedVerse || '';

    buttons.forEach(btn => {
      const v = parseInt(btn.dataset.verse, 10);
      let isSelected = false;

      if (vStr.includes('-')) {
        const parts = vStr.split('-').map(p => parseInt(p.trim(), 10));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          isSelected = v >= parts[0] && v <= parts[1];
        }
      } else if (vStr.includes(',')) {
        const list = vStr.split(',').map(p => parseInt(p.trim(), 10));
        isSelected = list.includes(v);
      } else {
        isSelected = parseInt(vStr, 10) === v;
      }

      btn.classList.toggle('selected', isSelected);
    });

    this.modalEl.querySelector('#pill-verse-num').textContent = this.selectedVerse;
  }

  updatePreview() {
    if (!this.selectedBook) {
      this.previewCitation.textContent = 'Ninguna seleccionada';
      return;
    }

    const citation = `${this.selectedBook.name} ${this.selectedChapter}:${this.selectedVerse}`;
    this.previewCitation.textContent = citation;

    // Buscar si tenemos el texto en populares de la TNM
    if (POPULAR_VERSES[citation]) {
      this.previewText.value = POPULAR_VERSES[citation];
    } else {
      // Si no está precargado, dejamos el campo listo para escribir o consultar
      this.previewText.placeholder = `Texto de ${citation} (Traducción del Nuevo Mundo)...`;
    }
  }

  triggerInsert() {
    if (!this.selectedBook) {
      alert('Por favor selecciona un libro.');
      return;
    }

    const citation = `${this.selectedBook.name} ${this.selectedChapter}:${this.selectedVerse}`;
    const quoteText = this.previewText.value.trim();

    this.onInsert({
      book: this.selectedBook,
      chapter: this.selectedChapter,
      verses: this.selectedVerse,
      citation,
      text: quoteText
    });

    this.hide();
  }

  show(initialBook = null) {
    this.modalEl.classList.remove('hidden');
    if (!this.selectedBook) {
      this.selectBook(initialBook || BIBLE_BOOKS[39]); // Mateo por defecto
      this.goToStep(1);
    } else {
      this.goToStep(1);
    }
    this.updatePreview();
  }

  hide() {
    this.modalEl.classList.add('hidden');
  }
}
