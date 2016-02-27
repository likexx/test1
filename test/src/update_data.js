'use strict';

var mongoose = require('mongoose');
var Journal = require('./model/journal');
var Promise = require('bluebird');

mongoose.connect('mongodb://mongo:27017/test2');
mongoose.connection.on('error', () => logger.error('MongoDB Connection Error'));


var samplesTitles = [
    "hello world",
    "san francisco",
    "c++",
    "javascript",
    "python",
    "mongodb",
    "mysql",
    "cassandra",
    "hbase",
    "java"
];

Promise
.each(samplesTitles, (title)=>{

    var data ={
        title: title
    };

    return Journal
           .findOneAndUpdate({title: data.title}, data, {upsert:true, new: true})
           .then((result)=>{
              console.log("id=" + result.id);
              console.log("updated for title " + data.title);
           })

})
.catch(err=>{
    console.log(err);
})
.done(()=>{
    console.log('completed');
    process.exit();
})

