import Duel from '../models/Duel.js';

// Real-time duel socket handlers, wired into server.js via socket.io.
//
// Events:
// - 'join-duel'     (client -> server): { duelId, userId } - client joins the duel's room
// - 'submit-answer' (client -> server): { duelId, userId, isCorrect, finished } - player
//     submits an answer; live scores are broadcast to the room
// - 'score-update'  (server -> clients): { scores } - broadcast after each answer
// - 'duel-finished'  (server -> clients): { scores, winnerId, status } - broadcast once
//     both players have finished the question set
// - 'duel-error'     (server -> client): { message }

const roomFinishState = new Map(); // duelId -> Set of userIds who have finished

export const registerDuelHandlers = (io) => {
  io.on('connection', (socket) => {
    socket.on('join-duel', async ({ duelId, userId }) => {
      try {
        if (!duelId || !userId) {
          socket.emit('duel-error', { message: 'duelId and userId are required' });
          return;
        }

        const duel = await Duel.findById(duelId);
        if (!duel) {
          socket.emit('duel-error', { message: 'Duel not found' });
          return;
        }

        socket.join(duelId);
        socket.data.duelId = duelId;
        socket.data.userId = userId;

        if (duel.status === 'pending') {
          duel.status = 'active';
          await duel.save();
        }

        io.to(duelId).emit('score-update', { scores: duel.scores });
      } catch (err) {
        socket.emit('duel-error', { message: 'Failed to join duel' });
      }
    });

    socket.on('submit-answer', async ({ duelId, userId, isCorrect, finished }) => {
      try {
        const duel = await Duel.findById(duelId);
        if (!duel) {
          socket.emit('duel-error', { message: 'Duel not found' });
          return;
        }

        const isChallenger = duel.challengerId.toString() === userId;
        const isOpponent = duel.opponentId.toString() === userId;

        if (!isChallenger && !isOpponent) {
          socket.emit('duel-error', { message: 'You are not a participant in this duel' });
          return;
        }

        // Atomic $inc rather than read-modify-save: two players can submit
        // answers in the same instant, and a save-based update would let one
        // overwrite the other's increment (lost update).
        let scores = duel.scores;
        if (isCorrect) {
          const incField = isChallenger ? 'scores.challenger' : 'scores.opponent';
          const updated = await Duel.findByIdAndUpdate(duelId, { $inc: { [incField]: 1 } }, { new: true });
          scores = updated.scores;
        }

        io.to(duelId).emit('score-update', { scores });

        if (finished) {
          if (!roomFinishState.has(duelId)) {
            roomFinishState.set(duelId, new Set());
          }
          const finishedSet = roomFinishState.get(duelId);
          finishedSet.add(userId);

          const bothFinished = finishedSet.has(duel.challengerId.toString()) && finishedSet.has(duel.opponentId.toString());

          if (bothFinished) {
            // Aggregation-pipeline update: winnerId is computed from the scores
            // in the same atomic operation that flips status, so there is no
            // read-then-write gap for a concurrent increment to land in.
            // The status:{$ne:'completed'} filter also guarantees only one of
            // the two "both finished" checks actually performs the transition.
            const completedDuel = await Duel.findOneAndUpdate(
              { _id: duelId, status: { $ne: 'completed' } },
              [
                {
                  $set: {
                    status: 'completed',
                    winnerId: {
                      $cond: [
                        { $gt: ['$scores.challenger', '$scores.opponent'] },
                        '$challengerId',
                        {
                          $cond: [{ $gt: ['$scores.opponent', '$scores.challenger'] }, '$opponentId', null],
                        },
                      ],
                    },
                  },
                },
              ],
              { new: true }
            );

            if (completedDuel) {
              io.to(duelId).emit('duel-finished', {
                scores: completedDuel.scores,
                winnerId: completedDuel.winnerId,
                status: completedDuel.status,
              });
            }

            roomFinishState.delete(duelId);
          }
        }
      } catch (err) {
        socket.emit('duel-error', { message: 'Failed to submit answer' });
      }
    });

    socket.on('disconnect', () => {});
  });
};

export default registerDuelHandlers;
