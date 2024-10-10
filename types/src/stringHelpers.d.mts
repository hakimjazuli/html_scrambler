export class stringHelpers {
    /**
     * @param {string} doc_string
     * @returns {string}
     */
    static uncommentDocument: (doc_string: string) => string;
    /**
     * @param {string} str
     */
    static escapeRegExp: (str: string) => string;
    /**
     * @param {String} path_
     * @returns {String}
     */
    static standardRelativeRefs: (path_: string) => string;
    /**
     * @param {String} path_
     * @returns {String}
     */
    static standardPath: (path_: string) => string;
    /**
     * @param {String} string
     * @returns {String}
     */
    static interpretSpecialChars: (string: string) => string;
    /**
     * @param {string} string_check
     * @param {string[]} includes
     * @returns {boolean}
     */
    static likes: (string_check: string, ...includes: string[]) => boolean;
    /**
     * @param {string} content
     */
    static closeVoidElement: (content: string) => string;
    /**
     * Replace substrings or patterns in a string with other strings.
     * @param {String} string - The input string to perform replacements on.
     * @param {Array<[String|RegExp, String]>} searchs_replaces - An array of search strings (or regexp) and their corresponding replacement strings.
     * @returns {String} - The modified string after replacements.
     */
    static stringReplaces: (string: string, searchs_replaces: Array<[string | RegExp, string]>) => string;
}
