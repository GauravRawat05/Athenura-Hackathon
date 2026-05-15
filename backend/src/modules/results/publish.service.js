import resultRepository from './result.repository.js';
import Hackathon from '../admin/hackathons/hackathon.model.js';
import publishResultsJob from '../../jobs/publishResults.job.js';

export const publishFinalResults = async (hackathonId, rankedResults) => {
  const resultsData = rankedResults.map(res => ({
    userId: res.userId,
    hackathonId,
    teamId: res.teamId,
    submissionId: res.submissionId,
    rank: res.rank,
    score: res.aggregatedScore,
    awardCategory: res.rank === 1 ? 'First Prize' : res.rank === 2 ? 'Second Prize' : res.rank === 3 ? 'Third Prize' : 'Participant',
    award: res.rank <= 3 ? 'Winner' : 'Participant',
    isWinner: res.rank <= 3,
    isPublished: true
  }));

  await resultRepository.deleteByHackathonId(hackathonId);
  await resultRepository.bulkCreate(resultsData);
  await Hackathon.findByIdAndUpdate(hackathonId, { resultsPublished: true });
  publishResultsJob(hackathonId, resultsData);

  return resultsData;
};
