import ejs from 'ejs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { brevoClient } from '../config/mail.js';
import envConfig from '../config/envConfig.js';
import User from '../modules/users/user.model.js';
import Hackathon from '../modules/admin/hackathons/hackathon.model.js';
import Submission from '../modules/submissions/submission.model.js';
import Result from '../modules/results/result.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendResultNotificationJob = async (hackathonId, resultsData) => {
  console.log(`[Job] sendResultNotification started for hackathon ${hackathonId}`);

  let sentCount = 0;
  let failCount = 0;

  try {
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      console.error(`[Job Error] Hackathon not found: ${hackathonId}`);
      return;
    }

    const templatePath = path.join(__dirname, '../templates/emails/resultNotification.ejs');
    if (!fs.existsSync(templatePath)) {
      console.error(`[Job Error] Email template not found at ${templatePath}`);
      return;
    }

    const templateContent = fs.readFileSync(templatePath, 'utf8');

    for (const result of resultsData) {
      try {
        const user = await User.findById(result.userId);
        if (!user || !user.email) {
          throw new Error(`User not found or has no email: ${result.userId}`);
        }

        const submission = result.submissionId 
          ? await Submission.findById(result.submissionId) 
          : null;

        const templateData = {
          userName: user.fullName || user.userName || 'Participant',
          hackathonTitle: hackathon.title,
          submissionTitle: submission ? submission.title : 'N/A',
          rank: result.rank,
          score: result.score,
          awardCategory: result.awardCategory,
          // Only pass certificate URL if it was successfully generated
          certificateUrl: result.certificateStatus === 'completed' ? result.certificateUrl : null,
          resultsLink: `${envConfig.clientUrl}/hackathons/${hackathonId}/results`
        };

        const htmlContent = ejs.render(templateContent, templateData);

        await brevoClient.post('/smtp/email', {
          sender: { 
            name: envConfig.appName || 'Athenura', 
            email: envConfig.brevoSenderEmail 
          },
          to: [{ email: user.email, name: user.fullName }],
          subject: `Results are out for ${hackathon.title}!`,
          htmlContent: htmlContent
        });

        await Result.findOneAndUpdate(
          { userId: result.userId, hackathonId: hackathonId },
          { notificationStatus: 'sent' }
        );

        sentCount++;
        console.log(`[Job Success] Notification sent to ${user.email}`);
      } catch (innerError) {
        failCount++;
        console.error(`[Job Error] Notification failure for user ${result.userId}:`, innerError.message);
        
        await Result.findOneAndUpdate(
          { userId: result.userId, hackathonId: hackathonId },
          { 
            notificationStatus: 'failed',
            errorMessage: result.errorMessage 
              ? `${result.errorMessage} | Email Error: ${innerError.message}` 
              : `Email Error: ${innerError.message}`
          }
        );
      }
    }
  } catch (error) {
    console.error('[Job Error] sendResultNotificationJob critical failure:', error);
  } finally {
    console.log(`[Job Finished] sendResultNotification: ${sentCount} sent, ${failCount} failed.`);
  }
};

export default sendResultNotificationJob;
