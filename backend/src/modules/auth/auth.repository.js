/**
  auth.repository.js
  Encapsulates database reads/writes for auth.
 */
import User from "../users/user.model.js"

class AuthRepository {

  /**
   * Find user by email
   */
  async findUserByEmail(email) {
    return await User.findOne({ email })
  }

  /**
   * Find user by email or phone
   */
  async findUserByEmailOrPhone(email, phone) {
    return await User.findOne({
      $or: [{ email }, { phone }]
    })
  }

  /**
   * Check if user exists by phone
   */
  async userExistsByPhone(phone) {
    return await User.exists({ phone })
  }

  /**
   * Find user by ID with field selection
   */
  async findUserById(userId, selectFields = "") {
    return await User.findById(userId).select(selectFields)
  }

  /**
   * Create new user
   */
  async createUser(userData) {
    return await User.create(userData)
  }

  /**
   * Save user document with options
   */
  async saveUser(user, options = {}) {
    return await user.save(options)
  }

  /**
   * Update user and unset specific fields
   */
  async unsetUserFields(userId, fieldsToUnset) {
    return await User.findByIdAndUpdate(
      userId,
      { $unset: fieldsToUnset },
      { new: true }
    )
  }
}

const authRepository = new AuthRepository()
export default authRepository
