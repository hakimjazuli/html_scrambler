// @ts-check
import ncp from 'ncp';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const folder_ = 'h_modules_example';
const source_dir = path.join(__dirname, folder_);
const dest_dir = path.join(process.cwd(), folder_);

const options = {
	clobber: true,
};

ncp.ncp(source_dir, dest_dir, options, function (err) {
	if (err) {
		return console.error(err);
	}
	console.log('example files copied successfully!');
});
