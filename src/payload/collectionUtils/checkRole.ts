import { User } from "@/payload-types"

export const checkRole = (allRoles: User['roles'] = [], user?: User | null): boolean => {
  if (user) {
    if (
      //  @ts-ignore
      allRoles.some(r => {
        //  @ts-ignore
        return user?.roles?.some(individualRole => {
          return individualRole === r
        })
      })
    )
      return true
  }

  return false
}