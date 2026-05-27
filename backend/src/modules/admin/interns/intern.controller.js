import Intern from "../../../interns/intern.model.js";
import ApiError from "../../../libs/apiError.js";
import asyncHandler from "../../../libs/asyncHandler.js";
import ApiResponse from "../../../libs/apiResponse.js";
import csv from 'csvtojson';

const uploadInternsCSV = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Please upload a CSV file");
  }

  const jsonArray = await csv().fromString(req.file.buffer.toString());
  
  if (jsonArray.length === 0) {
    throw new ApiError(400, "CSV file is empty");
  }

  const bulkOps = jsonArray.map(item => ({
    updateOne: {
      filter: { internId: item.internId },
      update: { $set: { fullName: item.fullName, internId: item.internId } },
      upsert: true
    }
  }));

  await Intern.bulkWrite(bulkOps);

  return res.status(200).json(new ApiResponse(200, { count: jsonArray.length }, "Interns uploaded successfully"));
});

export { uploadInternsCSV };
