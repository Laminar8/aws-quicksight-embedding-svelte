// Import Module
import { STSClient, AssumeRoleWithWebIdentityCommand } from '@aws-sdk/client-sts'
import {
  QuickSightClient,
  DescribeUserCommand,
  GetDashboardEmbedUrlCommand,
  SearchDashboardsCommand,
  RegisterUserCommand,
  DashboardSummary,
} from '@aws-sdk/client-quicksight'
import { Credentials } from '@aws-sdk/types'
import express from 'express'
import { url, region, awsAccountId, roleArn, dashboardParams } from '../../../interfaces/v1/aws.interfaces'

const getCredentials = async (p: dashboardParams) => {
  if (!p.openIdToken) {
    throw new Error(`Open  ID Token doesn't exist.`)
  }

  const idInfo = Buffer.from(p.openIdToken.split('.')[1] + '========', 'base64').toString()
  const idJSON = JSON.parse(idInfo)
  const userName = idJSON['cognito:username']
  const email = idJSON['email']

  const client = new STSClient({ region })
  const assumedRole = new AssumeRoleWithWebIdentityCommand({
    RoleSessionName: userName,
    WebIdentityToken: p.openIdToken,
    RoleArn: p.roleArn,
  })

  const assumedRoleSession = await client.send(assumedRole)
  const credentials = {
    accessKeyId: assumedRoleSession.Credentials!.AccessKeyId,
    secretAccessKey: assumedRoleSession.Credentials!.SecretAccessKey,
    sessionToken: assumedRoleSession.Credentials!.SessionToken,
    expiration: assumedRoleSession.Credentials!.Expiration,
  }
  console.log('===========================1')
  console.info('Get Credentials')
  return { credentials, userName, email }
}

// Function that derives the identity region of your QuickSight account.
const getIdentityRegion = async (p: dashboardParams) => {
  console.log('===========================2')
  console.info('Describe User')

  const params = {
    AwsAccountId: p.awsAccountId,
    Namespace: 'default',
    UserName: p.userName,
  }

  try {
    const quickSightClient = new QuickSightClient({ credentials: p.credentials, region: p.region })
    const command = new DescribeUserCommand(params)
    const response = await quickSightClient.send(command)
  } catch (err) {
    switch (err.name) {
      case 'AccessDeniedException':
        if (err.message.search('but your identity region is ') > -1) {
          const identityRegion = err.message.split('but your identity region is ')[1].split('.')[0]
          return identityRegion
        }
      case 'ResourceNotFoundException':
        // Call went through which means the dashboardRegion we used is your identity region as well.
        const identityRegion = p.region
        return identityRegion
      default:
        console.error(err)
    }
  }
}

// Return Dashboard ID
const getListDashboard = async (p: dashboardParams) => {
  if (!p.roleArn) {
    throw new Error(`Role Arn doesn't exsit.`)
  }
  const roleName = p.roleArn.split('/')[1]
  const params = {
    AwsAccountId: awsAccountId,
    Filters: [
      {
        Operator: 'StringEquals',
        Name: 'QUICKSIGHT_USER',
        Value: 'arn:aws:quicksight:' + p.identityRegion + ':' + p.awsAccountId + ':user/default/' + roleName + '/' + p.userName,
      },
    ],
  }

  const quickSightClientclient = new QuickSightClient({ credentials: p.credentials, region: p.region })
  const command = new SearchDashboardsCommand(params)
  const response = await quickSightClientclient.send(command)

  // Optional Chaining is not supported in Cloud9.
  // Equivalent expression -> const result = response.DashboardSummaryList?.filter((element) => element.Name == p.dashboardName)[0]
  const result = response.DashboardSummaryList && response.DashboardSummaryList.filter((element) => element.Name == p.dashboardName)[0]

  if (!result) {
    throw new Error(`Cannot get a dashboard ID.`)
  }
  console.log('===========================3')
  console.info('Get Dashboard ID')
  console.log(result)
  return result.DashboardId
}

// Get an URL for embedding a dashboard
const getEmbedUrl = async (p: dashboardParams) => {
  const params = {
    AwsAccountId: p.awsAccountId,
    DashboardId: p.dashboardId,
    IdentityType: 'IAM',
  }

  const quickSightClient = new QuickSightClient({ credentials: p.credentials, region: p.identityRegion })
  const command = new GetDashboardEmbedUrlCommand(params)
  const response = await quickSightClient.send(command)

  console.log('===========================4')
  console.info('Get Embed URL')
  console.log(response.EmbedUrl)
  return response.EmbedUrl
}

// Register an user
const registerUser = async (p: dashboardParams) => {
  console.log('===========================21')
  console.info('Register User')

  const params = {
    AwsAccountId: p.awsAccountId,
    Namespace: 'default',
    IdentityType: 'IAM',
    IamArn: p.roleArn,
    SessionName: p.userName,
    Email: p.email,
    UserRole: 'READER',
  }

  const quickSightClient = new QuickSightClient({ credentials: p.credentials, region: p.identityRegion })
  const command = new RegisterUserCommand(params)
  const response = await quickSightClient.send(command)

  return response
}

const returnJSON = async (p: dashboardParams) => {
  const { credentials, region, identityRegion, awsAccountId, userName, roleArn, dashboardName } = p
  const dashboardId = await getListDashboard({ credentials, region, identityRegion, awsAccountId, userName, roleArn, dashboardName })
  const embedUrl = await getEmbedUrl({ credentials, region, identityRegion, awsAccountId, dashboardId })
  return embedUrl
}

export const auth = (req: express.Request, res: express.Response): void => {
  return res.redirect(url)
}

// *************
// Main Function
// *************

export const get = async (req: express.Request, res: express.Response) => {
  const openIdToken = req.query.idToken as string
  const dashboardName = req.query.dashboardName as string

  const userCredentials = await getCredentials({ openIdToken, region, roleArn })
  const credentials = userCredentials.credentials as Credentials
  const userName = userCredentials.userName
  const email = userCredentials.email

  const identityRegion = await getIdentityRegion({ credentials, region, awsAccountId, userName })

  try {
    const embedUrl = await returnJSON({ credentials, region, identityRegion, awsAccountId, userName, roleArn, dashboardName })
    return res.json(embedUrl)
  } catch (err) {
    if (err.name == 'ResourceNotFoundException') {
      const newUser = await registerUser({ credentials, identityRegion, awsAccountId, userName, email })
      const embedUrl = await returnJSON({ credentials, region, identityRegion, awsAccountId, userName, roleArn, dashboardName })
      return res.json(embedUrl)
    } else {
      console.error(err)
    }
  }
}
