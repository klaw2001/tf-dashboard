'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import { Typography, Box, Card, CardContent } from '@mui/material'

// Component Imports
import ProfileCompletionModal from '@/components/ProfileCompletionModal'
import TalentAnalyticsCard from '@/components/TalentAnalyticsCard'

// Context Imports
import { useTalent } from '@/contexts/TalentContext'
import { useHome } from '@/contexts/HomeContext'
import { useAuth } from '@/contexts/AuthContext'

export default function HomePage() {
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profilePercentageData, setProfilePercentageData] = useState(null)

  const { profilePercentage, fetchProfilePercentage, profile } = useTalent()
  const { userRole } = useHome()
  const { user } = useAuth()

  // Check if profile completion modal should be shown
  useEffect(() => {
    const checkProfileCompletion = async () => {
      // Check if user has already seen the modal in this session
      const modalShown = sessionStorage.getItem('profileModalShown')

      if (!modalShown) {
        try {
          // Fetch latest profile percentage
          const response = await fetchProfilePercentage()

          if (response && response.data) {
            const percentage = response.data.profile_percentage || 0
            setProfilePercentageData(response.data)

            // Show modal if profile is not 100% complete
            if (percentage < 100) {
              setShowProfileModal(true)
            }
          }
        } catch (error) {
          console.error('Error checking profile completion:', error)
        }
      }
    }

    checkProfileCompletion()
  }, [])

  const handleCloseModal = () => {
    setShowProfileModal(false)
    // Mark modal as shown in this session
    sessionStorage.setItem('profileModalShown', 'true')
  }

  return (
    <>
      <Box sx={{ p: 3 }}>
        {/* Title & intro removed as requested */}

        {/* Talent-only analytics card */}
        {userRole === 'talent' && (
          <Box sx={{ mt: 3 }}>
            <TalentAnalyticsCard />
          </Box>
        )}

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mt: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Stats
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your dashboard overview and statistics will appear here.
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Recent user activities and notifications will be displayed here.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Profile Completion Modal */}
      <ProfileCompletionModal
        open={showProfileModal}
        onClose={handleCloseModal}
        profileData={profile}
        profilePercentageData={profilePercentageData}
      />
    </>
  )
}
