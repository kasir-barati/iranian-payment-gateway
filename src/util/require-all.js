// // @ts-check
// const path = require('path');
// const { promises: readdir } = require('fs');

// /**
//  *
//  * @param {string} path absolute path
//  */
// async function requireAllJsFilesIn(path) {
//   let files = await readdir(path, {
//     encoding: 'utf8',
//     withFileTypes: true
//   });
//   files.forEach((file) => {
//     console.log(`require ${file}`);
//   })
// }
