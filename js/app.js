/**
 * Aplicación Principal TeoNotas
 * Arquitectura de 4 Secciones:
 * 1. Título y Datos de la Reunión
 * 2. Texto Clave o Base
 * 3. Desarrollo del Discurso o Tema
 * 4. Resumen y Aplicación Personal
 * 
 * Sin datos predeterminados (inicio limpio).
 * Base de datos: Web LocalStorage (Privada, segura y offline).
 */

import { StorageService, MEETING_TYPES } from './storage.js';
import { BiblePickerModal } from './bible-picker.js';
import { NoteEditor } from './editor.js';
import { ICONS } from './icons.js';

class App {
  constructor() {
    this.currentFilter = 'all';
    this.searchQuery = '';
    this.activeNoteId = null;
    this.currentFontSize = 16;
    this.pickerTarget = 'development'; // 'keyScripture' | 'development'
    this.currentView = 'home'; // 'home' | 'editor'
    this.splashTimer = null;
    this.splashDismissed = false;

    this.init();
  }

  init() {
    this.settings = StorageService.getSettings();
    this.applyTheme(this.settings.theme || 'dark');
    this.applyFontPreferences(this.settings.fontSize || '16px', this.settings.fontFamily || 'roboto');

    this.initEditorAndPicker();
    this.bindDOMEvents();
    
    // Cargar notas (sin información predeterminada de ejemplo)
    const notes = StorageService.getNotes();
    if (notes.length > 0) {
      this.activeNoteId = notes[0].id;
      this.editor.loadNote(notes[0]);
    }

    this.renderNotesList();
    this.updateGlobalStats();

    // Inicializar experiencia de usuario, onboarding y pantalla splash
    this.initUserAndSplash();
  }

  initEditorAndPicker() {
    // Modal Selector Bíblico de la TNM
    this.biblePicker = new BiblePickerModal({
      onInsert: (data) => {
        if (this.pickerTarget === 'keyScripture') {
          this.editor.setKeyScripture(data);
        } else {
          this.editor.insertScripture(data);
        }
      }
    });

    // Editor de Notas estructurado en las 4 secciones
    this.editor = new NoteEditor({
      onNoteSaved: (savedNote) => {
        this.renderNotesList();
        this.updateGlobalStats();
      },
      onScripturesUpdated: (scriptures) => {
        this.renderNotesList();
      },
      onOpenBiblePicker: ({ isKeyScripture } = {}) => {
        this.pickerTarget = isKeyScripture ? 'keyScripture' : 'development';
        this.biblePicker.show();
      }
    });
  }

  bindDOMEvents() {
    // Modal Guía Rápida ("¿Cómo usar?")
    const guideModal = document.getElementById('guide-modal');
    const openGuideBtns = [document.getElementById('btn-open-guide'), document.getElementById('mobile-nav-guide')];
    const closeGuideBtns = [document.getElementById('btn-close-guide'), document.getElementById('btn-guide-ok')];

    openGuideBtns.forEach(btn => {
      btn?.addEventListener('click', () => {
        guideModal.classList.remove('hidden');
      });
    });

    closeGuideBtns.forEach(btn => {
      btn?.addEventListener('click', () => {
        guideModal.classList.add('hidden');
      });
    });

    guideModal.addEventListener('click', (e) => {
      if (e.target === guideModal) guideModal.classList.add('hidden');
    });

    // Controles de Tipografía
    const btnFontDecrease = document.getElementById('btn-font-decrease');
    const btnFontIncrease = document.getElementById('btn-font-increase');
    const fontFamilySelect = document.getElementById('font-family-select');

    if (btnFontDecrease) {
      btnFontDecrease.addEventListener('click', () => {
        if (this.currentFontSize > 13) {
          this.currentFontSize -= 1;
          this.updateFontSize();
        }
      });
    }

    if (btnFontIncrease) {
      btnFontIncrease.addEventListener('click', () => {
        if (this.currentFontSize < 24) {
          this.currentFontSize += 1;
          this.updateFontSize();
        }
      });
    }

    if (fontFamilySelect) {
      fontFamilySelect.value = this.settings.fontFamily || 'roboto';
      fontFamilySelect.addEventListener('change', (e) => {
        this.setFontFamily(e.target.value);
      });
    }

    // Botón Nueva Nota Directo (Creación Instantánea)
    document.getElementById('btn-new-note')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.createNewNote('fin_semana');
    });

    // Pestañas de Vista: Inicio y Cuaderno (Header)
    document.getElementById('btn-nav-home')?.addEventListener('click', () => {
      this.switchView('home');
    });

    document.getElementById('btn-nav-editor')?.addEventListener('click', () => {
      this.switchView('editor');
    });

    // Navegación móvil inferior (Bottom Nav)
    document.getElementById('mobile-nav-home')?.addEventListener('click', () => {
      this.switchView('home');
    });

    document.getElementById('mobile-nav-editor')?.addEventListener('click', () => {
      this.switchView('editor');
    });

    document.getElementById('mobile-nav-notes')?.addEventListener('click', () => {
      document.getElementById('app-sidebar').classList.toggle('open');
    });

    // Perfil y Edición de Nombre
    document.getElementById('btn-user-badge')?.addEventListener('click', () => {
      this.openEditNameModal();
    });

    document.getElementById('btn-edit-home-name')?.addEventListener('click', () => {
      this.openEditNameModal();
    });

    document.getElementById('btn-continue-last-note')?.addEventListener('click', () => {
      this.switchView('editor');
    });

    document.getElementById('btn-home-view-all-notes')?.addEventListener('click', () => {
      document.getElementById('app-sidebar').classList.add('open');
    });

    // Tarjetas de Inicio Rápido por Tipo de Reunión
    document.querySelectorAll('.quick-meeting-card').forEach(card => {
      card.addEventListener('click', () => {
        const createType = card.dataset.createType || 'fin_semana';
        this.createNewNote(createType);
      });
    });

    // Eventos de Pantalla Splash
    document.getElementById('btn-skip-splash')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.dismissSplash();
    });

    document.getElementById('app-splash')?.addEventListener('click', () => {
      this.dismissSplash();
    });

    // Modal de Primer Uso (Onboarding)
    document.getElementById('onboarding-name-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveOnboardingName();
    });

    document.getElementById('btn-submit-onboarding')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.saveOnboardingName();
    });

    document.getElementById('onboarding-name-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.saveOnboardingName();
      }
    });

    // Modal para Cambiar Nombre
    document.getElementById('edit-name-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveEditName();
    });

    document.getElementById('btn-save-edit-name')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.saveEditName();
    });

    document.getElementById('btn-close-edit-name')?.addEventListener('click', () => {
      this.closeEditNameModal();
    });

    document.getElementById('btn-cancel-edit-name')?.addEventListener('click', () => {
      this.closeEditNameModal();
    });

    document.getElementById('edit-name-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'edit-name-modal') {
        this.closeEditNameModal();
      }
    });

    document.getElementById('edit-user-name-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.saveEditName();
      }
    });

    // Menú desplegable para crear nota con tipo específico
    document.querySelectorAll('.dropdown-template-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const typeKey = item.dataset.template;
        this.createNewNote(typeKey);
        this.closeAllDropdowns();
      });
    });

    // Alternador de Menús Dropdown
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const parent = toggle.closest('.dropdown');
        const isOpen = parent.classList.contains('open');
        this.closeAllDropdowns();
        if (!isOpen) parent.classList.add('open');
      });
    });

    document.addEventListener('click', () => this.closeAllDropdowns());

    // Búsqueda en vivo de notas
    const searchInput = document.getElementById('search-notes-input');
    searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.trim().toLowerCase();
      this.renderNotesList();
    });

    // Filtros de categoría en Sidebar
    document.querySelectorAll('.nav-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter || 'all';
        this.renderNotesList();

        if (window.innerWidth <= 768) {
          document.getElementById('app-sidebar').classList.remove('open');
        }
      });
    });

    // Cambio de Temas (Oscuro, Claro, Sepia)
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;
        this.applyTheme(theme);
        this.settings.theme = theme;
        StorageService.saveSettings(this.settings);
      });
    });

    // Modo Pantalla Completa / Enfoque
    const btnFullscreen = document.getElementById('btn-toggle-fullscreen');
    btnFullscreen.addEventListener('click', () => {
      document.body.classList.toggle('focus-mode');
      const isFocus = document.body.classList.contains('focus-mode');
      btnFullscreen.innerHTML = isFocus 
        ? `<span>${ICONS.minimize(15)} Salir Enfoque</span>` 
        : `<span>${ICONS.focus(15)} Enfoque</span>`;
    });

    // Menú móvil / Hamburguesa
    const btnToggleSidebar = document.getElementById('btn-toggle-sidebar');
    if (btnToggleSidebar) {
      btnToggleSidebar.addEventListener('click', () => {
        document.getElementById('app-sidebar').classList.toggle('open');
      });
    }

    // Exportar a PDF / Imprimir
    document.getElementById('btn-print-note').addEventListener('click', () => {
      this.printCurrentNote();
    });

    // Copiar Resumen formateado para WhatsApp / Mensajes
    document.getElementById('btn-copy-summary').addEventListener('click', () => {
      this.copyNoteSummary();
    });

    // Exportar a Markdown
    document.getElementById('btn-export-markdown').addEventListener('click', () => {
      this.exportAsMarkdown();
    });

    // Eliminar nota actual
    document.getElementById('btn-delete-current-note').addEventListener('click', () => {
      this.deleteActiveNote();
    });

    // Fijar / Desfijar nota actual
    document.getElementById('btn-pin-current-note').addEventListener('click', () => {
      if (this.activeNoteId) {
        const isPinned = StorageService.togglePin(this.activeNoteId);
        this.updatePinButtonState(isPinned);
        this.renderNotesList();
        this.editor.showToast(isPinned ? 'Nota fijada arriba' : 'Nota desfijada');
      }
    });

    // Respaldo y Restauración (Backup)
    document.getElementById('btn-export-backup')?.addEventListener('click', () => {
      this.downloadBackup();
    });

    const fileImportInput = document.getElementById('input-import-backup');
    if (fileImportInput) {
      fileImportInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const success = StorageService.importBackup(ev.target.result);
            if (success) {
              this.editor.showToast('¡Copia de seguridad restaurada con éxito!');
              this.renderNotesList();
              const notes = StorageService.getNotes();
              if (notes.length > 0) this.selectNote(notes[0].id);
            } else {
              alert('El archivo no es una copia de seguridad válida de TeoNotas.');
            }
          };
          reader.readAsText(file);
        }
      });
    }
  }

  applyFontPreferences(fontSizeStr, fontFamily) {
    const parsed = parseInt(fontSizeStr, 10);
    this.currentFontSize = isNaN(parsed) ? 16 : parsed;
    document.documentElement.style.setProperty('--font-size-base', `${this.currentFontSize}px`);
    this.setFontFamily(fontFamily || 'roboto');
  }

  updateFontSize() {
    document.documentElement.style.setProperty('--font-size-base', `${this.currentFontSize}px`);
    this.settings.fontSize = `${this.currentFontSize}px`;
    StorageService.saveSettings(this.settings);
    this.editor.showToast(`Tamaño de letra: ${this.currentFontSize}px`);
  }

  setFontFamily(family) {
    document.body.classList.remove('font-roboto', 'font-noto', 'font-serif');
    if (family === 'noto') {
      document.body.classList.add('font-noto');
    } else if (family === 'serif') {
      document.body.classList.add('font-serif');
    } else {
      document.body.classList.add('font-roboto');
    }
    this.settings.fontFamily = family;
    StorageService.saveSettings(this.settings);
  }

  closeAllDropdowns() {
    document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
  }

  /* ========================================================
     GESTIÓN DE EXPERIENCIA DE USUARIO, ONBOARDING Y SPLASH
     ======================================================== */
  initUserAndSplash() {
    const savedName = StorageService.getUserName();
    const splashEl = document.getElementById('app-splash');
    const progressBar = document.getElementById('splash-progress-bar');
    
    this.updateHomeGreeting();
    this.renderHomeRecents();

    if (!savedName) {
      // Primera vez: Ocultar splash y mostrar modal de bienvenida para pedir su nombre
      splashEl?.classList.add('hidden');
      this.switchView('home');
      setTimeout(() => {
        this.openOnboardingModal();
      }, 300);
    } else {
      // Usuario que regresa: Saludo personalizado en el splash
      this.updateUserNameUI(savedName);
      this.switchView('home');

      if (splashEl) {
        splashEl.classList.remove('hidden', 'fade-out');
        const greetingEl = document.getElementById('splash-user-greeting');
        if (greetingEl) {
          greetingEl.textContent = `¡Hola, ${savedName}!`;
        }

        // Animar barra de carga
        setTimeout(() => {
          if (progressBar) progressBar.style.width = '100%';
        }, 80);

        // Ocultar suavemente después de 1.8 segundos
        this.splashTimer = setTimeout(() => {
          this.dismissSplash();
        }, 1800);
      }
    }
  }

  dismissSplash() {
    if (this.splashDismissed) return;
    this.splashDismissed = true;
    if (this.splashTimer) clearTimeout(this.splashTimer);

    const splashEl = document.getElementById('app-splash');
    if (!splashEl) return;

    splashEl.classList.add('fade-out');
    setTimeout(() => {
      splashEl.classList.add('hidden');
    }, 500);
  }

  openOnboardingModal() {
    const modal = document.getElementById('onboarding-modal');
    modal?.classList.remove('hidden');
    setTimeout(() => {
      document.getElementById('onboarding-name-input')?.focus();
    }, 200);
  }

  closeOnboardingModal() {
    document.getElementById('onboarding-modal')?.classList.add('hidden');
  }

  saveOnboardingName() {
    const input = document.getElementById('onboarding-name-input');
    const errorEl = document.getElementById('onboarding-error');
    const name = input?.value?.trim() || '';

    if (!name) {
      if (errorEl) errorEl.classList.remove('hidden');
      input?.focus();
      return;
    }

    if (errorEl) errorEl.classList.add('hidden');
    StorageService.saveUserName(name);
    this.updateUserNameUI(name);
    this.closeOnboardingModal();
    this.editor.showToast(`¡Bienvenido, ${name}! Tu cuaderno está listo`);
    this.switchView('home');
  }

  openEditNameModal() {
    const currentName = StorageService.getUserName();
    const input = document.getElementById('edit-user-name-input');
    if (input) input.value = currentName;
    const errorEl = document.getElementById('edit-name-error');
    if (errorEl) errorEl.classList.add('hidden');

    document.getElementById('edit-name-modal')?.classList.remove('hidden');
    setTimeout(() => input?.focus(), 200);
  }

  closeEditNameModal() {
    document.getElementById('edit-name-modal')?.classList.add('hidden');
  }

  saveEditName() {
    const input = document.getElementById('edit-user-name-input');
    const errorEl = document.getElementById('edit-name-error');
    const name = input?.value?.trim() || '';

    if (!name) {
      if (errorEl) errorEl.classList.remove('hidden');
      input?.focus();
      return;
    }

    if (errorEl) errorEl.classList.add('hidden');
    StorageService.saveUserName(name);
    this.updateUserNameUI(name);
    this.closeEditNameModal();
    this.editor.showToast(`Nombre actualizado a: ${name}`);
  }

  updateUserNameUI(name) {
    const displayName = name || 'Querido Hermano';
    const headerBadgeName = document.getElementById('user-badge-name');
    if (headerBadgeName) headerBadgeName.textContent = name || 'Usuario';

    const homeUserName = document.getElementById('home-user-name');
    if (homeUserName) homeUserName.textContent = displayName;

    this.updateHomeGreeting();
  }

  updateHomeGreeting() {
    const hour = new Date().getHours();
    let timeGreeting = '¡Buenos días!';
    if (hour >= 12 && hour < 19) timeGreeting = '¡Buenas tardes!';
    else if (hour >= 19 || hour < 6) timeGreeting = '¡Buenas noches!';

    const greetingTimeEl = document.getElementById('home-greeting-time');
    if (greetingTimeEl) greetingTimeEl.textContent = timeGreeting;

    try {
      const now = new Date();
      const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      let formattedDate = new Intl.DateTimeFormat('es-ES', options).format(now);
      formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
      const dateEl = document.getElementById('home-current-date-text');
      if (dateEl) dateEl.textContent = formattedDate;
    } catch (e) {
      // Ignorar fallback
    }

    const btnContinue = document.getElementById('btn-continue-last-note');
    if (btnContinue) {
      btnContinue.style.display = this.activeNoteId ? 'inline-flex' : 'none';
    }
  }

  /* ========================================================
     CAMBIO DE VISTAS (INICIO vs CUADERNO)
     ======================================================== */
  switchView(viewName) {
    this.currentView = viewName;
    const homeView = document.getElementById('home-view');
    const editorView = document.getElementById('editor-view');
    const btnNavHome = document.getElementById('btn-nav-home');
    const btnNavEditor = document.getElementById('btn-nav-editor');
    const mobileNavHome = document.getElementById('mobile-nav-home');
    const mobileNavEditor = document.getElementById('mobile-nav-editor');

    if (viewName === 'home') {
      homeView?.classList.remove('hidden');
      editorView?.classList.add('hidden');

      btnNavHome?.classList.add('active');
      btnNavEditor?.classList.remove('active');
      mobileNavHome?.classList.add('active');
      mobileNavEditor?.classList.remove('active');

      this.updateHomeGreeting();
      this.renderHomeRecents();
    } else {
      homeView?.classList.add('hidden');
      editorView?.classList.remove('hidden');

      btnNavHome?.classList.remove('active');
      btnNavEditor?.classList.add('active');
      mobileNavHome?.classList.remove('active');
      mobileNavEditor?.classList.add('active');

      if (!this.activeNoteId) {
        const notes = StorageService.getNotes();
        if (notes.length > 0) {
          this.selectNote(notes[0].id);
        } else {
          this.createNewNote('fin_semana');
        }
      }
    }
  }

  renderHomeRecents() {
    const container = document.getElementById('home-recent-notes-container');
    if (!container) return;

    const notes = StorageService.getNotes();
    if (notes.length === 0) {
      container.innerHTML = `
        <div class="home-empty-notes">
          <div class="empty-icon">${ICONS.book(32)}</div>
          <h3 class="empty-title">Tu cuaderno está listo y limpio</h3>
          <p class="empty-desc">
            No tienes apuntes guardados en este dispositivo todavía. Toca una de las reuniones de arriba para iniciar tu primera nota organizada en las 4 secciones.
          </p>
          <button class="btn btn-primary btn-sm" id="btn-home-empty-create" style="margin-top: 0.35rem;">
            + Crear Mi Primer Apunte
          </button>
        </div>
      `;

      document.getElementById('btn-home-empty-create')?.addEventListener('click', () => {
        this.createNewNote('fin_semana');
      });
      return;
    }

    const recentNotes = notes.slice(0, 6);
    let cardsHtml = '<div class="home-notes-grid">';

    recentNotes.forEach(note => {
      const typeInfo = MEETING_TYPES[Object.keys(MEETING_TYPES).find(k => MEETING_TYPES[k].id === note.type)] || MEETING_TYPES.WEEKEND;
      let dateFormatted = 'Sin fecha';
      if (note.date) {
        try {
          const d = new Date(note.date);
          dateFormatted = d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
        } catch (e) {
          dateFormatted = note.date;
        }
      }

      const keyScriptureHtml = note.keyScripture?.ref 
        ? `<span class="card-sc-badge">${ICONS.star(13)} ${this.escapeHtml(note.keyScripture.ref)}</span>` 
        : '';

      cardsHtml += `
        <div class="home-note-card" data-note-id="${note.id}">
          <div>
            <div class="home-note-card-header">
              <span class="meeting-card-badge" style="background: rgba(74, 109, 167, 0.15); color: var(--jw-blue-light); display: inline-flex; align-items: center; gap: 4px;">
                ${typeInfo.icon} ${typeInfo.label.split(':')[0]}
              </span>
              <span style="font-size: 0.72rem; color: var(--text-muted);">${dateFormatted}</span>
            </div>
            <h4 class="home-note-title" style="margin-top: 0.45rem;">
              ${this.escapeHtml(note.title) || 'Apunte sin título'}
            </h4>
            <div class="home-note-meta" style="margin-top: 0.35rem;">
              ${note.speaker ? `<span style="display:inline-flex; align-items:center; gap:3px;">${ICONS.user(13)} ${this.escapeHtml(note.speaker)}</span>` : ''}
              ${note.location ? `<span style="display:inline-flex; align-items:center; gap:3px;">${ICONS.mapPin(13)} ${this.escapeHtml(note.location)}</span>` : ''}
            </div>
          </div>
          <div>
            ${keyScriptureHtml}
            <div style="margin-top: 0.5rem; text-align: right;">
              <span style="font-size: 0.76rem; font-weight: 600; color: var(--jw-blue-light); display: inline-flex; align-items: center; gap: 4px;">Abrir apunte ${ICONS.arrowRight(13)}</span>
            </div>
          </div>
        </div>
      `;
    });

    cardsHtml += '</div>';
    container.innerHTML = cardsHtml;

    container.querySelectorAll('.home-note-card').forEach(card => {
      card.addEventListener('click', () => {
        const noteId = card.dataset.noteId;
        this.selectNote(noteId);
      });
    });
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  createNewNote(type = 'fin_semana') {
    const newNote = StorageService.createNewNote(type);
    this.renderNotesList();
    this.selectNote(newNote.id);
    this.updateGlobalStats();
    this.switchView('editor');
    
    setTimeout(() => {
      const titleEl = document.getElementById('note-title-input');
      if (titleEl) {
        titleEl.focus();
        titleEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);

    this.editor.showToast('Nuevo apunte creado (Limpio)');
  }

  selectNote(id) {
    const note = StorageService.getNoteById(id);
    if (!note) return;

    this.activeNoteId = id;
    this.editor.loadNote(note);
    this.updatePinButtonState(note.pinned);
    this.switchView('editor');

    document.querySelectorAll('.note-list-card').forEach(card => {
      if (card.dataset.id === id) {
        card.classList.add('active');
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        card.classList.remove('active');
      }
    });

    if (window.innerWidth <= 768) {
      document.getElementById('app-sidebar')?.classList.remove('open');
    }
  }

  deleteActiveNote() {
    if (!this.activeNoteId) return;
    const note = StorageService.getNoteById(this.activeNoteId);
    if (!note) return;

    if (confirm(`¿Estás seguro de que deseas eliminar este apunte ("${note.title || 'Sin título'}")?`)) {
      const remaining = StorageService.deleteNote(this.activeNoteId);
      this.editor.showToast('Apunte eliminado');
      this.renderNotesList();
      this.updateGlobalStats();

      if (remaining.length > 0) {
        this.selectNote(remaining[0].id);
      } else {
        this.activeNoteId = null;
        this.renderHomeRecents();
        this.switchView('home');
      }
    }
  }

  updatePinButtonState(isPinned) {
    const pinBtn = document.getElementById('btn-pin-current-note');
    if (pinBtn) {
      pinBtn.innerHTML = isPinned 
        ? `${ICONS.starFilled(15)} <span>Fijada</span>` 
        : `${ICONS.star(15)} <span>Fijar</span>`;
      pinBtn.classList.toggle('active', isPinned);
    }
  }

  renderNotesList() {
    const listContainer = document.getElementById('notes-catalog-list');
    let notes = StorageService.getNotes();

    notes.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
    });

    if (this.currentFilter !== 'all') {
      if (this.currentFilter === 'pinned') {
        notes = notes.filter(n => n.pinned);
      } else {
        notes = notes.filter(n => n.type === this.currentFilter);
      }
    }

    if (this.searchQuery) {
      notes = notes.filter(n => {
        const titleMatch = (n.title || '').toLowerCase().includes(this.searchQuery);
        const speakerMatch = (n.speaker || '').toLowerCase().includes(this.searchQuery);
        const baseRefMatch = (n.keyScripture?.ref || '').toLowerCase().includes(this.searchQuery);
        const contentMatch = (n.content || '').toLowerCase().includes(this.searchQuery);
        const summaryMatch = (n.summary || '').toLowerCase().includes(this.searchQuery);
        const appMatch = (n.application || '').toLowerCase().includes(this.searchQuery);
        const scripturesMatch = (n.scriptures || []).some(s => s.toLowerCase().includes(this.searchQuery));
        return titleMatch || speakerMatch || baseRefMatch || contentMatch || summaryMatch || appMatch || scripturesMatch;
      });
    }

    listContainer.innerHTML = '';

    if (notes.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-notes-catalog" style="text-align: center; padding: 2rem 1rem;">
          <div style="display: flex; justify-content: center; margin-bottom: 0.5rem; color: var(--text-muted);">${ICONS.note(32)}</div>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 0.75rem;">No tienes notas guardadas aún.</p>
          <button class="btn btn-sm btn-primary" id="btn-catalog-create-new">Crear mi primer apunte</button>
        </div>
      `;
      listContainer.querySelector('#btn-catalog-create-new')?.addEventListener('click', () => {
        this.createNewNote('fin_semana');
      });
      return;
    }

    notes.forEach(note => {
      const typeInfo = MEETING_TYPES[Object.keys(MEETING_TYPES).find(k => MEETING_TYPES[k].id === note.type)] || MEETING_TYPES.WEEKEND;
      const card = document.createElement('div');
      card.className = `note-list-card ${this.activeNoteId === note.id ? 'active' : ''}`;
      card.dataset.id = note.id;

      let dateStr = 'Fecha no definida';
      if (note.date) {
        try {
          const d = new Date(note.date);
          dateStr = d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
        } catch (e) {
          dateStr = note.date;
        }
      }

      const scripturesBadges = (note.scriptures || [])
        .slice(0, 3)
        .map(s => `<span class="card-sc-badge">${ICONS.book(12)} ${s}</span>`)
        .join('');
      const moreScriptures = (note.scriptures && note.scriptures.length > 3) 
        ? `<span class="card-sc-more">+${note.scriptures.length - 3}</span>` 
        : '';

      card.innerHTML = `
        <div class="card-top-row">
          <span class="card-type-tag" style="background-color: ${typeInfo.color}22; color: ${typeInfo.color}; border: 1px solid ${typeInfo.color}44; display: inline-flex; align-items: center; gap: 4px;">
            ${typeInfo.icon} ${typeInfo.label.split(':')[0]}
          </span>
          <div class="card-top-actions">
            ${note.pinned ? `<span class="card-pinned-icon" title="Nota destacada">${ICONS.starFilled(14)}</span>` : ''}
            <span class="card-date">${dateStr}</span>
          </div>
        </div>

        <h4 class="card-title">${note.title || 'Apunte sin título'}</h4>
        
        ${note.speaker ? `<p class="card-speaker" style="display:inline-flex; align-items:center; gap:4px;">${ICONS.user(13)} ${note.speaker}</p>` : ''}
        ${note.keyScripture?.ref ? `<p style="font-size: 0.74rem; color: var(--accent-gold); font-weight: 600; margin-top: 2px; display:inline-flex; align-items:center; gap:4px;">${ICONS.star(13)} Base: ${note.keyScripture.ref}</p>` : ''}
        
        <div class="card-scriptures-row">
          ${scripturesBadges}
          ${moreScriptures}
        </div>
      `;

      card.addEventListener('click', () => {
        this.selectNote(note.id);
        if (window.innerWidth <= 768) {
          document.getElementById('app-sidebar').classList.remove('open');
        }
      });

      listContainer.appendChild(card);
    });

    this.renderScripturesCloud();
  }

  renderScripturesCloud() {
    const cloudContainer = document.getElementById('global-scriptures-cloud');
    if (!cloudContainer) return;

    const notes = StorageService.getNotes();
    const freqMap = {};

    notes.forEach(note => {
      (note.scriptures || []).forEach(sc => {
        freqMap[sc] = (freqMap[sc] || 0) + 1;
      });
    });

    const entries = Object.entries(freqMap).sort((a, b) => b[1] - a[1]).slice(0, 8);
    cloudContainer.innerHTML = '';

    if (entries.length === 0) {
      cloudContainer.innerHTML = '<span class="cloud-empty" style="font-size: 0.72rem; color: var(--text-muted);">Usa el selector para registrar citas</span>';
      return;
    }

    entries.forEach(([ref, count]) => {
      const chip = document.createElement('button');
      chip.className = 'cloud-scripture-chip';
      chip.innerHTML = `<span style="display:inline-flex; align-items:center; gap:3px;">${ICONS.book(13)} ${ref}</span> <small>(${count})</small>`;
      chip.title = `Filtrar notas que citan ${ref}`;
      chip.addEventListener('click', () => {
        const searchInput = document.getElementById('search-notes-input');
        searchInput.value = ref;
        this.searchQuery = ref.toLowerCase();
        this.renderNotesList();
      });
      cloudContainer.appendChild(chip);
    });
  }

  updateGlobalStats() {
    const notes = StorageService.getNotes();
    const totalNotesEl = document.getElementById('stat-total-notes');
    const totalScripturesEl = document.getElementById('stat-total-scriptures');

    if (totalNotesEl) totalNotesEl.textContent = notes.length;

    if (totalScripturesEl) {
      const allSc = new Set();
      notes.forEach(n => (n.scriptures || []).forEach(s => allSc.add(s)));
      totalScripturesEl.textContent = allSc.size;
    }

    const filterCounts = {
      all: notes.length,
      pinned: notes.filter(n => n.pinned).length,
      fin_semana: notes.filter(n => n.type === 'fin_semana').length,
      entre_semana: notes.filter(n => n.type === 'entre_semana').length,
      asamblea_circuito: notes.filter(n => n.type === 'asamblea_circuito').length,
      asamblea_regional: notes.filter(n => n.type === 'asamblea_regional').length,
      especial: notes.filter(n => n.type === 'especial').length,
      estudio_personal: notes.filter(n => n.type === 'estudio_personal').length
    };

    Object.entries(filterCounts).forEach(([filterKey, count]) => {
      const badge = document.querySelector(`.count-badge[data-count-for="${filterKey}"]`);
      if (badge) badge.textContent = count;
    });
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });
  }

  printCurrentNote() {
    window.print();
  }

  /**
   * Copia el resumen formateado abarcando las 4 Secciones
   */
  copyNoteSummary() {
    const note = StorageService.getNoteById(this.activeNoteId);
    if (!note) return;

    let text = `*${note.title || 'Apunte de Reunión'}*\n`;
    if (note.speaker) text += `Discursante: ${note.speaker}\n`;
    if (note.date) text += `Fecha: ${note.date.replace('T', ' ')}\n`;
    if (note.location) text += `Salón: ${note.location}\n`;
    
    // SECCIÓN 2: Texto Clave
    if (note.keyScripture?.ref) {
      text += `\n*TEXTO CLAVE O BASE:*\n${note.keyScripture.ref}\n`;
      if (note.keyScripture.text) {
        text += `"${note.keyScripture.text}"\n`;
      }
    }

    // SECCIÓN 4: Resumen y Aplicación
    if (note.summary) {
      text += `\n*RESUMEN DEL DISCURSO:*\n${note.summary}\n`;
    }

    if (note.application) {
      text += `\n*APLICACIÓN PERSONAL:*\n${note.application}\n`;
    }

    // Textos citados secundarios
    if (note.scriptures && note.scriptures.length > 0) {
      text += `\n*Textos bíblicos citados en la reunión (TNM):*\n`;
      note.scriptures.forEach(sc => {
        text += `• ${sc}\n`;
      });
    }

    text += `\n— Apuntes guardados con TeoNotas (TNM · JW.ORG)`;

    navigator.clipboard.writeText(text).then(() => {
      this.editor.showToast('¡Resumen de las 4 secciones copiado!');
    }).catch(() => {
      this.editor.showToast('No se pudo copiar automáticamente');
    });
  }

  exportAsMarkdown() {
    const note = StorageService.getNoteById(this.activeNoteId);
    if (!note) return;

    let md = `# ${note.title || 'Apunte'}\n\n`;
    md += `## 1. Título y Datos de la Reunión\n`;
    md += `- **Tipo de Reunión:** ${note.type}\n`;
    if (note.speaker) md += `- **Discursante:** ${note.speaker}\n`;
    if (note.date) md += `- **Fecha:** ${note.date}\n`;
    if (note.location) md += `- **Lugar:** ${note.location}\n\n`;

    if (note.keyScripture?.ref) {
      md += `## 2. Texto Clave o Base (TNM)\n`;
      md += `> **${note.keyScripture.ref}**\n>\n`;
      if (note.keyScripture.text) {
        md += `> "${note.keyScripture.text}"\n\n`;
      }
    }

    md += `## 3. Desarrollo del Discurso o Tema\n\n`;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = note.content || '';
    md += `${tempDiv.innerText || '(Sin desarrollo escrito)'}\n\n`;

    md += `## 4. Resumen y Aplicación Personal\n\n`;
    if (note.summary) {
      md += `### Resumen del Discurso\n${note.summary}\n\n`;
    }
    if (note.application) {
      md += `### Aplicación Personal\n${note.application}\n\n`;
    }

    if (note.scriptures && note.scriptures.length > 0) {
      md += `### Textos Bíblicos Citados (TNM)\n`;
      note.scriptures.forEach(s => {
        md += `- ${s}\n`;
      });
      md += `\n`;
    }

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(note.title || 'apunte').replace(/[^a-zA-Z0-9_-]/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  downloadBackup() {
    const backupJson = StorageService.exportBackup();
    const blob = new Blob([backupJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teonotas_respaldo_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.editor.showToast('Copia de seguridad descargada');
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.teonotasApp = new App();
});
