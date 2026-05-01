/**
  apiResponse.js
  Response formatter that keeps success responses consistent across controllers.
 */
class ApiResponse {
  constructor (
      statusCode,
      data,
      message = "success"
  )
   {
        this.statusCode = statusCode,
        this.data = data,
        this.message =  message
   }
}

export default ApiResponse;