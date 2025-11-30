import express from "express"
import {promises as fs} from "fs"
import path, { parse } from "path"
import { fileURLToPath } from "url"

const app = express()
app.use(express.json())

const filedir = fileURLToPath(import.meta.url)
const dirname = path.dirname(filedir)

app.get("/items",async (req, res) => {
    try{
        const { category, price } = req.query;

        const results = await fs.readFile( path.join(dirname, "items.json"),"utf-8")

        if (price && category){
            const data = JSON.parse(results)
            const parsedPrice = Number(price)
            const filtered = data.filter(el=>el.category===category && el.price === parsedPrice)
            if(filtered.length == 0){
                return res.status(200).send("Not Found")
            }
            return res.status(200).json(filtered)
        }

        if (category) {
            const data = JSON.parse(results)
            const filtered = data.filter(el=>el.category === category)
            if(filtered.length == 0){
                return res.status(200).send("Not Found")
            }
            return res.status(200).json(filtered)
        }

        if(price){
            const data = JSON.parse(results)
            const parsedPrice = Number(price)
            const filtered = data.filter(el=>el.price === parsedPrice)
            if(filtered.length == 0){
                return res.status(200).send("Not Found")
            }
            return res.status(200).json(filtered)
        }


        if (!results) {
            results.status(400).send("File is Empty")
            return
        }
        const data = JSON.parse(results)
        return res.status(200).json(data)
    } catch (error) {
        console.error(error)
        return res.status(500).send("Internal Server Error ...")
    }
})

app.get("/items/:id", async (req, res)=>{
    try {
        const {id}  =  req.params
        const data = await fs.readFile(path.join(dirname, "items.json"),"utf-8");
        const parsedData = JSON.parse(data)
        const filtered = parsedData.find(el=>el.id = id );

        if(filtered.length == 0){
            return res.status(200).json({message: "Not Found ..."})
        }
        return res.status(200).json(filtered)
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error ...")
    }
})

app.post("/items", async (req, res)=>{
    try {
        const {id, name, seller, price, category} = req.body
        if(!id || !name || !seller || !price || !category){
            return res.status(400).json({message: "All field must be filled"})
        }
        const data = await fs.readFile(path.join(dirname, "items.json"),"utf-8")
        const parsedData = JSON.parse(data)
        parsedData.push({
            id,
            name,
            seller,
            price,
            category,
        })

        await fs.writeFile(path.join(dirname,"items.json"),JSON.stringify(parsedData),"utf-8")
        return res.status(200).json({id, name, seller, price, category})

    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error ..."})
    }
})


app.listen(3000,()=>console.log(`Server is running on port ${3000}`))