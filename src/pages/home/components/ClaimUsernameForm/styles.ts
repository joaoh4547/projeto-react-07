import { Box, styled, Text } from '@ignite-ui/react'

export const Form = styled(Box, {
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  gap: '$2',
  marginTop: '$4',
  padding: '$4',

  '@media (max-width:600px)': {
    gridTemplateColumns: '1fr',
  },
})

export const FormAnnotation = styled('div', {
  marginTop: '$2',

  variants: {
    type: {
      error: {
        [`> ${Text}`]: {
          color: '#f75a68',
        },
      },
      info: {
        [`> ${Text}`]: {
          color: '$gray400',
        },
      },
    },
  },

  defaultVariants: {
    type: 'info',
  },
})
