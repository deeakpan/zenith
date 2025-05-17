# Zenith: Decentralized Blockchain Mapping Platform

## Project Overview

Zenith is a decentralized mapping platform that visualizes blockchain ecosystems as geographic regions on an interactive world map. The application allows blockchains to claim territory on a real-world map and projects to register within these territories.

## Tech Stack

- Next.js 14.2.15
- TypeScript 5.8.3
- React 18.3.1
- Tailwind CSS 3.4.17
- Framer Motion 12.10.5
- Leaflet 1.9.4
- Lighthouse SDK 0.3.7
- OnchainKit
- Additional libraries as listed in dependencies

## Implementation Phases

### Phase 1: Core Map Implementation

1. Set up base map with CartoDB dark theme

   - URL: https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png
   - Full screen implementation
   - Mobile-responsive design
   - Pan and zoom functionality

2. Implement country borders
   - Load GeoJSON from Natural Earth dataset
   - URL: https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson
   - Remove country name labels
   - Add hover and click interactions
   - Prepare for blockchain data integration

### Phase 2: Navigation Interface

1. Desktop Navigation

   - Floating rectangular nav bar (iPhone notch-like)
   - Semi-transparent dark background
   - Smooth border animations
   - Sections: Explore, Search, Join, About
   - Zenith branding (top-left)
   - Connect wallet button (right side)

2. Mobile Navigation
   - Zenith branding (top-left)
   - Search text button
   - Explore button
   - Menu button with dropdown
   - Connect wallet button (red)
   - Fixed positions during map interaction

### Phase 3: Project Registration System

1. Join Modal Flow

   - Introduction step
     - Dark-themed modal
     - Animated border
     - Semi-transparent background
     - Zenith branding (red)
     - Feature explanations with icons
     - Join button with plus icon

2. Project Type Selection

   - List of categories with dot icons
   - Searchable list
   - Fixed modal size
   - Scrollable content
   - Mobile adaptation

3. Blockchain Selection

   - List of registered blockchains
   - Color indicators
   - Default: Ethereum (gray, US)
   - Lighthouse storage integration
   - Search functionality

4. Dynamic Form System

   - Project-specific questions
   - Required field validation
   - Error messaging
   - Social platform integration
   - Mobile-friendly design

5. Region Selection (Blockchain only)

   - Mini-map interface
   - Country size categorization
   - Selection limits
   - Area calculation
   - Mobile adaptation

6. Confirmation Step
   - Data review
   - Lighthouse storage upload
   - Mobile-friendly layout

### Phase 4: Map Entity Representation

1. Blockchain Territories

   - Colored regions
   - Theme color integration
   - Territory management
   - Mobile interaction

2. Project Markers
   - Circle markers (6px radius)
   - Glow border (2px)
   - Blockchain color integration
   - Tooltip system
   - Click interactions
   - Mobile optimization

### Phase 5: Search Functionality

1. Desktop Integration

   - Navigation bar search
   - Lighthouse storage query
   - Map zoom functionality

2. Mobile Integration
   - Search button
   - Expandable search bar
   - Results display
   - Mobile-friendly UI

### Phase 6: Wallet Integration

1. OnchainKit Implementation
   - Desktop styling
   - Mobile adaptation
   - Connection management

### Phase 7: Data Management

1. Lighthouse SDK Integration
   - File storage system
   - Data retrieval
   - Query optimization
   - Mobile performance

### Phase 8: Mobile Optimization

1. Separate Mobile Layouts
   - Custom components
   - Touch interactions
   - Performance optimization
   - UI/UX refinement

## Key Features

1. Interactive World Map

   - Dark theme
   - Country borders
   - Hover/click interactions
   - Mobile support

2. Project Registration

   - Multi-step process
   - Dynamic forms
   - Region selection
   - Data validation

3. Territory System

   - Blockchain claims
   - Project placement
   - Color management
   - Area calculations

4. Search System
   - Project discovery
   - Map navigation
   - Mobile adaptation

## Environment Variables

- LIGHTHOUSE_API_KEY
- NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME
- NEXT_PUBLIC_ONCHAINKIT_API_KEY

## Development Notes

1. Mobile-First Approach

   - Separate mobile layouts
   - Touch optimization
   - Performance focus

2. UI/UX Guidelines

   - Dark theme
   - Semi-transparent elements
   - Smooth animations
   - Consistent design

3. Data Storage

   - Lighthouse SDK integration
   - File naming conventions
   - Query optimization

4. Performance Considerations
   - Map optimization
   - Mobile responsiveness
   - Data loading
   - Animation smoothness

## Implementation Priority

1. Core map functionality
2. Navigation system
3. Registration flow
4. Data management
5. Search system
6. Mobile optimization
7. Final polish

## Testing Requirements

1. Cross-browser compatibility
2. Mobile device testing
3. Performance metrics
4. User interaction testing
5. Data flow validation
