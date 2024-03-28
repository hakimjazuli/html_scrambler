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
import { h_watcher } from '@html_first/html_scrambler';

const watcher = new h_watcher({
	/**
	 * options
	 * make no worries as we already make it type safe and ?documented? inside the module
	 */
});
watcher.run({
	/**
	 * options
	 * ditto
	 */
});
```

initiate watcher using

```shell
node "./h_modules_example/main.mjs"
```

## html call pattern

to call your class;method add attribute on the element to proccess

-   **build** and
-   **b**[dash]**index**="_class_name_[attribute_delimiter]_method_name_[attribute_delimiter]_...arguments_"

which then be called each index incrementally (starts from 1) and will end if there are no more
_index+1_ after the curent index

**nb**

-   you might want to utilize attribute_delimiter_2 and attribute_delimiter_3 from (inside builder
    class) this.builder.b_build.attribute_delimiter_2 or this.builder.b_build.attribute_delimiter_3
    for this.builder.split to split with escaped curent delimiter

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

our example class also have **bss** class, which show code example on how to code split one html
into multiple file

you can call it using partial method

```html
<div id="test" build b-1="bss;partial;component/test.blade.php;@include('view.name')">test</div>
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
```

get example on github
