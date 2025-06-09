import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Layout from './Layout'; // Layout is a top-level component, not part of atomic design structure below components
import { routes } from '@/config/routes';
import NotFoundPage from '@/components/pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen overflow-hidden bg-white">
        <Routes>
          <Route path="/" element={<Layout />}>
            {Object.values(routes).map(route => (
              <Route 
                key={route.id} 
                path={route.path} 
                element={<route.component />}
                index={route.path === '/'}
              />
            ))}
<Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
          toastStyle={{
            background: '#ffffff',
            color: '#334155',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
          }}
        />
      </div>
    </BrowserRouter>
  )
}

export default App