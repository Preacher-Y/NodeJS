import express from 'express'

const app = express()

function requestLogger(req,res,next){
    const start = Date.now()
    res.on('finish',()=>{
        const duration = Date.now() - start
        const timestamp = new Date().toISOString()
        console.log(`[${timestamp}] ${req.method} ${req.url} - ${duration}ms`)
    })
    next()
}

app.use(requestLogger)

app.get('/',(req,res)=>{
    res.send('Hello World')
})

app.get("/user",(req,res)=>{
    res.json({name:"John Doe",email:"john@gamil.com"})
})

app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})