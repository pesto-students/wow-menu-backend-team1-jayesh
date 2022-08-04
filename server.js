import express from 'express'
import { APP_PORT, DATABASE_URL } from './config'
import routes from './src/routes'
import errorHandler from './src/middlewares/errorHandlerMiddleware'
import mongoose from 'mongoose'

const app = express()

mongoose.connect(DATABASE_URL)
const db = mongoose.connection
db.on('error', () => console.error('database connection failed'))
db.once('open', () => console.log('database connection established'))

app.use(express.json())
app.use('/api', routes)

app.use(errorHandler)

const port = process.env.PORT || APP_PORT
app.listen(port, () => console.log(`Listening on port ${port}`))
