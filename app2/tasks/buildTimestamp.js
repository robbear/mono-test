const fs = require('fs');

// Return a compact timestamp we can use in cache-busting URLs.
function timestamp() {

  function twoDigits(n) {
    return n.toString().padStart(2, '0');
  }

  const date = new Date();
  const year = date.getFullYear();
  const month = twoDigits(date.getMonth() + 1);
  const day = twoDigits(date.getDate());
  const hour = twoDigits(date.getHours());
  const minute = twoDigits(date.getMinutes());
  const second = twoDigits(date.getSeconds());

  return `${year}${month}${day}${hour}${minute}${second}`;
}

async function buildTimestamp() {
  const timeStamp = timestamp();

  const wrapperTemplate = `
//
// timestamp.js
//
// This is a generated file. Do not modify.
// Generated on ${timeStamp}
//

module.exports = '${timeStamp}';
`;

  await fs.promises.writeFile('client/generated/timestamp.js', wrapperTemplate);
}

buildTimestamp();
