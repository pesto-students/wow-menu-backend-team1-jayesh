import mongoose, { Schema } from 'mongoose'

const dataSchema = new mongoose.Schema(
    {
        username: {
            required: true,
            type: String,
            unique: true,
        },
        password: {
            required: true,
            type: String,
        },
        is_admin: {
            required: false,
            type: Boolean,
            default: false,
        },
        role: {
            required: true,
            type: String,
        },
        created_by: {
            required: true,
            type: String,
        },
        restaurant: {
            required: true,
            type: String,
        },
        is_active: {
            type: Boolean,
            default: true,
        },
        created_at: {
            type: Date,
            default: () => Date.now()
        },
        updated_at: {
            type: Date,
            default: () => Date.now()
        }
    },
    {
        timestamps: false,
        versionKey: false,
    }
)

export default mongoose.model('RestaurantUsers', dataSchema, 'RestaurantUsers')
