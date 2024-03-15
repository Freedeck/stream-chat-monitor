const path = require("path");
const Plugin = require(path.resolve('./src/classes/Plugin'));
const {
    WebcastPushConnection
} = require('tiktok-live-connector');

class TTSC extends Plugin {
    tiktokStreamer = '';
    constructor() {
        // With JS Hooks, you must keep the ID of your plugin the name of the source folder.
        super('TikTok Stream Chat', 'Freedeck', 'TTStreamChat', false);
    }

    onInitialize() {
        const tiktokUsername = this.getFromSaveData("user");
        if (tiktokUsername == undefined || tiktokUsername == "") {
            console.log("[TikTok Stream Chat] No user found, please enter the username (no @) of the streamer's chat you want to monitor in the config.")
            this.setToSaveData('user', '');
            return false;
        }
        console.log('[TikTok Stream Chat] Initialized, connecting to @' + tiktokUsername + '\'s chat..')

        // Create a new wrapper object and pass the username
        let tiktokLiveConnection = new WebcastPushConnection(tiktokUsername);

        tiktokLiveConnection.connect().then(state => {
            console.info(`[TikTok Stream Chat] Connected to room ${state.roomId}`);
        }).catch(err => {
            console.error('Failed to connect', err);
        })

        tiktokLiveConnection.on('chat', data => {
            console.log(`${data.uniqueId} (userId:${data.userId}) writes: ${data.comment}`);
            this.pushNotification(`${data.userId} says: ${data.comment}`)
        })
        
        tiktokLiveConnection.on('gift', data => {
            console.log(`${data.uniqueId} (userId:${data.userId}) sends ${data.giftId}`);
            this.pushNotification(`${data.userId} gifted you a ${data.giftId}!`)
        })

        // ...and more events described in the documentation below
        return true;
    }
}

module.exports = {
    exec: () => new TTSC(),
    class: TTSC
}