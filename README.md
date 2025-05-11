# VUE 3 ESM in browser only

@author Nabil Redmann <repo@bananaacid.de>, @license MIT

... all natively in the browser.

- all in **one file** is possible
- uses **VUE 3** (unmodified, vanilla)
- **.vue files** support (using https://github.com/FranckFreiburger/vue3-sfc-loader)
- **no server** logic (static)
- **no compile**, no vite/webpack ...
- no node_modules
- **ESM module** based code
- native JS **import maps**
- script-module
- **LESS** and **PUG** support

Basic additions:

- VueUse

Optional Test additions:

- Vuetify

... and typescript just works out of the box (thanks vue? or chrome browser?)

**Note:**

- Pug support might not work within stackblitz at times in /v1. Outside of Stackblitz: always.

- initially long loading times might happen within stackblitz, due to the /v1 folder having a complete project within.

- moving the module code into a main.js would feel even more like a vite project.

## AI agent, prompt usage / Vibe Coding

The [project-ruleset.md](./project-ruleset.md) gives you a prompt to be used with an AI to create a project for vueEngine from scratch. Just copy and paste it before any prompt of you first.

It might also help to clarify with parts of this documentation.

## Installation

The npm package name is `vue3-esm-browser-vueengine`.

First add the basic dependencies:
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

To include the main script at the end of your html, either download it, or add it remotely with `<script type="module" id="vueEngine" src="https://unpkg.com/vue3-esm-browser-vueengine"></script>`

## Quick start template

You can use this as a quick start.

A more detailed [preloader is below](#loadingstates).

<details>
<summary>Single page app `code` here:</summary>

    <!DOCTYPE html>
    <html lang="en">
    <head>
      <style id="basicPageStyle">
        html {
          place-items: center;
          align-content: center;
          height: 100vh;
        }
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f0f0f0;
        }
        xmp {
          display: none;
        }
      </style>
    </head>
    <body>
      <div id="app">
        <progress>loading ...</progress>
      </div>
  
  
      <xmp type="app" id="App.vue">
        <template>
          <VApp>
            <RouterView />
          </VApp>
        </template>
      </xmp>
  
  
      <xmp type="page" id="home.vue">
        <template>
          <div class="page">
            <h1>App.vue only, all in one</h1>
          </div>
        </template>
        <style lang="less" scoped>
          .page {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            max-width: 800px;
            margin: 0 auto;
          }
        </style>
      </xmp>
  
  
  
      <script type="importmap" id="vueAdditions">
        {
          "imports": {
            "@vueuse/shared": "https://cdn.jsdelivr.net/npm/@vueuse/shared@13/index.min.mjs",
            "@vueuse/core": "https://cdn.jsdelivr.net/npm/@vueuse/core@13/index.min.mjs",
            "marked": "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js"
          }
        }
      </script>
  
      <script type="module" async id="vueConfig">
        globalThis.vueConfig = globalThis.vueConfig ?? {};
  
        globalThis.vueConfig.routes = [
          { path: '/', page: 'home.vue' },
          // ...
        ];
        
        globalThis.vueConfig.imports = [
          {
            type: 'style',
            content: '@import url("https://unpkg.com/vuetify@3.8.0/dist/vuetify.min.css"); ',
          },
          {
            type: 'plugin',
            content: async ({ app }) =>
              app.use( (await import('https://unpkg.com/vuetify@3.8.0/dist/vuetify.esm.js')).createVuetify() ),
          },
        ];
      </script>
  
  
      <!-- vueEngine stuff below, no need to modify ------------------------------------------------------->
  
      <script type="importmap" id="vueBasics">
        {
          "imports": {
            "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js",
            "vue-router": "https://unpkg.com/vue-router@4/dist/vue-router.esm-browser.prod.js",
            "vue3-sfc-loader": "https://unpkg.com/vue3-sfc-loader@0.9.5/dist/vue3-sfc-loader.esm.js",
            "less": "https://cdn.jsdelivr.net/npm/less@4/dist/less.min.js/+esm"        }
        }
      </script>
  
      
      <script type="module" id="vueEngine" src="https://unpkg.com/vue3-esm-browser-vueengine"></script>
    </body>
    </html>
    
</details>

## Getting Started

Folder structure (static server!)

```
./components   (optional)
./pages        (optional)
./views        (optinoal)
app.vue
index.html
```

### Basic setup (always required)

The usual .vue file setup.

You need to setup your HTML:

1. add `<style>xmp {display: none; }</style>` to the `<head>`
2. body needs an element with id app, like `<body> <div id="app">loading ...</app>`
3. below that:
   1. configure `vueConfig.routes` in a `<script type="module" async>` block (see below)
   2. include below the 2 script elements: `#vueBasics`  `#vueEngine` (see Installation)

Now just edit your app.vue and add pages (views) and components. For each page added, adjust your `vueConfig.routes`.

**Note: to use local not CDN**

In the `#vueBasics` importmap, you can change the paths to local versions. The PugJS dependency path can be changed by setting `globalThis.vueConfig.mappings.pugjs='./libs/pug.js'`

You can deactivate the import for LessCSS and PugJS: If you remove the import for less from the inputmap and set the pugjs=null.

### Minimal setup

Only `App.vue`, all in one, in index.html -> `/example-minimal`

1. do the `Basic setup` above
   - the 3.1. is not required: do not configure the `vueConfig.routes`, you do not need the async block.
2. either add a `App.vue` block (see `Simple setup`) or an `./App.vue` in the same folder as the index.html

### Simple setup

All in ONE, in index.html

1. do the `Basic setup` above
2. add components and pages to your index.html, after 3.1. (your configuration) and definitely before the 3.2. (the Vue basics)
   - at least, add a `app.vue` component

in order not to load from external `.vue` files, you can embed pages and components within your index.html. (If they are not embedded, the engine will try to load them from the server.)

#### Blocks (embedded .vue files)

- `id` is the filename for internal use, or in case you manually want to import it. Components will be globally initialized with the BaseName.
  - `<xmp type="component" id="vueuseTest/MousePos.vue">` => use `<MousePos />` -- or `import MousePos from '/components/vueuseTest/MousePos.vue';`
- `type` can be
  - `="page"` or `="component"` or `="view"` - the internal path for page will become `/pages/Home.vue` and for the component `/components/MyComponent.vue` and for view `/views/TopArea.vue`
  - `="app"` - will not be prefixed with a folder (but with a slash: `/SomeThing.vue`)
  - **mind the plural: folders are ending in `s`**
  - You can always use subpaths in the id (but the filenames MUST BE UNIQUE)

supported:
`<script setup>` and `<script lang="ts">` (both can be mixed),
`<template lang="pug">` and `<style lang="less">`

#### Syntax

```html
<xmp type="page" id="Home.vue">
  <template>
  </template>

  <script setup>
  </script>

  <style scoped>
  </style>
</xmp>
```

**Why `<xmp>`?**

It is next to `<textarea>` the only tag, that allows any tag within and does **NOT** change the tag-name to all lower case (which would break `<MyComponent />` and would only allow `<kebab-case />`).

#### `app.vue`

The App is mounted with the `<App />` tag as basic template. You need to provide an `App.vue`

Example:

```html
<xmp type="app" id="App.vue">
  <template>
    <RouterView />
  </template>
</xmp>
```

### Advanced configuration

additionally to the above, you can:

1. configure `vueConfig.routes`
2. configure `vueConfig.components` and `vueConfig.imports`
3. add an importmap `#vueImportsUserDefined`
4. hook into `vueConfig.onReady`
5. watch `loadingStates` for loading progress

Any of this is optional.

### `vueConfig.routes`

```js
globalThis.vueConfig.routes = [
  { path: '/', page: 'Home.vue', component: undefined },
  // ...
]
```

Helps configuring the `vue-router` plugin.

- **path**: the path to bind to
- **page**: the filename of the `/pages/*` page to automatically load and initialize as component
- **component**: (optional) if you load and initialize the component yourself instead of the page (component has precedence over the page property, use either one not both), manual instantiating see: https://stackoverflow.com/a/76136400/1644202

Noteworthy:

- **name**: a shorthand for `<RouterLink to="name">` to use
- **meta**: additional `vue-router` supported configuration

... and any other config option `vue-router` supports.

### `vueConfig.components`

```js
globalThis.vueConfig.components = [
  { name: 'TestMe', file: '/components/TestMe.vue' },
];
```

load components to be globally available they do not need to be imported in a vue file. (If not added to this array, you need to import them as you normally would.)

Embedded components (in index.html) are loaded automatically to be globally available without adding them here.

- **name** is the component name for Vue to use
- **file** is the local path or remote URL to load it from

### `vueConfig.imports`

```js
globalThis.vueConfig.imports = [
  { type: string, content: string|function|Promise },
  ...
]
```

#### type: 'script'

For scripts that add to window (window == globalThis). Will be added after options is defined.

- content => url

#### type: 'plugin'

To load a plugin: like using `import()` with `app.use()` or for handling stuff that had been loaded with `type: 'script'`. Will be called after createApp().

- content => async fn({app, options, vue}) {...}

#### type: 'style'

To add styles or stylesheet urls. Use `@import url("...")` to load a file. Will be added after options is defined.

- content => css string

### importmap

```html
<script type="importmap" id="vueImportsUserDefined">
  {
    "imports": {
      "@vueuse/shared": "https://cdn.jsdelivr.net/npm/@vueuse/shared@13/index.min.mjs",
      "@vueuse/core": "https://cdn.jsdelivr.net/npm/@vueuse/core@13/index.min.mjs"
    }
  }
</script>
```

An importmap script block MUST BE PURE **JSON** !

The import names (keys), are what you can use in your import statements, as you usually would in NodeJS, Deno, Bun, ... this ist the browser version. (`import { useMouse } from '@vueuse/core';`)

The import urls can be a local path or a remote URL.

The id is optional.

**Note:** Imports must be propper ES6 Modules ! They must use `export`.

### `vueConfig.onReady`

```
globalThis.vueConfig.onReady = (mountCallback) => {
  console.log('Vue app is ready and will be mounted');
  mountCallback();
};
```

This gives you the opportunity to handle a preload screen or alike, then trigger the app mounting.

If `onReady` is not set, the Vue app will be mounted automatically when everything is prepared.

### `loadingStates[]`

Accessing `globalThis.loadingStates`, you get the current loading stage. As of writing, there are 11.

You could watch for changes in that array for progress on loading. `vueConfig.onReady` gives you a reliable trigger when it is done.

Example:

```html
<div id="app">
  <progress max="11"></progress> <br /> <div id="status"></div>
</div>
```

```js
globalThis.loadingStates = new Proxy([], {
  set: (target, prop, changes) => {
    target[prop] = changes;

    // handle status update
    const el = document.querySelector('#status');
    if (prop !== 'length' && el) el.innerHTML += '<br>' + changes;
    if (prop == 'length' && el)
      document.querySelector('progress').value = changes;

    return true;
  },
});
// set first status (before the engine pushes the others)
globalThis.loadingStates.push( 'Preparing and loading dependencies' );
```

## Tipps

If you need a simple Store that is available in each component (like in NuxtJS, and do not want to use `Pinia`), you can use:
```js
import { reactive } from 'vue';
// access or init a "store"
let selectedModel = globalThis.selectedModel || (globalThis.selectedModel = reactive({ index: '' })); // index is a made up key and behaves like the ref()'s .value

// use
selectedModel.index = 0; // and in template `{{ selectedModel.index }}`
```

## Caveats

Only commonjs imports are a problem.

### Notes about Imports:

#### The UseVue problem:

`@vueuse/shared` **must** be in an importmap, but `@vueuse/core` **must** be in `options.moduleCache` to work.

Side note: `script[type=importmap]` tags do nothing when added by javascript.

**So what is there to do?** The importmap for custom modules has to be created by the user, but all keys from importmaps will be added to options.moduleCache automatically.

## Todo

**The technical parts are all done allready.**

These are optional things I want to include, to have a single drop in solution.

- [E] (ERROR) add a styles folder and test importing in style-less-tags (with .css and .less), and .css imports in script-tags
  - https://github.com/FranckFreiburger/vue3-sfc-loader/issues/219
