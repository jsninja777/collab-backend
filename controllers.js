const mongoose = require('mongoose');
const models = require('./models');
const operationalTransformation = require('./operationalTransformation');

const Mutation = mongoose.model('Mutation', models.mutationSchema);
const Conversation = mongoose.model('Conversation', models.conversationSchema);

const ping = (req, res) => {
  res.status(200).send({
    'ok': true,
    'msg': 'pong'});
};

const getInfo = (req, res) => {
    res.status(200).send({
      'ok': true,
      'author': {
        'email': 'carlwang122@gmail.com',
        'name': 'Carl Wang'
      },
      'frontend': {
        'url': ''
      },
      'language': 'node.js',
      'sources': 'https://github.com/jsninja777/collab-backend',
      'answers': {
        '1': "My approach started with drawing out how I believed the algorithm should work and breaking it down into cases based on the examples. I used that to design and implement the database schema which I chose to do in MongoDB because it is flexible and easy to change the schema if needed.",
        '2': 'If I had more time, I would add support conflict cases. I would learn about serverless frameworks and implement one, because I think that my solution has scalability concerns.',
        '3': "I found this challenge to be an incredibly interesting puzzle, and I enjoyed working on it. I just wish that I had more time to finish. So if I were to add something to this challenge, it would be more time to work on it."
      }
    });
};

const postMutation = (req, res) => {
  if (Object.keys(req.body).length === 0) {
    res.status(400).send({
      'msg': '',
      'ok': false
    })
  } else {
    updateConversation(req.body.conversationId, req, res);
  }
};

const updateConversation = (id, req, res) => {
  Conversation.findOne({id}, (error, docs) => {
    if(error){
      res.status(400).send(error);
    } else {
      const data = req.body.data;
      const origin = req.body.origin;
      const author = req.body.author;
      let updateMutation = operationalTransformation.performUpdate(docs? docs.text:"", author, data);
      const lastMutation = {
        type: data.type,
        index: data.index,
        length: data.length,
        text: data.text,
        author: author,
        origin: origin
      }
      if (!docs) {
        var newConversation = new Conversation({
          id: id,
          text: updateMutation,
          lastMutation: lastMutation
        });
        newConversation.save((error, doc) => {
          if(error){
            // res.status(400).send(error);
            console.log(error);
          } else {
            createMutation(req, res, origin, id);
          }
        });
      } else {
        Conversation.updateOne(
          {id: id}, 
          {text: updateMutation, lastMutation: lastMutation}, 
          (error, doc) => {
            if(error){
              console.log(error);
            } else {
              console.log(doc);
              createMutation(req, res, origin, id);
            }
          }
        );
      }      
    };
  });
};

const createMutation = (req, res, origin, id) => {
  console.log("create mutation");
  let newMutation = new Mutation({
      author: req.body.author,
      origin: req.body.origin,
      conversationId: id,
      data: req.body.data
  });
  newMutation.save((error, doc) => {
    if(error){
      res.status(400).send(error);
    } else {
      getConversation(req, res);
    };
  });
};

const getConversations = (req, res) => {
  console.log("get");
  Conversation.find({}).sort({id: 'desc'}).exec((error, conversations) => {
    if (error) {
      res.status(400).send(error);
    } else {
      // console.log(conversations);
      res.status(200).send({
        ok: true,
        conversations
      });
    };
  });
};

const getConversation = (req, res) => {
  let id = req.params.conversationId || req.body.conversationId;
  Conversation.findOne({id}, (error, doc) => {
    if(error){
      res.status(400).send(error);
    } else {
      res.status(201).send({
        'msg': 'Mutation applied to conversation',
        'ok': true,
        'text': doc.text
      });
    };
  });
};

const deleteConversation = (req, res) => {
  Conversation.findOneAndDelete({id: req.params.conversationId}, (error, docs) => {
    if(error){
      res.status(400).send(error);
    } else {
      console.log(req.params.conversationId)
      res.status(200).json({ msg: 'message', ok: true })
    };
  });
};

module.exports.ping = ping;
module.exports.getInfo = getInfo;
module.exports.postMutation = postMutation;
module.exports.getConversation = getConversation;
module.exports.getConversations = getConversations;
module.exports.deleteConversation = deleteConversation;
