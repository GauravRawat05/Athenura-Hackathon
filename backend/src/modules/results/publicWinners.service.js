/**
 * publicWinners.service.js
 * Service to fetch winners for a hackathon (winners only).
 */
class PublicWinnersService {
  async getWinners(hackathonId) {
    // Fallback shape (until DB/query implementation is finalized)
    const fallback = {
      hackathonId,
      winners: [],
      summary: { winnersCount: 0 },
    };

    // Attempt to reuse existing (admin) result logic if it exists.
    try {
      const adminResultServiceModule = await import("../admin/results/adminResult.service.js");
      const adminResultService = adminResultServiceModule.default;

      if (adminResultService && typeof adminResultService.getHackathonResults === "function") {
        const resultsPayload = await adminResultService.getHackathonResults(hackathonId, {
          page: 1,
          limit: 100,
        });

        // Try to find winners data in common shapes.
        const candidate =
          resultsPayload?.summary?.winners ||
          resultsPayload?.winners ||
          resultsPayload?.data?.winners ||
          [];

        const winnersOnly = Array.isArray(candidate)
          ? candidate.filter((w) => {
              const awardCategory = w?.awardCategory || w?.certificateType || w?.category;
              return awardCategory === "winner" || w?.isWinner === true || w?.award === "winner";
            })
          : [];

        return {
          hackathonId,
          winners: winnersOnly,
          summary: { winnersCount: winnersOnly.length },
        };
      }
    } catch (err) {
      // Ignore and return fallback; endpoint should still be functional.
    }

    return fallback;
  }
}

export default new PublicWinnersService();
