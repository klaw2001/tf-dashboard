// Context Imports
import { VerticalNavProvider } from '@menu/contexts/verticalNavContext'
import { SettingsProvider } from '@core/contexts/settingsContext'
import { AuthProvider } from '../contexts/AuthContext'
import { TalentProvider } from '../contexts/TalentContext'
import ThemeProvider from '@components/theme'

// Util Imports
import { getMode, getSettingsFromCookie, getSystemMode } from '@core/utils/serverHelpers'

const Providers = async props => {
  // Props
  const { children, direction } = props

  // Vars
  const mode = await getMode()
  const settingsCookie = await getSettingsFromCookie()
  const systemMode = await getSystemMode()

  return (
    <VerticalNavProvider>
      <SettingsProvider settingsCookie={settingsCookie} mode={mode}>
        <AuthProvider>
          <TalentProvider>
            <ThemeProvider direction={direction} systemMode={systemMode}>
              {children}
            </ThemeProvider>
          </TalentProvider>
        </AuthProvider>
      </SettingsProvider>
    </VerticalNavProvider>
  )
}

export default Providers
