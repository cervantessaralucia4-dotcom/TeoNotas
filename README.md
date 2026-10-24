# TeoNotas - Cuaderno de Apuntes para Reuniones y Asambleas

Una aplicación web moderna, rápida y elegante diseñada especialmente para tomar apuntes edificantes durante **reuniones cristianas, asambleas de circuito, asambleas regionales y adoración en familia**, con un **selector interactivo de textos de la Traducción del Nuevo Mundo (TNM)** y almacenamiento 100% privado y offline.

---

## Características Principales

### 1. Arquitectura de Cuaderno en 4 Secciones
El área de toma de notas está estructurada en 4 bloques claros para facilitar el orden durante el discurso:
1. **Sección 1: Título y Datos de la Reunión:**
   - Tipo de reunión con selector temático.
   - Tema del discurso o título.
   - Discursante/Orador, Fecha y Salón del Reino o de Asambleas.
   - Acciones: Fijar nota, Copiar resumen para WhatsApp, Imprimir/PDF, Exportar Markdown y Eliminar.
2. **Sección 2: Texto Clave o Base:**
   - Cita bíblica principal del discurso.
   - Botón directo para seleccionar el texto base con la TNM.
   - Área para el texto bíblico transcrito o leído.
3. **Sección 3: Desarrollo del Discurso o Tema:**
   - Hoja amplia para escribir argumentos, explicaciones y puntos clave.
   - Barra de herramientas: Encabezados (H2, H3), estilos (Negrita, Cursiva, Subrayado), listas con viñetas/numeradas y paleta de resaltadores.
   - Controles tipográficos: Ajuste de tamaño de fuente (A-, A+) y fuentes inspiradas en JW.ORG (Roboto, Noto Sans, Merriweather).
   - Botón de cita rápida (`Ctrl+Alt+B`): Inserta tarjetas de cita bíblica dentro de los apuntes.
4. **Sección 4: Resumen y Aplicación Personal:**
   - **4.1 Resumen del Discurso:** Síntesis de las 2 o 3 ideas principales enseñadas por el orador.
   - **4.2 Aplicación Personal:** Meta práctica para poner en práctica en la vida diaria, el ministerio o la familia.

---

### 2. Selector Bíblico Interactivo (TNM - JW.ORG)
- **Filtro guiado en 3 pasos:**
  - **Paso 1: Libro:** Los 66 libros canónicos de la Traducción del Nuevo Mundo, con pestañas para *Todos (66)*, *Escrituras Hebreas (39)* y *Escrituras Griegas (27)*, más buscador predictivo.
  - **Paso 2: Capítulo:** Cuadrícula táctil con la cantidad exacta de capítulos de cada libro.
  - **Paso 3: Versículo(s):** Muestra **únicamente la cantidad real de versículos** que tiene el capítulo seleccionado (evita errores y sobrecarga). Permite selección individual, rangos o capítulo completo.
- **Bandeja de Textos Citados:**
  - Panel lateral que lista todas las citas bíblicas leídas durante la reunión.
  - Función para localizar y hacer scroll suave hasta el versículo en el cuaderno con un clic.

---

### 3. Pantalla de Inicio (Dashboard) y Experiencia Personalizada
- **Pantalla Splash de Bienvenida:**
  - Saludo personalizado con tu nombre: *«¡Hola, [Tu Nombre]!»*.
  - Efectos dinámicos de fondo (*aurora glow, partículas flotantes y orbes de luz*).
  - Tarjeta translúcida con acabado de cristal perlado (*glassmorphism* claro y luminoso).
- **Accesos Directos por Reunión:**
  - Fin de Semana: Discurso Público y La Atalaya.
  - Entre Semana: Vida y Ministerio Cristianos.
  - Asamblea de Circuito (1 Día).
  - Asamblea Regional (3 Días).
  - Adoración en Familia / Estudio Personal.
  - Visitas Especiales / Conmemoración.
- **Tus Apuntes Recientes:** Tarjetas con fecha, orador, lugar y texto clave para reanudar tus notas con un solo toque.

---

### 4. Sistema de Iconos Vectoriales SVG Profesionales
- **Cero emojis del sistema operativo:** Aspecto visual sobrio, uniforme y elegante en cualquier dispositivo (Android, iOS, Windows, Mac).
- **Iconos limpios y adaptables:** Diseñados con `stroke: currentColor` para adaptarse automáticamente a los 3 modos visuales:
  - **Modo Noche:** Fondo pizarra oscuro de alto contraste y descanso visual.
  - **Modo Luz:** Fondo diurno limpio y nítido.
  - **Modo Sepia:** Tono pergamino cálido para lectura prolongada sin fatiga.

---

### 5. Privacidad Total y Funcionamiento Offline
- **Base de Datos Local (Web LocalStorage):** Todo se almacena exclusivamente en la memoria interna de tu navegador/dispositivo.
- **Sin necesidad de conexión a internet:** Funciona 100% offline dentro de cualquier Salón del Reino o Salón de Asambleas.
- **Respaldo y Restauración:** Permite descargar una copia de seguridad en formato `.json` para transferir tus notas entre teléfono, tableta y computadora.

---

## Estructura del Proyecto

```
apuntes-reuniones/
├── index.html          # Interfaz principal completa y accesible
├── css/
│   └── style.css       # Sistema de diseño, temas visuales y glassmorphism
├── js/
│   ├── app.js          # Controlador principal y gestión de vistas
│   ├── bible-data.js   # Catálogo canónico de la TNM (66 libros, capítulos y versículos)
│   ├── bible-picker.js # Modal del selector bíblico
│   ├── editor.js       # Motor del editor en 4 secciones y bandeja de citas
│   ├── icons.js        # Librería de iconos vectoriales SVG profesionales
│   └── storage.js      # Servicio de persistencia local (LocalStorage) y exportación
├── server.js           # Servidor local Node.js ligero (sin dependencias externas)
├── iniciar.bat         # Lanzador rápido con un clic para Windows
└── README.md           # Documentación del proyecto
```

---

## Cómo Iniciar la Aplicación

### Opción 1: Con doble clic en Windows
Haz doble clic en `iniciar.bat`. Se abrirá automáticamente en tu navegador predeterminado en `http://localhost:3000`.

### Opción 2: Con Node.js
```bash
node server.js
```
Abre en tu navegador `http://localhost:3000`.

### Opción 3: Directamente en el navegador (Sin servidor)
Haz doble clic sobre `index.html` para abrirlo directamente en Chrome, Edge, Safari o Firefox.

---

## Licencia y Uso
Diseñado para uso personal y para la edificación espiritual en las reuniones y asambleas cristianas.
Basado en las referencias de la *Traducción del Nuevo Mundo de las Santas Escrituras (TNM)* de JW.ORG.
