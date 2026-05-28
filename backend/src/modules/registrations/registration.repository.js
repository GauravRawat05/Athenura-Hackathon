// registration.repository.js
import {Registration}  from './registration.model.js';

class RegistrationRepository {
    async createRegistration(data, session) {
        return await Registration.create([data], { session });
    }

    async findById(id, session) {
        return await Registration.findById(id).session(session);
    }

    async findByUserAndHackathon(userId, hackathonId, session) {
        return await Registration.findOne({ userId, hackathonId }).session(session);
    }

    async findExpiredPendingRegistrations(session) {
        return await Registration.find({
            registrationStatus: 'PENDING_PAYMENT',
            expiresAt: { $lt: new Date() },
        }).session(session);
    }
     async findUserRegistrationsWithDetails(userId, teamIds, filters = {}) {
    return await Registration.find({
      $or: [
        { userId },
        { teamId: { $in: teamIds } }
      ],
      ...filters
    })
      .populate('hackathonId')
      .populate('teamId')
      .populate({
        path: 'userId',
        select: '-password -refreshToken -emailOTP -emailVerificationToken'
      });
  }

    // You might add more specific update methods if needed,
    // or rely on fetching and then saving the model instance.
}

const registrationRepository = new RegistrationRepository();

export default registrationRepository;
