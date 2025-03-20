import { defineStore } from 'pinia'
import { User } from '../pages/users/types'
import { UserCredential, getAuth, getIdToken, signOut } from 'firebase/auth'
import router from '@/router'

export const useGlobalStore = defineStore('global', {
  state: () => {
    return {
      isSidebarMinimized: false,
    }
  },

  actions: {
    toggleSidebar() {
      this.isSidebarMinimized = !this.isSidebarMinimized
    },
  },
})

export const useGlobalAuthStore = defineStore('auth', {
  state: () => {
    return {
      user: null as User | null,
      accessToken: null as string | null, // Access token
      timeExpire: null as number | null, // Time expire token
      refreshToken: null as string | null, // Refresh token
    }
  },
  actions: {
    login(user: User) {
      this.user = user
    },
    async setUserCredential(userCredential: UserCredential) {
      // this.user = {
      //   email: userCredential.user.email || '',
      //   fullname: userCredential.user.displayName || '',
      //   username: userCredential.user.displayName || '',
      //   role: 'user',
      //   avatar: userCredential.user.photoURL || '',
      //   projects: [],
      //   notes: '',
      //   active: true,
      //   uid: userCredential.user.uid,
      // }
      this.accessToken = await userCredential.user.getIdToken()
      console.log('this.accessToken', this.accessToken)
      // get time expire token in access token
      this.timeExpire = 1000
      this.refreshToken = userCredential.user.refreshToken || ''
    },

    async getRefreshToken(): Promise<string> {
      // try {
      //   const response = await apiInstance.post(api.apiRefreshToken, {
      //     refreshToken: this.refreshToken,
      //   })
      //   const { idToken } = response.data
      //   this.accessToken = idToken
      //   return idToken
      // } catch (error) {
      //   this.logout()
      //   throw error
      // }

      const auth = getAuth()
      if (auth.currentUser) {
        const idToken = await getIdToken(auth.currentUser, true)
        console.log('this.getRefreshToken accessToken', this.accessToken)
        this.accessToken = idToken
        return idToken
      } else {
        throw new Error('No authenticated user found')
      }
    },
    logout() {
      const auth = getAuth()
      signOut(auth)
        .then(() => {
          console.log('logout success')
          router.push({ name: 'login' })
        })
        .catch((error) => {
          console.log('logout error', error)
        })

      this.user = null
      this.accessToken = null
      this.timeExpire = null
      this.refreshToken = null
    },
  },
  persist: true,
})
