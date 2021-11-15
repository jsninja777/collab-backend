const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const lastMutationSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  index: {
    type: Number
  },
  length:{
    type:Number
  },
  text: {
    type: String
  },
  author: {
    type: String,
  },
  origin: {
    alice: Number,
    bob: Number
  }
});


const originSchema =new Schema({
  alice: {
    type: Number,
    default:0
  },
  bob: {
    type: Number,
    default:0
  },
});


const conversationSchema = new Schema({
  id: {
   type: String,
   default: Date.now
 },
 text: {
   type: String
 },
 lastMutation:{
   type: lastMutationSchema
 }
});



const dataSchema =new Schema({
  type: {
    type: String,
    required: true
  },
  index: {
    type: Number
  },
  length: {
    type: Number
  },
  text: {
    type: String
  }
});


const mutationSchema = new Schema({
  author: {
    type: String,
    required: true
  },
  origin: {
    type: originSchema
  },
  conversationId:{
    type: String,
    required: true
  },
  data:{
    type: dataSchema
  }
});

module.exports.mutationSchema = mutationSchema;
module.exports.conversationSchema = conversationSchema;
