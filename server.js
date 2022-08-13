import express from 'express'
import { APP_PORT, DATABASE_URL } from './config'
import routes from './src/routes'
import mongoose from 'mongoose'
import passport from 'passport'
import ErrorHandlerMiddleware from './src/middlewares/errorHandlerMiddleware'
const app = express()

mongoose.connect(DATABASE_URL)
const db = mongoose.connection
db.on('error', () => console.error('database connection failed'))
db.once('open', () => console.log('database connection established')) // eslint-disable-line
mongoose.set('toJSON', {
    virtuals: true,
    transform: (doc, converted) => {
        delete converted._id
    },
})

app.use(express.json())
app.use('/api', routes)

app.use(passport.initialize());

app.use(ErrorHandlerMiddleware)

app.use((req, res) =>
    res.status(404).json({ message: `Invalid request url path ${req.path}` })
)

const port = process.env.PORT || APP_PORT
app.listen(port, () => console.log(`Listening on port ${port}`)) // eslint-disable-line
