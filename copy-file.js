// @ts-check
const ncp = require('ncp').ncp;
const path = require('path');

const source_dir = path.join(__dirname, 'path', 'to', 'source');

const dest_dir = path.join(process.cwd(), 'path', 'to', 'destination');

const options = {
	clobber: true,
};

ncp(source_dir, dest_dir, options, function (err) {
	if (err) {
		return console.error(err);
	}
	console.log('example files copied successfully!');
});
