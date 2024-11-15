export default [
  {
    title: 'Mis Servicios',
    icon: { icon: 'mdi-home-outline' },
    children: [
      {
        title: 'CRM',
        to: 'dashboards-crm',
      },
      {
        title: 'Analytics',
        to: 'dashboards-analytics',
      },
      {
        title: 'eCommerce',
        to: 'dashboards-ecommerce',
      },
    ],
    badgeContent: 'Nuevo',
    badgeClass: 'bg-warning',
  },
]
