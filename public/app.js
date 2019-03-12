const vueInstance = new Vue({
    el: '#app',

    data: {
        selected: null,
        ws: null, // Our websocket
        newMsg: '', // Holds new messages to be sent to the server
        chatContent: '', // A running list of chat messages displayed on the screen
        email: null, // Email address used for grabbing an avatar
        username: null, // Our username
        joined: false, // True if email and username have been filled in
        chatID: null, // Attempt to add private chat
        chatOwner: false // Tracks if the current user is the owner.
    },

    created: function() {
        var self = this;
        this.ws = new WebSocket('ws://' + window.location.host + '/ws');
        this.ws.addEventListener('message', function(e) {
            var msg = JSON.parse(e.data);
            var content = msg.content;
            switch (msg.signal) {
                case 'joined':
                    self.chatContent += `<div class="notification-container">
                    <span>${content.username} joined the chat.</span>
                    </div>`;
                    break;
                case 'created':
                    self.chatContent += `<div class="notification-container">
                    <span>${content.username} created this chat.</span>
                    </div>`;
                    break;
                case 'message':
                    self.chatContent += 
                    `<div class="chat-container ${content.email === self.email ? '' : 'reverse'}">
                        <div class="gravatar-container">
                            <div class="chip">
                                <img src=${self.gravatarURL(content.email)}>
                                ${content.username}
                             </div>
                            <span class="time">${new Date(content.time).toLocaleTimeString()}</span>
                        </div>
                        <div class="message ${content.email === self.email ? '' : 'reverse'}">
                            <span class="content">${emojione.toImage(content.message)}</span>
                        </div>
                    </div>`; 
                    break;
            }
            var element = document.getElementById('chat-messages');
            element.scrollTop = element.scrollHeight; // Auto scroll to the bottom
        });
    },

    methods: {
        send: function () {
            if (this.newMsg != '') {
                this.ws.send(
                    JSON.stringify({
                        signal: 'message',
                        content: {
                            email: this.email,
                            username: this.username,
                            message: $('<p>').html(this.newMsg).text(), // Strip out html
                            chatOwner: this.chatOwner,
                            time: new Date()
                        },
                        chatID: this.chatID
                    }
                ));
                this.newMsg = ''; // Reset newMsg
            }
        },

        select: function(selection) {
            this.selected = selection;
        },
        join: function () {
            if (!this.email) {
                Materialize.toast('You must enter an email', 2000);
                return
            }
            if (!this.username) {
                Materialize.toast('You must choose a username', 2000);
                return
            }
            if (!this.chatID) {
                Materialize.toast('You must choose an existing chat.', 2000);
                return
            }
            this.chatID = this.chatID;
            this.email = $('<p>').html(this.email).text();
            this.username = $('<p>').html(this.username).text();
            this.joined = true;

            this.ws.send(
                JSON.stringify({
                    signal: 'joined',
                    content: {
                        email: this.email,
                        username: this.username,
                        message: "",
                        time: new Date()
                    },
                    chatID: this.chatID
                }
            ));
        },

        create: function () {
            if (!this.email) {
                Materialize.toast('You must enter an email', 2000);
                return
            }
            if (!this.username) {
                Materialize.toast('You must choose a username', 2000);
                return
            }
            
            this.chatID = this.chatID || Math.random().toString(36).substr(2, 12);
            this.email = $('<p>').html(this.email).text();
            this.username = $('<p>').html(this.username).text();
            this.joined = true;
            this.chatOwner = true;

            this.ws.send(
                JSON.stringify({
                    signal: 'created',
                    content: {
                        email: this.email,
                        username: this.username,
                        message: "",
                        time: new Date()
                    },
                    chatID: this.chatID
                }
            ));
        },

        gravatarURL: function(email) {
            return 'http://www.gravatar.com/avatar/' + CryptoJS.MD5(email);
        }
    }
});