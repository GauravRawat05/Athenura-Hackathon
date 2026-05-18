import Result from './result.model.js';
import Hackathon from '../admin/hackathons/hackathon.model.js';
import publishResultsJob from '../../jobs/publishResults.job.js';

export const publishFinalResults = async (hackathonId, draftResults) => {
  // Update all drafts for this hackathon to be published
  await Result.updateMany(
    { hackathonId, isPublished: false },
    { $set: { isPublished: true } }
  );

  await Hackathon.findByIdAndUpdate(hackathonId, { resultsPublished: true });

  const resultsData = draftResults.map(draft => {
    const data = draft.toObject ? draft.toObject() : draft;
    return { ...data, isPublished: true };
  });

  publishResultsJob(hackathonId, resultsData);

  return resultsData;
};
