'use client'

// React Imports
import { useEffect, useState } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import Link from '@components/Link'
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

// Service Imports
import { loginWithGoogle } from '../services/auth'

// Context Imports
import { useAuth } from '../contexts/AuthContext'

// Styled Custom Components
const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 680,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 450
  }
}))

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 355,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

const LoginV2 = ({ mode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [googleError, setGoogleError] = useState('')
  const [isFormLoading, setIsFormLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Auth context
  const { signin, isAuthenticated, isLoading } = useAuth()

  // Vars
  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/auth-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-login-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-login-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-login-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-login-light-border.png'

  // Hooks
  const router = useRouter()
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  // Redirect authenticated users away from login
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.replace('/home')
    }
  }, [isAuthenticated, isLoading, router])

  const handleGoogleLogin = async () => {
    try {
      setGoogleError('')
      setIsGoogleLoading(true)
      const result = await loginWithGoogle()
      if (result?.token) {
        // Store token in the same format as AuthContext expects
        localStorage.setItem('auth_token', result.token)
        // Create a mock user object for Google login
        const mockUser = {
          user_id: 'google_user',
          user_email: 'google@example.com',
          user_role: { role_name: 'User' }
        }
        localStorage.setItem('auth_user', JSON.stringify(mockUser))
        router.push('/home')
      } else {
        throw new Error('Invalid token response')
      }
    } catch (err) {
      setGoogleError(err?.message || 'Login failed. Please try again.')
    } finally {
      setIsGoogleLoading(false)
    }
  }

  // Show loading while auth context is initializing
  if (isLoading) {
    return (
      <div className='flex bs-full justify-center items-center'>
        <Typography>Loading...</Typography>
      </div>
    )
  }

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <LoginIllustration src={characterIllustration} alt='character-illustration' />
        {!hidden && (
          <MaskImg
            alt='mask'
            src={authBackground}
            className={classnames({ 'scale-x-[-1]': theme.direction === 'rtl' })}
          />
        )}
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <Link className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </Link>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>{`Welcome to ${themeConfig.templateName}! 👋🏻`}</Typography>
            <Typography>Please sign-in to your account and start the adventure</Typography>
          </div>
          <form
            noValidate
            autoComplete='off'
            onSubmit={async e => {
              e.preventDefault()
              try {
                setFormError('')
                setIsFormLoading(true)

                // Use the new AuthContext signin method
                const result = await signin({
                  user_email: email.trim(),
                  user_password: password
                })

                if (result.success) {
                  // AuthContext automatically handles token storage
                  router.push('/home')
                } else {
                  setFormError(result.error || 'Login failed. Please try again.')
                }
              } catch (err) {
                setFormError(err?.message || 'Login failed. Please try again.')
              } finally {
                setIsFormLoading(false)
              }
            }}
            className='flex flex-col gap-5'
          >
            <CustomTextField
              autoFocus
              fullWidth
              label='Email or Username'
              placeholder='Enter your email or username'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <CustomTextField
              fullWidth
              label='Password'
              placeholder='············'
              id='outlined-adornment-password'
              type={isPasswordShown ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                        <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />
            <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
              <FormControlLabel control={<Checkbox />} label='Remember me' />
              <Typography className='text-end' color='primary.main' component={Link}>
                Forgot password?
              </Typography>
            </div>
            <Button fullWidth variant='contained' type='submit' disabled={isFormLoading}>
              {isFormLoading ? 'Signing in…' : 'Login'}
            </Button>
            {formError ? (
              <Typography color='error.main' variant='body2'>
                {formError}
              </Typography>
            ) : null}
            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>New on our platform?</Typography>
              <Typography component={Link} color='primary.main'>
                Create an account
              </Typography>
            </div>
            <Divider className='gap-2 text-textPrimary'>or</Divider>
            <div className='flex flex-col gap-3'>
              <Button
                fullWidth
                variant='outlined'
                color='error'
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                startIcon={<i className='tabler-brand-google-filled' />}
              >
                {isGoogleLoading ? 'Signing in with Google…' : 'Continue with Google'}
              </Button>
              {googleError ? (
                <Typography color='error.main' variant='body2'>
                  {googleError}
                </Typography>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginV2
