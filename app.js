const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const request = require('request');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var object = {};

app.post('/', (req, res, next) => {
    object[req.body.id] = req.body.url;
    res.send('url store to object');
});

app.get('/:id', async (req, res, next) => {
    // res.send(object[req.params.id]);
    var response = [];
    const url = object[req.params.id];
    if (!url)
        return res.send();
    await asyncForEach(url, async (item, index) => {
        await urlRequest(item)
        .then(result => {
            response.push(result);
        })
        .catch(err => {
            console.log(err);
        });
    });
    res.send(response);
});

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
}

const urlRequest = (url) => {
    return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
            if (error) {
                reject(new Error(error));
            } else {
                resolve(response);
            }
        });
    });
}


module.exports = app;