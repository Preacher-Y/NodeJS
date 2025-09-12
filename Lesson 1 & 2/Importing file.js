const {arr1,arr2} = require('./2')

console.log(`Files from 2.js:`,arr1,",",arr2)

console.log("Absolute path for the directory: "+__dirname) // the absolute path for the directory
console.log("Absolute path for the file: "+__filename) // Absolute path for the file

const os = require('os')

console.log(JSON.stringify(os.networkInterfaces,null,2))