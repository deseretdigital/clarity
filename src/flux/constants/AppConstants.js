var keyMirror = require('keymirror');

module.exports = {

    ActionTypes: keyMirror({
        RECEIVE_RAW_CONTENT: null,
        CONTROLLER_LOADED: null
    }),

    PayloadSources: keyMirror({
        SERVER_ACTION: null,
        VIEW_ACTION: null
    })

};
