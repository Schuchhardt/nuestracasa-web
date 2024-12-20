<script setup lang="ts">
import { VForm } from 'vuetify/components/VForm'
import type { LoginResponse } from '@/@fake-db/types'
import { useAppAbility } from '@/plugins/casl/useAppAbility'
import axios,{ AxiosError } from 'axios'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import { default as authV2MaskDark, default as authV2MaskLight } from '@images/pages/ipanema.jpg'
import avatar1 from '@images/avatars/avatar-1.png'
import type { UserAbility } from '@/plugins/casl/AppAbility';
import { requiredValidator } from '@validators'

const isPasswordVisible = ref(false)

const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

const route = useRoute()
const router = useRouter()

const ability = useAppAbility()

const errorMessages = {
  'USER_NOT_FOUND': 'Usuario no encontrado.',
  'PASSWORD_NOT_MATCH': 'Contraseña incorrecta.',
  'USER_NO_MODULES': 'Usuario no tiene acceso a ningún módulo.',
  'DEFAULT': 'Los datos ingresados son incorrectos.'
} as const

interface ErrorResponse {
  code: "USER_NOT_FOUND" | "PASSWORD_NOT_MATCH" | "USER_NO_MODULES" | "DEFAULT"
  message: string
  // Agrega otros campos que pueda tener tu respuesta de error
}
const errorDescription = ref('')

const refVForm = ref<VForm>()
const email = ref('')
const password = ref('')
const showErrors = ref(false)
const isLoading = ref(false)


// check url param logout=1 to force logout
if (route.query.logout == '1') {
  localStorage.removeItem('userData')
  localStorage.removeItem('accessToken')
  localStorage.removeItem('userAbilities')
  ability.update([])
}

// check on mount if user is already logged in
if (localStorage.getItem('accessToken')) {
  // call get user profile api to check if token is valid
  axios.get<LoginResponse>(process.env.API_URL+'/profile', {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('accessToken')
    }
  }
  )
    .then(r => {
      if (!r.data?.auth) {
        console.error('Login failed:', r)
        return
      }
      const { auth: accessToken, user: userData } = r.data
      localStorage.setItem('userData', JSON.stringify({...userData, avatar: avatar1}))
      localStorage.setItem('accessToken', accessToken) 
      ability.update(JSON.parse(localStorage.getItem('userAbilities') || '[]'))
      router.replace(route.query.to ? String(route.query.to) : '/dashboards/admin')
    })
    .catch(e => {
      console.error(e)
    })
}

const handleLoginError = (error: AxiosError<ErrorResponse>) => {
  showErrors.value = true
  isLoading.value = false

  // Verifica si el error tiene una respuesta del servidor
  if (error.response?.data?.code) {
    const errorKey = error.response.data.code as keyof typeof errorMessages
    errorDescription.value = errorMessages[errorKey] || errorMessages.DEFAULT
  } else {
    // Manejo de errores de red u otros errores
    errorDescription.value = 'Error de conexión. Por favor, intente nuevamente.'
  }

  console.log('Login error:', error)
}

const login = async () => {
  const userAbilities: UserAbility[] = [
      {
        action: 'manage',
        subject: 'all',
      }
  ]
  try {
    isLoading.value = true
    showErrors.value = false

    const response = await axios.post<LoginResponse>(
      `${process.env.API_URL}/login`,
      { 
        email: email.value, 
        password: password.value 
      }
    )

    // Validación de la respuesta
    if (!response?.data?.auth) {
      throw new Error('Login failed: Invalid response format')
    }

    const { auth: accessToken, user: userData, login_iframe_url } = response.data

    // Guardar datos en localStorage
    localStorage.setItem('userData', JSON.stringify({...userData, avatar: avatar1}))
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('userAbilities', JSON.stringify(userAbilities))
    localStorage.setItem('userDefaultApp', login_iframe_url)
    
    // Actualizar ability
    ability.update(userAbilities)

    isLoading.value = false
    
    router.replace(route.query.to ? String(route.query.to) : '/dashboards/admin')
    // Retornar los datos por si se necesitan en el componente
    return { accessToken, userData }

  } catch (error) {
    handleLoginError(error as AxiosError<ErrorResponse>)
    throw error // Re-lanzar el error para manejo adicional si es necesario
  }
}


const onSubmit = () => {

  refVForm.value?.validate()
    .then(({ valid: isValid }) => {
      if (isValid)
        login()
    })
}
</script>

<template>
  <div>

    <VRow
      no-gutters
      class="auth-wrapper pa-0"
    >
      <VCol
        md="8"
        class="d-none d-md-flex align-center justify-center position-relative bg-black"
      >
        <div class="d-flex align-center justify-center w-100 pa-0 pe-0">
          <VImg
            max-width="1024px"
            :src="authThemeMask"
            class="auth-illustration"
          />
        </div>
      </VCol>

      <VCol
        cols="12"
        md="4"
        class="auth-card-v2 d-flex align-center justify-center"
      >
      
      <VCard
      flat
      :max-width="500"
      class="mt-4 mt-sm-0 pa-4"
      >
          <VRow>
            <img src="/logo.png" class="logo-img" alt="Logo">
          </VRow>
          <VCardText>
            <h5 class="text-h5 mb-1 text-center">
              Bienvenido! 👋🏻
            </h5>
            <p class="mb-0">
              Para empezar inicia sesión en tu cuenta.
            </p>
          </VCardText>
          <VCardText v-if="showErrors">
            <VAlert
              color="primary"
              variant="tonal"
            >
              <p class="text-caption mb-0">
                <strong>{{ errorDescription }}</strong>
              </p>
            </VAlert>
          </VCardText>
          <VCardText>
            <VForm ref="refVForm" @submit.prevent="onSubmit()">
              <VRow>
                <!-- email -->
                <VCol cols="12">
                  <VTextField
                    v-model="email"
                    autofocus
                    label="Correo"
                    type="text"
                    :rules="[requiredValidator]"
                  />
                </VCol>

                <!-- password -->
                <VCol cols="12">
                  <VTextField
                    v-model="password"
                    label="Contraseña"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                    @click:append-inner="isPasswordVisible = !isPasswordVisible"
                    :rules="[requiredValidator]"
                  />

                  <!-- <div class="d-flex align-center flex-wrap justify-space-between mt-1 mb-4">
                    <RouterLink
                      class="text-primary text-center ms-2 mb-1"
                      :to="{ name: 'pages-authentication-forgot-password-v2' }"
                    >
                      ¿Olvidaste tu contraseña?
                    </RouterLink>
                  </div> -->

                  <VBtn
                    block
                    :loading="isLoading"
                    type="submit"
                  >
                    Ingresar
                  </VBtn>
                </VCol>

              </VRow>
            </VForm>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";

</style>

<route lang="yaml">
meta:
  layout: blank
</route>
