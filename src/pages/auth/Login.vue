<template>
  <VaForm ref="form" @submit.prevent="submit">
    <h1 class="font-semibold text-4xl mb-4">Log in</h1>
    <p class="text-base mb-4 leading-5">
      New to Vuestic?
      <RouterLink :to="{ name: 'signup' }" class="font-semibold text-primary">Sign up</RouterLink>
    </p>
    <VaInput
      v-model="formData.email"
      :rules="[validators.required, validators.email]"
      class="mb-4"
      label="Email"
      type="email"
    />
    <VaValue v-slot="isPasswordVisible" :default-value="false">
      <VaInput
        v-model="formData.password"
        :rules="[validators.required]"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        label="Password"
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

    <div class="auth-layout__options flex flex-col sm:flex-row items-start sm:items-center justify-between">
      <VaCheckbox v-model="formData.keepLoggedIn" class="mb-2 sm:mb-0" label="Keep me signed in on this device" />
      <RouterLink :to="{ name: 'recover-password' }" class="mt-2 sm:mt-0 sm:ml-1 font-semibold text-primary">
        Forgot password?
      </RouterLink>
    </div>

    <div class="flex justify-center mt-4">
      <VaButton class="w-full" @click="submit"> Login</VaButton>
    </div>

    <!-- social login buttons -->
    <div class="flex flex-col gap-2 mt-4">
      <VaButton class="w-full" color="primary" variant="outlined" @click="signInWithGoogle">
        <VaIcon class="mr-2">
          <FontAwesomeIcon :icon="['fab', 'google']" />
        </VaIcon>
        <span>Continue with Google</span>
      </VaButton>
      <VaButton class="w-full" color="primary" variant="outlined" @click="signInWithFacebook">
        <VaIcon class="mr-2">
          <FontAwesomeIcon :icon="['fab', 'facebook']" />
        </VaIcon>
        <span>Continue with Facebook</span>
      </VaButton>
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useToast } from 'vuestic-ui'
import { validators } from '../../services/utils'
import { getAuth, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth'
import { useGlobalAuthStore } from '@/stores/global-store'
const auth = getAuth()

const { validate } = useForm('form')
const { push } = useRouter()
const { init } = useToast()
const globalAuthStore = useGlobalAuthStore()

const formData = reactive({
  email: '',
  password: '',
  keepLoggedIn: false,
})

// Đăng nhập bằng email/password
const submit = async () => {
  if (validate()) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password)
      await globalAuthStore.setUserCredential(userCredential)
      init({ message: "You've successfully logged in", color: 'success' })
      push({ name: 'dashboard' })
    } catch (error) {
      console.error(error)
      init({ message: 'Đăng nhập thất bại', color: 'danger' })
    }
  }
}

// Đăng nhập bằng Google
const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  try {
    const userCredential = await signInWithPopup(auth, provider)
    await globalAuthStore.setUserCredential(userCredential)

    init({ message: "You've successfully logged in with Google", color: 'success' })
    push({ name: 'dashboard' })
  } catch (error) {
    console.error(error)

    init({ message: 'Đăng nhập thất bại', color: 'danger' })
  }
}

// Đăng nhập bằng Facebook
const signInWithFacebook = async () => {
  const provider = new FacebookAuthProvider()
  try {
    const userCredential = await signInWithPopup(auth, provider)
    await globalAuthStore.setUserCredential(userCredential)
    init({ message: "You've successfully logged in with Facebook", color: 'success' })
    push({ name: 'dashboard' })
  } catch (error) {
    console.error(error)
    init({ message: 'Đăng nhập thất bại', color: 'danger' })
  }
}
</script>
