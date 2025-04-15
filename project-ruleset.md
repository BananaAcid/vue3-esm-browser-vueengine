## Vue3-ESM-Browser-vueEngine Project Ruleset

This ruleset outlines the steps and conventions for creating Vue 3 projects using `vue3-esm-browser-vueengine` (in short `vue-engine`).  It focuses on browser-based development without a build process, leveraging ESM modules and import maps.

**I. Project Setup & Folder Structure (Rule Set: Project Structure)**

1.  **Root Directory:** Create a root directory for your project.
2.  **`index.html` (Required):**  This is the main entry point of your application. It *must* be in the root directory.
3.  **`app.vue` (Required):** This is the root Vue component, acting as the main application container. It *must* be in the root directory.
4.  **`components/` (Optional):** Create a `components` subdirectory in the root to house reusable Vue components (`.vue` files).
5.  **`pages/` (Optional):** Create a `pages` subdirectory in the root to house Vue page components (`.vue` files) representing different routes/sections of your application.
6.  **`views/` (Optional):** Create a `views` subdirectory in the root for potentially larger, more complex view components (`.vue` files).  The distinction from `pages` might be semantic or for organizational preference.
7.  **`lib/` (Optional, but recommended for engine if local):** If you download `vueEngine.mjs` locally, place it in a `lib` subdirectory. This keeps the root clean.

**II. Essential HTML Setup in `index.html` (Rule Set: HTML Foundation)**

1.  **DOCTYPE and Language:** Begin `index.html` with `<!DOCTYPE html>` and ` <html lang="en">`.
2.  **`<head>` Section:**
    *   **`<meta charset="UTF-8" />` and `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`:**  Standard meta tags for character set and viewport.
    *   **`<title>`:** Set an appropriate title for your application.
    *   **`<style>` Block (Required - for essential engine styles):** Include the following CSS rule within the `<head>`:
        ```html
        <style>
          xmp {
            display: none;
          }
        </style>
        ```
        *   **Purpose:** This CSS rule is **essential** and hides `<xmp>` tags from being displayed on the page. `<xmp>` tags are used to embed `.vue` components directly in the HTML, and they should be hidden from the rendered output. **This `<style>` block in `<head>` should primarily be reserved for these core, engine-level styles.**
    *   **Global Application Styles (in `App.vue`):**  For global styles that apply across your entire application (like base typography, button styles, utility classes, etc.), **do not place them in the `<head><style>` block.** Instead, define these global application-wide styles within an **unscoped** `<style>` block (additional to a possibly existing scoped bock) directly inside your root `App.vue` component. This keeps your global application styles organized within your main Vue component, following Vue best practices for component-based styling.
3.  **`<body>` Section:**
    *   **`<div id="app">loading ...</div>` (Required):**  This `div` with the ID `app` is the mount point for your Vue application.  The "loading..." text is a placeholder displayed before Vue is initialized.
    *   **Configuration Script Block (Optional but likely needed for routing etc.)**: Place a `<script type="module" async>` block *below* the `#app` div but *before* the import map and engine scripts. This is where you configure `globalThis.vueConfig`.
    *   **`<script type="importmap" id="vueBasics">` (Required):** Include this import map block *below* the configuration script (if present) and the `#app` div. This defines core Vue dependencies.
        ```html
        <script type="importmap" id="vueBasics">
          {
            "imports": {
              "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js",
              "vue-router": "https://unpkg.com/vue-router@4/dist/vue-router.esm-browser.prod.js",
              "vue3-sfc-loader": "https://unpkg.com/vue3-sfc-loader@0.9.5/dist/vue3-sfc-loader.esm.js",
              "less": "https://cdn.jsdelivr.net/npm/less@4/dist/less.min.js/+esm"
            }
          }
        </script>
        ```
        *   **Customization:** You can modify the URLs in `vueBasics` to use local files if desired.
        *   **Optional Dependencies:**  Remove `"less": ...` if you don't need LESS support. You can also remove `"vue-router": ...` if you don't need routing.
    *   **`<script type="module" id="vueEngine" src="...">` (Required):** Include this script block *below* the `#vueBasics` import map. This loads the `vue3-esm-browser-vueengine`.
        ```html
        <script type="module" id="vueEngine" src="https://unpkg.com/vue3-esm-browser-vueengine"></script>
        ```
        *   **Local Engine:** If you downloaded `vueEngine.mjs` and placed it in `lib/`,  the `src` attribute should be `src="/lib/vueEngine.mjs"`.

**III. Vue Configuration (`vueConfig`) (Rule Set: Configuration)**

1.  **`globalThis.vueConfig = {};`**:  Initialize the `vueConfig` object in the `<script type="module" async>` block in `index.html`.
2.  **`vueConfig.routes` (Optional - for routing):**  An array of route objects for `vue-router`.
    ```javascript
    globalThis.vueConfig.routes = [
      { path: '/', page: 'Home.vue' }, // Loads /pages/Home.vue or embedded Home.vue with type="page"
      { path: '/about', page: 'About.vue' },
      { path: '/contact', page: 'Contact.vue' },
      { path: '/example2', component: () => import('/views/Example2.vue') }, // Example of view component import
      // ... more routes
    ];
    ```
    *   **`path`**: The URL path for the route.
    *   **`page`**:  Filename (e.g., `'Home.vue'`) of a page component located in the `pages/` directory.  The engine will automatically load and use this component. Just add it to `globalThis.vueConfig.routes` with the correct route.
    *   **`component`**:  Alternatively to `page`, you can provide a component directly. This must be a dynamic import (`() => import(...)`) for loading or a component you've defined elsewhere. `component` takes precedence over `page`.
    *   **`name` (Optional):** Route name for `<RouterLink to="{ name: 'routeName' }">`.
    *   **`meta` (Optional):**  Route meta data as supported by `vue-router`.
    *   **Other `vue-router` Options:**  You can include other `vue-router` options within each route object as needed.
3.  **`vueConfig.components` (Optional - for external global components):** An array of component objects to register **external** components globally. This configuration is specifically for loading and globally registering `.vue` files that are **not embedded** within your `index.html` as `<xmp>` blocks.
    ```javascript
    globalThis.vueConfig.components = [
      { name: 'TestMe', file: '/components/TestMe.vue' }, // Loads /components/TestMe.vue and registers as <TestMe>
      { name: 'PrimeTest', file: 'https://example.com/remote/PrimeTest.vue' }, // Example of remote component
      // ... more components
    ];
    ```
    *   **`name`**:  The component name used in templates (e.g., `'TestMe'` will be used as `<TestMe>` or `<test-me>`).
    *   **`file`**:  Path to the external `.vue` file. Can be:
        *   Relative path from `index.html` (e.g., `/components/MyComponent.vue`) to load local files.
        *   Absolute URL (e.g., `https://example.com/components/RemoteComponent.vue`) to load components from remote URLs.
    *   **Important Note about Embedded Components:**  Components defined using `<xmp type="component">` (not `<xmp type="page">`, or `<xmp type="view">`) blocks directly within your `index.html` are **automatically** registered globally by `vue-engine`. **You do not need to (and should not)** list these embedded components again in `vueConfig.components`. This configuration is exclusively for registering views and *external* components (loaded from separate files or URLs) as global components.
4.  **`vueConfig.imports` (Optional - for scripts, plugins, styles):** An array of import objects for loading external resources and plugins.
    ```javascript
    globalThis.vueConfig.imports = [
      { type: 'style', content: '@import url("https://unpkg.com/vuetify@3.8.0/dist/vuetify.min.css");' }, // External stylesheet
      { type: 'plugin', content: async ({ app }) => app.use((await import('https://unpkg.com/vuetify@3.8.0/dist/vuetify.esm.js')).createVuetify()) }, // Vue plugin
      { type: 'script', content: 'https://code.jquery.com/jquery-3.7.1.min.js' }, // External script (adds to window)
      // ... more imports
    ];
    ```
    *   **`type: 'style'`**: Injects CSS into the document. `content` should be a CSS string, and can include `@import url(...)` to load external CSS files.
    *   **`type: 'plugin'`**:  Registers a Vue plugin. `content` should be an `async` function that receives `{ app, options, vue }` as arguments. Use `app.use(...)` within this function to register the plugin.
    *   **`type: 'script'`**:  Loads and executes a JavaScript script. `content` should be a URL to a JavaScript file.  These scripts typically add things to the `window` (global) scope.
5.  **`vueConfig.onReady` (Optional - for custom mounting logic/preloading):** A function to execute after Vue app is prepared but before mounting.
    ```javascript
    globalThis.vueConfig.onReady = (mountCallback) => {
      console.log('Vue app ready!');
      // Perform pre-mounting tasks (e.g., hide loading screen)
      setTimeout(() => {
        mountCallback(); // Call mountCallback to actually mount the Vue app.
      }, 1000);
    };
    ```
    *   If `vueConfig.onReady` is *not* defined, the Vue app will mount automatically when ready.
    *   If defined, the engine will call your `onReady` function, passing a `mountCallback` function as an argument. You *must* call `mountCallback()` within your `onReady` function to initiate the Vue app mounting.
6.  **`globalThis.loadingStates` (Optional - for loading progress tracking):**  An array that `vue-engine` pushes loading status messages into. You can use a Proxy to react to changes in this array for custom loading indicators. (See example in documentation).

**IV. Creating Vue Components, Pages, and Views (Rule Set: Vue Components)**

1.  **Embedded Components (`<xmp>` blocks in `index.html`):**
    *   **Placement:** Place `<xmp>` blocks *within* the `<body>` of `index.html`, ideally *after* the configuration script but *before* the `#vueBasics` and `#vueEngine` scripts.  This ensures they are parsed before Vue Engine initializes.
    *   **Structure:**
        ```html
        <xmp type="component" id="MyComponentName.vue">
          <template>
            </template>

          <script setup>
            // Component logic (Composition API)
          </script>

          <style scoped lang="less">
            /* Component styles (optional lang="less" or lang="css") */
          </style>
        </xmp>
        ```
        *   **`type` Attribute (Required):**
            *   `type="component"`: For reusable components (placed in `/components/` conceptually but embedded).
            *   `type="page"`: For page-level components (placed in `/pages/` conceptually but embedded).
            *   `type="view"`: For view components (placed in `/views/` conceptually but embedded).
            *   `type="app"`:  *Must* be used for `App.vue`.  It's treated as the root component and is not placed in a subdirectory.
        *   **`id` Attribute (Required):**  The filename (e.g., `MyComponentName.vue`, `HomePage.vue`, `App.vue`). This ID is used internally for component registration and can be used for manual imports if needed.
        *   **Content:**  Standard Vue Single-File Component (SFC) structure: `<template>`, `<script>`, `<style>`.
        *   **Language Attributes:** Support for `lang="ts"` in `<script>`, `lang="pug"` in `<template>`, and `lang="less"` or `lang="css"` in `<style>`. `scoped` attribute in `<style>` is supported.
    *   **Usage:** Embedded components of `type="component"`, `type="page"`, and `type="view"` are automatically registered globally based on their `id` (base name).  For example, `<xmp type="component" id="MyButton.vue">` can be used as `<MyButton />` in templates. `App.vue` (type="app") is used as the root component `<App />` in the initial mount.
2.  **External `.vue` Files (Files in `components/`, `pages/`, `views/` directories):**
    *   **Creation:** Create `.vue` files in the `components/`, `pages/`, and `views/` subdirectories as needed.
    *   **Structure:**  Use the standard Vue SFC structure within these files ( `<template>`, `<script>`, `<style>`).
    *   **Usage:**
        *   **Pages (in `pages/`):**  When you configure `vueConfig.routes` with `page: 'PageName.vue'`, the engine will automatically load and use the corresponding file from the `pages/` directory.
        *   **Components (in `components/` and `views/`):**
            *   **Global Registration (via `vueConfig.components`):**  Register components globally using `vueConfig.components` to make them available in all templates without explicit import.
            *   **Local Import:** Import components directly into other components or pages using standard ESM import syntax:
                ```javascript
                // In a .vue file:
                import MyComponent from '/components/MyComponent.vue'; // Relative to index.html
                import MyView from '/views/MyView.vue';
                import HomePage from '/pages/HomePage.vue';

                export default {
                  components: {
                    MyComponent,
                    MyView,
                    HomePage
                  },
                  // ... component options
                }
                </script>
                ```

**V. Optional Features (Rule Set: Enhancements)**

1.  **LESS Support:** Included by default in `#vueBasics` import map. Use `lang="less"` in `<style>` blocks.
2.  **Pug Support:**  Included by default in `#vueBasics` import map. Use `lang="pug"` in `<template>` blocks.
3.  **VueUse:** To use VueUse composables, include the `@vueuse/shared` and `@vueuse/core` imports in the `#vueImportsUserDefined` import map (as shown in the example).
4.  **Vuetify:** To use Vuetify, include the Vuetify CSS and plugin import in `vueConfig.imports` (as shown in the example). You might also need to add Vuetify's components to your templates.
5.  **TypeScript:**  `<script lang="ts">` is supported out of the box in `.vue` files and `<xmp>` blocks.

**VI. Import Maps (`#vueImportsUserDefined`) (Rule Set: Custom Imports)**

1.  **Purpose:** Use the `#vueImportsUserDefined` import map to define custom module mappings for libraries like VueUse or any other ESM-based library you want to use.
2.  **Placement:** Place the `<script type="importmap" id="vueImportsUserDefined">` block in `index.html` *below* the configuration script and *before* the `#vueBasics` and `#vueEngine` scripts.
3.  **Structure:**  Must be valid JSON.
    ```html
    <script type="importmap" id="vueImportsUserDefined">
      {
        "imports": {
          "@vueuse/shared": "https://cdn.jsdelivr.net/npm/@vueuse/shared@13/index.min.mjs",
          "@vueuse/core": "https://cdn.jsdelivr.net/npm/@vueuse/core@13/index.min.mjs"
          // ... more custom imports
        }
      }
    </script>
    ```
4.  **Importing in Components/Pages:** After defining imports in `#vueImportsUserDefined`, you can import them in your `.vue` components and pages using the defined import names:
    ```javascript
    // In MyComponent.vue
    import { useMouse } from '@vueuse/core'; // Uses the mapping from #vueImportsUserDefined
    ```

**VII. Caveats and Notes (Rule Set: Important Considerations)**

1.  **ESM Modules Only:**  `vue3-esm-browser-vueengine` is designed for ESM modules. CommonJS modules will likely not work directly.
2.  **`@vueuse/shared` and `@vueuse/core`:**  As noted in the documentation, `@vueuse/shared` *must* be in the import map for `@vueuse/core` to work, and `@vueuse/core` should also be in the import map for proper functionality.
3.  **`xmp` Tag Importance:** The use of `<xmp>` tags is crucial for embedding `.vue` components in HTML because it preserves case sensitivity in tags (like `<MyComponent />`).
4.  **No Build Process:**  Remember that this setup avoids a build process (Vite, Webpack).  This is great for simplicity but may have performance implications in larger applications compared to optimized builds.
5.  **Previewing:**  The app can not be opened as html file in the browser.  It must be served by a server to work.  To preview it locally, you can use `npx --yes http-server` in the same folder the html is in.

**VIII. Project Creation Steps (Simplified Checklist)**

1.  Create project directory.
2.  Create `index.html`, `app.vue` in the root.
3.  Create `components/`, `pages/`, `views/` directories if needed.
4.  In `index.html`:
    *   Add basic HTML structure (`<!DOCTYPE html>`, `<head>`, `<body>`).
    *   Add `<style> xmp { display: none; }</style>` in `<head>`.
    *   Add `<div id="app">loading ...</div>` in `<body>`.
    *   Add `<script type="module" async>` for `vueConfig` (below `#app`, before import maps).
    *   Add `<script type="importmap" id="vueBasics">` (below config script, before engine script).
    *   Add `<script type="importmap" id="vueImportsUserDefined">` (if needed, below config script, before engine script).
    *   Add `<script type="module" id="vueEngine" src="...">` (last script in `<body>`).
    *   Add `<xmp type="app" id="App.vue">` for your root `App.vue` component (within `<body>`, ideally before import maps/engine).
    *   Add `<xmp type="component" id="...">`, `<xmp type="page" id="...">`, `<xmp type="view" id="...">` for embedded components/pages/views (within `<body>`, ideally before import maps/engine).
5.  Configure `globalThis.vueConfig` in the `<script type="module" async>` block in `index.html` for routes, components, imports, etc.
6.  Create `.vue` files in `components/`, `pages/`, `views/` or use embedded `<xmp>` blocks to define your Vue components, pages, and views.
7.  Run `index.html` in a browser.

This ruleset should provide a comprehensive and precise guide for building Vue 3 applications using `vue3-esm-browser-vueengine` in a browser-centric, no-build setup.
