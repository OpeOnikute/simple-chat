# GO Chat App
Basic Chat Application based on [this tutorial](https://scotch.io/bar-talk/build-a-realtime-chat-server-with-go-and-websockets).

Using as practice to implement web sockets in the [sgx game](https://github.com/OpeOnikute/project-ideas-and-specs/blob/master/ideas/sgx/sgx.md).

## How to run
- `go get github.com/gorilla/websocket`
- `cd src`
- `go run main.go`

## Practice list
- Implement private messaging. Broadcasts should only go out to clients with a specific chat ID.
- Add timestamps to the chat items.
- Investigate the emoji features.
- Add notifications on user actions. e.g. User joined chat, user left.
- Separate creating a chat from joining one.
- Add notifications for when a user tries to join a chat that doesnt exist.
- Add notification for when someone leaves the chat.
- End chat when the web socket connection closes.
- Investigate `error: websocket: close sent`

## PS
- Running from the base folder won't work, route serving the html assets uses relative paths to find them. So don't do `go run src/main.go`.
- Limited to users entering chat IDs they want to join because there's no persistence layer. Not planning to add one too.