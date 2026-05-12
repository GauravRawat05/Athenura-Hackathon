/**
  submission.controller.js
  Handles HTTP request/response flow for submission, including parsing inputs and returning standardized API responses.
 */
import ApiResponse from "../../libs/apiResponse.js"
import submissionService from "./submission.service.js"

class SubmissionController {

  async createSubmission(req, res) {
    const { hackathonId } = req.params
    const data = req.body

    const submission = await submissionService.createSubmission(
      hackathonId,
      req.user._id,
      data
    )

    return res
      .status(201)
      .json(new ApiResponse(201, submission, "Submission created successfully"))
  }

  async updateSubmission(req, res) {
    const { submissionId } = req.params
    const data = req.body

    const submission = await submissionService.updateSubmission(
      submissionId,
      req.user._id,
      data
    )

    return res
      .status(200)
      .json(new ApiResponse(200, submission, "Submission updated successfully"))
  }

  async getMySubmission(req, res) {
    const { hackathonId } = req.params

    const submission = await submissionService.getMySubmission(
      hackathonId,
      req.user._id
    )

    return res
      .status(200)
      .json(new ApiResponse(200, submission, "Submission fetched successfully"))
  }

  async getVersions(req, res) {
    const { submissionId } = req.params

    const versions = await submissionService.getVersions(
      submissionId,
      req.user
    )

    return res
      .status(200)
      .json(new ApiResponse(200, versions, "Versions fetched successfully"))
  }
}

const submissionController = new SubmissionController()
export default submissionController
