/**
 * This JS Socket hook will run on every socket connection.
 * Think of it like this: io.on('connection', (socket) => { 
 * 	(Companion/Freedeck built-in event handlers..)
 * 	(Your code)
 * });
 */

module.exports = (socket, io, instance) => {
	instance.stateChange = (data) => {
		socket.emit('haf.statechange', data);
	}
}