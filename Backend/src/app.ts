// Module Import with Import
import express from 'express'
import createError, { HttpError } from 'http-errors'
import logger from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import fs from 'fs'
import https from 'https'

// Router Import
import { router as indexRouter } from './routes/index'
import v1Route from './routes/v1'

import { redirectUri } from './interfaces/v1/aws.interfaces'

// Module Initialize
dotenv.config()
const app = express()

// App uses moudle
app.use(logger('dev'))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(cors({ credentials: true, origin: redirectUri }))

// App uses Router
app.use('/', indexRouter)
app.use('/v1', v1Route)

// catch 404 and forward to error handler
app.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
  next(createError(404))
})

// error handler
app.use(function (err: HttpError, req: express.Request, res: express.Response) {
  let apiError = err

  if (!err.status) {
    apiError = createError(err)
  }

  // set locals, only providing error in development
  res.locals.message = apiError.message
  res.locals.error = process.env.NODE_ENV === 'development' ? apiError : {}

  // render the error page
  return res.status(apiError.status).json({ message: apiError.message })
})

// Open Port from .env
const appPort: string | number = process.env.PORT || 4000
https
  .createServer(
    {
      key: fs.readFileSync('server.key'),
      cert: fs.readFileSync('server.cert'),
    },
    app
  )
  .listen(appPort, () => {
    console.log(``)
    console.log(`HTTP Server is running at http://localhost:${appPort} ♥`)
    console.log(``)
  })
