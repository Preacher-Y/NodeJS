require('dotenv').config();
const express = require('express')
const app = express();
const path = require('path')
const mysql = require('mysql2/promise');
// register view engine
app.set('view engine', "ejs")

// setting a new root dir for the ejs cause by the default i checks in the views folder
app.set('views',path.join(__dirname,'./'))

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