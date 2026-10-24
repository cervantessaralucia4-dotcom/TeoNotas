/**
 * Base de datos de los 66 libros de la Biblia en español
 * Basada en la Traducción del Nuevo Mundo de las Santas Escrituras (TNM) de JW.ORG
 * Con conteo exacto de capítulos y versículos por cada capítulo de los 66 libros (1,189 capítulos).
 */

export const BIBLE_DIVISIONS = {
  PENTATEUCO: { id: 'pentateuco', name: 'Pentateuco (La Ley)', testament: 'AT', color: '#3b82f6' },
  HISTORICOS_AT: { id: 'historicos_at', name: 'Libros Históricos', testament: 'AT', color: '#0ea5e9' },
  POETICOS: { id: 'poeticos', name: 'Libros Poéticos y Sapienciales', testament: 'AT', color: '#d97706' },
  PROFETAS_MAYORES: { id: 'profetas_mayores', name: 'Profetas Mayores', testament: 'AT', color: '#8b5cf6' },
  PROFETAS_MENORES: { id: 'profetas_menores', name: 'Profetas Menores', testament: 'AT', color: '#ec4899' },
  
  EVANGELIOS: { id: 'evangelios', name: 'Los Cuatro Evangelios', testament: 'NT', color: '#10b981' },
  HISTORICO_NT: { id: 'historico_nt', name: 'Hechos de los Apóstoles', testament: 'NT', color: '#14b8a6' },
  CARTAS_PABLO: { id: 'cartas_pablo', name: 'Cartas de Pablo', testament: 'NT', color: '#4a6da7' },
  CARTAS_GENERALES: { id: 'cartas_generales', name: 'Cartas Generales', testament: 'NT', color: '#f97316' },
  PROFECIA: { id: 'profecia', name: 'Profecía (Apocalipsis)', testament: 'NT', color: '#e11d48' }
};

export const BIBLE_BOOKS = [
  // Antiguo Testamento / Escrituras Hebreoarameas (39 libros)
  { id: 1, name: 'Génesis', abbrev: 'Gé', testament: 'AT', aliases: ['gen', 'genesis', 'ge', 'gn'], chapters: 50, division: 'PENTATEUCO' },
  { id: 2, name: 'Éxodo', abbrev: 'Éx', testament: 'AT', aliases: ['ex', 'exodo', 'exod'], chapters: 40, division: 'PENTATEUCO' },
  { id: 3, name: 'Levítico', abbrev: 'Le', testament: 'AT', aliases: ['lev', 'levitico', 'lv', 'le'], chapters: 27, division: 'PENTATEUCO' },
  { id: 4, name: 'Números', abbrev: 'Nú', testament: 'AT', aliases: ['num', 'numeros', 'nm', 'nu'], chapters: 36, division: 'PENTATEUCO' },
  { id: 5, name: 'Deuteronomio', abbrev: 'De', testament: 'AT', aliases: ['dt', 'deut', 'deuteronomio', 'de'], chapters: 34, division: 'PENTATEUCO' },
  { id: 6, name: 'Josué', abbrev: 'Jos', testament: 'AT', aliases: ['jos', 'josue', 'js'], chapters: 24, division: 'HISTORICOS_AT' },
  { id: 7, name: 'Jueces', abbrev: 'Jue', testament: 'AT', aliases: ['jue', 'jueces', 'jc'], chapters: 21, division: 'HISTORICOS_AT' },
  { id: 8, name: 'Rut', abbrev: 'Rut', testament: 'AT', aliases: ['rut', 'rt'], chapters: 4, division: 'HISTORICOS_AT' },
  { id: 9, name: '1 Samuel', abbrev: '1Sa', testament: 'AT', aliases: ['1sam', '1 samuel', '1s', '1sa'], chapters: 31, division: 'HISTORICOS_AT' },
  { id: 10, name: '2 Samuel', abbrev: '2Sa', testament: 'AT', aliases: ['2sam', '2 samuel', '2s', '2sa'], chapters: 24, division: 'HISTORICOS_AT' },
  { id: 11, name: '1 Reyes', abbrev: '1Re', testament: 'AT', aliases: ['1rey', '1 reyes', '1r', '1re'], chapters: 22, division: 'HISTORICOS_AT' },
  { id: 12, name: '2 Reyes', abbrev: '2Re', testament: 'AT', aliases: ['2rey', '2 reyes', '2r', '2re'], chapters: 25, division: 'HISTORICOS_AT' },
  { id: 13, name: '1 Crónicas', abbrev: '1Cr', testament: 'AT', aliases: ['1cron', '1 cronicas', '1cr'], chapters: 29, division: 'HISTORICOS_AT' },
  { id: 14, name: '2 Crónicas', abbrev: '2Cr', testament: 'AT', aliases: ['2cron', '2 cronicas', '2cr'], chapters: 36, division: 'HISTORICOS_AT' },
  { id: 15, name: 'Esdras', abbrev: 'Esd', testament: 'AT', aliases: ['esd', 'esdras', 'ed'], chapters: 10, division: 'HISTORICOS_AT' },
  { id: 16, name: 'Nehemías', abbrev: 'Ne', testament: 'AT', aliases: ['neh', 'nehemias', 'ne'], chapters: 13, division: 'HISTORICOS_AT' },
  { id: 17, name: 'Ester', abbrev: 'Est', testament: 'AT', aliases: ['est', 'ester'], chapters: 10, division: 'HISTORICOS_AT' },
  { id: 18, name: 'Job', abbrev: 'Job', testament: 'AT', aliases: ['job', 'jb'], chapters: 42, division: 'POETICOS' },
  { id: 19, name: 'Salmos', abbrev: 'Sl', testament: 'AT', aliases: ['sal', 'salmos', 'salmo', 'sl', 'ps'], chapters: 150, division: 'POETICOS' },
  { id: 20, name: 'Proverbios', abbrev: 'Pr', testament: 'AT', aliases: ['prov', 'proverbios', 'pr'], chapters: 31, division: 'POETICOS' },
  { id: 21, name: 'Eclesiastés', abbrev: 'Ec', testament: 'AT', aliases: ['ecl', 'eclesiastes', 'ec'], chapters: 12, division: 'POETICOS' },
  { id: 22, name: 'El Cantar de los Cantares', abbrev: 'Can', testament: 'AT', aliases: ['cant', 'cantares', 'cantar', 'cnt', 'can'], chapters: 8, division: 'POETICOS' },
  { id: 23, name: 'Isaías', abbrev: 'Is', testament: 'AT', aliases: ['isa', 'isaias', 'is'], chapters: 66, division: 'PROFETAS_MAYORES' },
  { id: 24, name: 'Jeremías', abbrev: 'Jer', testament: 'AT', aliases: ['jer', 'jeremias', 'jr'], chapters: 52, division: 'PROFETAS_MAYORES' },
  { id: 25, name: 'Lamentaciones', abbrev: 'La', testament: 'AT', aliases: ['lam', 'lamentaciones', 'lm', 'la'], chapters: 5, division: 'PROFETAS_MAYORES' },
  { id: 26, name: 'Ezequiel', abbrev: 'Ez', testament: 'AT', aliases: ['ezeq', 'ezequiel', 'ez'], chapters: 48, division: 'PROFETAS_MAYORES' },
  { id: 27, name: 'Daniel', abbrev: 'Da', testament: 'AT', aliases: ['dan', 'daniel', 'dn', 'da'], chapters: 12, division: 'PROFETAS_MAYORES' },
  { id: 28, name: 'Oseas', abbrev: 'Os', testament: 'AT', aliases: ['os', 'oseas'], chapters: 14, division: 'PROFETAS_MENORES' },
  { id: 29, name: 'Joel', abbrev: 'Joe', testament: 'AT', aliases: ['joel', 'jl', 'joe'], chapters: 3, division: 'PROFETAS_MENORES' },
  { id: 30, name: 'Amós', abbrev: 'Am', testament: 'AT', aliases: ['amos', 'am'], chapters: 9, division: 'PROFETAS_MENORES' },
  { id: 31, name: 'Abdías', abbrev: 'Ab', testament: 'AT', aliases: ['abd', 'abdias', 'ob', 'ab'], chapters: 1, division: 'PROFETAS_MENORES' },
  { id: 32, name: 'Jonás', abbrev: 'Jon', testament: 'AT', aliases: ['jon', 'jonas'], chapters: 4, division: 'PROFETAS_MENORES' },
  { id: 33, name: 'Miqueas', abbrev: 'Miq', testament: 'AT', aliases: ['miq', 'miqueas', 'mq', 'mi'], chapters: 7, division: 'PROFETAS_MENORES' },
  { id: 34, name: 'Nahúm', abbrev: 'Na', testament: 'AT', aliases: ['nah', 'nahum', 'na'], chapters: 3, division: 'PROFETAS_MENORES' },
  { id: 35, name: 'Habacuc', abbrev: 'Hab', testament: 'AT', aliases: ['hab', 'habacuc'], chapters: 3, division: 'PROFETAS_MENORES' },
  { id: 36, name: 'Sofonías', abbrev: 'Sof', testament: 'AT', aliases: ['sof', 'sofonias'], chapters: 3, division: 'PROFETAS_MENORES' },
  { id: 37, name: 'Hageo', abbrev: 'Ag', testament: 'AT', aliases: ['hag', 'hageo', 'ag'], chapters: 2, division: 'PROFETAS_MENORES' },
  { id: 38, name: 'Zacarías', abbrev: 'Zac', testament: 'AT', aliases: ['zac', 'zacarias', 'zc'], chapters: 14, division: 'PROFETAS_MENORES' },
  { id: 39, name: 'Malaquías', abbrev: 'Mal', testament: 'AT', aliases: ['mal', 'malaquias'], chapters: 4, division: 'PROFETAS_MENORES' },

  // Nuevo Testamento / Escrituras Griegas Cristianas (27 libros)
  { id: 40, name: 'Mateo', abbrev: 'Mt', testament: 'NT', aliases: ['mat', 'mateo', 'mt'], chapters: 28, division: 'EVANGELIOS' },
  { id: 41, name: 'Marcos', abbrev: 'Mr', testament: 'NT', aliases: ['mar', 'marcos', 'mc', 'mr'], chapters: 16, division: 'EVANGELIOS' },
  { id: 42, name: 'Lucas', abbrev: 'Lu', testament: 'NT', aliases: ['luc', 'lucas', 'lc', 'lu'], chapters: 24, division: 'EVANGELIOS' },
  { id: 43, name: 'Juan', abbrev: 'Jn', testament: 'NT', aliases: ['juan', 'jn', 'jhn'], chapters: 21, division: 'EVANGELIOS' },
  { id: 44, name: 'Hechos', abbrev: 'Hch', testament: 'NT', aliases: ['hech', 'hechos', 'hch', 'act'], chapters: 28, division: 'HISTORICO_NT' },
  { id: 45, name: 'Romanos', abbrev: 'Ro', testament: 'NT', aliases: ['rom', 'romanos', 'rm', 'ro'], chapters: 16, division: 'CARTAS_PABLO' },
  { id: 46, name: '1 Corintios', abbrev: '1Co', testament: 'NT', aliases: ['1cor', '1 corintios', '1co'], chapters: 16, division: 'CARTAS_PABLO' },
  { id: 47, name: '2 Corintios', abbrev: '2Co', testament: 'NT', aliases: ['2cor', '2 corintios', '2co'], chapters: 13, division: 'CARTAS_PABLO' },
  { id: 48, name: 'Gálatas', abbrev: 'Gál', testament: 'NT', aliases: ['gal', 'galatas', 'ga', 'gál'], chapters: 6, division: 'CARTAS_PABLO' },
  { id: 49, name: 'Efesios', abbrev: 'Ef', testament: 'NT', aliases: ['efe', 'efesios', 'ef', 'ep'], chapters: 6, division: 'CARTAS_PABLO' },
  { id: 50, name: 'Filipenses', abbrev: 'Flp', testament: 'NT', aliases: ['fil', 'filipenses', 'flp', 'fp'], chapters: 4, division: 'CARTAS_PABLO' },
  { id: 51, name: 'Colosenses', abbrev: 'Col', testament: 'NT', aliases: ['col', 'colosenses', 'cl'], chapters: 4, division: 'CARTAS_PABLO' },
  { id: 52, name: '1 Tesalonicenses', abbrev: '1Te', testament: 'NT', aliases: ['1tes', '1 tesalonicenses', '1ts', '1te'], chapters: 5, division: 'CARTAS_PABLO' },
  { id: 53, name: '2 Tesalonicenses', abbrev: '2Te', testament: 'NT', aliases: ['2tes', '2 tesalonicenses', '2ts', '2te'], chapters: 3, division: 'CARTAS_PABLO' },
  { id: 54, name: '1 Timoteo', abbrev: '1Ti', testament: 'NT', aliases: ['1tim', '1 timoteo', '1tm', '1ti'], chapters: 6, division: 'CARTAS_PABLO' },
  { id: 55, name: '2 Timoteo', abbrev: '2Ti', testament: 'NT', aliases: ['2tim', '2 timoteo', '2tm', '2ti'], chapters: 4, division: 'CARTAS_PABLO' },
  { id: 56, name: 'Tito', abbrev: 'Tit', testament: 'NT', aliases: ['tit', 'tito', 'tt'], chapters: 3, division: 'CARTAS_PABLO' },
  { id: 57, name: 'Filemón', abbrev: 'Flm', testament: 'NT', aliases: ['filem', 'filemon', 'flm'], chapters: 1, division: 'CARTAS_PABLO' },
  { id: 58, name: 'Hebreos', abbrev: 'Heb', testament: 'NT', aliases: ['heb', 'hebreos', 'he'], chapters: 13, division: 'CARTAS_PABLO' },
  { id: 59, name: 'Santiago', abbrev: 'Snt', testament: 'NT', aliases: ['sant', 'santiago', 'stgo', 'stg', 'snt'], chapters: 5, division: 'CARTAS_GENERALES' },
  { id: 60, name: '1 Pedro', abbrev: '1Pe', testament: 'NT', aliases: ['1ped', '1 pedro', '1p', '1pe'], chapters: 5, division: 'CARTAS_GENERALES' },
  { id: 61, name: '2 Pedro', abbrev: '2Pe', testament: 'NT', aliases: ['2ped', '2 pedro', '2p', '2pe'], chapters: 3, division: 'CARTAS_GENERALES' },
  { id: 62, name: '1 Juan', abbrev: '1Jn', testament: 'NT', aliases: ['1juan', '1jn', '1jhn'], chapters: 5, division: 'CARTAS_GENERALES' },
  { id: 63, name: '2 Juan', abbrev: '2Jn', testament: 'NT', aliases: ['2juan', '2jn', '2jhn'], chapters: 1, division: 'CARTAS_GENERALES' },
  { id: 64, name: '3 Juan', abbrev: '3Jn', testament: 'NT', aliases: ['3juan', '3jn', '3jhn'], chapters: 1, division: 'CARTAS_GENERALES' },
  { id: 65, name: 'Judas', abbrev: 'Jud', testament: 'NT', aliases: ['jud', 'judas', 'jd'], chapters: 1, division: 'CARTAS_GENERALES' },
  { id: 66, name: 'Apocalipsis', abbrev: 'Ap', testament: 'NT', aliases: ['apoc', 'apocalipsis', 'revelacion', 'rev', 're', 'ap'], chapters: 22, division: 'PROFECIA' }
];

/**
 * Conteo canónico exacto de versículos por cada capítulo de los 66 libros
 */
export const VERSE_COUNTS = {
  1: [31, 25, 24, 26, 32, 22, 24, 22, 29, 32, 32, 20, 18, 24, 21, 16, 27, 33, 38, 18, 34, 24, 20, 67, 34, 35, 46, 22, 35, 43, 55, 32, 20, 31, 29, 43, 36, 30, 23, 23, 57, 38, 34, 34, 28, 34, 31, 22, 33, 26], // Gen (50)
  2: [22, 25, 22, 31, 23, 30, 25, 32, 35, 29, 10, 51, 22, 31, 27, 36, 16, 27, 25, 26, 36, 31, 33, 18, 40, 37, 21, 43, 46, 38, 18, 35, 23, 35, 35, 38, 29, 31, 43, 38], // Ex (40)
  3: [17, 16, 17, 35, 19, 30, 38, 36, 24, 20, 47, 8, 59, 57, 33, 34, 16, 30, 37, 27, 24, 33, 44, 23, 55, 46, 34], // Lev (27)
  4: [54, 34, 51, 49, 31, 27, 89, 26, 23, 36, 35, 16, 33, 45, 41, 50, 13, 32, 22, 29, 35, 41, 30, 25, 18, 65, 23, 31, 40, 16, 54, 42, 56, 29, 34, 13], // Num (36)
  5: [46, 37, 29, 49, 33, 25, 26, 20, 29, 22, 32, 32, 18, 29, 23, 22, 20, 22, 21, 20, 23, 30, 25, 22, 19, 19, 26, 68, 29, 20, 30, 52, 29, 12], // Deut (34)
  6: [18, 24, 17, 24, 15, 27, 26, 35, 27, 43, 23, 24, 33, 15, 63, 10, 18, 28, 51, 9, 45, 34, 16, 33], // Jos (24)
  7: [36, 23, 31, 24, 31, 40, 25, 35, 57, 18, 40, 15, 25, 20, 20, 31, 13, 31, 30, 48, 25], // Jue (21)
  8: [22, 23, 18, 22], // Rut (4)
  9: [28, 36, 21, 22, 12, 21, 17, 22, 27, 27, 15, 25, 23, 52, 35, 23, 58, 30, 24, 42, 15, 23, 29, 22, 44, 25, 12, 25, 11, 31, 13], // 1Sam (31)
  10: [27, 32, 39, 12, 25, 23, 29, 18, 13, 19, 27, 31, 39, 33, 37, 23, 29, 33, 43, 26, 22, 51, 39, 25], // 2Sam (24)
  11: [53, 46, 28, 34, 18, 38, 51, 66, 28, 29, 43, 33, 34, 31, 34, 34, 24, 46, 21, 43, 29, 53], // 1Rey (22)
  12: [18, 25, 27, 44, 27, 33, 20, 29, 37, 36, 21, 21, 25, 29, 38, 20, 41, 37, 37, 21, 26, 20, 37, 20, 30], // 2Rey (25)
  13: [54, 55, 24, 43, 26, 81, 40, 40, 44, 14, 47, 40, 14, 17, 29, 43, 27, 17, 19, 8, 30, 19, 32, 31, 31, 32, 34, 21, 30], // 1Cro (29)
  14: [17, 18, 17, 22, 14, 42, 22, 18, 31, 19, 23, 16, 22, 15, 19, 14, 19, 34, 11, 37, 20, 12, 21, 27, 28, 23, 9, 27, 36, 27, 21, 33, 25, 33, 27, 23], // 2Cro (36)
  15: [11, 70, 13, 24, 17, 22, 28, 36, 15, 44], // Esd (10)
  16: [11, 20, 32, 23, 19, 19, 73, 18, 38, 39, 36, 47, 31], // Neh (13)
  17: [22, 23, 15, 17, 14, 14, 10, 17, 32, 3], // Est (10)
  18: [22, 13, 26, 21, 27, 30, 21, 22, 35, 22, 20, 25, 28, 22, 35, 22, 16, 21, 29, 29, 34, 30, 17, 25, 6, 14, 23, 28, 25, 31, 40, 22, 33, 37, 16, 33, 24, 41, 30, 24, 34, 17], // Job (42)
  19: [6, 12, 8, 8, 12, 10, 17, 9, 20, 18, 7, 8, 6, 7, 5, 11, 15, 50, 14, 9, 13, 31, 6, 10, 22, 12, 14, 9, 11, 12, 24, 11, 22, 22, 28, 12, 40, 22, 13, 17, 13, 11, 5, 26, 17, 11, 9, 14, 20, 23, 19, 9, 6, 7, 23, 13, 11, 11, 17, 12, 8, 12, 11, 10, 13, 20, 7, 35, 36, 5, 24, 20, 28, 23, 10, 12, 20, 72, 13, 19, 16, 8, 18, 12, 13, 17, 7, 18, 52, 17, 16, 15, 5, 23, 11, 13, 12, 9, 9, 5, 8, 28, 22, 35, 45, 48, 43, 13, 31, 7, 10, 10, 9, 8, 18, 19, 2, 29, 176, 7, 8, 9, 4, 8, 5, 6, 5, 6, 8, 8, 3, 18, 3, 3, 21, 26, 9, 8, 24, 13, 10, 7, 12, 15, 21, 10, 20, 14, 9, 6], // Salmos (150)
  20: [33, 22, 35, 27, 23, 35, 27, 36, 18, 32, 31, 28, 25, 35, 33, 33, 28, 24, 29, 30, 31, 29, 35, 34, 28, 28, 27, 28, 27, 33, 31], // Prov (31)
  21: [18, 26, 22, 16, 20, 12, 29, 17, 18, 20, 10, 14], // Ecl (12)
  22: [17, 17, 11, 16, 16, 13, 13, 14], // Cant (8)
  23: [31, 22, 26, 6, 30, 13, 25, 22, 21, 34, 16, 6, 22, 32, 9, 14, 14, 7, 25, 6, 17, 25, 18, 23, 12, 21, 13, 29, 24, 33, 9, 20, 24, 17, 10, 22, 38, 22, 8, 31, 29, 25, 28, 28, 25, 13, 15, 22, 26, 11, 23, 15, 12, 17, 13, 12, 21, 14, 21, 22, 11, 12, 19, 12, 25, 24], // Isa (66)
  24: [19, 37, 25, 31, 31, 30, 34, 22, 26, 25, 23, 17, 27, 22, 21, 21, 27, 23, 15, 18, 14, 30, 40, 10, 38, 24, 22, 17, 32, 24, 40, 44, 26, 22, 19, 32, 21, 28, 18, 16, 18, 22, 13, 30, 5, 28, 7, 47, 39, 46, 64, 34], // Jer (52)
  25: [22, 22, 66, 22, 22], // Lam (5)
  26: [28, 10, 27, 17, 17, 14, 27, 18, 11, 22, 25, 28, 23, 23, 8, 63, 24, 32, 14, 49, 32, 31, 49, 27, 17, 21, 36, 26, 21, 26, 18, 32, 33, 31, 15, 38, 28, 23, 29, 49, 26, 20, 27, 31, 25, 24, 23, 35], // Ezeq (48)
  27: [21, 49, 30, 37, 31, 28, 28, 27, 27, 21, 45, 13], // Dan (12)
  28: [11, 23, 5, 19, 15, 11, 16, 14, 17, 15, 12, 14, 16, 9], // Os (14)
  29: [20, 32, 21], // Joel (3)
  30: [15, 16, 15, 13, 27, 14, 17, 14, 15], // Amos (9)
  31: [21], // Abd (1)
  32: [17, 10, 10, 11], // Jon (4)
  33: [16, 13, 12, 13, 15, 16, 20], // Miq (7)
  34: [15, 13, 19], // Nah (3)
  35: [17, 20, 19], // Hab (3)
  36: [18, 15, 20], // Sof (3)
  37: [15, 23], // Hag (2)
  38: [21, 13, 10, 14, 11, 15, 14, 23, 17, 12, 17, 14, 9, 21], // Zac (14)
  39: [14, 17, 18, 6], // Mal (4)
  40: [25, 23, 17, 25, 48, 34, 29, 34, 38, 42, 30, 50, 58, 36, 39, 28, 27, 35, 30, 34, 46, 46, 39, 51, 46, 75, 66, 20], // Mat (28)
  41: [45, 28, 35, 41, 43, 56, 37, 38, 50, 52, 33, 44, 37, 72, 47, 20], // Mar (16)
  42: [80, 52, 38, 44, 39, 49, 50, 56, 62, 42, 54, 59, 35, 35, 32, 31, 37, 43, 48, 47, 38, 71, 56, 53], // Luc (24)
  43: [51, 25, 36, 54, 47, 71, 53, 59, 41, 42, 57, 50, 38, 31, 27, 33, 26, 40, 42, 31, 25], // Juan (21)
  44: [26, 47, 26, 37, 42, 15, 60, 40, 43, 48, 30, 25, 52, 28, 41, 40, 34, 28, 41, 38, 40, 30, 35, 27, 27, 32, 44, 31], // Hech (28)
  45: [32, 29, 31, 25, 21, 23, 25, 39, 33, 21, 36, 21, 14, 23, 33, 27], // Rom (16)
  46: [31, 16, 23, 21, 13, 20, 40, 13, 27, 33, 34, 31, 13, 40, 58, 24], // 1Cor (16)
  47: [24, 17, 18, 18, 21, 18, 16, 24, 15, 18, 33, 21, 14], // 2Cor (13)
  48: [24, 21, 29, 31, 26, 18], // Gal (6)
  49: [23, 22, 21, 32, 33, 24], // Efe (6)
  50: [30, 30, 21, 23], // Fil (4)
  51: [29, 23, 25, 18], // Col (4)
  52: [10, 20, 13, 18, 28], // 1Tes (5)
  53: [12, 17, 18], // 2Tes (3)
  54: [20, 15, 16, 16, 25, 21], // 1Tim (6)
  55: [18, 26, 17, 22], // 2Tim (4)
  56: [16, 15, 15], // Tit (3)
  57: [25], // Filem (1)
  58: [14, 18, 19, 16, 14, 20, 28, 13, 28, 39, 40, 29, 25], // Heb (13)
  59: [27, 26, 18, 17, 20], // Sant (5)
  60: [25, 25, 22, 19, 14], // 1Ped (5)
  61: [21, 22, 18], // 2Ped (3)
  62: [10, 29, 24, 21, 21], // 1Juan (5)
  63: [13], // 2Juan (1)
  64: [14], // 3Juan (1)
  65: [25], // Judas (1)
  66: [20, 29, 22, 11, 14, 17, 17, 13, 21, 11, 19, 17, 18, 20, 8, 21, 18, 24, 21, 15, 27, 21] // Apoc (22)
};

/**
 * Devuelve la cantidad exacta de versículos para un capítulo dado de un libro.
 * ¡Nunca devuelve más ni menos de los que tiene!
 */
export function getVerseCount(bookId, chapter) {
  const counts = VERSE_COUNTS[bookId];
  if (!counts) return 0;
  const c = parseInt(chapter, 10);
  if (isNaN(c) || c < 1 || c > counts.length) return 0;
  return counts[c - 1];
}

/**
 * Textos bíblicos literales extraídos de la
 * Traducción del Nuevo Mundo de las Santas Escrituras de JW.ORG
 */
export const POPULAR_VERSES = {
  'Mateo 24:14': 'Y las buenas noticias del Reino se predicarán en toda la tierra habitada para testimonio a todas las naciones, y entonces vendrá el fin.',
  'Mateo 28:19, 20': 'Así que vayan y hagan discípulos de gente de todas las naciones, bautizándolos en el nombre del Padre y del Hijo y del espíritu santo, enseñándoles a obedecer todo lo que yo les he mandado. Y, ¡recuerden!, estoy con ustedes todos los días hasta la conclusión del sistema.',
  'Mateo 6:33': 'Por lo tanto, sigan buscando primero el Reino y la justicia de Dios, y entonces recibirán también todas estas cosas.',
  'Salmos 83:18': 'Que la gente sepa que tu nombre es Jehová, que solo tú eres el Altísimo sobre toda la tierra.',
  'Salmos 37:10, 11': 'Solo un poco más, y los malvados ya no existirán; mirarás adonde estaban, y ya no estarán allí. Pero los mansos heredarán la tierra y disfrutarán plenamente de abundante paz.',
  'Salmos 119:105': 'Tu palabra es una lámpara para mi pie y una luz para mi camino.',
  '2 Timoteo 3:16, 17': 'Toda la Escritura está inspirada por Dios y es útil para enseñar, para censurar, para rectificar las cosas y para educar en la justicia, a fin de que el hombre de Dios esté completamente capacitado y bien preparado para realizar todo tipo de buenas obras.',
  'Proverbios 3:5, 6': 'Confía en Jehová con todo tu corazón y no te apoyes en tu propio entendimiento. Tómalo en cuenta en todos tus caminos, y él enderezará tus sendas.',
  'Isaías 41:10': 'No tengas miedo, porque estoy contigo. No te angusties, porque yo soy tu Dios. Yo te daré fuerzas. Sí, yo te ayudaré. Con mi mano derecha de justicia, de verdad te sostendré.',
  'Apocalipsis 21:3, 4': 'Y oí una voz fuerte que salía del trono y decía: "¡Mira! La tienda de Dios está con la humanidad [...] Y les secará toda lágrima de sus ojos, y la muerte ya no existirá, ni habrá más tristeza ni llanto ni dolor. Las cosas anteriores han desaparecido".',
  'Romanos 12:2': 'Y dejen de amoldarse a este sistema; más bien, transfórmense renovando su mente, para que comprueben por ustedes mismos cuál es la buena, agradable y perfecta voluntad de Dios.',
  'Hebreos 10:24, 25': 'Y estemos pendientes unos de otros para motivarnos a mostrar amor y a hacer buenas obras, sin dejar de reunirnos, como algunos tienen por costumbre, sino animándonos unos a otros, y sobre todo al ver que el día se acerca.',
  'Santiago 1:5': 'Por lo tanto, si a alguno de ustedes le falta sabiduría, que se la pida constantemente a Dios, y él se la dará, porque él es generoso con todos y no le reprocha nada a nadie.',
  '1 Pedro 5:7': '...mientras echan todas sus inquietudes sobre él, porque él se preocupa por ustedes.',
  'Juan 13:34, 35': 'Les doy un nuevo mandamiento: que se amen unos a otros; tal como yo los he amado, ámense también unos a otros. De este modo todos sabrán que son mis discípulos: si se tienen amor entre sí.',
  'Josué 1:8': 'Este libro de la Ley no debe apartarse de tu boca. Tienes que leerlo y meditar en él día y noche, para que obedezcas cuidadosamente todo lo que está escrito en él...'
};

export function findBook(query) {
  if (!query) return null;
  const clean = query.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  return BIBLE_BOOKS.find(b => {
    const bookNameClean = b.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const abbrevClean = b.abbrev.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    if (bookNameClean === clean || abbrevClean === clean) return true;
    if (b.aliases.some(alias => alias === clean)) return true;
    if (bookNameClean.startsWith(clean)) return true;
    return false;
  }) || null;
}
