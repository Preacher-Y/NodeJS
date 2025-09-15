const express = require('express')
const app = express();
const path = require('path')

// register view engine
app.set('view engine', "ejs")

// setting a new root dir for the ejs cause by the default i checks in the views folder
app.set('views',path.join(__dirname,'./'))

// we use express cause it makes the life easy
// we don't need to do the switch 
// we don't need to explicitly tell return type of the response, it implicitly handles it

app.listen(3000)

app.get('/',(req,res)=>{
    const projects = [
        {title:'Analytics Dashboard', description:'Role‑based insights with charts, filters, and exports..', tools:['React','Node','PostgreSQL']},
        {title:'Realtime Chat', description:'WebSocket-based messaging with typing indicators.', tools:['TypeScript','WebSocket','Redis']},
        {title:'E‑Commerce API', description:'Orders, payments, and inventory with clean docs.', tools:['Node','Express','stripe']},
        {title:'Ansys Receipt Manager', description:'OCR based, retrieving the data from the receipt and exporting the to excel', tools:['React','Supabase','Express','Mindee']},
        {title:'GlobalRoots', description:'Connect Diaspora mentor and Youth in Rwanda, LinkedIn Profile based.', tools:['React','Python','Express','EmailJS']},
        {title:'Chef Claude', description:'AI based Chef, providing recipe from the given ingredients', tools:['React','TailwindCSS','TypeScript','Anthropic']}
        
    ]
    res.render('index',{name : 'Yves', fullName: 'Yves Sheja N M ', projects})
})
app.get('/project',(req,res)=>{
    res.render('project')
})

app.get('/about',(req,res)=>{
    res.redirect('/project')
})

app.use((req,res)=>{
    res.status(404).sendFile('./404.html',{root: __dirname})
})

// Any function that runs between the 