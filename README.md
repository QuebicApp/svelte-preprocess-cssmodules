# Svelte preprocess CSS Modules

Generate CSS Modules classname on Svelte components

```bash
npm install --save-dev svelte-preprocess-cssmodules
```

- [Usage](#usage)
  - [Modes](#modes)
  - [Class directive](#class-directive)
- [Local selector](#local-selector)
- [Import styles from an external stylesheet](#import-styles-from-an-external-stylesheet)
  - [Destructuring import](#destructuring-import)
  - [kebab-case situation](#kebab-case-situation)
  - [Unnamed import](#unnamed-import)
  - [Directive and dynamic class](#directive-and-dynamic-class)
- [Configuration](#configuration)
  - [Rollup](#rollup)
  - [Webpack](#webpack)
  - [SvelteKit](#sveltekit)
  - [Svelte Preprocess](#svelte-preprocess)
  - [Options](#options)
- [Migrating from v1](#migrating-from-v1)
- [Code example](#code-example)
- [Why CSS Modules on Svelte](#why-css-modules-on-svelte)

## Usage

Add the `module` attribute to the `<style>` tag to enable cssModules

```html
<style module>
  p { font-size: 14px; }
  .red { color: red; }
</style>

<p class="red">My red text</p>
```

The component will be transformed to

```html
<style>
  p { font-size: 14px; }
  .red-30_1IC { color: red; }
</style>

<p class="red-30_1IC">My red text</p>
```

### Modes

Preprocessor can operate in the following modes:

- `native` (default) - scopes classes with cssModules, anything else is unscoped
- `mixed` - scopes non-class selectors with svelte scoping in addition to `native` (same as preprocessor `v1`)
- `scoped` - scopes classes with svelte scoping in addition to `mixed`

The mode can be **set globally from the preprocessor options** or **locally to override the global settings** per component.

**Mixed mode**
```html
<style module="mixed">
  p { font-size: 14px; }
  .red { color: red; }
</style>

<p class="red">My red text</p>
```

*generating*

```html
<style>
  p.svelte-teyu13r { font-size: 14px; }
  .red-30_1IC { color: red; }
</style>

<p class="red-30_1IC svelte-teyu13r">My red text</p>
```

**Scoped mode**
```html
<style module="scoped">
  p { font-size: 14px; }
  .red { color: red; }
</style>

<p class="red">My red text</p>
```

*generating*

```html
<style>
  p.svelte-teyu13r { font-size: 14px; }
  .red-30_1IC.svelte-teyu13r { color: red; }
</style>

<p class="red-30_1IC svelte-teyu13r">My red text</p>
```

### Class directive

Toggle a class on an element.

```html
<script>
  let isActive = true;
</script>

<style module>
  .bold { font-weight: bold; }
</style>

<p class:bold={isActive}>My red text</p>
<p class="{isActive ? 'bold' : ''}">My blue text</p>
```

*Generating*

```html
<style>
  .bold-2jIMhI { font-weight: bold; }
</style>

<p class="bold-2jIMhI">My red text</p>
<p class="bold-2jIMhI">My blue text</p>
```

**Use of shorthand**

```html
<script>
  let active = true;
</script>

<style module>
  .active { font-weight: bold; }
</style>

<p class:active>My active text</p>
```

*Generating*

```html
<style>
  .active-2jIMhI { font-weight: bold; }
</style>

<p class="active-2jIMhI">My active text</p>
```

## Local selector

Force a selector to be scoped within a component to prevent style inheritance on child components.

`:local()` is doing the opposite of `:global()` and can only be used with the `native` and `mixed` mode on.

```html
<!-- Parent Component-->

<style module>
  .main em { color: grey; }
  .main :local(strong) { font-weight: 900; }
</style>

<div class="main">
  <p>My <em>main</em> lorem <strong>ipsum tuye</strong></p>
  <ChildComponent />
</div>
```
```html
<!-- Child Component-->

<style module>
  /** Rule to override parent style **/
  .child em { color: black; }

  /** 
   * Not needed rule because of the use of :local()
   .child strong { font-weight: 700 }
   */
</style>

<p class="child">My <em>secondary</em> lorem <strong>ipsum tuye</strong></p>
```

*Generating*

```html
<!-- Parent Component-->

<style>
  .main-Yu78Wr em { color: grey; }
  .main-Yu78Wr strong.svelte-ery8ts { font-weight: 900; }
</style>

<div class="main-Yu78Wr">
  <p>My <em>main</em> lorem <strong class="svelte-ery8ts">ipsum tuye</strong></p>
  <ChildComponent />
</div>
```
```html
<!-- Child Component-->

<style>
  .child-uhRt2j em { color: black; }
</style>

<p class="child-uhRt2j">My <em>secondary</em> lorem <strong>ipsum tuye</strong></p>
```

When used on a class, `:local()` applies the svelte scoping system to the selector. This could be useful when targetting global classnames.

```html
<style module>
  .actions {
    padding: 10px;
  }
  /* target a css framework classname without replacing it*/
  :local(.btn-primary) {
    margin-right: 10px;
  }
</style>

<div class="actions">
  <button class="btn btn-primary">Ok</button>
  <button class="btn btn-default">Cancel</button>
</div>
```

*Generating*

```html
<style>
  .actions-7Fhti9 {
    padding: 10px;
  }
  .btn-primary.svelte-saq8ts {
    margin-right: 10px;
  }
</style>

<div class="actions-7Fhti9">
  <button class="btn btn-primary svelte-saq8ts">Ok</button>
  <button class="btn btn-default">Cancel</button>
</div>
```


## Import styles from an external stylesheet

Alternatively, styles can be created into an external file and imported onto a svelte component from the `<script>` tag. The name referring to the import can then be used in the markup targetting any existing classname of the stylesheet.

- The option `parseExternalStylesheet` need to be enabled.
- The css file must follow the convention `FILENAME.module.css` in order to be processed.

**Note:** *The import option is only meant for stylesheets relative to the component. You will have to set your own bundler in order to import *node_modules* packages css files.*

```css
/** style.module.css **/
.red { color: red; }
.blue { color: blue; }
```
```html
<!-- Svelte component -->
<script>
  import style from './style.module.css';
</script>

<p class={style.red}>My red text</p>
<p class={style.blue}>My blue text</p>
```

*Generated code*

```html
<style>
  .red-en-6pb { color: red; }
  .blue-oVk-n1 { color: blue; }
</style>

<p class="red-en-6pb">My red text</p>
<p class="blue-oVk-n1">My blue text</p>
```

### Destructuring import

```css
/** style.module.css **/
section { padding: 10px; }
.red { color: red; }
.blue { color: blue; }
.bold { font-weight: bold; }
```
```html
<!-- Svelte component -->
<script>
  import { red, blue } from './style.module.css';
</script>

<section>
  <p class={red}>My <span class="bold">red</span> text</p>
  <p class="{blue} bold">My blue text</p>
</section>
```

*Generated code*

```html
<style>
  section { padding: 10px; }
  .red-1sPexk { color: red; }
  .blue-oVkn13 { color: blue; }
  .bold-18te3n { font-weight: bold; }
</style>

<section>
  <p class="red-1sPexk">My <span class="bold-18te3n">red</span> text</p>
  <p class="blue-oVkn13 bold-18te3n">My blue text</p>
</section>
```

### kebab-case situation

The kebab-case classnames are being transformed to a camelCase version on imports to facilitate their use on Markup and Javascript.

```css
/** style.module.css **/
.success { color: green; }
.error-message {
  color: red;
  text-decoration: line-through;
}
```
```html
<script>
  import css from './style.module.css';
</script>

<p class={css.success}>My success text</p>
<p class="{css.errorMessage}">My error message</p>

<!-- OR -->

<script>
  import { success, errorMessage } from './style.module.css';
</script>

<p class={success}>My success message</p>
<p class={errorMessage}>My error message</p>
```

*Generated code*

```html
<style>
  .success-3BIYsG { color: green; }
  .error-message-16LSOn {
    color: red;
    text-decoration: line-through;
  }
</style>

<p class="success-3BIYsG">My success messge</p>
<p class="error-message-16LSOn">My error message</p>
```

### Unnamed import

If a css file is being imported without a name, the cssModules will still be applied to the classes of the stylesheet.

```css
/** style.module.css **/
p { font-size: 18px; }
.success { color: green; }
```
```html
<script>
  import './style.module.css'
</script>

<p class="success">My success message</p>
<p>My another message</p>
```

*Generated code*

```html
<style>
  p { font-size: 18px; }
  .success-vg78j0 { color: green; }
</style>

<p class="success-vg78j0">My success messge</p>
<p>My error message</p>
```

### Directive and Dynamic class

Use the Svelte's builtin `class:` directive or javascript template to display a class dynamically.  
**Note**: the *shorthand directive* is **NOT working** with imported CSS Module identifiers.

```html
<script>
  import { success, error } from './style.module.css';

  let isSuccess = true;
  $: notice = isSuccess ? success : error;
</script>

<button on:click={() => isSuccess = !isSuccess}>Toggle</button>

<!-- Error -->
<p class:success>Success</p>

<!-- Ok -->
<p 
  class:success={isSuccess}
  class:error={!isSuccess}>Notice</p>

<p class={notice}>Notice</p>
<p class={isSuccess ? success : error}>Notice</p>
```

## Configuration

### Rollup

To be used with the plugin [`rollup-plugin-svelte`](https://github.com/sveltejs/rollup-plugin-svelte).

```js
import svelte from 'rollup-plugin-svelte';
import cssModules from 'svelte-preprocess-cssmodules';

export default {
  ...
  plugins: [
    svelte({
      preprocess: [
        cssModules(),
      ]
    }),
  ]
  ...
}
```

### Webpack

To be used with the loader [`svelte-loader`](https://github.com/sveltejs/svelte-loader).

```js
const cssModules = require('svelte-preprocess-cssmodules');

module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.svelte$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'svelte-loader',
            options: {
              preprocess: [
                cssModules(),
              ]
            }
          }
        ]
      }
    ]
  }
  ...
}
```

### SvelteKit

As the module distribution is targetting `esnext`, `Node.js 14` or above is required 
in order to work. 

```js
// svelte.config.js

import cssModules from 'svelte-preprocess-cssmodules';

const config = {
  ...
  preprocess: [
    cssModules(),
  ]
};

export default config;
```

### Svelte Preprocess

Chaining several preprocessors may lead to errors if the svelte parser and walker is being manipulated multiple time. This issue is due to the way svelte runs its preprocessor in two phases. [Read more here](https://github.com/firefish5000/svelte-as-markup-preprocessor#motivation)


In that situation, we recommend the use of the package [`svelte-as-markup-preprocessor`](https://github.com/firefish5000/svelte-as-markup-preprocessor).

```bash
npm install --save-dev svelte-as-markup-preprocessor
```

**Example with typescript**

```js
// import packages
const { typescript } = require('svelte-preprocess');
const { asMarkupPreprocessor } = require('svelte-as-markup-preprocessor');
const cssModules = require('svelte-preprocess-cssmodules');

...

// svelte config
  preprocess: [
    asMarkupPreprocessor([
      typescript()
    ]),
    cssModules()
  ],
...
```

### Options
Pass an object of the following properties

| Name | Type | Default | Description |
| ------------- | ------------- | ------------- | ------------- |
| [`getLocalIdent`](#getlocalident) | `Function` | `undefined`  | Generate the classname by specifying a function instead of using the built-in interpolation |
| [`hashSeeder`](#hashseeder) | `{Array}` | `['style', 'filepath', 'classname']` | An array of keys to base the hash on |
| [`includeAttributes`](#includeattributes) | `{Array}` | `[]` | An array of attributes to parse along with `class` |
| `includePaths` | `{Array}` | `[]` (Any) | An array of paths to be processed |
| [`localIdentName`](#localidentname) | `{String}` | `"[local]-[hash:base64:6]"` |  A rule using any available token |
| `mode`  | `native\|mixed\|scoped` | `native` | The preprocess mode to use
| `parseExternalStylesheet` | `{Boolean}` | `false` | Enable parsing on imported external stylesheet |
| `parseStyleTag` | `{Boolean}` | `true` | Enable parsing on style tag |
| [`useAsDefaultScoping`](#useasdefaultscoping) | `{Boolean}` | `false` | Replace svelte scoping globally |

#### `getLocalIdent`

Customize the creation of the classname instead of relying on the built-in function.

```ts
function getLocalIdent(
  context: {
    context: string, // the context path
    resourcePath: string, // path + filename
  },
  localIdentName: {
    template: string, // the template rule
    interpolatedName: string, // the built-in generated classname
  },
  className: string, // the classname string
  content: { 
    markup: string, // the markup content
    style: string,  // the style content
  }
): string {
  return `your_generated_classname`;
}
```


*Example of use*

```bash
# Directory
SvelteApp
└─ src
   ├─ App.svelte
   └─ components
      └─ Button.svelte
```
```html
<!-- Button.svelte -->
<button class="red">Ok</button>

<style>
  .red { background-color: red; }
</style>
```

```js
// Preprocess config
...
preprocess: [
  cssModules({
    localIdentName: '[path][name]__[local]',
    getLocalIdent: (context, { interpolatedName }) => {
      return interpolatedName.toLowerCase().replace('src_', '');
      // svelteapp_components_button__red;
    }
  })
],
...
```

#### `hashSeeder`

Set the source to create the hash from (when using `[hash]` / `[contenthash]`).

The list of available keys are:

- `style` the content of the style tag (or the imported stylesheet)
- `filepath` the path of the component 
- `classname` the local className

*Example of use*
```js
// Preprocess config
...
preprocess: [
  cssModules({
    hashSeeder: ['filepath'],
  })
],
...
```
```html
<button class="success">Ok</button>
<button class="cancel">Cancel</button>
<style module>
  .success { background-color: green; }
  .cancel { background-color: gray; }
</style>
```

*Generating*

```html
<button class="success-yr6RT">Ok</button>
<button class="cancel-yr6RT">Cancel</button>
<style>
  .success-yr6RT { background-color: green; }
  .cancel-yr6RT { background-color: gray; }
</style>
```

#### `includeAttributes`

Add other attributes than `class` to be parsed by the preprocesser

```js
// Preprocess config
...
preprocess: [
  cssModules({
    includeAttributes: ['data-color', 'classname'],
  })
],
...
```
```html
<button class="red" data-color="red">Red</button>
<button class="red" classname="blue">Red or Blue</button>
<style module>
  .red { background-color: red; }
  .blue { background-color: blue; }
</style>
```

*Generating*

```html
<button class="red-yr6RT" data-color="red-yr6RT">Red</button>
<button class="red-yr6RT" classname="blue-aE4qW">Red or Blue</button>
<style>
  .red-yr6RT { background-color: red; }
  .blue-aE4qW { background-color: blue; }
</style>
```

#### `localIdentName`

Inspired by [webpack interpolateName](https://github.com/webpack/loader-utils#interpolatename), here is the list of tokens:

- `[local]` the targeted classname
- `[ext]` the extension of the resource
- `[name]` the basename of the resource
- `[path]` the path of the resource
- `[folder]` the folder the resource is in
- `[contenthash]` or `[hash]` *(they are the same)* the hash of the resource content (by default it's the hex digest of the md4 hash)
- `[<hashType>:contenthash:<digestType>:<length>]` optionally one can configure
  - other hashTypes, i. e. `sha1`, `md4`, `md5`, `sha256`, `sha512`
  - other digestTypes, i. e. `hex`, `base26`, `base32`, `base36`, `base49`, `base52`, `base58`, `base62`, `base64`
  - and `length` the length in chars

#### `useAsDefaultScoping`

Globally replace the default svelte scoping by the cssModules scoping. As a result, the `module` attribute to `<style>` becomes unnecessary.


```js
// Preprocess config
...
preprocess: [
  cssModules({
    useAsDefaultScoping: true
  }),
],
...
```

```html
<h1 class="title">Welcome</h1>
<style>
  .title { color: blue }
</style>
```

*Generating*
```html
<h1 class="title-erYt1">Welcome</h1>
<style>
  .title-erYt1 { color: blue }
</style>
```

**Beware**   
The enabled option will applied cssModules scoping to all imported Svelte files, even the ones coming from `node_modules`. When using a third party library, make sure the compiled version is being imported. In the case of a raw svelte file, it might break its styling.

To prevent any scoping conflict, it is recommended to associate the option `useAsDefaultScoping` with `includePaths`.

```js
// Preprocess config
...
preprocess: [
  cssModules({
    useAsDefaultScoping: true,
    includePaths: ['./src'],
  }),
],
...
```

## Migrating from v1
If you want to migrate an existing project to `v2` keeping the approach of the 1st version, follow the steps below:

- Set the `mixed` mode from the global settings.
   ```js
   // Preprocess config
   ...
   preprocess: [
    cssModules({
      mode: 'mixed',
    }),
   ],
   ...
   ```
- Remove all `$style.` prefix from the html markup
- Add the attribute `module` to `<style>` within your components.
   ```html
   <style module>
   ...
   </style>
   ```

## Code Example

*Rollup Config*

```js
export default {
  ...
  plugins: [
    svelte({
      preprocess: [
        cssModules({
          includePaths: ['src'],
          localIdentName: '[hash:base64:10]',
        }),
      ]
    }),
  ]
  ...
}
```

*Svelte Component*

```html
<style module>
  .modal {
    position: fixed;
  }
  .wrapper {
    padding: 0.5rem 1rem;
  }
  .body {
    flex: 1 0 0;
  }
  .modal button {
    background-color: white;
  }
  .cancel {
    background-color: #f2f2f2;
  }
</style>

<section class="modal">
  <header class="wrapper">My Modal Title</header>
  <div class="body wrapper">
    <p>Lorem ipsum dolor sit, amet consectetur.</p>
  </div>
  <footer class="wrapper">
    <button>Ok</button>
    <button class="cancel">Cancel</button>
  </footer>
</section>
```

*Final html code generated by svelte*

```html
<style>
  ._329TyLUs9c {
    position: fixed;
  }
  .Re123xDTGv {
    padding: 0.5rem 1rem;
  }
  ._1HPUBXtzNG {
    flex: 1 0 0;
  }
  ._329TyLUs9c button {
    background-color: white;
  }
  ._1xhJxRwWs7 {
    background-color: #f2f2f2;
  }
</style>

<section class="_329TyLUs9c">
  <header class="Re123xDTGv">My Modal Title</header>
  <div class="_1HPUBXtzNG Re123xDTGv">
    <p>Lorem ipsum dolor sit, amet consectetur.</p>
  </div>
  <footer class="Re123xDTGv">
    <button>Ok</button>
    <button class="_1xhJxRwWs7">Cancel</button>
  </footer>
</section>
```

## Why CSS Modules on Svelte

While the native CSS Scoped system should be largely enough to avoid class conflict, it could find its limit when working on a hybrid project. On a non full Svelte application, paying attention to the name of a class would be no less different than to a regular html project. For example, on the modal component above, It would have been wiser to namespace some of the classes such as `.modal-body` and `.modal-cancel` in order to prevent inheriting styles from other `.body` and `.cancel` classes.

## License

[MIT](https://opensource.org/licenses/MIT)
