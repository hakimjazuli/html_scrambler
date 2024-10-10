## a simple yet highly extendable `nodeJS`/`JSRuntime with fs capability` SSG scrambler library.
for scrambling generated static web html resources from, including but not limited to:
-   `bootstrap studio`.
-   `pinegrow`.
-   `WYSIWYG web builder`.
-   or bassically `any program` that generate _static web folder_, as long as it is able to add
	custom html attribute.
into chunks of file, that(by extending our `Builder`) are usable for any html based web
framework/templating language like:
-   laravel blade,
-   svelte,
-   next,
-   ejs, or...
-   basically anything.
_or at least that is the mission of this project_
## about @html_first/html_scrambler v^4.x.x
- change on how to instantiate the library
> - no more `__AppSettings` instantiation is needed
- naming convention
> - change `__Watcher` to `HTMLScrambler`
> - change `__BuilderClass` to `Builder`
> - change `instruction method` to `static method`
## How to install
```shell
npm i @html_first/html_scrambler
node ./node_modules/@html_first/html_scrambler/starter.mjs
```
 - examples are in node and npm
 > - you can use other js runtime with filesystem capability


<h2 id="exported-api-and-type-list">exported-api-and-type-list</h2>

- [Builder](#builder)

- [HTMLScrambler](#htmlscrambler)

<h2 id="builder">Builder</h2>

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

- create a file with exported default by extending this class with static method instructions;```js// @ts-checkimport { Builder } from '@html_first/html_scrambler'export default class extends Builder{	// args': string[];	static someMethod = (...args) => {		// code	}}```

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>


<h2 id="htmlscrambler">HTMLScrambler</h2>

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

- assign folder watcher by instantiating this class;```js// @ts-checkimport { HTMLScrambler } from '@html_first/html_scrambler'new HTMLScrambler({...options});```- initiate watcher by adding script to your `package.json` scripts object```json{..."scripts":{	...	"scrambler":"node ./path/to/thisInstance/file.mjs",	...}...}```- then```shellnpm run scrambler```

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>
