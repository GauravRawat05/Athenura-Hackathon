/**
  mail.js
  Brevo REST API client configuration for sending emails.
  Used for better error handling and tracking compared to SMTP.
  */

import axios from 'axios'
import envConfig from './envConfig.js'

/**
 * Brevo API client using REST API
 */
const brevoClient = axios.create({
  baseURL: 'https://api.brevo.com/v3',
  headers: {
    'api-key': envConfig.brevoApiKey,
    'Content-Type': 'application/json'
  }
})

/**
 * Verifies the API connection by checking API key format
 */
const verifyTransporter = async () => {
  try {
    if (!envConfig.brevoApiKey || !envConfig.brevoApiKey.startsWith('xkeysib-')) {
      console.warn('Brevo API key format may be invalid')
      return false
    }
    console.log('Brevo API client is ready')
    return true
  } catch (error) {
    console.error('Brevo API verification failed:', error.message)
    return false
  }
}

export { brevoClient, verifyTransporter }
