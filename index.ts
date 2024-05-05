const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');

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
