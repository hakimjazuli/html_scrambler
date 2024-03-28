// @ts-check
import ncp from 'ncp';
import path from 'path';

const base = process.cwd();
const folder_ = 'h_modules_example';
const source_dir = path.join(base, 'node_modules', '@html_first', 'html_scrambler', folder_);
const dest_dir = path.join(base, folder_);

const options = {
	clobber: true,
};
[source_dir].forEach(folder__ => {
	ncp.ncp(folder__, dest_dir, options, function (err) {
		if (err) {
			return console.error(err);
		}
		console.log('example files copied successfully!');
	});
	
});
