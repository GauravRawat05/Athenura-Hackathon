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
import Team from '../modules/teams/team.model.js';
import Certificate from '../modules/certificates/certificate.model.js';

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
      // Identify all recipients for this result (solo or team members)
      let recipientIds = [result.userId];
      if (result.teamId) {
        try {
          const team = await Team.findById(result.teamId);
          if (team) {
            recipientIds = team.members
              .filter(m => m.invitationStatus === 'accepted')
              .map(m => m.userId);
          }
        } catch (teamErr) {
          console.error(`[Job Error] Failed to expand team members for notification:`, teamErr.message);
        }
      }

      const submission = result.submissionId 
        ? await Submission.findById(result.submissionId) 
        : null;

      for (const recipientId of recipientIds) {
        try {
          const user = await User.findById(recipientId);
          if (!user || !user.email) {
            console.warn(`[Job Warning] Recipient not found or has no email: ${recipientId}`);
            continue;
          }

          // Fetch individual certificate for this user (could be Winner or Participation)
          // We look for the one generated in this publish cycle
          const certificate = await Certificate.findOne({
            userId: recipientId,
            hackathonId: hackathonId,
            isDeleted: false,
            generationStatus: 'completed'
          }).sort({ createdAt: -1 }); // Get the latest one

          const templateData = {
            userName: user.fullName || user.userName || 'Participant',
            hackathonTitle: hackathon.title,
            submissionTitle: submission ? submission.title : 'N/A',
            rank: result.rank,
            awardCategory: result.awardCategory,
            certificateUrl: certificate ? certificate.certificateUrl : null,
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

          sentCount++;
          console.log(`[Job Success] Notification sent to ${user.email}`);
        } catch (innerError) {
          failCount++;
          console.error(`[Job Error] Notification failure for user ${recipientId}:`, innerError.message);
        }
      }

      // Update the main Result record status (tracks the submission-level notification)
      await Result.findByIdAndUpdate(result._id, { notificationStatus: 'sent' });
    }
  } catch (error) {
    console.error('[Job Error] sendResultNotificationJob critical failure:', error);
  } finally {
    console.log(`[Job Finished] sendResultNotification: ${sentCount} individual emails sent, ${failCount} failed.`);
  }
};

export default sendResultNotificationJob;
