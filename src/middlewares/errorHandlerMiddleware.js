const errorHandler = (err, req, res, next) => {
    if (err.name === 'ValidationError') {
        return res.status(400).json({message: err.message});
    }
    else if (err.code === 11000) {
        res.status(409).json({message: err.message})
    }

}

export default errorHandler
