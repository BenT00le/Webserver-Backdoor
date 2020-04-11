const EventEmitter = require('events');

//create emmiter class
class EmitTest extends EventEmitter {}

//init emmiter
const test = new EmitTest();

//event listener

//when thing is emmited fire callback to do other thing
test.on('thing1', () => console.log('thing1 fired'));

test.on('thing2', () => console.log('thing2 fired'));

// trigger event

test.emit('thing1');

test.emit('thing2');

test.emit('thing1');

test.emit('thing2');