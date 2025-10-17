# PromoForge Frontend

A React.js frontend application for managing promo codes with modern UI components and camera scanning capabilities.

## Features

- **Cashier Authentication**: Secure login system with JWT tokens
- **Promo Code Activation**: Manual entry and camera QR code scanning
- **Promo Code Generation**: Create new promo codes via external API
- **Status Checking**: Verify promo code status and details
- **Activation History**: View and search through activation records
- **Settings Management**: Change passwords and view system info
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, professional interface with chalysh-ui components

## Prerequisites

- Node.js v24.10.0 or higher
- npm or yarn package manager
- Modern web browser with camera support (for QR scanning)

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd PromoForgeFront
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file (optional):
   ```bash
   # Create .env file if you need to override default settings
   echo "REACT_APP_API_URL=http://localhost:3001/api" > .env
   ```

## Running the Application

### Development Mode
```bash
npm start
```

The application will start on `http://localhost:3000` and automatically open in your browser.

### Production Build
```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## Application Structure

### Pages/Components

- **Login** (`/login`) - Cashier authentication
- **Dashboard** (`/dashboard`) - Overview and quick actions
- **Activate Promo** (`/activate`) - Activate promo codes with camera scanning
- **Generate Promo** (`/generate`) - Create new promo codes
- **Check Status** (`/status`) - Verify promo code status
- **History** (`/history`) - View activation history
- **Settings** (`/settings`) - Account and system settings

### Key Features

#### Camera QR Code Scanning
- Uses device camera to scan QR codes
- Fallback to manual entry if camera is unavailable
- Real-time scanning with visual feedback

#### Responsive Design
- Mobile-first approach
- Collapsible sidebar navigation
- Touch-friendly interface

#### State Management
- React Context for authentication
- Local state management for forms
- Toast notifications for user feedback

## Default Login

Use these credentials for initial login:
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change the default password after first login!

## API Integration

The frontend communicates with the backend API through:
- Axios HTTP client with interceptors
- Automatic token management
- Error handling and user feedback
- Request/response logging

### API Endpoints Used

- Authentication: `/api/auth/*`
- Promo codes: `/api/promo/*`
- Health check: `/health`

## Environment Configuration

### Available Environment Variables

- `REACT_APP_API_URL` - Backend API URL (default: `http://localhost:3001/api`)
- `NODE_ENV` - Environment mode (development/production)

### Development vs Production

- **Development**: Hot reloading, detailed error messages
- **Production**: Optimized build, minified code, error boundaries

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Camera Requirements

For QR code scanning:
- HTTPS connection (required for camera access)
- User permission for camera access
- Modern browser with WebRTC support

## Security Features

- JWT token authentication
- Automatic token refresh
- Secure password handling
- XSS protection
- CSRF protection via same-origin policy

## Styling and UI

### Design System
- Custom CSS with utility classes
- Consistent color palette
- Responsive grid system
- Icon integration with Lucide React

### Components
- Reusable form components
- Loading states and spinners
- Alert and notification systems
- Modal dialogs and overlays

## Development

### Project Structure
```
PromoForgeFront/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/          # React components
│   │   ├── Login.js
│   │   ├── Dashboard.js
│   │   ├── PromoActivation.js
│   │   ├── PromoGeneration.js
│   │   ├── PromoStatus.js
│   │   ├── ActivationHistory.js
│   │   ├── Settings.js
│   │   └── Layout.js
│   ├── contexts/           # React contexts
│   │   └── AuthContext.js
│   ├── services/           # API services
│   │   └── api.js
│   ├── App.js             # Main app component
│   ├── index.js           # Entry point
│   └── index.css          # Global styles
├── package.json
└── README.md
```

### Adding New Features

1. Create new components in `src/components/`
2. Add new API methods in `src/services/api.js`
3. Update routing in `src/App.js`
4. Add navigation items in `src/components/Layout.js`

### Code Style

- Functional components with hooks
- ES6+ JavaScript features
- Consistent naming conventions
- Component composition over inheritance

## Testing

Run tests with:
```bash
npm test
```

## Building for Production

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Serve the build**:
   ```bash
   # Using serve (install globally: npm install -g serve)
   serve -s build
   
   # Or using any static file server
   ```

3. **Deploy to hosting service**:
   - Upload the `build/` directory contents
   - Configure environment variables
   - Set up HTTPS for camera access

## Troubleshooting

### Common Issues

1. **Camera not working**: Ensure HTTPS and camera permissions
2. **API connection errors**: Check backend server and CORS settings
3. **Authentication issues**: Verify JWT token and backend configuration
4. **Build errors**: Check Node.js version and dependencies

### Browser Console

Check the browser console for:
- Network errors
- JavaScript errors
- API response issues
- Authentication problems

### Network Tab

Monitor network requests for:
- API call failures
- Authentication token issues
- CORS problems
- Response data validation

## Performance Optimization

- Code splitting with React.lazy()
- Image optimization
- Bundle size monitoring
- Lazy loading of components
- Memoization of expensive operations

## Accessibility

- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management
- ARIA labels and roles

## Contributing

1. Follow the existing code style
2. Add appropriate error handling
3. Include user feedback for actions
4. Test on multiple browsers
5. Ensure mobile responsiveness
