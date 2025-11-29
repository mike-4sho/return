import { useState } from 'react'
import PickupScheduler from './components/PickupScheduler'

function App() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200">
      {/* Demo trigger button (shown when modal is closed) */}
      {!isOpen && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">Return It</h1>
            <p className="text-gray-500 mb-6">Doorstep pickup scheduling</p>
            <button
              onClick={() => setIsOpen(true)}
              className="px-6 py-3 bg-coral-500 hover:bg-coral-600 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-coral-500/25"
            >
              Schedule a Pickup
            </button>
          </div>
        </div>
      )}

      {/* The scheduling modal */}
      <PickupScheduler
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  )
}

export default App
