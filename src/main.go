package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

// structure of this is:
// {
//	chatID: {
//		*websocket.Conn: bool
//	}
//}

var clients = make(map[string]map[*websocket.Conn]bool) // connected clients. Nested Maps chat ID to the connections
var broadcast = make(chan Message)                      // broadcast channel

var upgrader = websocket.Upgrader{}

// Message defines the structure of messages expected from the client
type Message struct {
	Signal  string  `json:"signal"`
	ChatID  string  `json:"chatID"`
	Content Content `json:"content"`
}

// Content defines the structure of the json message content
type Content struct {
	Email     string    `json:"email"`
	Username  string    `json:"username"`
	Message   string    `json:"message"`
	ChatOwner bool      `json:"chatOwner"`
	Time      time.Time `json:"time"`
}

func main() {
	// Create a simple file server
	fs := http.FileServer(http.Dir("../public"))
	http.Handle("/", fs)

	// Configure websocket route
	http.HandleFunc("/ws", handleConnections)

	go handleMessages()

	// Start the server on localhost port 8000 and log any errors
	log.Println("http server started on :8000")
	err := http.ListenAndServe(":8000", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	// Upgrade initial GET request to a websocket
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}
	// Make sure we close the connection when the function returns
	defer ws.Close()

	// Register our new client

	for {
		var msg Message
		// Read in a new message as JSON and map it to a Message object
		err := ws.ReadJSON(&msg)
		if err != nil {
			log.Printf("error: %v", err)
			break
		}
		//initialize the new chat map if it doesn't exist.
		if _, ok := clients[msg.ChatID]; !ok {
			clients[msg.ChatID] = make(map[*websocket.Conn]bool)
		}
		clients[msg.ChatID][ws] = true
		// Send the newly received message to the broadcast channel
		broadcast <- msg
	}
}

func handleMessages() {
	for {
		// Grab the next message from the broadcast channel
		msg := <-broadcast
		// Send it out to every client for a specific chat.
		chatClients := clients[msg.ChatID]
		for client := range chatClients {
			err := client.WriteJSON(msg)
			if err != nil {
				log.Printf("error: %v", err)
				client.Close()
				delete(chatClients, client)
			}
		}
	}
}
