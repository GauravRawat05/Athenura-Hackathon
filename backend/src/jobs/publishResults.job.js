import sendResultNotificationJob from './sendResultNotification.job.js';
import generateCertificateJob from './generateCertificate.job.js';
import Result from '../modules/results/result.model.js';

const publishResultsJob = async (hackathonId, resultsData) => {
  console.log(`[Main Job] Starting publication process for hackathon: ${hackathonId}`);
  const startTime = Date.now();

  try {
    // 1. Generate certificates first
    console.log('[Main Job] Step 1/2: Generating certificates...');
    await generateCertificateJob(hackathonId, resultsData);
    
    // 2. Fetch fresh results from DB to get the generated certificate URLs and statuses
    console.log('[Main Job] Step 2/2: Sending notifications...');
    const updatedResults = await Result.find({ hackathonId });
    
    // 3. Send notifications
    await sendResultNotificationJob(hackathonId, updatedResults);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[Main Job] Publication process completed in ${duration}s for hackathon ${hackathonId}`);

  } catch (error) {
    console.error('[Main Job Critical Error]:', error);
  }
};

export default publishResultsJob;
