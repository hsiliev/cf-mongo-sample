'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const cfenv = require('cfenv');
const appEnv = cfenv.getAppEnv();
const url = appEnv.getServiceURL('mymongo', {
  url: 'uri',
  auth: ['username', 'password']
});

const MongoClient = require('mongodb').MongoClient;
const extend = require('lodash').extend;

app.get('/', (req, res) => {
  res.send(`Hello with service ${url}`);
});

app.use(bodyParser.json());

app.post('/items/:itemName', (req, res) => {
  MongoClient.connect(url, function (err, db) {
    if (err)
      return res.status(500).send(err);

    const collection = db.collection('documents');
    collection.insertOne(extend(req.body, {
      _id: req.params.itemName
    }), (err, result) => {
      if (err)
        return res.status(500).send(err);
      res.status(201).location(`/items/${req.params.itemName}`).send(result);
      db.close();
    });
  });
});

app.get('/items/:itemName', (req, res) => {
  MongoClient.connect(url, function (err, db) {
    if (err)
      return res.status(500).send(err);

    const collection = db.collection('documents');
    collection.findOne({_id: req.params.itemName}, (err, result) => {
      res.send(result);
      db.close();
    });
  })
});

app.listen(appEnv.port, appEnv.bind, () => {
  console.log(`Sample app listening on ${appEnv.url}`);
});