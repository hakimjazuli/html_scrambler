# html_scrambler

## a simple yet highly extendable nodeJS library...

for scrambling generated static web html resources, from including but not limited to

-   **bootstrap studio**.
-   **pinegrow**.
-   **WYSIWYG web builder**.
-   or bassically **any program** that generate _static web folder_.

into chunks of file, that(by extending our **builder_class**) are usable for any html web
framework/templating like:

-   ejs,
-   laravel blade,
-   sveltekit,
-   next, or
-   basically anything.

or at least that was the mission of this project

### how to initiate

```js
import { builder } from '@html_first/html_scrambler';

const app = new builder({
	/**
	 * options
	 * make no worries as we already make it type safe and ?documented? inside the module
	 */
});
app.watch();
```

### which can be called on the html file like bellow

```html
<div id="test" builder b-1="php;foreach;$table as $row">test</div>
```

that means that \#test element will call class named **php**, run method named **foreach** with
"_$table as \$row_" as first argument

which with our _example class_, **php**, it will result into

```php
<?php foreach($table as $row){ ?><div id="test">test</div><?php };?>
```

\* **examples are available in the listed github repo**

## code splitting

the example class also have **bss** class, which show example on how to code split one html into
multiple file

you can call it using partial method like

```html
<div id="test" builder b-1="php;partial;component/test.blade.php;@include('view.name')">test</div>
```

which will turn main html line into

```blade
@include('view.name')
```

and create new file at component/test.blade.php with this

```html
<div id="test">test</div>
```

## html call pattern

as have mentioned above, the pattern to call your class is by adding

-   builder and
-   b[dash]index="class_name[attribute_delimiter]method_name[attribute_delimiter]...arguments"

which then be called each index incrementally (starts from 1) and will end if there are no more
index+1 after curent index

you might want to utilize attribute_delimiter_2 and attribute_delimiter_3 from (inside builder
class) this.builder.b_build.attribute_delimiter_2 or this.builder.b_build.attribute_delimiter_3 for
this.builder.split to split with escaped curent delimiter
