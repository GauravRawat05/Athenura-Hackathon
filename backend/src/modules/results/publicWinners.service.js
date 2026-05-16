/**
 * publicWinners.service.js
 * Service to fetch winners for a hackathon (winners only).
 */
import resultRepository from "./result.repository.js";

class PublicWinnersService {
  async getWinners(hackathonId) {
    // Fallback shape (until DB/query implementation is finalized)
    const fallback = {
      hackathonId,
      winners: [],
      summary: { winnersCount: 0 },
    };

    try {
      // Fetch only published results marked as winners
      const allResults = await resultRepository.findByHackathonId(hackathonId);
      
      const winnersOnly = allResults.filter(
        (r) => r.isPublished && (r.isWinner || r.rank <= 3)
      );

      return {
        hackathonId,
        winners: winnersOnly,
        summary: { winnersCount: winnersOnly.length },
      };
    } catch (err) {
      // Ignore and return fallback; endpoint should still be functional.
      console.error(`Error fetching winners for hackathon ${hackathonId}:`, err);
    }

    return fallback;
  }
}

export default new PublicWinnersService();
