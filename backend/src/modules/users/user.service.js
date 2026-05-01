/**
  user.service.js
  Contains the core business rules for user.
*/
import UserRepository from "./user.repository.js"

class UserService {
  constructor() {
    this.userRepository = new UserRepository()
  }

  // User profile and management service methods will be added here
  // Auth service methods have been moved to auth.service.js
}

const userService = new UserService()
export default userService
