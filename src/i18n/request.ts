import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as 'es' | 'en' | 'fr' | 'pt')) {
    locale = routing.defaultLocale
  }

  return {
    locale: locale as 'es' | 'en' | 'fr' | 'pt',
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
