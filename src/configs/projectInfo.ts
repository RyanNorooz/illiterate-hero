export const projectInfo = {
  name: 'Portfolio',
  phoneNum: {
    label: '',
    href: '#',
  },
  whatsApp: {
    label: '',
    href: '#',
  },
  instagram: {
    label: '',
    href: '#',
  },
} as const satisfies Record<string, string | { label: string; href: string }>
