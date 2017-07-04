'use strict';

const express = require('express');
const app = express();

const cfenv = require('cfenv');
const appEnv = cfenv.getAppEnv();
const url = appEnv.getServiceURL('mymongo', {
  url: 'uri',
  auth: ['username', 'password']
});

app.get('/', (req, res) => {
  res.send(`Hello with service ${url}`);
});

app.listen(appEnv.port, appEnv.bind, () => {
  console.log(`Sample app listening on ${appEnv.url}`);
});

