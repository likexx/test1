'use strict'

const Promise = require('bluebird');
const Journal = require('../../model/journal');
const redis = require('redis');


var redisClient = redis.createClient(6379, "redis");


//
// get all journals
//
exports.getJournals = function(req, res, next) {


    Journal
    .find({})
    .then(journals=>{
        var result = [];
        
        journals.forEach((journal)=>{
            result.push(journal.toJSON());
        })

        res.json({
            data: result
        });
    })
    .catch(err=>{
        res.json(err);
    })


}


//
// create new journal document
//
exports.createJournal = function(req, res, next) {

    var title = req.body.title;
    if (!title) {
        res.status(500).end("error");
    }

    var journal = {
        title: title
    };

    Journal
    .create(journal)
    .then(()=>{
        res.json({
            message: "ok"
        });
    })
    .catch(err=>{
        res.json(err);
    })

}

//
// find journal document by id
//
exports.getJournalById = function(req, res, next) {

    var journalId = req.params.journal_id;

    Journal
    .findOne({_id: journalId})
    .then(result => {
        res.json({
            data: result.toJSON()
        });
    })
    .catch(err=>{
        res.json(err);
    })


}

//
// update journal document by id
//
exports.updateJournalById = function(req, res, next) {

    var journalId = req.params.journal_id;

    Journal
    .findOne({_id: journalId})
    .then(result=>{
        if (!result) {
            res.status(500).json({
                error:"not found"
            })
            return;
        }

        return result.update(req.body);
    })
    .then(()=>{
        res.json({
            message: "ok"
        });
    })
    .catch(err=>{
        res.status(500).json({

        })
    })

}

//
// delete journal document by id
//
exports.deleteJournalById = function(req, res, next) {

    var journalId = req.params.journal_id;

    Journal
    .remove({
        _id: journalId
    })
    .then(()=>{
        res.json({
            message: "ok"
        })
    })
    .catch(err=>{
        res.status(500).json({
            err
        })
    })

}

//
// get suggestion based on user input. using redis to speed up 
//
exports.getSuggestions = function(req, res, next) {


    var searchKey = req.params.key;

    if (!searchKey || searchKey.length < 2) {
        res.json([]);
        return;
    };

    // key in redis cache
    var autocompletionKey = `autocompletion:${searchKey}`;

    // first search redis cache
    redisClient
    .getAsync(autocompletionKey)
    .catch(err=>{
        // just log err and continue. should NOT be blocked by redis error
        console.log('redis error', err);
    })
    .then(result=>{

        if (result) {
            // read from redis
            console.log('get from redis');
            res.json({
                data: JSON.parse(result)
            });
            return;

        } 

        Journal
        .find({title: new RegExp(searchKey, 'i')})
        .limit(100)   // limit the result size
        .then(journals=>{
            var result = [];
            
            journals.forEach((journal)=>{
                // need to convert to pure json
                result.push(journal.toJSON());
            })


            res.json({
                data: result
            });

            // save result to redis and mark its ttl to 60 seconds
            redisClient
            .setAsync(autocompletionKey, JSON.stringify(result))
            .then(result=>{
                redisClient.expire(autocompletionKey, 60);
            })

        })
        .catch(err=>{
            console.log(err);
            res.json(err);
        })

    })

}

