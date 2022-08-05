import mongoose from 'mongoose'

const dataSchema = new mongoose.Schema(
    {
        name: {
            required: true,
            type: String,
            unique: true,
            trim: true,
            lowercase: true,
        },
        description: {
            required: false,
            type: String,
            trim: true,
        },
        price: {
            required: true,
            type: Number,
        },
        discounted_price: {
            required: false,
            type: Number,
        },
        category: {
            required: true,
            type: String,
            lowercase: true,
            trim: true,
        },
        is_active: {
            required: false,
            type: Boolean,
            default: true,
        },
        is_available: {
            required: false,
            type: Boolean,
            default: true,
        },
        is_veg: {
            required: true,
            type: Boolean,
        },
        spicy: {
            required: false,
            type: String,
            lowercase: true,
            trim: true,
        },
        image_url: {
            required: false,
            type: String,
        },
        preparation_time: {
            required: false,
            type: Number,
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
        versionKey: false,
    }
)

export default mongoose.model('MenuItem', dataSchema, 'MenuItems')
