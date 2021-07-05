import { Credentials } from '@aws-sdk/types'

// Default
export const region = 'ap-northeast-2'

// CHANGE THIS ALL
export const awsAccountId = '<YOUR AWS ACCOUNT ID>'
export const appName = '<YOUR COGNITO APP NAME>'
export const clientId = '<YOUR CLIENT ID>'
export const redirectUri = 'https://<YOUR SERVER URL>:5000'
export const roleArn = `arn:aws:iam::${awsAccountId}:role/<YOUR ROLE NAME>`

export const url = `https://${appName}.auth.${region}.amazoncognito.com/login?client_id=${clientId}&response_type=token&scope=openid+profile&redirect_uri=${redirectUri}`
export interface dashboardParams {
  credentials?: Credentials
  region?: string
  identityRegion?: string
  awsAccountId?: string
  userName?: string
  email?: string
  roleArn?: string
  dashboardName?: string
  dashboardId?: string
  openIdToken?: string
}
