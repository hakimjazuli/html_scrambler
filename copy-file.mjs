// @ts-check
import { ncp } from 'ncp';
import path from 'path';
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const relative_path = 'h_module_example';
const source_dir = path.join(__dirname, relative_path);
const dest_dir = path.join(process.cwd(), relative_path);
const options = {
	clobber: true,
};

ncp(source_dir, dest_dir, options, function (err) {
	if (err) {
		return console.error(err);
	}
	console.log('example files copied successfully!');
});
