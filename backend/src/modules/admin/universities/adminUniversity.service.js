/**
  adminUniversity.service.js
  Contains the core business rules for adminUniversity.
 */
import ApiError from '../../../libs/apiError.js'
import University from '../../universities/university.model.js'
import User from '../../users/user.model.js'
import { Registration } from '../../registrations/registration.model.js'
import Submission from '../../submissions/submission.model.js'
import Result from '../../results/result.model.js'

class AdminUniversityService {
  async listUniversities({ page = 1, limit = 20, search, status }) {
    const skip = (page - 1) * limit
    const query = {}

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } }
      ]
    }

    if (status && status !== 'All') {
      const statusTitle = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
      query.status = statusTitle
    }

    const total = await University.countDocuments(query)
    const universities = await University.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    return {
      data: universities,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }

  async getUniversityById(universityId) {
    const university = await University.findById(universityId).lean()
    return university
  }

  async createUniversity(data) {
    // Check if university email already exists
    const existingEmail = await University.findOne({ email: data.email.toLowerCase() })
    if (existingEmail) {
      throw new ApiError(400, 'University with this email already exists')
    }

    // Generate code if not provided
    if (!data.code || data.code.trim() === '') {
      const initials = data.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
      const randomNum = Math.floor(100 + Math.random() * 900)
      data.code = `${initials}${randomNum}`.slice(0, 10)
    } else {
      data.code = data.code.toUpperCase()
    }

    // Check if university code already exists
    const existingCode = await University.findOne({ code: data.code })
    if (existingCode) {
      throw new ApiError(400, 'University with this code already exists')
    }

    // Normalize status case
    if (data.status) {
      data.status = data.status.charAt(0).toUpperCase() + data.status.slice(1).toLowerCase()
    } else {
      data.status = 'Active'
    }

    // Auto extract city and state from address if they aren't explicitly provided
    if (data.address && (!data.city || !data.state)) {
      const parts = data.address.split(',')
      if (parts[0] && !data.city) data.city = parts[0].trim()
      if (parts[1] && !data.state) data.state = parts[1].trim()
    }

    const newUniv = new University({
      ...data,
      email: data.email.toLowerCase()
    })
    return await newUniv.save()
  }

  async updateUniversity(universityId, updateData) {
    if (updateData.email) {
      updateData.email = updateData.email.toLowerCase()
      // Check if email belongs to another university
      const duplicateEmail = await University.findOne({ email: updateData.email, _id: { $ne: universityId } })
      if (duplicateEmail) {
        throw new ApiError(400, 'Email is already in use by another university')
      }
    }

    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase()
      const duplicateCode = await University.findOne({ code: updateData.code, _id: { $ne: universityId } })
      if (duplicateCode) {
        throw new ApiError(400, 'University code is already in use by another university')
      }
    }

    if (updateData.status) {
      updateData.status = updateData.status.charAt(0).toUpperCase() + updateData.status.slice(1).toLowerCase()
    }

    // Auto extract city and state from address if they aren't explicitly provided
    if (updateData.address) {
      const parts = updateData.address.split(',')
      if (parts[0] && !updateData.city) updateData.city = parts[0].trim()
      if (parts[1] && !updateData.state) updateData.state = parts[1].trim()
    }

    const updated = await University.findByIdAndUpdate(
      universityId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean()

    return updated
  }

  async deleteUniversity(universityId) {
    const deleted = await University.findByIdAndDelete(universityId)
    return !!deleted
  }

  async getUniversityStats(universityId) {
    const university = await University.findById(universityId)
    if (!university) {
      throw new ApiError(404, 'University not found')
    }

    // Find students whose collegeOrUniversity matches the university name (case insensitive regex)
    const students = await User.find({
      role: 'User',
      collegeOrUniversity: { $regex: `^${university.name}$`, $options: 'i' }
    }).select('_id').lean()

    const studentIds = students.map((s) => s._id)

    // Calculate total registrations for these students
    const totalRegistrations = await Registration.countDocuments({
      participantIds: { $in: studentIds },
      status: { $ne: 'cancelled' }
    })

    // Calculate total submissions
    const totalSubmissions = await Submission.countDocuments({
      userId: { $in: studentIds }
    })

    // Winner count
    const winnerCount = await Result.countDocuments({
      userId: { $in: studentIds },
      isWinner: true
    })

    return {
      universityId,
      totalStudents: studentIds.length,
      totalRegistrations,
      totalSubmissions,
      winnerCount,
      topStudents: [],
      participationByHackathon: []
    }
  }
}

const adminUniversityService = new AdminUniversityService()
export default adminUniversityService
