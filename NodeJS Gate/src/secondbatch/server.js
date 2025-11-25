import express from "express";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE_PATH = path.join(__dirname, "task.json");

app.get("/todos", async (req, res) => {
  try {
    const {status} = req.query
    if(status){
        const result = await fs.readFile(FILE_PATH, "utf-8");
        const data = JSON.parse(result);
        const filteredData = data.filter((item) => item.status === status);
        return res.status(200).json(filteredData);
    }

    const result = await fs.readFile(FILE_PATH, "utf-8");
    return res.status(200).json(JSON.parse(result));

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/todos", async (req, res) => {
  const { id, task, status } = req.body;
  try {
    if (!id || !task || !status) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const data = await fs.readFile(FILE_PATH, "utf-8");
    const newTask = data ? JSON.parse(data) : [];

    newTask.push({ id, task, status });
    await fs.writeFile(FILE_PATH, JSON.stringify(newTask));
    return res.status(201).json({ id, task, status });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get('/todos/:id',async (req,res)=>{
    try {
        const {id} = req.params
        const result = JSON.parse(await fs.readFile(FILE_PATH, "utf-8"));
        const filteredData = result.find((item) => item.id === id);
        if(!filteredData){
            return res.status(404).json({message:"Task not found"})
        }
        return res.status(200).json(filteredData);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
})


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
