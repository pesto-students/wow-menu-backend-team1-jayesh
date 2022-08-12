import mongoose from 'mongoose'
const Schema = mongoose.Schema

const orderSchema = new Schema(
    {
        iterations: [
            {
                items: [Object],
                instruction: {
                    type: String,
                },
                status: {
                    type: String,
                    default: 'Pending',
                },
                created_at: {
                    type: Date,
                    immutable: true,
                    default: () => Date.now(),
                },
                accepted_by: {
                    type: String,
                    default: '',
                }, // TODO:to be changed to id of user and need to check if Id is present in User.
            },
        ],
        table_no: {
            type: Number,
            required: true,
        },
        order_no: String, // TODO:to be auto generated
        restaurant_id: String, // TODO:to be changed to id of restaurant and need to check if Id is present in Restaurant.
        created_at: {
            type: Date,
            immutable: true,
            default: () => Date.now(),
        },
        updated_at: {
            type: Date,
            default: () => Date.now(),
        },
    },
    {
        timestamps: false,
        versionKey: false,
    }
)

orderSchema.pre('save', async function (next) {
    try {
        this.updated_at = new Date()
        next()
    } catch (error) {
        next(error)
    }
})
export default mongoose.model('Order', orderSchema)
