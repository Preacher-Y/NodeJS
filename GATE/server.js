const express = require('express')
const app = express()

const requestLogger  = (req, res, next)=>{
    const date = Date.now()
    req.on('finish',()=>{
        const end = Date.now() - date
        const timestamp = new Date().toISOString()
        console.log(`[${timestamp}] ${req.method} ${req.url} - ${end}ms`);
    })
    next()
}

app.use(requestLogger)

app.get("/",(_,res)=>{
    console.log('Something happened 😂')
    return res.status(200).json({message: "what"})
})

app.post("/user", (_, res)=>{
    try {
        console.log("Posting some users")
        return res.status(200).json({message:"ballala"})
    } catch (error) {
        console.log(error)
        return res.status(500).send("Internal ISsues")
    }
})

app.listen(3000, ()=>{
    console.log("Server in on port 300")
})