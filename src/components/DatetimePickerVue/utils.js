import moment from 'moment'

export const getDefaultLocale = () => {
  if (typeof window === 'undefined') return null

  const { userLanguage, language } = window.navigator
  const locale = (userLanguage || language || 'en').toLowerCase()
  moment.locale(locale)
  return locale
}
