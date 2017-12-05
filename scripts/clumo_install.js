var request = require('request');
var fs = require('fs');
var zlib = require('zlib');
var JSZip = require('jszip');
var ProgressBar = require('progress');

var platform2release = {
  darwin: 'mac',
  linux: 'linux64',
  win32: 'win64',
};

var isWindows = process.platform === 'win32';
var platformZip = 'clumo_' + platform2release[process.platform] + '.zip';
var version = process.env.npm_package_version;
var file = fs.createWriteStream(platformZip);
var executable = isWindows ? 'clumo.exe' : 'clumo';

if (version == null) {
  throw new Error('Aborting! $npm_package_version not defined in env.');
}

var url = [
  'https://github.com/hlolli/clumo/releases/download',
  version,
  platformZip,
].join('/');

function hookProgressBar(req) {
  req.on('response', function(response) {
    console.log(/* just newline */);

    var len = parseInt(response.headers['content-length'], 10);
    var bar = new ProgressBar(' Downloading [:bar] :rate/bps :percent :etas', {
      complete: '=',
      imcomplete: ' ',
      width: 40,
      total: len,
    });

    response.on('data', function(chunk) {
      bar.tick(chunk.length);
    });

    response.on('end', function() {
      console.log(/* just newline */);
    });
  });
}

var req = request(url);

hookProgressBar(req);

req.pipe(file);

req.on('error', function(err) {
  file.close();
  console.error('\nDownload failed.');
  process.exit(-1);
});

req.on('end', function() {
  var fileContents = fs.readFileSync(platformZip);
  var zipped = new JSZip().load(fileContents).file(executable);

  try {
    fs.mkdirSync('bin');
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e;
    }
  }

  fs.writeFileSync('./bin/' + executable, zipped.asBinary(), {
    encoding: 'binary',
    mode: zipped.options.unixPermissions,
  });

  fs.unlinkSync(platformZip);
});