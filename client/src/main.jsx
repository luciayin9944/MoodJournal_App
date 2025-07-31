import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createTheme, MantineProvider } from '@mantine/core'
import App from './App.jsx'

const theme= createTheme({
  colorScheme: 'dark',
  primaryColor: 'violet',
  fontFamily: 'Rubik, sans-serif',
  defaultRadius: 'md',
  headings: {
    fontFamily: 'Roboto Slab, serif',
    sizes: {
      h1: { fontSize: '2.8rem' },
      h2: { fontSize: '2.2rem' },
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
      <App />
    </MantineProvider>
  </StrictMode>,
)










// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
