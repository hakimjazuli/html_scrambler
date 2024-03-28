// @ts-check
import ncp from 'ncp';
import path from 'path';

const folder_ = 'h_modules_example';
const source_dir = path.join(
	process.cwd(),
	'node_modules',
	'@html_first',
	'html_scrambler',
	folder_
);
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
