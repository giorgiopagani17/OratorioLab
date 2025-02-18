<template>
  <q-btn-dropdown
    flat
    :label="currentLocale === 'it' ? '🇮🇹 IT' : '🇬🇧 EN'"
    class="language-switcher"
  >
    <q-list>
      <q-item
        clickable
        v-close-popup
        @click="changeLocale('it')"
        :active="currentLocale === 'it'"
      >
        <q-item-section>
          <q-item-label>🇮🇹 Italiano</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        clickable
        v-close-popup
        @click="changeLocale('en')"
        :active="currentLocale === 'en'"
      >
        <q-item-section>
          <q-item-label>🇬🇧 English</q-item-label>
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

const changeLocale = (lang: 'en' | 'it') => {
  locale.value = lang
  currentLocale.value = lang
  localStorage.setItem('locale', lang) // Save the selected language to localStorage
}
</script>

<style lang="scss" scoped>
.language-switcher {
  margin-left: 10px;
}
</style>
