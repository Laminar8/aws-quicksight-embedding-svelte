import express from 'express'
import { get, auth } from '../../controllers/v1/aws/quicksight.controller'

export const router = express.Router()

// AWS
router.route('/aws/auth').get(auth)
router.route('/aws').get(get)
