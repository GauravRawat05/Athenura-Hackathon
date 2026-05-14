/**
 * university.service.js
 * Contains the core business rules for university endpoints.
 */
import ApiError from '../../libs/apiError.js'
import { userRoles } from '../users/user.constants.js'
import universityRepository from './university.repository.js'

class UniversityService {
  async getMe(universityUser) {
    const me = await universityRepository.findUniversityById(universityUser._id)
    if (!me) {
      throw new ApiError(404, 'University not found')
    }

    if (me.role !== userRoles.UNIVERSITY) {
      // Defensive check: only university accounts can access this endpoint
      throw new ApiError(403, 'Forbidden')
    }
    return me
  }

  async getMyStudents(universityUser) {
    if (universityUser.role !== userRoles.UNIVERSITY) {
      throw new ApiError(403, 'Forbidden')
    }

    const { collegeOrUniversity } = universityUser

    if (!collegeOrUniversity) {
      throw new ApiError(400, 'University collegeOrUniversity is missing')
    }

    const students = await universityRepository.findStudentsByUniversityCollege({
      collegeOrUniversity
    })

    const studentIds = students.map(student => student._id)
    const registrations = await universityRepository.findStudentRegistrationsByStudentIds(studentIds)

    const hackathonMap = registrations.reduce((map, reg) => {
      const hackathon = reg.hackathonId
      if (!hackathon) return map

      reg.participantIds.forEach((participantId) => {
        const key = participantId.toString()
        if (!map[key]) map[key] = []

        const exists = map[key].some(
          (item) => item._id && item._id.toString() === hackathon._id.toString()
        )
        if (!exists) {
          map[key].push(hackathon)
        }
      })
      return map
    }, {})

    const studentsWithHackathons = students.map((student) => ({
      ...student,
      hackathons: hackathonMap[student._id.toString()] || []
    }))

    return studentsWithHackathons
  }
}

const universityService = new UniversityService()
export default universityService
