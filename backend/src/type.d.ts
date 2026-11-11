import { Permission } from './constants/permissions'

// Override Express v5 req.params to always be Record<string, string>
// Express v5 changed ParamsDictionary to Record<string, string | string[]>
// which breaks destructuring like: const { id } = req.params
declare module 'express-serve-static-core' {
  interface ParamsDictionary {
    [key: string]: string
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string
        roles?: string[]
      }
      userPermissions?: Permission[]
      userRoles?: string[]
      rateLimit?: {
        limit: number
        current: number
        remaining: number
        resetTime?: Date
      }
    }
  }
}
