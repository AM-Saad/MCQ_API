const http = require('http');
const url = require('url');
const Question = require("./models/Question").Question;

module.exports = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true);

    // Check if the request is preflight 
    if (req.method === 'OPTIONS') {
        var headers = {};

        headers["Access-Control-Allow-Origin"] = "*";
        headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
        headers["Access-Control-Allow-Credentials"] = false;
        headers["Access-Control-Max-Age"] = '86400'; // 24 hours
        headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
        res.writeHead(200, headers);
        res.end();
    } else {
        // allow access form all origins
        res.setHeader('X-Frame-Options', 'ALLOWALL');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, GET, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')



        // Post Question Endpoint
        if (reqUrl.pathname == '/questions' && req.method === 'POST') {
            const body = ''
            let parsedBody;

            // add the data to body variable
            req.on('data', function (data) {

                body += data
            })

            req.on('end', function () {

                // parse the body to json
                parsedBody = JSON.parse(body)

                // Create new question
                const newQuetions = new Question({
                    questionNo: parsedBody.questionNo,
                    question: parsedBody.question,
                    answers: parsedBody.answers,
                    correct_answer: parsedBody.correct_answer
                });

                newQuetions.save()
                    .then(result => {
                        // return the new question
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Question created successfully', newQuetions: newQuetions }));
                    }).catch(error => {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: '500 internal server error' }));
                    })
            })



        }


        // Qyestions Endpoint
        if (reqUrl.pathname == '/questions' && req.method === 'GET') {

            // Get all questions
            Question.fetchAll()
                .then(questions => {

                    // shuffle the questions array
                    const shuffled = questions.sort(() => Math.random() - 0.5)

                    //  Trimed the questions to only 5 questions
                    shuffled.length = 5

                    // return the qeustions
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(shuffled));
                }).catch(error => {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: '500 internal server error' }));
                })
        }


    }

});