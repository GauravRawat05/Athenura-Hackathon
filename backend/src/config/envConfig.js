/**
  env.js
  Environment variable validation and export.
 */

import {config} from 'dotenv';
config( );

const envConfig = {       
portNumber : Number(process.env.PORT ),
  connectionString : String(process.env.MONGODB_URL),
  appName :  String(process.env.APP_NAME ),
  accessTokenSecret : String(process.env.ACCESS_TOKEN_SECRET ),
  accessTokenExpiry : String(process.env.ACCESS_TOKEN_EXPIRY ),
  refreshTokenSecret : String(process.env.REFRESH_TOKEN_SECRET ),
  refreshTokenExpiry : String(process.env.REFRESH_TOKEN_EXPIRY ),
  cloudinaryCloudName : String(process.env.CLOUDINARY_CLOUD_NAME ),
  cloudinaryApiKey : String(process.env.CLOUDINARY_API_KEY ),
  cloudinaryApiSecret : String(process.env.CLOUDINARY_API_SECRET ),
  brevoApiKey : String(process.env.BREVO_API_KEY ),
  judgeSecretKey : String(process.env.JUDGE_SECRET_KEY ), 
  universitySecretKey : String(process.env.UNIVERSITY_SECRET_KEY ),
  admineSecretKey : String(process.env.ADMIN_SECRET_KEY )

}
export default envConfig
