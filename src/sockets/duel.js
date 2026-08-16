// TODO: real-time duel socket handlers, to be wired into server.js via socket.io
// once the REST duel flow (duelRoutes.js/duelController.js) is fleshed out.
//
// Planned events:
// - 'join-duel'     (client -> server): opponent joins a pending Duel room by duelId
// - 'submit-answer'  (client -> server): player submits an answer during the duel
// - 'duel-finished'  (server -> clients): final scores/winner broadcast to both players
//
// Requires adding the `socket.io` package and attaching it to the http server
// created in server.js (currently only app.listen is used).
