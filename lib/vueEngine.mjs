/**
 * Vue Engine for Browsers
 *
 * @author Nabil Redmann <repo@bananaacid.de>
 * @license MIT
 */

// initiate logging
globalThis.loadingStates = globalThis.loadingStates || [];
globalThis.loadingStates.push('Initializing');

// imports
import * as vue from 'vue';
const { createApp, defineAsyncComponent } = vue;
import { createRouter, createWebHashHistory } from 'vue-router';
import { loadModule } from 'vue3-sfc-loader';

// ensure, object exists
globalThis.vueConfig = globalThis.vueConfig || {};
globalThis.vueConfig.routes = globalThis.vueConfig.routes || [];
globalThis.vueConfig.components = globalThis.vueConfig.components || [];
globalThis.vueConfig.imports = globalThis.vueConfig.imports || [];
globalThis.vueConfig.onReady = globalThis.vueConfig.onReady || undefined;
globalThis.vueConfig.mappings = {
  pugjs: 'https://pugjs.org/js/pug.js',
  ...(globalThis.vueConfig.mappings || {}),
};

// no esm import for PUG
if (globalThis.vueConfig.mappings.pugjs)
  globalThis.vueConfig.imports.push({ type: 'script', content: globalThis.vueConfig.mappings.pugjs }, { type: 'plugin', content: ({options}) => options.moduleCache['pug'] =  require('pug')}); // prettier-ignore

// check if less is available in the importmaps
const lessIsImported =
  Array.from(document.querySelectorAll('script[type="importmap"]')).filter(
    (importmap) => JSON.parse(importmap.text).imports['less']
  ).length > 0;
const moduleCacheLess = !lessIsImported
  ? {}
  : { less: (await import('less')).default };

// vue3-sfc-loader config
let options = {
  moduleCache: {
    vue,
    //pug, .. added by vueConfig.imports
    ...moduleCacheLess, // we test if less was imported first
  },
  files: {},
  async getFile(url) {
    if (options.files[url]) return options.files[url];

    // fetch the file
    const res = await fetch(url);
    if (!res.ok)
      throw Object.assign(new Error(res.statusText + ' ' + url), { res });
    return await res.text();
  },
  addStyle(textContent) {
    const style = Object.assign(document.createElement('style'), {
      textContent,
    });
    const ref = document.head.getElementsByTagName('style')[0] || null;
    document.head.insertBefore(style, ref);
  },
};

globalThis.loadingStates.push('Processing styles');

// fix: hide templates using xmp tag (the template tag lower-cases ALL tags! And self-closing tags are not supported. Solution: XMP or TEXTAREA)
options.addStyle(`html>body>xmp{display:none}`);

// add styles from the globalThis.vueConfig.imports
globalThis.vueConfig.imports
  .filter((imp) => imp.type == 'style')
  .forEach((imp) => options.addStyle(imp.content));

globalThis.loadingStates.push('Processing scripts and imports');

// add scripts from the globalThis.vueConfig.imports, and wait till they are all loaded
// prettier-ignore
const loadScripts = globalThis.vueConfig.imports
  .filter((imp) => imp.type == 'script')
  .map((imp) =>
    new Promise((resolve) =>
      document.head.append(
        Object.assign(document.createElement('script'), {
          src: imp.content,
          onload: resolve,
        })
      )
  ));
// add importmap modules to be accessible from vue files
// if not included in options.moduleCache / passed through, getFile would try to load them as file and try to get its text content
const loadImpartmap = Array.from(
  document.querySelectorAll('script[type="importmap"]')
).map(async (importmap) => {
  for (const mod in JSON.parse(importmap.text).imports) {
    // DO NOT REIMPORT Vue, and if there are mapping urls -> do not add them
    if (!options.moduleCache[mod] && !/https*:\/\//.test(mod)) {
      options.moduleCache[mod] = await import(mod);
    }
  }
});

// wait for scripts and imports to be ready
await Promise.all([...loadScripts, ...loadImpartmap]);

globalThis.loadingStates.push('Processing embedded components');

// load pages and components from this html
let loadComponents = globalThis.vueConfig.components || [];
document
  .querySelectorAll(
    'xmp[type="page"], xmp[type="component"], xmp[type="view"], xmp[type="app"]'
  )
  .forEach((template) => {
    if (!template.id)
      throw new Error(
        'All page and component templates must have id attributes with a valid filename'
      );

    const type = template.getAttribute('type');
    const filename =
      type === 'app' ? `/${template.id}` : `/${type}s/${template.id}`;
    options.files[filename] = template.innerHTML;

    if (type == 'component')
      loadComponents.push({
        name: template.id.split(/[/\\]/).pop().replace('.vue', ''),
        file: filename,
      });
  });

globalThis.loadingStates.push('Processing pages');

// initialize vue-router
const router = createRouter({
  history: createWebHashHistory(),
  routes: globalThis.vueConfig.routes.map((route) => ({
    ...route,
    component:
      route.component ?? (() => loadModule('/pages/' + route.page, options)),
  })),
});

globalThis.loadingStates.push('Processing app');

// Create and mount the app
const app = createApp({
  components: {
    App: await loadModule('/App.vue', options),
  },
  template: '<App />',
});

globalThis.loadingStates.push('Processing plugins');

// activate vue plugins
const self = this;
await Promise.all(
  globalThis.vueConfig.imports
    .filter((imp) => imp.type == 'plugin')
    .map(async (imp) => await imp.content.call(self, { app, options, vue }))
);

globalThis.loadingStates.push('Processing global components');

// Load components globally
loadComponents.forEach(({ name, file }) =>
  app.component(
    name,
    defineAsyncComponent(() => loadModule(file, options))
  )
);

globalThis.loadingStates.push('Processing router');

// wait for router and mount app
app.use(router);
await router.isReady();
const mount = function mount() {
  app.mount('#app');
}.bind(this);
if (globalThis.vueConfig.onReady) globalThis.vueConfig.onReady(mount);
else mount();

globalThis.loadingStates.push('Ready');
