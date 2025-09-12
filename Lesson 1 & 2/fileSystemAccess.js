// To acces the file system we import it as module
const fs = require('fs')

//-------------------------------------------------------------------------------------------------------

// To read a file
fs.readFile('./doc/blog.txt',(err,data)=>{
    if(err) console.log(err);
    console.log(data.toString())
}) 
// this is an *Asynchronous* function 
// has three arguments, first is the file name (relative path) and second is the encoding type
// so it takes a callback function as the third argument
// the callback function has two arguments, first is the error and second is the data
// the Second and Third argument is optional

//------------------------------------------------------------------------------------------------------

// To write a file
fs.writeFile('./doc/blog.txt','Hello, My People',()=>{
    console.log('Done Writting the file')
})
// this is also an Asynchronous Function as well
// take three arguments, the first is the file name (Relative path) and the second one is the the text to write/add in
// the third is a callback and that runs after the file was changed
// same thing the third is optional
// and if the file doesn't exist it means that the file will be created

//-------------------------------------------------------------------------------------------------------

// To Create and Delete Directory

// existsSync this is use to check if the file exist and it take only paramenter and its synchronous
if (!fs.existsSync('./assests')) {
    fs.mkdir('./assests/src',{recursive:true},(err)=>{
        if(err) console.log(err);
        console.log('Folder Created')
    })
}else{
    fs.rmdir('./assests/',{recursive:true},(err)=>{
        if(err) console.log(err);
        console.log("Folder Deleted")  
    })
}
// so this is to both the mkdir and rmdir are used to create and delete respectively
// they all take three arguments such as 1. relative path to create the fike with its name,
// optional: 2. recusive (create nested folder) or mode, 3. Callback function
// these are also Asynchronous function 
// to make the Synchronous we use the *mkdirSync* and *rmdirSync*
// they also do take in in the same arguments

//-----------------------------------------------------------------------------------------------------

// To Delete a file
if (fs.existsSync('./doc/deleteme.txt')) {
    fs.unlink('./doc/deleteme.txt',(err)=>{
        if(err) console.log(err);
        console.log('File Removed')
    })
}
// so we use *unlink* to delete a specific file, it is Ansychronous
// it has two paramenters which are 1. relative path of the file, 2. the Callback function