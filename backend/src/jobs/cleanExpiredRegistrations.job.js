// cleanExpiredRegistrations.job.js
import  registrationRepository  from '../modules/registrations/registration.repository.js';
import { paymentRepository } from '../modules/payments/payment.repository.js';
import { registrationService } from '../modules/registrations/registration.service.js';
import { PAYMENT_STATUSES } from '../constants/user.constants.js';
import mongoose from 'mongoose';

const cleanExpiredRegistrations = async () => {
    console.log('[Job] Running cleanExpiredRegistrations...');
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const expiredRegistrations = await registrationRepository.findExpiredPendingRegistrations(session);

        for (const registration of expiredRegistrations) {
            console.log(`[Job] Expiring registration: ${registration._id}`);
            // Update registration status
            await registrationService.expireRegistration(registration._id, session);

            // Update associated payment status
            const payment = await paymentRepository.findByRegistrationId(registration._id, session);
            if (payment && payment.paymentStatus === PAYMENT_STATUSES.CREATED) { // Only update if still CREATED (i.e., not paid)
                payment.paymentStatus = PAYMENT_STATUSES.EXPIRED;
                await payment.save({ session });
                console.log(`[Job] Expired associated payment: ${payment._id}`);
            }
        }
        await session.commitTransaction();
        console.log(`[Job] Cleaned up ${expiredRegistrations.length} expired registrations.`);
    } catch (error) {
        await session.abortTransaction();
        console.error('[Job] Error in cleanExpiredRegistrations job:', error);
    } finally {
        session.endSession();
    }
};

export { cleanExpiredRegistrations };
