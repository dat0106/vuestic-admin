<template>
  <VaForm ref="form" @submit.prevent="submit">
    <h1 class="font-semibold text-4xl mb-4">Sign up</h1>
    <p class="text-base mb-4 leading-5">
      Have an account?
      <RouterLink :to="{ name: 'login' }" class="font-semibold text-primary">Login</RouterLink>
    </p>
    <VaInput
      v-model="formData.email"
      :rules="[(v) => !!v || 'Email field is required', (v) => /.+@.+\..+/.test(v) || 'Email should be valid']"
      class="mb-4"
      label="Email"
      type="email"
    />
    <VaValue v-slot="isPasswordVisible" :default-value="false">
      <VaInput
        ref="password1"
        v-model="formData.password"
        :rules="passwordRules"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        label="Password"
        messages="Password should be 8+ characters: letters, numbers, and special characters."
        @clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value"
      >
        <template #appendInner>
          <VaIcon
            :name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'"
            class="cursor-pointer"
            color="secondary"
          />
        </template>
      </VaInput>
      <VaInput
        ref="password2"
        v-model="formData.repeatPassword"
        :rules="[
          (v) => !!v || 'Repeat Password field is required',
          (v) => v === formData.password || 'Passwords don\'t match',
        ]"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        label="Repeat Password"
        @clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value"
      >
        <template #appendInner>
          <VaIcon
            :name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'"
            class="cursor-pointer"
            color="secondary"
          />
        </template>
      </VaInput>
    </VaValue>

    <div class="flex justify-center mt-4">
      <VaButton class="w-full" @click="submit"> Create account</VaButton>
    </div>

    <!-- social login buttons -->
    <div class="flex flex-col gap-2 mt-4">
      <VaButton class="w-full" color="#4285F4" @click="signInWithGoogle">
        <!-- <VaIcon name="Google" class="mr-2" /> -->
        <VaIcon class="mr-2">
          <FontAwesomeIcon :icon="['fab', 'google']" />
        </VaIcon>
        Sign up with Google
      </VaButton>
      <VaButton class="w-full" color="#3b5998" @click="signInWithFacebook">
        <VaIcon name="facebook" class="mr-2" />
        Sign up with Facebook
      </VaButton>
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useToast } from 'vuestic-ui'
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  UserCredential,
} from 'firebase/auth'
import { useGlobalAuthStore } from '@/stores/global-store'
import { useUsersStore } from '@/stores/users'
import { CreateUser } from '../users/types'
const { validate } = useForm('form')

const auth = getAuth()

const globalAuthStore = useGlobalAuthStore()
const useStore = useUsersStore()
const { push } = useRouter()
const { init } = useToast()
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
  await useStore.createUser(createUser)
}
const formData = reactive({
  email: '',
  password: '',
  repeatPassword: '',
})

// Google Sign in
const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  try {
    const userCredential = await signInWithPopup(auth, provider)
    await globalAuthStore.setUserCredential(userCredential)
    const user = await createUser(userCredential)
    console.log('aaaa', user)
    const idToken = await userCredential.user.getIdToken()
    console.log('idToken', idToken)
    init({
      message: "You've successfully signed up",
      color: 'success',
    })
    push({ name: 'dashboard' })
  } catch (error) {
    init({
      message: 'An error occurred. Please try again',
      color: 'danger',
    })
  }
}

// Facebook Sign in
const signInWithFacebook = async () => {
  const provider = new FacebookAuthProvider()
  try {
    const userCredential = await signInWithPopup(auth, provider)
    // const idToken = await userCredential.user.getIdToken()
    console.log(userCredential.user)
    globalAuthStore.setUserCredential(userCredential)
    const user = await createUser(userCredential)
    console.log(user)

    init({
      message: "You've successfully signed up",
      color: 'success',
    })
    push({ name: 'dashboard' })
  } catch (error) {
    init({
      message: 'An error occurred. Please try again',
      color: 'danger',
    })
  }
}
// use firebase to create a new user
const submit = async () => {
  if (validate()) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      await globalAuthStore.setUserCredential(userCredential)
      const user = await createUser(userCredential)
      console.log(user)
      const idToken = await userCredential.user.getIdToken()
      console.log('idToken', idToken)
      // set
      init({
        message: "You've successfully signed up",
        color: 'success',
      })
      push({ name: 'dashboard' })
    } catch (error) {
      init({
        message: 'Bạn đã đăng ký thất bại',
        color: 'danger',
      })
    }
  }
}

const passwordRules: ((v: string) => boolean | string)[] = [
  (v) => !!v || 'Password field is required',
  (v) => (v && v.length >= 8) || 'Password must be at least 8 characters long',
  (v) => (v && /[A-Za-z]/.test(v)) || 'Password must contain at least one letter',
  (v) => (v && /\d/.test(v)) || 'Password must contain at least one number',
  (v) => (v && /[!@#$%^&*(),.?":{}|<>]/.test(v)) || 'Password must contain at least one special character',
]
</script>
