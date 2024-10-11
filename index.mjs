// @ts-check

/**
 * generated using:
 * @see {@link https://www.npmjs.com/package/@html_first/js_lib_template | @html_first/js_lib_template}
 * @copyright
 * developed and published under MIT license,
 * @description
 * ## a simple yet highly extendable SSG scrambler library for `nodeJS`/`JSRuntime with fs capability`.
 * for scrambling generated static web html resources from, including but not limited to:
 * -   `bootstrap studio`.
 * -   `pinegrow`.
 * -   `WYSIWYG web builder`.
 * -   or bassically `any program` that generate _static web folder_, as long as it is able to add
 * 	custom html attribute.
 * into chunks of file, that(by extending our `Builder`) are usable for any html based web
 * framework/templating language like:
 * -   laravel blade,
 * -   svelte,
 * -   next,
 * -   ejs, or...
 * -   basically anything.
 * _or at least that is the mission of this project_
 * ## about @html_first/html_scrambler v^4.x.x
 * - change on how to instantiate the library
 * > - no more `__AppSettings` instantiation is needed
 * - naming convention
 * > - change `__Watcher` to `HTMLScrambler`
 * > - change `__BuilderClass` to `Builder`
 * > - change `instruction method` to `static method`
 * ## How to install
 * ```shell
 * npm i @html_first/html_scrambler
 * node ./node_modules/@html_first/html_scrambler/starter.mjs
 * ```
 *  - examples are in node and npm
 *  > - you can use other js runtime with filesystem capability
 */

import { Builder } from './src/Builder.mjs';
import { HTMLScrambler } from './src/HTMLScrambler.mjs';
export { Builder, HTMLScrambler };