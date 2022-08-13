import mongoose from 'mongoose'

const dataSchema = new mongoose.Schema(
    {
        name: {
            required: true,
            type: String,
            unique: true
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

export default mongoose.model('Categories', dataSchema, 'Categories')
