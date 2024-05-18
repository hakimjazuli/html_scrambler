# html_scrambler

## a simple yet highly extendable nodeJS SSG scrambler library.

for scrambling generated static web html resources from, including but not limited to:

-   **bootstrap studio**.
-   **pinegrow**.
-   **WYSIWYG web builder**.
-   or bassically **any program** that generate _static web folder_, as long as it is able to add
    custom html attribute.

into chunks of file, that(by extending our **builder_class**) are usable for any html based web
framework/templating language like:

-   laravel blade,
-   svelte,
-   next,
-   ejs, or...
-   basically anything.

_or at least that is the mission of this project_

### how to initiate

create file in your project folder

```js
// main.mjs
// @ts-check

import { __Watcher } from '@html_first/html_scrambler';
import { AppSettings } from './AppSettings.mjs';

new __Watcher(AppSettings).run();
```

```js
// AppSettings.mjs
// @ts-check

import { __AppSettings } from '@html_first/html_scrambler';

export class AppSettings extends __AppSettings {
	/**
	 * modify public non-readonly property here
	 */
}
```

initiate watcher using

```shell
node ./path/to/your/main.mjs
```

or add it to your `package.json` scripts object

```json
{...
"scripts":{
	...
	"scrambler":"node ./path/to/your/main.mjs",
	...
}
...
}
```

then

```shell
npm run scrambler
```

## html call pattern

to call your class;method add attribute on the element to proccess

-   **build** and
-   **b**[dash]**index**="_class_name_[attribute_delimiter]_method_name_[attribute_delimiter]_...arguments_"

which then be called each index incrementally (starts from 1) and will end if there are no more
_index+1_ after the curent index

**nb**

-   you might want to utilize `__AppSettings.__.separator[1]` and `[2]` from (inside
    `_BuilderClass`)`__AppSettings.__.separator[1]` or `[2]` for this.builder.split to split with
    escaped curent delimiter

### html example

```html
<div id="test" build b-1="php;foreach;$table as $row">test</div>
```

_meaning_:

-   that **\#test** element will call registered class named **php**,
-   run method named **foreach**
-   with _"$table as \$row"_ as first argument

which, with our _example class_, **php**, it will result into

```php
<?php foreach($table as $row){ ?><div id="test">test</div><?php };?>
```

## code splitting

our example class also have **any builder class children** class, which show code example on how to
code split one html into multiple file

you can call it using partial method

```html
<div id="test" build b-1="php;partial;component/test.blade.php;@include('view.name')">test</div>
```

which will turn main html line into

```blade
@include('view.name')
```

and create new file at **"${build_path}/component/test.blade.php"** with this

```html
<div id="test">test</div>
```

## How to install

```shell
npm i @html_first/html_scrambler
node ./node_modules/@html_first/html_scrambler/starter.mjs

```

## Library Naming Convenience

-   classes that are **PREFIXED** with "\_\_" are globals, can be accessed with its "\_\_" static
    method, no need to be instantiated after the `new __Watcher(AppSettings).run();` script;
-   classes that are **PREFIXED** with "\_" are meant to be used in your app;
-   classes that are **NOT PREFIXED** with any "\_" are meant for library internals;

## version info

-   **1.0.x** custom classes uses named export, which when using this version dynamic import, it
    need to now exactly the name, which became a problem when you need to namespace the class with
    nested folder;
-   **2.x.x** custom classes uses default export;
-   **2.1.x**
    > -   added set_b_next for compound instruction,
    > -   added support for "classes.js" and
        "classes.ts"(bun) support while still maintaining compatibility for windows "file://" prefixer
        on node;
-   **3.0.x**
    > -   change on how to modify app behaviour using `__AppSettings`:
    > -   temporraily drop classes extention support
    >     > -   `js`,
    >     > -   `ts` (bun),
    > -   quick lookup seems it's the problem with either node or npm version of mine, cannot really
    >     check, I'm sorry, you have to stick with `mjs` with JSDOC for the time being:
