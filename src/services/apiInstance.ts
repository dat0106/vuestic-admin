import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'

import { useGlobalAuthStore } from '@/stores/global-store'
import router from '@/router'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

const apiInstance: AxiosInstance = axios.create({
  baseURL: apiBaseUrl, // Base URL của API
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Thời gian chờ tối đa
})

// Intercept add jwt token to request header
apiInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const authStore = useGlobalAuthStore()
    const accessToken = authStore.accessToken

    console.log('Add accessToken', accessToken)
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)
// Hàm để thử lại yêu cầu
const retryRequest = async (config: InternalAxiosRequestConfig, retries: number): Promise<any> => {
  try {
    return await apiInstance(config) // Thử lại yêu cầu
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying request... Attempts left: ${retries}`)
      return retryRequest(config, retries - 1) // Giảm số lần thử lại
    }
    throw error // Ném lỗi nếu hết số lần thử lại
  }
}

// Interceptor phản hồi để xử lý lỗi và thử lại
apiInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Kiểm tra nếu lỗi là 401 (Unauthorized) và chưa thử lại
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true // Đánh dấu yêu cầu đã thử lại

      // Làm mới token
      const authStore = useGlobalAuthStore()
      try {
        const newToken = await authStore.getRefreshToken() // Hàm refreshToken cần được định nghĩa trong store
        // Lưu token mới vào store
        // Thử lại yêu cầu ban đầu
        console.log('response  newToken', newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return apiInstance(originalRequest)
      } catch (refreshError) {
        console.log('refreshError', refreshError)
        // authStore.logout() // Đăng xuất nếu không thể làm mới token
        // redirect to login page
        router.push({ name: 'login' })
        return Promise.reject(refreshError)
      }
      return retryRequest(originalRequest, 3) // Thử lại tối đa 3 lần
    }

    // Kiểm tra nếu lỗi là 500 (Internal Server Error) và chưa thử lại
    if (error.response?.status === 500 && !originalRequest._retry) {
      originalRequest._retry = true // Đánh dấu yêu cầu đã thử lại
      return retryRequest(originalRequest, 2) // Thử lại tối đa 3 lần
    }

    // Ném lỗi nếu không phải lỗi 401 hoặc 500
    return Promise.reject(error)
  },
)

// // Biến để kiểm soát việc retry
// let isRefreshing = false
// let failedQueue: Array<{
//   resolve: (token: string) => void
//   reject: (error: unknown) => void
// }> = []

// const processQueue = (error: unknown, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error)
//     } else {
//       prom.resolve(token!)
//     }
//   })

//   failedQueue = []
// }

// // Interceptor phản hồi để xử lý lỗi 401
// apiInstance.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }
//     const authStore = useGlobalAuthStore()
//     // Kiểm tra nếu lỗi là 401 và chưa thử lại
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         // Nếu đang làm mới token, thêm yêu cầu vào hàng đợi
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject })
//         })
//           .then((token) => {
//             token = token as string
//             if (originalRequest.headers) {
//               originalRequest.headers.Authorization = `Bearer ${token}`
//             }
//             return apiInstance(originalRequest)
//           })
//           .catch((err) => {
//             return Promise.reject(err)
//           })
//       }

//       originalRequest._retry = true
//       isRefreshing = true

//       try {
//         // Làm mới token
//         const newToken = await authStore.accessToken // Hàm refreshToken cần được định nghĩa trong store
//         console.log('newToken')
//        // Lưu token mới vào store
//         apiInstance.post(api.apiRegister)
//         // Thử lại yêu cầu ban đầu
//         if (originalRequest.headers) {
//           originalRequest.headers.Authorization = `Bearer ${newToken}`
//         }
//         // throw new Error('TODO Chua lam')

//         processQueue(null, newToken)
//         return apiInstance(originalRequest)
//       } catch (refreshError) {
//         console.log('refreshError', refreshError)
//         processQueue(refreshError, null)
//         authStore.logout() // Đăng xuất nếu không thể làm mới token
//         // redirect to login page
//         router.push({ name: '404' })
//         return Promise.reject(refreshError)
//       } finally {
//         isRefreshing = false
//       }
//     }

//     return Promise.reject(error)
//   },
// )

export default apiInstance
