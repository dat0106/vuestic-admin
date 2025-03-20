export type UserRole = 'admin' | 'user' | 'owner' | 'accountant' | 'staff' | 'editor' | 'guest'

export type UUID = `${string}-${string}-${string}-${string}-${string}`

export type User = {
  id: UUID
  uid: string
  fullname: string
  email: string
  username: string
  role: UserRole
  avatar: string
  phone: string
  address: string
  projects: UUID[]
  notes: string
  active: boolean
}

export type EmptyUser = Omit<
  User,
  'id' | 'uid' | 'fullname' | 'email' | 'username' | 'role' | 'avatar' | 'projects' | 'notes' | 'active'
> & {
  uid: User['uid'] | undefined
  role: User['role'] | undefined
  active: User['active'] | undefined
}

// Tạo kiểu CreateUser bằng cách loại bỏ thuộc tính 'id'
export type CreateUser = Omit<User, 'id'>

// export type CreateUser = Omit<User, 'id' | 'note'> & {
//   uid: string
//   role: UserRole | 'user'
//   email: string | ''
//   fullname: string | ''
//   username: string
//   avatar: string
//   projects: UUID[] | []
//   active: boolean | false
//   address: string | ''
//   phone: string | ''
// }
