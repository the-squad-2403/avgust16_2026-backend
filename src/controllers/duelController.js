// TODO: implement duel challenge logic against the Duel model
// Real-time play during a duel is handled separately in sockets/duel.js

export const createDuelChallenge = async (req, res, next) => {
  // TODO: implement - create a pending Duel between the current user and opponent
  res.status(501).json({ message: 'Not implemented' });
};

export const getDuelById = async (req, res, next) => {
  // TODO: implement - return a single Duel by :id
  res.status(501).json({ message: 'Not implemented' });
};
