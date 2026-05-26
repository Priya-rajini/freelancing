import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { UserProvider } from './context/UserContext'
import { ProjectProvider } from './context/ProjectContext'
import { TalentProvider } from './context/TalentContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <TalentProvider>
        <ProjectProvider>
          <App />
        </ProjectProvider>
      </TalentProvider>
    </UserProvider>
  </StrictMode>,
)
