import bcrypt from 'bcrypt'

const hashedPassword = (password) => {
    return bcrypt.hash(password, 10)
}

export default hashedPassword
