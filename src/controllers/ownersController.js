import { Owners } from '../models'
import hashPasswordUtil from '../utils/hashPasswordUtil'
import sendMailUtil from '../utils/sendMailUtil'
import { APP_URL } from '../../config'

const ownersController = {
    async get(req, res, next) {
        try {
            const data = await Owners.find(req.query)
            res.status(200).json({ status: true, data: data })
        } catch (error) {
            return next(error)
        }
    },

    async getById(req, res, next) {
        try {
            const data = await Owners.findById(req.params.id)
            res.status(200).json({ status: true, data: data })
        } catch (error) {
            return next(error)
        }
    },

    async post(req, res, next) {
        const data = new Owners({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email_id: req.body.email_id,
            password: await hashPasswordUtil(req.body.password),
        })

        try {
            const result = await data.save()
            const queryParams = `id=${result['id']}&hashed_string=${result['password']}`
            const htmlBody = `<b>Greetings from Wow Menu<b> 
                <br> Click on this link to verify your password <br><br>
                <a>${APP_URL}/api//verify/mail?${queryParams}</a>`
            await sendMailUtil(
                req.body.email_id,
                'Wow Menu Verification Mail',
                'Please verify your email id',
                htmlBody
            )
            res.status(201).json({
                message: 'Owner successfully added',
                status: true,
                data: req.body,
            })
        } catch (error) {
            return next(error)
        }
    },

    async update(req, res, next) {
        try {
            const options = { new: true }

            if (typeof req.body.password !== 'undefined') {
                req.body.password = await hashPasswordUtil(req.body.password)
            }

            req.body.updated_at = Date.now()

            const result = await Owners.findByIdAndUpdate(
                req.params.id,
                req.body,
                options
            )
            res.status(200).json({
                message: `Owner's data is successfully updated`,
                status: true,
                data: result,
            })
        } catch (error) {
            return next(error)
        }
    },

    async delete(req, res, next) {
        try {
            const id = req.params.id
            const { firstname, lastname } = await Owners.findByIdAndDelete(id)
            res.status(200).json({
                message: `Owner ${firstname} ${lastname} is successfully deleted`,
                status: true,
            })
        } catch (error) {
            return next(error)
        }
    },

    async verifyEmail(req, res) {
        try {
            const data = await Owners.findById(req.query.id)
            if (req.query.hashed_string === data.password) {
                await Owners.findByIdAndUpdate(
                    req.query.id,
                    { is_verified: true },
                    { new: true }
                )
                res.status(200).json({
                    message: 'Email is successfully verified',
                })
            } else {
                res.status(422).json({ message: 'Clicked on invalid link' })
            }
        } catch (error) {
            res.status(500).json({
                message: 'Unable to verify email. Please try again later.',
            })
        }
    },
}

export default ownersController
