// registration.service.js
import { Registration } from './registration.model.js';
import registrationRepository  from './registration.repository.js';
import { paymentService } from '../payments/payment.service.js';
import { paymentRepository } from '../payments/payment.repository.js';
import  hackathonRepository  from '../hackathons/hackathon.repository.js';
import teamRepository  from '../teams/team.repository.js';
import userRepository  from '../users/user.repository.js';
import ApiError from '../../libs/apiError.js';
import mongoose from 'mongoose';
import { REGISTRATION_STATUSES, PAYMENT_STATUSES } from '../../constants/user.constants.js';
import envConfig from '../../config/envConfig.js';

const REGISTRATION_EXPIRY_MINUTES = 30;

class RegistrationService {
    async initiateHackathonRegistration(userId, hackathonId, registrationType, teamId, internDetails) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const hackathon = await hackathonRepository.findById(hackathonId);
            if (!hackathon) {
                throw new ApiError(404, 'Hackathon not found.');
            }
            // Registration is allowed if status is 'upcoming' or 'ongoing'
            // if (!['upcoming', 'ongoing'].includes(hackathon.status)) {
            //     throw new ApiError(400, 'Registration is not open for this hackathon.');
            // }
            if (new Date() > hackathon.registrationDeadline) {
                throw new ApiError(400, 'Registration deadline has passed for this hackathon.');
            }

            const existingRegistration = await registrationRepository.findByUserAndHackathon(userId, hackathonId);
            if (existingRegistration) {
                if (existingRegistration.registrationStatus === REGISTRATION_STATUSES.CONFIRMED) {
                    throw new ApiError(400, 'You are already registered and paid for this hackathon.');
                } else if (existingRegistration.registrationStatus === REGISTRATION_STATUSES.PENDING_PAYMENT) {
                    // Update registration if type or team changed
                    let needsUpdate = false;
                    let newAmount = existingRegistration.amount;

                    if (existingRegistration.registrationType !== registrationType) {
                        existingRegistration.registrationType = registrationType;
                        needsUpdate = true;
                    }
                    if (registrationType === 'team' && String(existingRegistration.teamId) !== String(teamId)) {
                        existingRegistration.teamId = teamId;
                        needsUpdate = true;
                    }

                    if (needsUpdate) {
                        if (registrationType === 'solo') newAmount = hackathon.soloFee || 0;
                        else if (registrationType === 'intern') newAmount = hackathon.internFee || 0;
                        else if (registrationType === 'team') newAmount = hackathon.teamFee || 0;
                        
                        existingRegistration.amount = newAmount;
                        await Registration.updateOne(
                            { _id: existingRegistration._id },
                            { $set: { 
                                registrationType: existingRegistration.registrationType,
                                teamId: existingRegistration.teamId,
                                amount: existingRegistration.amount
                            } },
                            { session }
                        );
                    }

                    let payment = existingRegistration.paymentId 
                        ? await paymentRepository.findById(existingRegistration.paymentId, session) 
                        : await paymentRepository.findByRegistrationId(existingRegistration._id, session);
                        
                    // If the expected amount doesn't match the existing payment, force recreation
                    const expectedAmountInPaise = newAmount * 100;
                    if (payment && payment.amount !== expectedAmountInPaise) {
                        payment = null; // Trigger creation of a new payment record
                    }

                    if (!payment && newAmount > 0) {
                        // Self-healing: create the missing/updated payment record
                        const amountInPaise = newAmount * 100;
                        const currency = existingRegistration.currency || hackathon.currency || 'INR';
                        
                        payment = await paymentService.createPaymentRecord({
                            registrationId: existingRegistration._id,
                            amount: amountInPaise,
                            currency: currency,
                            paymentStatus: PAYMENT_STATUSES.CREATED,
                            razorpayOrderId: `temp_${new mongoose.Types.ObjectId().toString()}`,
                        }, session);

                        existingRegistration.paymentId = payment._id;
                        await Registration.updateOne({ _id: existingRegistration._id }, { $set: { paymentId: payment._id } }, { session });

                        const razorpayOrder = await paymentService.createRazorpayOrder(amountInPaise, currency, payment._id.toString());
                        payment.razorpayOrderId = razorpayOrder.id;
                        await payment.save({ session });
                    }

                    if (payment && payment.paymentStatus !== PAYMENT_STATUSES.COMPLETED) {
                        return {
                            registrationId: existingRegistration._id,
                            orderId: payment.razorpayOrderId,
                            amount: payment.amount,
                            currency: payment.currency,
                            razorpayKey: envConfig.razorpayKeyId,
                            requiresPayment: true,
                        };
                    } else if (!payment && newAmount === 0) {
                        // Handle transition to a free mode
                        existingRegistration.registrationStatus = REGISTRATION_STATUSES.CONFIRMED;
                        existingRegistration.confirmedAt = new Date();
                        await Registration.updateOne(
                            { _id: existingRegistration._id }, 
                            { $set: { registrationStatus: REGISTRATION_STATUSES.CONFIRMED, confirmedAt: existingRegistration.confirmedAt } }, 
                            { session }
                        );
                        return {
                            registrationId: existingRegistration._id,
                            requiresPayment: false,
                        };
                    }
                }
                throw new ApiError(400, `Your previous registration is ${existingRegistration.registrationStatus}. Cannot proceed.`);
            }

            let team = null;
            if (registrationType === 'team') {
                if (!teamId) {
                    throw new ApiError(400, 'Team ID is required for team registrations.');
                }
                team = await teamRepository.findById(teamId);
                if (!team) {
                    throw new ApiError(404, 'Team not found.');
                }
                if (!team.hackathonId.equals(hackathonId)) {
                    throw new ApiError(400, 'Team does not belong to this hackathon.');
                }
                if (team.members.length < hackathon.minTeamSize || team.members.length > hackathon.maxTeamSize) {
                    throw new ApiError(400, `Team must have between ${hackathon.minTeamSize} and ${hackathon.maxTeamSize} members.`);
                }
                const userIsTeamMember = team.members.some(
                    (member) => member.userId.equals(userId) && member.status === 'accepted'
                );
                if (!userIsTeamMember) {
                    throw new ApiError(403, 'You are not an active member of this team.');
                }
                for (const member of team.members) {
                    const memberRegistration = await registrationRepository.findByUserAndHackathon(member.userId, hackathonId);
                    if (memberRegistration) {
                        throw new ApiError(400, `Team member ${member.userId} is already registered for this hackathon.`);
                    }
                }
            } else if (teamId) {
                throw new ApiError(400, 'Team ID is not allowed for solo or intern registrations.');
            }

            if (registrationType === 'intern') {
                if (!internDetails.isIntern && (!internDetails.internProofUrl && !internDetails.universityEmail)) {
                    throw new ApiError(400, 'Intern registration requires confirmation or proof (document/university email).');
                }
            }

            let calculatedAmount = 0;
            const currency = hackathon.currency || 'INR';

            if (registrationType === 'solo') {
                calculatedAmount = hackathon.soloFee || 0;
            } else if (registrationType === 'intern') {
                calculatedAmount = hackathon.internFee || 0;
            } else if (registrationType === 'team') {
                calculatedAmount = hackathon.teamFee || 0;
            } else {
                throw new ApiError(400, 'Invalid registration type.');
            }

            // --- 6. Create Registration Record ---
            const expiresAt = new Date(Date.now() + REGISTRATION_EXPIRY_MINUTES * 60 * 1000);
            const registrationData = {
                userId,
                hackathonId,
                teamId: registrationType === 'team' ? team._id : null,
                registrationType,
                amount: calculatedAmount,
                currency,
                registrationStatus: calculatedAmount > 0 ? REGISTRATION_STATUSES.PENDING_PAYMENT : REGISTRATION_STATUSES.CONFIRMED,
                expiresAt: calculatedAmount > 0 ? expiresAt : null,
                confirmedAt: calculatedAmount > 0 ? null : new Date(),
            };

            const [newRegistration] = await registrationRepository.createRegistration(registrationData, session);

            let paymentResult = { requiresPayment: false };

            if (calculatedAmount > 0) {
                const amountInPaise = calculatedAmount * 100;
                // --- 7. Create Payment Record (only for paid) ---
                const newPayment = await paymentService.createPaymentRecord({
                    registrationId: newRegistration._id,
                    amount: amountInPaise,
                    currency: currency,
                    paymentStatus: PAYMENT_STATUSES.CREATED,
                    razorpayOrderId: `temp_${new mongoose.Types.ObjectId().toString()}`,
                }, session);

                newRegistration.paymentId = newPayment._id;
                await newRegistration.save({ session });

                const razorpayOrder = await paymentService.createRazorpayOrder(amountInPaise, currency, newPayment._id.toString());
                newPayment.razorpayOrderId = razorpayOrder.id;
                await newPayment.save({ session });

                console.log('[DEBUG] Razorpay Order Created:', razorpayOrder);
                paymentResult = {
                    registrationId: newRegistration._id,
                    orderId: razorpayOrder.id,
                    amount: razorpayOrder.amount,
                    currency: razorpayOrder.currency,
                    razorpayKey: envConfig.razorpayKeyId,
                    requiresPayment: true,
                };
                console.log('[DEBUG] Payment Result:', paymentResult);
            } else {
                // Payment result for free hackathon
                paymentResult = {
                    registrationId: newRegistration._id,
                    requiresPayment: false,
                };
            }

            await session.commitTransaction();
            return paymentResult;

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async getRegistrationById(registrationId, session) {
        const registration = await registrationRepository.findById(registrationId, session);
        if (!registration) {
            throw new ApiError(404, 'Registration not found.');
        }
        return registration;
    }

    async confirmRegistration(registrationId, session) {
        const registration = await registrationRepository.findById(registrationId, session);
        if (!registration) {
            throw new ApiError(404, 'Registration not found.');
        }
        if (registration.registrationStatus === REGISTRATION_STATUSES.CONFIRMED) {
            return registration;
        }
        registration.registrationStatus = REGISTRATION_STATUSES.CONFIRMED;
        registration.confirmedAt = new Date();
        await registration.save({ session });
        return registration;
    }

    async failRegistration(registrationId, session) {
        const registration = await registrationRepository.findById(registrationId, session);
        if (!registration) {
            throw new ApiError(404, 'Registration not found.');
        }
        if (registration.registrationStatus === REGISTRATION_STATUSES.CONFIRMED) {
            return registration;
        }
        registration.registrationStatus = REGISTRATION_STATUSES.FAILED;
        await registration.save({ session });
        return registration;
    }

    async expireRegistration(registrationId, session) {
        const registration = await registrationRepository.findById(registrationId, session);
        if (!registration) {
            throw new ApiError(404, 'Registration not found.');
        }
        if (registration.registrationStatus === REGISTRATION_STATUSES.CONFIRMED) {
            return registration;
        }
        registration.registrationStatus = REGISTRATION_STATUSES.EXPIRED;
        await registration.save({ session });
        return registration;
    }

    async getUserRegistrations(userId) {
        return await Registration.find({ userId }).populate('hackathonId');
    }
}

export const registrationService = new RegistrationService();