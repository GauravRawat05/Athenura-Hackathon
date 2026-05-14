/**
 * university.controller.js
 * Thin controller layer that formats HTTP responses for university endpoints.
 */
import ApiResponse from '../../libs/apiResponse.js'
import universityService from './university.service.js'

class UniversityController {
  async getMe(req, res) {
    const result = await universityService.getMe(req.user)
    return res.status(200).json(new ApiResponse(200, result, 'University fetched successfully'))
  }

  async getMyStudents(req, res) {
    const students = await universityService.getMyStudents(req.user)
    return res
      .status(200)
      .json(new ApiResponse(200, { students }, 'University students fetched successfully'))
  }
}

const universityController = new UniversityController()
export default universityController
