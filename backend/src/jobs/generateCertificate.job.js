import puppeteer from 'puppeteer';
import ejs from 'ejs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { uploadToCloudinary } from '../config/cloudinary.js';
import User from '../modules/users/user.model.js';
import Hackathon from '../modules/admin/hackathons/hackathon.model.js';
import Submission from '../modules/submissions/submission.model.js';
import Result from '../modules/results/result.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateCertificateJob = async (hackathonId, resultsData) => {
  console.log(`[Job] generateCertificate started for hackathon ${hackathonId}`);

  let browser;
  let successCount = 0;
  let failCount = 0;

  try {
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      console.error(`[Job Error] Hackathon not found: ${hackathonId}`);
      return;
    }

    const templatePath = path.join(__dirname, '../templates/certificates/hackathonCertificate.ejs');
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Certificate template not found at ${templatePath}`);
    }

    const templateContent = fs.readFileSync(templatePath, 'utf8');

    const tempDir = path.join(__dirname, 'temp_certificates');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: 'new'
    });
    const page = await browser.newPage();

    for (const result of resultsData) {
      try {
        const user = await User.findById(result.userId);
        if (!user) {
          throw new Error(`User not found: ${result.userId}`);
        }

        const submission = result.submissionId 
          ? await Submission.findById(result.submissionId) 
          : null;

        const templateData = {
          userName: user.fullName || user.userName || 'Participant',
          hackathonTitle: hackathon.title,
          submissionTitle: submission ? submission.title : 'N/A',
          rank: result.rank,
          awardCategory: result.awardCategory,
          date: new Date().toLocaleDateString()
        };

        const htmlContent = ejs.render(templateContent, templateData);
        
        // Reusing the same page instance for efficiency
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        
        const pdfFileName = `cert_${hackathonId}_${result.userId}.pdf`;
        const pdfPath = path.join(tempDir, pdfFileName);
        
        await page.pdf({
          path: pdfPath,
          format: 'A4',
          landscape: true,
          printBackground: true
        });

        const uploadResult = await uploadToCloudinary(pdfPath, {
          folder: `certificates/${hackathonId}`,
          public_id: `cert_${result.userId}`,
          resource_type: 'raw'
        });

        await Result.findOneAndUpdate(
          { userId: result.userId, hackathonId: hackathonId },
          { 
            certificateUrl: uploadResult.secure_url,
            certificateStatus: 'completed',
            errorMessage: null
          }
        );

        if (fs.existsSync(pdfPath)) {
          fs.unlinkSync(pdfPath);
        }

        successCount++;
        console.log(`[Job Success] Certificate generated for ${user.email}`);
      } catch (innerError) {
        failCount++;
        console.error(`[Job Error] Certificate failure for user ${result.userId}:`, innerError.message);
        
        await Result.findOneAndUpdate(
          { userId: result.userId, hackathonId: hackathonId },
          { 
            certificateStatus: 'failed',
            errorMessage: innerError.message
          }
        );
      }
    }
  } catch (error) {
    console.error('[Job Error] generateCertificateJob critical failure:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
    console.log(`[Job Finished] generateCertificate: ${successCount} succeeded, ${failCount} failed.`);
  }
};

export default generateCertificateJob;
