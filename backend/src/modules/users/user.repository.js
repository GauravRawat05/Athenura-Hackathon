import User from "./user.model.js"

class UserRepository {
  
   // Find user by ID
   
  async findUserById(userId, selectFields = "") {
    return await User.findById(userId).select(selectFields)
  }

  
   // Find user by email
   
  async findUserByEmail(email) {
    return await User.findOne({ email })
  }

  
   // Find user by email or phone
   
  async findUserByEmailOrPhone(email, phone) {
    return await User.findOne({
      $or: [{ email }, { phone }]
    })
  }

  
   // Check if user exists by email
   
  async userExistsByEmail(email) {
    return await User.exists({ email })
  }

  
   // Check if user exists by phone
   
  async userExistsByPhone(phone) {
    return await User.exists({ phone })
  }

  
   // Create new user
   
  async createUser(userData) {
    return await User.create(userData)
  }

  
   // Update user by ID
   
  async updateUserById(userId, updateData, options = {}) {
    return await User.findByIdAndUpdate(userId, updateData, { new: true, ...options })
  }

  
   // Update user and unset fields
   
  async unsetUserFields(userId, fieldsToUnset) {
    return await User.findByIdAndUpdate(
      userId,
      { $unset: fieldsToUnset },
      { new: true }
    )
  }

  //get user results by ID (placeholder for actual implementation)
  
  async findUserResultsById(userId) {
    // This is a placeholder. The actual implementation would depend on how results are stored in the database.
    // For example, if results are stored in a separate collection, you would query that collection for entries related to the userId.
    return await User.findById(userId).select('results') // Assuming 'results' is a field in the User model
  }

  
   // Save user document
   
  async saveUser(user, options = {}) {
    return await user.save(options)
  }
}

export default UserRepository