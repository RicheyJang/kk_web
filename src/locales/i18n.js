import { createI18n } from 'vue-i18n'
import enLocale from './lang/en.json'
import zhLocale from './lang/zh-CN.json'

const messages = {
  en: {
    ...enLocale
  },
  "zh-CN": {
    ...zhLocale
  }
}

const i18n = createI18n({
    legacy: false,
    locale: "zh-CN",
    fallbackLocale: "en",
    messages
})

export default i18n
