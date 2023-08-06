async function readDailyChallengeFile(callback) {
  var date = new Date();
  var month = ('0' + (date.getMonth() + 1)).slice(-2);
  var day = ('0' + date.getDate()).slice(-2);
  var year = date.getFullYear();
  var filename = 'dailyChallenge' + month + day + year + '.txt';

  try {
    const response = await fetch('dailyChallenges/' + filename);
    if (!response.ok) {
      callback(null);
      return;
    }
    const text = await response.text();
    callback(text, 'File found: ' + filename);
  } catch (error) {
    callback(null, 'File not found: ' + filename);
    // error(error);
  }
}
