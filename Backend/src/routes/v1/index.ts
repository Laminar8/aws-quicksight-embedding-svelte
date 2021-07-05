// Module Import
import express from 'express'

// Router Import
import { router as awsRouter } from './aws.route'

// Variable Initialize
const router = express.Router()

router.use(awsRouter)

export default router
