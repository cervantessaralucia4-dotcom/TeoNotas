/**
 * Módulo de almacenamiento y estructura de notas en 4 Secciones:
 * 1. Título y Datos de la Reunión (Tipo, orador, fecha, lugar)
 * 2. Texto Clave o Base (Texto temático del discurso)
 * 3. Desarrollo del Discurso o Tema (Apuntes, puntos, textos adicionales)
 * 4. Resumen y Aplicación Personal (Ideas clave y metas prácticas)
 * 
 * Sin notas predeterminadas de ejemplo (inicia completamente limpio).
 * Base de datos: Web LocalStorage (Persistencia local en el dispositivo, privada y offline).
 */

import { ICONS } from './icons.js';

const STORAGE_KEY = 'teonotas_app_data_v3';
const SETTINGS_KEY = 'teonotas_app_settings_v3';
const USER_NAME_KEY = 'teonotas_user_name_v1';

export const MEETING_TYPES = {
  WEEKEND: { id: 'fin_semana', label: 'Fin de Semana: Discurso y La Atalaya', iconName: 'building', get icon() { return ICONS.building(16); }, color: '#4a6da7' },
  MIDWEEK: { id: 'entre_semana', label: 'Entre Semana: Vida y Ministerio Cristianos', iconName: 'calendar', get icon() { return ICONS.calendar(16); }, color: '#0d9488' },
  CIRCUIT_ASSEMBLY: { id: 'asamblea_circuito', label: 'Asamblea de Circuito (1 Día)', iconName: 'tent', get icon() { return ICONS.tent(16); }, color: '#7c3aed' },
  REGIONAL_CONVENTION: { id: 'asamblea_regional', label: 'Asamblea Regional (3 Días)', iconName: 'flag', get icon() { return ICONS.flag(16); }, color: '#c026d3' },
  SPECIAL: { id: 'especial', label: 'Reunión Especial / Visita de Circuito', iconName: 'sparkles', get icon() { return ICONS.sparkles(16); }, color: '#d97706' },
  MEMORIAL: { id: 'conmemoracion', label: 'Conmemoración / Discurso Especial', iconName: 'wine', get icon() { return ICONS.wine(16); }, color: '#dc2626' },
  FAMILY_WORSHIP: { id: 'estudio_personal', label: 'Adoración en Familia / Estudio Personal', iconName: 'book', get icon() { return ICONS.book(16); }, color: '#2563eb' }
};

export class StorageService {
  /**
   * Obtiene todas las notas guardadas en el almacenamiento local del dispositivo.
   * Sin información predeterminada (inicia vacío).
   */
  static getNotes() {
    try {
      if (typeof localStorage === 'undefined') return [];
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        return [];
      }
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Error cargando notas de localStorage:', e);
      return [];
    }
  }

  static saveNotes(notes) {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error('Error guardando notas en localStorage:', e);
    }
  }

  static getNoteById(id) {
    const notes = this.getNotes();
    return notes.find(n => n.id === id) || null;
  }

  static saveNote(note) {
    const notes = this.getNotes();
    const index = notes.findIndex(n => n.id === note.id);
    
    note.updatedAt = new Date().toISOString();
    
    if (index >= 0) {
      notes[index] = note;
    } else {
      notes.unshift(note);
    }
    
    this.saveNotes(notes);
    return note;
  }

  static deleteNote(id) {
    let notes = this.getNotes();
    notes = notes.filter(n => n.id !== id);
    this.saveNotes(notes);
    return notes;
  }

  static togglePin(id) {
    const notes = this.getNotes();
    const note = notes.find(n => n.id === id);
    if (note) {
      note.pinned = !note.pinned;
      this.saveNotes(notes);
      return note.pinned;
    }
    return false;
  }

  /**
   * Crea una nueva nota limpia estructurada en las 4 secciones
   */
  static createNewNote(type = 'fin_semana') {
    const now = new Date();
    const localIsoDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    
    const newNote = {
      id: 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      // SECCIÓN 1: Título y Datos
      title: '',
      type: type || 'fin_semana',
      speaker: '',
      location: '',
      date: localIsoDate,
      pinned: false,
      
      // SECCIÓN 2: Texto Clave o Base
      keyScripture: {
        ref: '',
        text: ''
      },
      
      // SECCIÓN 3: Desarrollo del Discurso / Tema
      content: '<p></p>',
      scriptures: [], // Textos citados durante el desarrollo
      
      // SECCIÓN 4: Resumen y Aplicación Personal
      summary: '',
      application: '',
      
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };
    
    return this.saveNote(newNote);
  }

  static getSettings() {
    try {
      if (typeof localStorage === 'undefined') {
        return { theme: 'dark', fontSize: '16px', fontFamily: 'roboto', autoSave: true };
      }
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? JSON.parse(data) : { 
        theme: 'dark', 
        fontSize: '16px', 
        fontFamily: 'roboto',
        autoSave: true 
      };
    } catch (e) {
      return { 
        theme: 'dark', 
        fontSize: '16px', 
        fontFamily: 'roboto',
        autoSave: true 
      };
    }
  }

  static saveSettings(settings) {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Error guardando configuración:', e);
    }
  }

  static getUserName() {
    try {
      if (typeof localStorage === 'undefined') return '';
      return (localStorage.getItem(USER_NAME_KEY) || '').trim();
    } catch (e) {
      console.error('Error obteniendo nombre de usuario:', e);
      return '';
    }
  }

  static saveUserName(name) {
    try {
      if (typeof localStorage === 'undefined') return '';
      const cleanName = (name || '').trim();
      if (cleanName) {
        localStorage.setItem(USER_NAME_KEY, cleanName);
      } else {
        localStorage.removeItem(USER_NAME_KEY);
      }
      return cleanName;
    } catch (e) {
      console.error('Error guardando nombre de usuario:', e);
      return '';
    }
  }

  static exportBackup() {
    const data = {
      notes: this.getNotes(),
      settings: this.getSettings(),
      exportDate: new Date().toISOString(),
      app: 'TeoNotas'
    };
    return JSON.stringify(data, null, 2);
  }

  static importBackup(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.notes)) {
        this.saveNotes(parsed.notes);
        if (parsed.settings) this.saveSettings(parsed.settings);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error al importar:', e);
      return false;
    }
  }
}
