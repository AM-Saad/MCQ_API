const getDb = require("../util/db").getDb;
const mongodb = require("mongodb");

class Question {

    constructor({ questionNo, question, answers, correct_answer }) {
        this.questionNo = questionNo
        this.question = question;
        this.answers = answers;
        this.correct_answer = correct_answer
    }

    // Save method to add new question
    async save() {
        const db = getDb();
        return db.collection("questions").insertOne({ questionNo: this.questionNo, question: this.question, answers: this.answers, correct_answer: this.correct_answer });
    }

    // Fetch all method to get all the questions

    static fetchAll() {
        const db = getDb();
        return db.collection('questions').find().toArray()
    }


}


exports.Question = Question;

