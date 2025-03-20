const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

export default {
  allUsers: () => `${apiBaseUrl}/users`,
  user: (id: string) => `${apiBaseUrl}/users/${id}`,
  users: ({ page, pageSize }: { page: number; pageSize: number }) =>
    `${apiBaseUrl}/users/?page=${page}&pageSize=${pageSize}`,
  allProjects: () => `${apiBaseUrl}/projects`,
  project: (id: string) => `${apiBaseUrl}/projects/${id}`,
  projects: ({ page, pageSize }: { page: number; pageSize: number }) =>
    `${apiBaseUrl}/projects/?page=${page}&pageSize=${pageSize}`,
  avatars: () => `${apiBaseUrl}/avatars`,

  allUsersAxios: () => `/users`, // dang su dung axios
  userAxios: (id: string) => `/users/${id}`, // dang su dung axios
  usersAxios: ({ page, pageSize }: { page: number; pageSize: number }) => `/users/?page=${page}&pageSize=${pageSize}`, // dang su dung axios
  allProjectsAxios: () => `/projects`, // dang su dung axios
  projectAxios: (id: string) => `/projects/${id}`, // dang su dung axios
  projectsAxios: ({ page, pageSize }: { page: number; pageSize: number }) =>
    `/projects/?page=${page}&pageSize=${pageSize}`, // dang su dung axios
  avatarsAxios: () => `/avatars`,
  // dang su dung axios
  apiRefreshToken: '/auth/refresh-token',
  apiRegister: '/auth/register',
  apiLogin: `/auth/login`,
  apiLogout: `/auth/logout`,
  forgotPassword: `/auth/forgot-password`,
}
