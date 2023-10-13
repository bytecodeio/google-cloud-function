const express = require('express');
const app = express();
const json = require('./acoustic-atom-309118-478915387056.json')
const fs = require('fs')
const { Storage } = require("@google-cloud/storage");
const bodyParser = require('body-parser')

const storage = new Storage();
    storage.authClient.jsonContent = json
    storage.projectId = 'acoustic-atom-309118'


app.get('/folders', async (req,res) => {
    let [bucket] = await storage.bucket('acoustic-atom-309118.appspot.com').getFiles()
    let folders = bucket.map(f => {return f['name']})
    res.send(folders)
})

app.post('/uploadFile', bodyParser.json(), async (req,res) => {
    let fileName = req.body['name'];
    let oFile = req.body['file'];
    var regex = /^data:.+\/(.+);base64,(.*)$/;
    let matches = oFile.match(regex);
    let folder = req.body['folder']
    let buffer = Buffer.from(matches[2],'base64')
     let bucket = await storage.bucket('acoustic-atom-309118.appspot.com');
     const file = bucket.file(`${folder}${fileName}`);
     const myStream = file.createWriteStream();
     myStream.write(buffer)
     myStream.end();
    res.send("success")
})

exports.cloud = app;