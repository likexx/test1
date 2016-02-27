
'use strict';

const express = require('express')
const api = require('./api/v1')

module.exports = function (app) {

    app.get('/v1/journals', api.getJournals);
    app.post('/v1/journals', api.createJournal);
    
    app.get('/v1/journals/:journal_id', api.getJournalById);
    app.put('/v1/journals/:journal_id', api.updateJournalById);
    app.delete('/v1/journals/:journal_id', api.deleteJournalById);

    app.get('/v1/journals/suggest/:key', api.getSuggestions);


    app.route('*')
        .all((req, res, next)=>{
            res.status(404).end('api not found');
        });

};

