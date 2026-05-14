/**
 * university.repository.js
 * Encapsulates database reads for university and its students.
 */
import User from '../users/user.model.js'
import Registration from '../registrations/registration.model.js'
import '../admin/hackathons/hackathon.model.js'

class UniversityRepository {
  async findUniversityById(userId) {
    return await User.findById(userId).select(
      'fullName email collegeOrUniversity graduationYear role createdAt updatedAt'
    )
  }

  async findStudentsByUniversityCollege({ collegeOrUniversity }) {
    return await User.find({
      collegeOrUniversity,
      role: 'User'
    })
      .select('fullName email collegeOrUniversity graduationYear skills role createdAt updatedAt')
      .lean()
  }

  async findStudentRegistrationsByStudentIds(studentIds) {
    if (!Array.isArray(studentIds) || studentIds.length === 0) return []

    return await Registration.find({
      participantIds: { $in: studentIds },
      status: { $ne: 'cancelled' }
    })
      .populate('hackathonId', 'title slug description startDate endDate')
      .lean()
  }
}

const universityRepository = new UniversityRepository()
export default universityRepository
