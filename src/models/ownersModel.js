import mongoose from 'mongoose'

const dataSchema = new mongoose.Schema(
    {
        firstname: {
            required: true,
            type: String,
        },
        lastname: {
            required: true,
            type: String,
        },
        password: {
            required: true,
            type: String,
        },
        email_id: {
            required: true,
            type: String,
            unique: true,
        },
        is_verified: {
            required: false,
            type: Boolean,
            default: false,
        },
        restaurant_code: {
            required: false,
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

export default mongoose.model('Owners', dataSchema, 'Owners')
