import { HashRouter, Routes, Route } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { HomePage } from './pages/HomePage'
import { FollowupsPage } from './pages/FollowupsPage'
import { SearchPage } from './pages/SearchPage'
import { ShareTargetPage } from './pages/ShareTargetPage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/followups" element={<FollowupsPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Route>
        <Route path="/share-target" element={<ShareTargetPage />} />
      </Routes>
    </HashRouter>
  )
}
