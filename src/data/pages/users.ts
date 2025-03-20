import apiInstance from '@/services/apiInstance'
import { CreateUser, User } from '../../pages/users/types'
import api from '../../services/api'
import { HttpStatusCode } from 'axios'

export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof User | undefined
  sortingOrder: 'asc' | 'desc' | null
}

export type Filters = {
  isActive: boolean
  search: string
}

export const getUsers = async (filters: Partial<Filters & Pagination & Sorting>) => {
  // const { isActive, search } = filters
  // let filteredUsers: User[] = await fetch(api.allUsers()).then((r) => r.json())
  // filteredUsers = filteredUsers.filter((user) => user.active === isActive)
  // if (search) {
  //   filteredUsers = filteredUsers.filter((user) => user.fullname.toLowerCase().includes(search.toLowerCase()))
  // }
  // const { page = 1, perPage = 10 } = filters || {}
  // return {
  //   data: filteredUsers,
  //   pagination: {
  //     page,
  //     perPage,
  //     total: filteredUsers.length,
  //   },
  // }
  const { isActive, search } = filters
  const response = await apiInstance.get(api.allUsers())
  if (response.status === HttpStatusCode.Ok) {
    let filteredUsers = response.data
    filteredUsers = filteredUsers.filter((user: User) => user.active === isActive)
    if (search) {
      filteredUsers = filteredUsers.filter((user: User) => user.fullname.toLowerCase().includes(search.toLowerCase()))
    }
    const { page = 1, perPage = 10 } = filters || {}
    return {
      data: filteredUsers,
      pagination: {
        page,
        perPage,
        total: filteredUsers.length,
      },
    }
  }
  throw new Error(response.data.error)
}

export const createUser = async (user: CreateUser) => {
  const response = await apiInstance.post(api.apiRegister, JSON.stringify(user))

  if (response.status === HttpStatusCode.Ok) {
    const data = response.data
    return data
  } else {
    throw new Error(response.data.error)
  }
}

export const addUser = async (user: User) => {
  // const headers = new Headers()
  // headers.append('Content-Type', 'application/json')

  // const result = await fetch(api.allUsers(), { method: 'POST', body: JSON.stringify(user), headers }).then((r) =>
  //   r.json(),
  // )

  const response = await apiInstance.post(api.allUsers(), JSON.stringify(user))
  if (response.status === HttpStatusCode.Ok) {
    return response.data
  } else throw new Error(response.data.error)
}

export const updateUser = async (user: User) => {
  // const headers = new Headers()
  // headers.append('Content-Type', 'application/json')
  // const result = await fetch(api.user(user.id), { method: 'PUT', body: JSON.stringify(user), headers }).then((r) =>
  //   r.json(),
  // )
  // if (!result.error) {
  //   return result
  // }
  // throw new Error(result.error)
  const response = await apiInstance.put(api.user(user.id), JSON.stringify(user))
  if (response.status === HttpStatusCode.Ok) {
    return response.data
  } else throw new Error(response.data.error)
}

export const removeUser = async (user: User) => {
  // return fetch(api.user(user.id), { method: 'DELETE' })
  const response = await apiInstance.delete(api.user(user.id))
  if (response.status === HttpStatusCode.Ok) {
    return true
  }
  return false
}

export const uploadAvatar = async (body: FormData) => {
  return fetch(api.avatars(), { method: 'POST', body, redirect: 'follow' }).then((r) => r.json())
  // const response = await apiInstance.post(api.avatars(), body)
  // if (response.status === HttpStatusCode.Ok) {
  //   return response.data
  // }
  // throw new Error(response.data.error)
}
