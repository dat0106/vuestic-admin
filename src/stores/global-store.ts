import { defineStore } from 'pinia'
import { CreateUser, User } from '../pages/users/types'
import { UserCredential, getAuth, getIdToken, signOut } from 'firebase/auth'
import { useUsersStore } from '@/stores/users'
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

// create function create user form UserCredential
const createUser = async (userCredential: UserCredential) => {
  const user = userCredential.user
  const createUser: CreateUser = {
    uid: user.uid,
    role: 'user',
    active: true,
    email: user.email || '',
    fullname: user.displayName || '',
    username: user.email || '',
    avatar: user.photoURL || '',
    projects: [],
    phone: user.phoneNumber || '',
    address: '',
    notes: '',
  }
  const useStore = useUsersStore()
  const userServer = await useStore.createUser(createUser)
  return userServer
}

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
      this.accessToken = await userCredential.user.getIdToken()
      console.log('this.accessToken', this.accessToken)
      // get time expire token in access token
      // this.timeExpire = 1000
      this.refreshToken = userCredential.user.refreshToken || ''
      this.user = await createUser(userCredential)
      const idToken = await userCredential.user.getIdToken()
      // console.log('idToken', idToken)
      this.accessToken = idToken
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
        const idToken = await getIdToken(auth.currentUser)
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
