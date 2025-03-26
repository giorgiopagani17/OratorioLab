import { boot } from 'quasar/wrappers';
import { createI18n } from 'vue-i18n';
import messages from 'src/i18n';

const savedLocale = localStorage.getItem('locale') || 'it';

export default boot(({ app }) => {
  const i18n = createI18n({
    legacy: false,
    locale: savedLocale,
    fallbackLocale: 'en',
    messages
  });

  app.use(i18n);
});
