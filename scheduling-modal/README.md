# Return It - Pickup Scheduling Modal

A clean, minimal React component for scheduling return pickups. Designed to integrate into any Shopify merchant's return portal.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The dev server will start at `http://localhost:5173`

## Features

- **Address Management**: Pre-filled shipping address with inline editing
- **Contact Info**: Phone (required) and email (optional) for tracking updates
- **Date Picker**: Horizontal scrolling cards for the next 7 days
- **Time Windows**: Morning (7-10am), Midday (10am-1pm), Afternoon (1-4pm)
- **Validation**: Real-time form validation with clear error states
- **Confirmation Screen**: Summary of scheduled pickup details
- **Responsive**: Works on mobile and desktop
- **Accessible**: Proper ARIA labels and keyboard navigation

## Component Usage

```jsx
import PickupScheduler from './components/PickupScheduler'

function App() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <PickupScheduler
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    />
  )
}
```

## Customization

### Mock Data

The component uses mock data defined at the top of `PickupScheduler.jsx`:

```javascript
const mockCustomer = {
  name: "Sarah Chen",
  address: {
    line1: "2847 Oakwood Drive",
    line2: "Apt 4B",
    city: "Austin",
    state: "TX",
    zip: "78704"
  },
  phone: "",
  email: "sarah.chen@email.com"
};

const mockReturn = {
  orderId: "#RT-4892",
  items: [
    { name: "Classic Fit Chino - Navy", size: "32x30", qty: 1 }
  ]
};
```

### Colors

The coral accent color is defined in `src/index.css` and can be customized:

```css
@theme {
  --color-coral-500: #FF6B6B;  /* Primary accent */
  --color-coral-600: #ee5a5a;  /* Hover state */
}
```

## Tech Stack

- React 19 + Vite
- Tailwind CSS v4
- Inter font (Google Fonts)

## Project Structure

```
scheduling-modal/
├── src/
│   ├── components/
│   │   └── PickupScheduler.jsx  # Main component
│   ├── App.jsx                  # Demo wrapper
│   ├── App.css                  # App styles (minimal)
│   ├── index.css                # Tailwind + custom theme
│   └── main.jsx                 # Entry point
├── index.html
├── vite.config.js
└── package.json
```

## Next Steps (V2)

- Real API integration for scheduling
- Driver tracking / live updates
- SMS notification integration
- Calendar sync (iCal, Google Calendar)
