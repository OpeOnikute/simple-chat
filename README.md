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