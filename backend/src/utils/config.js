
import  { configDotenv } from 'dotenv'

configDotenv({
  path : '.env'
})

const portNumber = Number(process.env.PORT)
const mongoUrl =    String(process.env.MONGO_URL)
const appName =  String(process.env.APP_NAME)
const accessTokenSecret = String(process.env.ACCESS_TOKEN_SECRET)
const accessTokenExpiry = String(process.env.ACCESS_TOKEN_EXPIRY)
const refreshTokenSecret = String(process.env.REFRESH_TOKEN_SECRET)
const refreshTokenExpiry = String(process.env.REFRESH_TOKEN_EXPIRY)
const cloudinaryCloudName = String(process.env.CLOUDINARY_CLOUD_NAME)
const cloudinaryApiKey = String(process.env.CLOUDINARY_API_KEY)
const cloudinaryApiSecret = String(process.env.CLOUDINARY_API_SECRET)
const brevoApiKey = String(process.env.BREVO_API_KEY)
const judgeSecretKey = String(process.env.JUDGE_SECRET_KEY)
const universitySecretKey = String(process.env.UNIVERSITY_SECRET_KEY)
const admineSecretKey = String(process.env.ADMIN_SECRET_KEY)




export {
  portNumber,
  mongoUrl,
  appName,
  admineSecretKey,
  judgeSecretKey,
  universitySecretKey,
  accessTokenExpiry,
  accessTokenSecret,
  refreshTokenSecret,
  refreshTokenExpiry,
  cloudinaryApiKey,
  cloudinaryApiSecret,
  cloudinaryCloudName,
  brevoApiKey
}