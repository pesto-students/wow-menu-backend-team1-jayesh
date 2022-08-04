import mongoose from 'mongoose'

const dataSchema = new mongoose.Schema(
    {
        category: {
            required: true,
            type: String,
        },
        is_active: {
            required: false,
            type: Boolean,
            default: true,
        },
        created_by: {
            required: true,
            type: String,
        },
        restaurant_code: {
            required: true,
            type: String,
        },
    },
    {
        timestamps: true,
    }
)

export default mongoose.model('Categories', dataSchema, 'Categories')
