// notes about this whole concept
// the server folder dailyChallenge needs to have a no cache policy for .txt files in the .htaccess file
// a the generateDailyFile.py script has to run every night. the ftp credentials have to be kept up-to-date

async function readDailyChallengeFile(callback) {
  var date = new Date();
  var month = ('0' + (date.getMonth() + 1)).slice(-2);
  var day = ('0' + date.getDate()).slice(-2);
  var year = date.getFullYear();
  var filename = 'dailyChallenge' + month + day + year + '.txt';

  try {
    if (typeof caches !== 'undefined') {
      await caches.open('my-cache').then(function (cache) {
        cache.delete('dailyChallengeSeeds/' + filename).then(function (response) {
          note('The cache has been deleted for: ' + filename);
        });
      });
    }
  } catch (_error) {
    error(_error);
  }

  try {
    const response = await fetch('dailyChallengeSeeds/' + filename);
    if (!response.ok) {
      callback(null);
      return;
    }
    const text = await response.text();
    callback(text, 'File found: ' + filename);
  } catch (error) {
    callback(null, 'File not found: ' + filename);
    // error
  }
}
