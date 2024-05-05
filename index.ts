const express = require('express');
const bodyParser = require('body-parser');

const sqlite3 = require('sqlite3').verbose();
const dbName = 'examPortal.db';

let db = new sqlite3.Database(dbName, (err: { message: any; }) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS exams (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            date TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            exam_id INTEGER NOT NULL,
            question_text TEXT NOT NULL,
            correct_answer TEXT NOT NULL,
            FOREIGN KEY (exam_id) REFERENCES exams(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS answers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            submitted_answer TEXT,
            FOREIGN KEY (question_id) REFERENCES questions(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);
});

const app = express();
app.use(bodyParser.json());

app.post('/register', (req: { body: { username: any; password: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: { error?: any; id?: any; }): void; new(): any; }; }; }) => {
    const { username, password } = req.body;
    const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
    db.run(sql, [username, password], function(err: { message: any; }) {
        if (err) {
            return res.status(400).send({ error: err.message });
        }
        res.status(201).send({ id: this.lastID });
    });
});

app.post('/create-exam', (req: { body: { title: any; description: any; date: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: { error?: any; id?: any; }): void; new(): any; }; }; }) => {
    const { title, description, date } = req.body;
    const sql = `INSERT INTO exams (title, description, date) VALUES (?, ?, ?)`;
    db.run(sql, [title, description, date], function(err: { message: any; }) {
        if (err) {
            return res.status(400).send({ error: err.message });
        }
        res.status(201).send({ id: this.lastID });
    });
});

app.post('/create-question', (req: { body: { exam_id: any; question_text: any; correct_answer: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: { error?: any; id?: any; }): void; new(): any; }; }; }) => {
    const { exam_id, question_text, correct_answer } = req.body;
    const sql = `INSERT INTO questions (exam_id, question_text, correct_answer) VALUES (?, ?, ?)`;
    db.run(sql, [exam_id, question_text, correct_answer], function(err: { message: any; }) {
        if (err) {
            return res.status(400).send({ error: err.message });
        }
        res.status(201).send({ id: this.lastID });
    });
});

app.post('/submit-answer', (req: { body: { user_id: any; question_id: any; submitted_answer: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: { error?: any; id?: any; }): void; new(): any; }; }; }) => {
    const { user_id, question_id, submitted_answer } = req.body;
    const sql = `INSERT INTO answers (user_id, question_id, submitted_answer) VALUES (?, ?, ?)`;
    db.run(sql, [user_id, question_id, submitted_answer], function(err: { message: any; }) {
        if (err) {
            return res.status(400).send({ error: err.message });
        }
        res.status(201).send({ id: this.lastID });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
