import io from "socket.io-client";

const MESSAGE_TYPES = {
  ONLINE_CLIENTS: "ONLINE_CLIENTS",
  CHALLENGE_REQUEST: "CHALLENGE_REQUEST",
  START_GAME: "START_GAME"
}

export default class Socket {
  constructor(query, testLocally = false) {
    this.MESSAGE_TYPES = MESSAGE_TYPES;

    const connectionString = testLocally 
      ? "http://localhost:3002"
      : "https://dry-ocean-39738.herokuapp.com";
      
    this.socket = io.connect(connectionString, query);
  }

  registerHandler(onMessageReceived) {
    this.socket.on("message", onMessageReceived);
  }

  submitChallenge(user, opponentId) {
    this.socket.emit("submitChallenge", {
      opponentId: opponentId,
      userId: user._id,
      username: user.username,
      userElo: user.elo
    });        
  }

  acceptChallenge(userId, opponentId) {
    this.socket.emit("acceptChallenge", {
      userId: userId,
      opponentId: opponentId
    });        
  }

  updateScore(progress, room, userId) {
    this.socket.emit("updateScore", {
      progress: progress,
      room: room,
      userId: userId
    });    
  }

  initiateRandomGame(user, opponentId) {
    this.socket.emit("initiateRandomGame", {
      user: user,
      opponentId: opponentId
    });    
  }  
}
