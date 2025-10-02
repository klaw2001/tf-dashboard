// Profile data structure matching the design from images
export const profileData = {
  user: {
    id: '1815661',
    name: 'Sarah Mitchell',
    title: 'Senior Software Architect',
    location: 'San Francisco, CA',
    experience: '15+ years experience',
    profilePicture: null, // Will use initials 'SA'
    profileCompleteness: 75,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sarahmitchell',
      behance: 'https://behance.net/sarahmitchell',
      website: 'https://sarahmitchell.dev',
      github: 'https://github.com/saraharchitect'
    }
  },

  aboutMe: {
    content:
      "Experienced software architect with 15+ years of expertise in building scalable distributed systems and leading high-performing engineering teams. Passionate about mentoring junior developers and driving technical excellence across organizations. I specialize in cloud-native architectures, microservices design, and full-stack development. My experience spans from early-stage startups to Fortune 500 companies, where I've consistently delivered solutions that scale to millions of users while maintaining high performance and reliability."
  },

  professionalSummary: {
    content:
      'Senior Software Architect | 15+ Years | Python, AWS, Microservices Expert | Team Leadership | Scalable Systems | Performance Optimization | Mentoring | Technical Strategy | Cloud-Native Architecture | Full-Stack Development | Startup to Enterprise Experience',
    isAIOptimized: true
  },

  skills: {
    categories: [
      {
        name: 'Programming Languages',
        skills: [
          { name: 'Python', percentage: 95 },
          { name: 'JavaScript', percentage: 90 }
        ]
      },
      {
        name: 'Frontend',
        skills: [{ name: 'React', percentage: 92 }]
      },
      {
        name: 'Backend',
        skills: [{ name: 'Node.js', percentage: 88 }]
      },
      {
        name: 'Cloud',
        skills: [{ name: 'AWS', percentage: 85 }]
      },
      {
        name: 'DevOps',
        skills: [
          { name: 'Docker', percentage: 90 },
          { name: 'Kubernetes', percentage: 80 }
        ]
      },
      {
        name: 'Database',
        skills: [{ name: 'PostgreSQL', percentage: 85 }]
      },
      {
        name: 'Management',
        skills: [{ name: 'Team Leadership', percentage: 92 }]
      },
      {
        name: 'Architecture',
        skills: [{ name: 'System Architecture', percentage: 95 }]
      }
    ]
  },

  projects: [
    {
      id: 1,
      title: 'E-commerce Platform Migration',
      description:
        'Led complete migration from monolithic architecture to microservices, improving scalability and reducing deployment time by 80%.',
      duration: '18 months',
      impact: '40% improvement in system performance',
      technologies: ['Python', 'Docker', 'Kubernetes', 'AWS', 'PostgreSQL'],
      links: {
        github: 'https://github.com/saraharchitect/ecommerce-migration',
        demo: 'https://demo.sarahmitchell.dev/ecommerce',
        images: 2
      },
      image: null
    },
    {
      id: 2,
      title: 'Real-time Analytics Dashboard',
      description:
        'Built high-performance analytics platform processing 1M+ events per second with real-time visualization capabilities.',
      duration: '12 months',
      impact: '50% faster business decision making',
      technologies: ['React', 'Node.js', 'Redis', 'Apache Kafka', 'D3.js'],
      links: {
        github: 'https://github.com/saraharchitect/analytics-dashboard',
        images: 3
      },
      image: null
    },
    {
      id: 3,
      title: 'AI-Powered Recommendation Engine',
      description:
        'Developed machine learning recommendation system increasing user engagement by 35% and conversion rates by 25%.',
      duration: '10 months',
      impact: '$2M additional annual revenue',
      technologies: ['Python', 'TensorFlow', 'Apache Spark', 'Elasticsearch'],
      links: {
        github: 'https://github.com/saraharchitect/recommendation-engine',
        demo: 'https://demo.sarahmitchell.dev/recommendations',
        images: 1
      },
      image: null
    }
  ],

  experience: [
    {
      id: 1,
      title: 'Senior Software Architect',
      company: 'TechCorp Inc.',
      duration: '2020 - Present',
      location: 'San Francisco, CA',
      achievements: [
        'Led migration of monolith to microservices architecture serving 10M+ users',
        'Reduced system latency by 40% through performance optimization initiatives',
        'Managed and mentored engineering team of 15+ developers'
      ]
    },
    {
      id: 2,
      title: 'Lead Developer',
      company: 'InnovateTech',
      duration: '2017 - 2020',
      location: 'New York, NY',
      achievements: [
        'Built scalable e-commerce platform handling $50M+ annual revenue',
        'Implemented CI/CD pipeline reducing deployment time by 80%',
        'Led technical interviews and established engineering best practices'
      ]
    },
    {
      id: 3,
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      duration: '2014 - 2017',
      location: 'Austin, TX',
      achievements: [
        'Developed MVP that attracted $5M Series A funding',
        'Built real-time analytics dashboard processing 1M+ events daily',
        'Collaborated with product team to define technical requirements'
      ]
    }
  ],

  portfolio: {
    media: [
      {
        id: 1,
        type: 'images',
        title: 'Project Screenshots',
        count: 5,
        gradient: 'from-purple-500 to-pink-500'
      },
      {
        id: 2,
        type: 'document',
        title: 'Technical Resume',
        format: 'PDF Document',
        gradient: 'from-green-500 to-teal-500'
      },
      {
        id: 3,
        type: 'videos',
        title: 'Demo Videos',
        count: 3,
        gradient: 'from-pink-500 to-purple-500'
      }
    ],
    externalLinks: [
      {
        id: 1,
        title: 'Personal Website',
        url: 'https://sarahmitchell.dev',
        icon: 'tabler-world'
      },
      {
        id: 2,
        title: 'GitHub Portfolio',
        url: 'https://github.com/saraharchitect',
        icon: 'tabler-brand-github'
      }
    ]
  },

  availability: {
    preferences: [
      {
        id: 1,
        type: 'Full-time',
        description: '40+ hours/week',
        active: true,
        fields: {
          minSalary: 180000,
          maxSalary: 220000
        }
      },
      {
        id: 2,
        type: 'Part-time',
        description: '20-30 hours/week',
        active: false,
        fields: {
          hourlyRate: 150,
          minHours: 20
        }
      },
      {
        id: 3,
        type: 'Consulting',
        description: 'Project-based',
        active: true,
        fields: {
          hourlyRate: 200,
          dailyRate: 1600
        }
      }
    ],
    additionalPreferences: {
      workLocation: 'Remote Only',
      noticePeriod: 'Immediate',
      timeZone: 'PST (UTC-8)',
      travelWillingness: 'No Travel'
    }
  },

  reviews: {
    overallRating: 4.9,
    totalReviews: 12,
    testimonials: [
      {
        id: 1,
        clientName: 'Michael Johnson',
        clientTitle: 'CTO, TechStartup Inc.',
        clientInitials: 'MJ',
        rating: 5,
        testimonial:
          'Sarah led the complete transformation of our architecture from a monolithic system to microservices. Her expertise in cloud technologies and team leadership was instrumental in our success. The project was delivered on time and exceeded our performance expectations.',
        engagement: {
          type: 'Full-time Engagement',
          duration: '6 months',
          period: 'January 2024'
        },
        avatarColor: 'blue'
      },
      {
        id: 2,
        clientName: 'Alex Rodriguez',
        clientTitle: 'VP Engineering, DataCorp',
        clientInitials: 'AR',
        rating: 5,
        testimonial:
          'Exceptional consultant! Sarah helped us optimize our data pipeline performance and implemented best practices for scalability. Her communication skills and technical depth made the collaboration seamless. Highly recommend for any complex system challenges.',
        engagement: {
          type: 'Consulting Project',
          duration: '3 months',
          period: 'October 2023'
        },
        avatarColor: 'green'
      },
      {
        id: 3,
        clientName: 'Lisa Wang',
        clientTitle: 'Founder, InnovateApp',
        clientInitials: 'LW',
        rating: 4.5,
        testimonial:
          'Sarah was instrumental in getting our MVP to market quickly. Her full-stack expertise and mentorship of our junior developers accelerated our development timeline significantly. Great balance of technical skills and business understanding.',
        engagement: {
          type: 'Part-time Engagement',
          duration: '4 months',
          period: 'June 2023'
        },
        avatarColor: 'purple'
      }
    ]
  }
}

// Helper functions for profile data
export const getInitials = name => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
}

export const getAvatarColor = color => {
  const colors = {
    blue: '#3B82F6',
    green: '#10B981',
    purple: '#8B5CF6',
    red: '#EF4444',
    orange: '#F59E0B',
    teal: '#14B8A6'
  }
  return colors[color] || colors.blue
}
