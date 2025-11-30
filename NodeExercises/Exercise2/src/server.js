import express from "express"
import path from "path"
import { promises as fs } from "fs"
import { fileURLToPath } from "url"

const filename = fileURLToPath(import.meta.url)
const dirname =  path.dirname(filename)

const app = express()

app.get("/",async (_, res)=>{
    try {
        const raw = await fs.readFile(path.join(dirname, "input.txt"),"utf-8");
        if (!raw) {
            res.status(200).send("File is Empty")
        }
        res.status(200).send(raw)
    } catch (error) {
        res.status(500).send("Internal Server Error")
        console.log("Error: "+error.message)
    }
})

app.post("/",async (req, res)=>{
    try {
        const {text} = req.body
        if (!text) {
            res.status(400).send("The Text is Empty")
            return
        }
        await fs.writeFile(path.join(dirname,"output.txt"), text, "utf-8")
        res.send(text)
    } catch (error) {
        res.status(500).send("Internal Server Error")
        console.log("Error: "+error.message)
    }
})

app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})