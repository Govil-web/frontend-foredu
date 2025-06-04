## 📝 General

- Framework: **React** con **Vite** como bundler.
- Estilos y UI: **Material UI (MUI)**.
- Lenguaje: **TypeScript**.
- Principios: Código **escalable**, **modular**, **mantenible**, **testeable**.
- Se siguen **buenas prácticas de arquitectura limpia**.

---

## 📁 Estructura de Carpetas

```
src/
│
├── assets/           # Imágenes, íconos, fuentes, etc.
├── components/       # Componentes reutilizables (puros)
├── features/         # Módulos funcionales (ej. auth, users, dashboard)
│   └── nombreFeature/
│       ├── components/    # Componentes específicos
│       ├── hooks/         # Custom hooks
│       ├── services/      # Llamadas a API, lógica de negocio
│       ├── slices/        # Redux Toolkit slices (si aplica)
│       ├── types.ts       # Tipado
│       └── index.tsx
│
├── hooks/            # Custom hooks reutilizables
├── layouts/          # Layouts globales (AdminLayout, AuthLayout, etc.)
├── pages/            # Vistas principales de la app
├── router/           # React Router DOM: rutas y navegación
├── services/         # Servicios globales (axios, auth, etc.)
├── store/            # Configuración de Redux Toolkit o Context
├── theme/            # Tema MUI centralizado (colores, tipografía, etc.)
├── utils/            # Funciones auxiliares puras
└── main.tsx
```

---

## 📐 Patrones y Buenas Prácticas

### React
- Uso de **componentes funcionales** con hooks (`useEffect`, `useState`, `useMemo`, etc.).
- Tipado estricto con **TypeScript**.
- Componentes **puros** y reutilizables.
- Separación entre componentes **Smart** (con lógica) y **Dumb** (visual).

### Material UI
- Tema unificado mediante `ThemeProvider`.
- Uso del sistema `sx` o `styled()` en lugar de `className`.
- Accesibilidad (uso de `aria-*`, roles, etc.).

### Arquitectura
- Lógica de negocio desacoplada de la vista.
- Cada `feature/` es un módulo autocontenible.
- Uso de `Context API` o `Redux Toolkit` para manejar estado global.
- Servicios separados de los componentes (`services/`).

---

## 🔒 Seguridad y Performance

- Manejo de errores con `try/catch` y validaciones.
- Lazy loading de vistas con `React.lazy` + `Suspense`.
- Optimización de render con `React.memo`, `useMemo` y `useCallback`.
- Uso de ESLint y Prettier con reglas estrictas.

---

## 🧪 Testing

- **React Testing Library** y **Jest** o **Vitest** (si aplica).
- Tests unitarios para componentes y funciones puras.
- Tests de integración para features y flujos clave.
- Cobertura mínima sugerida: **80%**.

---

## 🔧 Herramientas y Librerías Clave

- [`react-router-dom`](https://reactrouter.com/)
- [`@mui/material`](https://mui.com/)
- [`axios`](https://axios-http.com/)
- [`redux-toolkit`](https://redux-toolkit.js.org/) o `Context API`
- [`yup`](https://github.com/jquense/yup) + `react-hook-form` o `formik` para validaciones y formularios
- [`eslint` + `prettier`](https://eslint.org/)
- [`vitest`](https://vitest.dev/) o `jest` para tests

---

## 🧑‍💻 ¿Qué puede hacer Junie?

Junie puede ayudarte con:
- Refactorización de componentes.
- Optimización de rendimiento con hooks.
- Mejora de tipado TypeScript.
- Migraciones de estilos a `sx`/`styled()`.
- Generación de tests unitarios e integración.
- Asistencia en lógica de negocio desacoplada.
- Sugerencias de patrones para nuevas features.

---

## 📌 Notas Adicionales

- Se busca mantener coherencia en nombres de carpetas, archivos y convenciones.
- Todas las nuevas features deben crearse dentro de su carpeta en `features/` siguiendo este patrón.
- Las decisiones importantes deben documentarse en un changelog o README interno por módulo.
