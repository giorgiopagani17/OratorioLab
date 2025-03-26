<template>
  <q-btn-dropdown
    flat
    :label="currentLocale === 'it' ? '🇮🇹 IT' : '🇬🇧 EN'"
    class="language-switcher"
  >
    <q-list>
      <q-item
        v-for="lang in availableLanguages"
        :key="lang.code"
        clickable
        v-close-popup
        @click="changeLocale(lang.code)"
        :active="currentLocale === lang.code"
      >
        <q-item-section>
          <q-item-label>{{ lang.flag }} {{ lang.name }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const currentLocale = ref(locale.value)
type SupportedLanguage = 'en' | 'it'
const availableLanguages: Array<{code: SupportedLanguage, name: string, flag: string}> = [
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
]

const changeLocale = (lang: 'en' | 'it') => {
  locale.value = lang
  currentLocale.value = lang
  localStorage.setItem('locale', lang)
}
</script>

<style lang="scss" scoped>
.language-switcher {
  margin-left: 10px;
}
</style>
