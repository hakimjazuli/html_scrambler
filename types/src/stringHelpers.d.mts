export class stringHelpers {
    /**
     * @param {string} docString
     * @returns {string}
     */
    static uncommentDocument: (docString: string) => string;
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
     * @param {string} stringCheck
     * @param {string[]} includes
     * @returns {boolean}
     */
    static likes: (stringCheck: string, ...includes: string[]) => boolean;
    /**
     * @param {string} content
     */
    static closeVoidElement: (content: string) => string;
    /**
     * Replace substrings or patterns in a string with other strings.
     * @param {String} string - The input string to perform replacements on.
     * @param {Array<[String|RegExp, String]>} searchsReplaces - An array of search strings (or regexp) and their corresponding replacement strings.
     * @returns {String} - The modified string after replacements.
     */
    static stringReplaces: (string: string, searchsReplaces: Array<[string | RegExp, string]>) => string;
}
