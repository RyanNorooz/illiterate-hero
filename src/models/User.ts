import bcrypt from 'bcrypt'
import type { Model } from 'mongoose'
import { model, models, Schema } from 'mongoose'

const SALT_WORK_FACTOR = 10

interface User {
  username: string
  password: string
  comparePassword: (password: string) => boolean
  updated_at: string
  created_at: string
}

const UserSchema = new Schema<User>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    methods: {
      async comparePassword(password: string) {
        return await bcrypt.compare(password, this.password)
      },
    },
  }
)

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
  this.password = await bcrypt.hash(this.password, salt)

  next()
})

export const UserModel = (models.User || model('User', UserSchema)) as Model<User>
