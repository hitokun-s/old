var fs = require('fs');
fs.readdir('../img', function(err, files){
  if (err) throw err;
  var fileList = files.filter(function(file){
    return fs.statSync("../img/" + file).isFile() && !(/.*\.jpg$/.test(file)); //絞り込み
  })
  console.log(fileList);
  fileList.forEach(f => {
    fs.rename("../img/" + f, "../img/" + f.replace("JPG", "jpg"), function(err) {
      if ( err ) console.log('ERROR: ' + err);
    });
  })
});