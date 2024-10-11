## a simple yet highly extendable SSG scrambler library for `nodeJS`/`JSRuntime with fs capability`.
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

- create a file with exported default by extending this class with static method instructions;```js// on `${_builderClassFolderPath}/someClass.mjs`// @ts-checkimport { Builder } from '@html_first/html_scrambler'export default class extends Builder{	// args': string[];	static someMethod = (...args) => {		// code	}}```- usage on `*.html` file:```html<div build b-1="someClass;someMethod;arg0;arg1" b-2="otherClass;otherMethod;...args">	divInnerHTML</div>```> - notice that `b-${index}` are incrementaly increases, the lib expect `[build]` to have b-1 and increases incrementaly by `1`, if the element has no `b-${next}` it will ignore any `b-`'s afterward;> - this `attributeNameIdentification` can be changed using [`HTMLScrambler`](#htmlscrambler) `options._buildAttrIdentifier` and `options._buildPrefix` respectively on that order;> > - preferably use dash "`-`" as word separator;> > - don't use colon "`:`" as word separator;- check on copyed `/builder/html_first/classes/` for examples on how to use;

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>


<h2 id="htmlscrambler">HTMLScrambler</h2>

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

- assign folder watcher by instantiating this class;```js// @ts-checkimport { HTMLScrambler } from '@html_first/html_scrambler'new HTMLScrambler({...options}).run(...pathCallbacks);```- initiate watcher by adding script to your `package.json` scripts object```json{..."scripts":{	...	"scrambler":"node --watch ./path/to/thisInstance/file.mjs",	// or	"scrambler":"bun --watch ./path/to/thisInstance/file.mjs",	// or	"scrambler":"bun --hot ./path/to/thisInstance/file.mjs",	...}...}```- then```shellnpm run scrambler```

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>
