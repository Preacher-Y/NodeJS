const express = require('express')
const app = express();

// register view engine
app.set('view engine', "ejs")

// setting a new root dir for the ejs cause by the default i checks in the views folder
app.set('views',path.join(__dirname,'./'))

// we use express cause it makes the life easy
// we don't need to do the switch 
// we don't need to explicitly tell return type of the response, it implicitly handles it

app.listen(3000)

app.get('/',(req,res)=>{
    res.sendFile('./index.html',{root:__dirname})
})
app.get('/project',(req,res)=>{
    res.sendFile('./project.html',{root:__dirname})
})

app.get('/about',(req,res)=>{
    res.redirect('/project')
})

app.use((req,res)=>{
    res.status(404).sendFile('./404.html',{root: __dirname})
})
