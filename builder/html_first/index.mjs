// @ts-check

import { HTMLScrambler } from '@html_first/html_scrambler';

new HTMLScrambler({
	_htmlWatchPath: '/builder/html_first/src/',
	_buildPath: '/mockFolderBackEnd/',
	_publicRootStatic: '/public/',
	_publicSubfoldersStatic: '/mockFolderBackEnd/index/',
})
	.run
	/**
	 * pathCallbacks
	 */
	();
