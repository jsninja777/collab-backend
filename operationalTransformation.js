var bobCounter = 0;
var aliceCounter = 0;
var origin = [bobCounter, aliceCounter];

const updateOrigin = (author) => {
  if(author == 'bob'){
    bobCounter++;
    origin[0] = bobCounter;
  };
  if(author == 'alice'){
    aliceCounter++;
    origin[1] = aliceCounter;
  };
};

const getOrigin = () => {
  return origin;
};

const performUpdate = (conversation, author, data) => {
  updateOrigin(author.toLowerCase());
  let newConversation = conversation;
  if (data.type === 'insert') {
    newConversation = conversation.slice(0, data.index)
                    + data.text
                    + conversation.slice(data.index)
  } else if (data.type === 'delete') {
    newConversation = conversation.slice(0, data.index)
                    + conversation.slice(data.index + data.length)
  }
  return newConversation;
};

module.exports.performUpdate = performUpdate;
module.exports.getOrigin = getOrigin;
