/**
  user.service.js
  Contains the core business rules for user.
*/
import UserRepository from "./user.repository.js"
import UserUtils from "./user.utils.js"
import resultRepository from "../results/result.repository.js"

class UserService {
  constructor() {
    this.userRepository = new UserRepository()
    this.userUtils = new UserUtils()
  }

  async getProfileService(userId) {
    const excludeFields = this.userUtils.getSensitiveFieldsToExclude()
    const user = await this.userRepository.findUserById(userId, excludeFields)

    if (!user) {
      throw new Error("User not found")
    }

    return user
  }

  async updateProfileService(userId, updateData) {
    const allowedFields = [
      'fullName',
      'phone',
      'dateOfBirth',
      'collegeOrUniversity',
      'graduationYear',
      'skills',
      'resumeLink'
    ]

    const filteredData = {}
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field]
      }
    }

    // Normalize skills if provided
    if (filteredData.skills) {
      if (typeof filteredData.skills === 'string') {
        filteredData.skills = filteredData.skills.split(',').map(skill => skill.trim())
      }
    }

    const user = await this.userRepository.updateUserById(userId, filteredData)

    if (!user) {
      throw new Error("User not found")
    }

    const excludeFields = this.userUtils.getSensitiveFieldsToExclude()
    return await this.userRepository.findUserById(userId, excludeFields)
  }

  async getMyResultsService(userId) {
    const results = await resultRepository.findByUserId(userId);
    return results;
  }
}

const userService = new UserService()
export default userService
