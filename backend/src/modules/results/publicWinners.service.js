/**
  publicWinners.service.js
  Fetches winners for a hackathon from the immutable Result snapshot model.
  Uses the service layer so filtering, population, and sort logic is shared.
 */
import resultService from './result.service.js';

class PublicWinnersService {
  async getWinners(hackathonId) {
    const fallback = {
      hackathonId,
      winners: [],
      summary: { winnersCount: 0 },
    };

    try {
      // Use the service-layer method that returns only published snapshots,
      // sorted by rank, with user/team already populated.
      const winners = await resultService.getPublishedResults(hackathonId);

      return {
        hackathonId,
        winners,
        summary: { winnersCount: winners.length },
      };
    } catch (err) {
      console.error(`Error fetching winners for hackathon ${hackathonId}:`, err);
    }

    return fallback;
  }
}

export default new PublicWinnersService();
