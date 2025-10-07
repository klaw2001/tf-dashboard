const verticalMenuData = (userRole = 'talent') => {
  const baseMenu = [
    {
      label: 'Home',
      href: '/home',
      icon: 'tabler-smart-home'
    },
    {
      label: 'About',
      href: '/about',
      icon: 'tabler-info-circle'
    }
  ]

  return baseMenu
}

export default verticalMenuData
