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

schema.options.toJSON = {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

module.exports = mongoose.model('Journal', schema)