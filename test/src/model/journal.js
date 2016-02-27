'use strict'

var mongoose = require('mongoose')

var Schema = mongoose.Schema
var Types = mongoose.Types

var schema = new mongoose.Schema({
    title: {type: String,index: true}

},{ timestamps: { 
    createdAt: 'created',
    updatedAt: 'updated' 
} 
})

//
//  use document _id as the journal's unique id.
//  we need to explicitly do the conversion since mongoosejs has its own "id" field
//
schema.options.toJSON = {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

module.exports = mongoose.model('Journal', schema)
