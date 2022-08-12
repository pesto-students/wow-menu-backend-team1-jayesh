import { ValidationError } from 'joi'

const errorHandler = (err, req, res) => {
    if (typeof err.message !== 'undefined') {
        const statusCode = err instanceof ValidationError ? 422 : 500

        let data = {
            message: err.message,
        }

        return res.status(statusCode).json(data)
    }
    else {
        res()
    }

}

export default errorHandler
