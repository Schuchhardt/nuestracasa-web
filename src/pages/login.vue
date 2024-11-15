<script setup lang="ts">
import { VForm } from 'vuetify/components/VForm'
import type { LoginResponse } from '@/@fake-db/types'
import { useAppAbility } from '@/plugins/casl/useAppAbility'
import axios from '@axios'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import { themeConfig } from '@themeConfig'
import { default as authV2MaskDark, default as authV2MaskLight } from '@images/pages/ipanema.jpg'
import avatar1 from '@images/avatars/avatar-1.png'
import type { UserAbility } from '@/plugins/casl/AppAbility';
import { requiredValidator } from '@validators'

const isPasswordVisible = ref(false)

const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

const route = useRoute()
const router = useRouter()

const ability = useAppAbility()

const errors = ref<Record<string, string | undefined>>({
  email: undefined,
  password: undefined,
})

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
  const userData = JSON.parse(localStorage.getItem('userData') || '{}')
  if (userData.userType == "admin") {
    router.replace(route.query.to ? String(route.query.to) : '/dashboards/admin')
  } else {
    if (userData.userType == "customer") {
      router.replace(route.query.to ? String(route.query.to) : '/dashboards/customer-analytics')
    } else {
      router.replace(route.query.to ? String(route.query.to) : '/dashboards/home')
    }
  }
}

const login = () => {
  const userAbilities: UserAbility[] = [
      {
        action: 'manage',
        subject: 'all',
      }
  ]
  isLoading.value = true
  axios.post<LoginResponse>(process.env.API_URL+'/login', { email: email.value, password: password.value })
    .then(r => {
      const { auth: accessToken, user: userData } = r.data
      showErrors.value = false
      localStorage.setItem('userAbilities', JSON.stringify(userAbilities))
      ability.update(userAbilities)

      localStorage.setItem('userData', JSON.stringify({...userData, avatar: avatar1}))
      localStorage.setItem('accessToken', accessToken) 
      isLoading.value = false
      
      // Redirect to `to` query if exist or redirect to index route
      // if (userData.userType == "admin") {
      //   router.replace(route.query.to ? String(route.query.to) : '/dashboards/admin')
      // } else {
      //     router.replace(route.query.to ? String(route.query.to) : '/dashboards/home')
      // }
      router.replace(route.query.to ? String(route.query.to) : '/dashboards/admin')
    })
    .catch(e => {
      showErrors.value = true
      isLoading.value = false
      console.error(e)
    })
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
    <!-- Title and Logo -->
    <!--
      <div class="auth-logo d-flex align-start gap-x-3">
      <VNodeRenderer :nodes="themeConfig.app.logo" />

      <h1 class="font-weight-medium leading-normal text-2xl">
      {{ themeConfig.app.title }}
      </h1>
      </div>
    -->

    <VRow
      no-gutters
      class="auth-wrapper pa-0"
    >
      <VCol
        md="8"
        class="d-none d-md-flex align-center justify-center position-relative"
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
                <strong>Los datos ingresados son incorrectos.</strong>
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

                  <div class="d-flex align-center flex-wrap justify-space-between mt-1 mb-4">
                    <RouterLink
                      class="text-primary text-center ms-2 mb-1"
                      :to="{ name: 'pages-authentication-forgot-password-v2' }"
                    >
                      ¿Olvidaste tu contraseña?
                    </RouterLink>
                  </div>

                  <VBtn
                    block
                    :loading="isLoading"
                    type="submit"
                  >
                    Ingresar
                  </VBtn>
                </VCol>

                <!-- create account -->
                <!-- <VCol
                  cols="12"
                  class="text-center text-base"
                >
                  <span>No tienes cuenta?</span>
                  <RouterLink
                    class="text-primary ms-2"
                    :to="{ name: 'pages-authentication-register-v2' }"
                  >
                    Crear tu cuenta
                  </RouterLink>
                </VCol> -->
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
