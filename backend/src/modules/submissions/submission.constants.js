/**
  submission.constants.js
  Keeps enums, status values, event names, and fixed configuration used only by the submission module.
 */

export const submissionStatus = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  SCORED: "Scored"
}

export const submissionStatusEnums = Object.values(submissionStatus)

export const assetTypes = {
  IMAGE: "image",
  VIDEO: "video",
  DOCUMENT: "document",
  LINK: "link"
}

export const assetTypesEnums = Object.values(assetTypes)

export const MAX_ASSETS_PER_SUBMISSION = 10
