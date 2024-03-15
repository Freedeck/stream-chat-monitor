const path = require("path");
const Plugin = require(path.resolve('./src/classes/Plugin'));

class HAFreedeck extends Plugin {
    statesToTrack = ['my.room.temperature'];
    token = '';
    url = 'http://localhost:8123/';
    constructor() {
        // With JS Hooks, you must keep the ID of your plugin the name of the source folder.
        super('Home Assistant: Freedeckified', 'Freedeck', 'HAFreedeck', false);
    }

    onInitialize () {
        console.log('Initialized HAF.')
        this.setJSServerHook("haf/server.js");
        this.setJSClientHook("haf/client.js");
        this.setJSSocketHook("haf/socket.js");
        
        const token = this.getFromSaveData("token");
        if(token == undefined || token == "") {
            console.log("No token found, please enter your token in the settings.")
            this.setToSaveData('token', '');
            return false;
        }
        const url = this.getFromSaveData("url");
        if(url == undefined || url == "http://localhost:8123/") {
            console.log("No URL found, please enter your Home Assistant URL in the settings.")
            this.setToSaveData('url', 'http://localhost:8123/');
            return false;
        }
        const statesToTrack = this.getFromSaveData("statesToTrack");
        if(statesToTrack == undefined || statesToTrack == ['my.room.temperature']) {
            console.log("No states to track found, please enter the states you want to track in the settings.")
            this.setToSaveData('statesToTrack', ['my.room.temperature']);
            return false;
        }

        console.log('Connecting to Home Assistant...')
        fetch(url+"api/", {
            headers: {
                Authorization: "Bearer "+token,
                "Content-Type": "application/json"
            }
        }).then(res => res.text()).then(data => {
            console.log('Connected to Home Assistant!');
        }).catch(err => {
            console.error('Failed to connect to Home Assistant:', err);
            return false;
        });

        statesToTrack.forEach(state => {
            this.registerNewType(state, state);
        })

        // This is all you need to do. Freedeck will do all of the logic for you.
        
        setInterval(() => {
            this.stateLoop(token, url, statesToTrack);
        }, this.getFromSaveData("updateInterval") || 1000);
        
        return true;
    }

    stateLoop(t, u ,s) {
        s.forEach(state => {
            fetch(u+"api/states/" + state, {
                headers: {
                    Authorization: "Bearer " + t,
                    "Content-Type": "application/json"
                }
            }).then(res => res.json()).then(data => {
                this.stateChange({
                    wanted: data.entity_id,
                    state: data.attributes.friendly_name +": " + data.state + data.attributes.unit_of_measurement
                })
            });
        })
    }

    stateChange(changeData) {}
}

module.exports = {
	exec: () => new HAFreedeck(),
 	class: HAFreedeck
}