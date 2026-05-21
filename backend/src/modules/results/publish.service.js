import Result from './result.model.js';
import Hackathon from '../admin/hackathons/hackathon.model.js';
import publishResultsJob from '../../jobs/publishResults.job.js';

/**
 * publishFinalResults — final side-effect step after the DB transaction has committed.
 * Must be called AFTER the transaction so that certificate generation / emails
 * can be retried if they fail without corrupting the main DB state.
 */
export const publishFinalResults = async (hackathonId, insertedResults) => {
  // Bulk mark all published Result records for this hackathon
  await Result.updateMany(
    { hackathonId, isPublished: false },
    { $set: { isPublished: true } }
  );

  await Hackathon.findByIdAndUpdate(hackathonId, { resultsPublished: true });

  // Format for the job: plain JS objects the job can serialise / attach to messages
  const resultsData = insertedResults.map(r => ({
    _id: r._id,
    userId: r.userId,
    hackathonId: r.hackathonId || hackathonId,
    submissionId: r.submissionId,
    rank: r.rank,
    score: r.score,
    awardCategory: r.awardCategory,
    award: r.award,
    isWinner: r.isWinner,
    isPublished: true
  }));

  // Fire-and-forget — the job handles its own errors.
  // IMPORTANT: this must be called AFTER session.commitTransaction() has succeeded
  // so that the job (certificate generation, emails) does not hold a DB write lock.
  publishResultsJob(hackathonId, resultsData).catch(err => {
    console.error('publishResultsJob failed after publish:', err.message);
  });

  return resultsData;
};
