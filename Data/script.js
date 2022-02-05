import sqlite3  from 'sqlite3';
import { readFile } from 'fs/promises';
const json = JSON.parse(
  await readFile(
    new URL('./lc.json', import.meta.url)
  )
);

var title = [];
var likes = [];
var difficulty = [];

for(var i=0; i<json.data.problemsetQuestionList.questions.length; i++){
  title.push(json.data.problemsetQuestionList.questions[i].title);
  likes.push(json.data.problemsetQuestionList.questions[i].likes);
  difficulty.push(json.data.problemsetQuestionList.questions[i].difficulty);
}

console.log(title);
console.log(likes);
console.log(difficulty);

let db = new sqlite3.Database('./Leecode.db', (err) => {
    if (err) {
        return console.error(err.message); 
    }
    console.log('Connected to the in-memory SQlite database.');
});


db.run(`CREATE TABLE IF NOT EXISTS lc (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    difficulty TEXT,
    likes INTEGER)`, (err) => {
    if (err) {
        return console.log(err.message);
    }
    console.log('Table created');
});

db.serialize(function() {
    db.run("begin transaction");
    for (var i = 0; i < json.data.problemsetQuestionList.questions.length; i++) {
        db.run("insert into lc(title, difficulty, likes) values (?, ?, ?)", title[i], difficulty[i], likes[i]);
    }
    db.run("commit");
});


db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Close the database connection.');
});