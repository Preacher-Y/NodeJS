require('dotenv').config();
const express = require('express')
const app = express();
const path = require('path')
const mysql = require('mysql2/promise');
// register view engine
app.set('view engine', "ejs")

// setting a new root dir for the ejs cause by the default i checks in the views folder
app.set('views',path.join(__dirname,'./'))

// middleware to parse form data
app.use(express.urlencoded({ extended: true }))

// we use express cause it makes the life easy
// we don't need to do the switch 
// we don't need to explicitly tell return type of the response, it implicitly handles it

app.listen(3000)

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.id, p.title, p.description, s.skill
      FROM projects p
      LEFT JOIN skills s ON s.project_ID = p.id
      ORDER BY p.id;
    `);
    
    const projectsMap = new Map();
    rows.forEach(row => {
      if (!projectsMap.has(row.id)) {
        projectsMap.set(row.id, {
          title: row.title,
          description: row.description,
          tools: []
        });
      }
      if (row.skill) projectsMap.get(row.id).tools.push(row.skill);
    });

    const projects = Array.from(projectsMap.values());

    res.render('index', {
      name: 'Yves',
      fullName: 'Yves Sheja N M',
      projects
    });

  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).send('Error retrieving projects');
  }
});

app.get('/project',async (req,res)=>{

  const [rows] = await pool.query(`
      SELECT p.id, p.title, p.description, s.skill
      FROM projects p
      LEFT JOIN skills s ON s.project_ID = p.id
      ORDER BY p.id;
    `);
    
    const projectsMap = new Map();
    rows.forEach(row => {
      if (!projectsMap.has(row.id)) {
        projectsMap.set(row.id, {
          title: row.title,
          description: row.description,
          tools: []
        });
      }
      if (row.skill) projectsMap.get(row.id).tools.push(row.skill);
    });

    const projects = Array.from(projectsMap.values());

    res.render('project',{projects})
})

app.get('/about',(req,res)=>{
    res.redirect('/project')
})

app.get('/add-project',(req,res)=>{
    res.render('add-project')
})

app.get('/edit-project/:title',async(req,res)=>{
  const title = req.params.title;
  try{
    const [rows] = await pool.query('SELECT p.id, p.title, p.description, s.skill FROM projects p LEFT JOIN skills s ON s.project_ID = p.id WHERE p.title = ?',[title]);
    if(rows.length === 0) return res.status(404).send('Project not found');
    const project = {
      id: rows[0].id,
      title: rows[0].title,
      description: rows[0].description,
      tools: rows.filter(r => r.skill).map(r => r.skill)
    };
    res.render('edit-project',{project});
  }catch{
    res.status(500).send('Server Error');
  }
})

app.post('/add-project', async (req,res)=>{
    const { title, description, tools } = req.body;
    
    try {
        // Insert project
        const [result] = await pool.query(
            'INSERT INTO projects (title, description) VALUES (?, ?)',
            [title, description]
        );
        
        const projectId = result.insertId;
        
        // Insert skills/tools
        if (tools && tools.trim()) {
            const toolsArray = tools.split(',').map(tool => tool.trim()).filter(tool => tool);
            for (const tool of toolsArray) {
                await pool.query(
                    'INSERT INTO skills (project_ID, skill) VALUES (?, ?)',
                    [projectId, tool]
                );
            }
        }
        
        res.redirect('/project');
    } catch (err) {
        console.error('Error adding project:', err);
        res.status(500).send('Error adding project');
    }
})

app.delete('/:title',async(req,res)=>{
  const title = req.params.title;
  try {
    const [result] = await pool.query('DELETE FROM projects WHERE title = ?',[title]);
    if(result.affectedRows==0) return res.status(404).json({error:`No Project Found with ${title}`});
    res.json({message: 'Project Delete'});
  } catch{
    res.status(404).json({error: 'Server Error'})
  }
})

app.get('/api/project/:title',async(req,res)=>{
  const title = req.params.title;
  try{
    const [rows] = await pool.query('SELECT p.id, p.title, p.description, s.skill FROM projects p LEFT JOIN skills s ON s.project_ID = p.id WHERE p.title = ?',[title]);
    if(rows.length === 0) return res.status(404).json({error:`No Project "${title}" Found`});
    const project = {
      id: rows[0].id,
      title: rows[0].title,
      description: rows[0].description,
      tools: rows.filter(r => r.skill).map(r => r.skill)
    };
    res.json(project);
  }catch{
    res.status(500).json({error:'Server Error'});
  }
})

app.use((req,res)=>{
    res.status(404).sendFile('./404.html',{root: __dirname})
})

// Any function that runs between the 
