/**
  apiError.js
  Custom error class used to throw consistent HTTP/application errors with status codes and machine-readable metadata.
 */

class ApiError extends Error{
  constructor(
      statusCode,
      message,
      stack,
      errors
   )

   {
     super(message)
     this.statusCode = statusCode,
     this.message = message
     this.success = false
     this.errors = errors

     if(stack) {
      this.stack = stack
     } else {
        Error.captureStackTrace(this, this.constructor)
     }

   }
}

export default ApiError;
