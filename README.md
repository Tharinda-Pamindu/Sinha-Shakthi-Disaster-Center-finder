# සිංහ ශක්ති (Sinha Shakthi) - Disaster Center Finder

A full-stack web application for finding and managing disaster relief centers using Google Maps API and Prisma database.

**සිංහ ශක්ති** (Sinha Shakthi) means "Lion's Strength" in Sinhala, representing the strength and resilience of communities in times of disaster.

## Features

- 🗺️ **Interactive Google Maps Integration**: View all disaster centers on an interactive map
- 📍 **Geolocation**: Automatically detect user's current location
- 🔍 **Smart Search**: Search disaster centers within a specified radius
- 📏 **Distance Calculation**: See distance from your location to each center
- ➕ **Add Centers**: Add new disaster centers with detailed information
- 🎯 **Nearest Centers**: Quickly find the nearest disaster centers to your location
- 💾 **Persistent Storage**: All data stored securely in Prisma Accelerate PostgreSQL database
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Maps**: Google Maps API with @react-google-maps/api
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM and Prisma Accelerate
- **Deployment Ready**: Optimized for production deployment

## Prerequisites

- Node.js 18+ installed
- Google Maps API Key
- Prisma Database URL (already configured)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Edit the `.env` file and add your Google Maps API key:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_google_maps_api_key_here"
```

**Get a Google Maps API Key:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - Maps JavaScript API
   - Geocoding API (optional, for address lookup)
4. Create credentials (API Key)
5. Copy the API key to your `.env` file

### 3. Set Up Prisma Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to database
npm run prisma:push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
disaster-center-finder/
├── app/
│   ├── api/
│   │   └── disaster-centers/
│   │       ├── route.ts              # GET all, POST new center
│   │       ├── [id]/route.ts         # GET, PUT, DELETE specific center
│   │       └── nearest/route.ts      # GET nearest centers
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Main page
│   └── globals.css                   # Global styles
├── components/
│   ├── MapComponent.tsx              # Google Maps integration
│   ├── AddCenterForm.tsx             # Form for adding centers
│   └── CenterList.tsx                # List of disaster centers
├── lib/
│   ├── prisma.ts                     # Prisma client setup
│   └── geo-utils.ts                  # Geolocation utilities
├── prisma/
│   └── schema.prisma                 # Database schema
├── types/
│   └── index.ts                      # TypeScript types
├── .env                              # Environment variables
├── package.json
└── README.md
```

## Database Schema

The `DisasterCenter` model includes:
- Basic info: name, address, description
- Location: latitude, longitude (indexed for fast queries)
- Contact: phone, email
- Capacity: number of people
- Facilities: array of available services
- Status: active/inactive flag
- Timestamps: created and updated dates

## API Endpoints

### GET `/api/disaster-centers`
Fetch all disaster centers, optionally filtered by location and radius.

**Query Parameters:**
- `lat`: User latitude (optional)
- `lng`: User longitude (optional)
- `radius`: Search radius in km (default: 50)
- `limit`: Max results (default: 100)

### POST `/api/disaster-centers`
Create a new disaster center.

**Body:**
```json
{
  "name": "Emergency Shelter",
  "address": "123 Main St",
  "description": "Large emergency shelter",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "capacity": 500,
  "contactPhone": "+1234567890",
  "contactEmail": "contact@shelter.org",
  "facilities": ["Shelter", "Medical", "Food"]
}
```

### GET `/api/disaster-centers/nearest`
Find nearest disaster centers to a location.

**Query Parameters:**
- `lat`: User latitude (required)
- `lng`: User longitude (required)
- `limit`: Max results (default: 5)

### GET/PUT/DELETE `/api/disaster-centers/[id]`
Get, update, or delete a specific disaster center by ID.

## Usage Guide

### Finding Disaster Centers

1. **Allow Location Access**: Click "Get My Location" to enable geolocation
2. **View All Centers**: See all disaster centers on the map with red markers
3. **Filter by Distance**: Use "Show Nearest Only" to see the closest centers
4. **Adjust Search Radius**: Change the radius to search within a specific area
5. **View Details**: Click on any marker or list item to see full details

### Adding a Disaster Center

1. Click "+ Add Disaster Center"
2. Click on the map to select location (green marker appears)
3. Fill in the form:
   - Name and address (required)
   - Description, capacity, contact info (optional)
   - Select available facilities
4. Click "Add Disaster Center"
5. The new center appears immediately on the map

### Map Legend

- 🔵 Blue Marker: Your current location
- 🔴 Red Markers: Disaster centers
- 🟢 Green Marker: Selected location for new center

## Features Explained

### Automatic Distance Calculation
Uses the Haversine formula to calculate accurate distances between coordinates in kilometers.

### Smart Filtering
Filter centers by:
- Distance from your location
- Search radius
- Show only nearest centers

### Real-time Updates
All changes reflect immediately on both the map and the list view.

### Responsive Design
- Desktop: Side-by-side map and list
- Mobile: Stacked layout for easy navigation

## Production Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables for Production

Ensure these are set in your production environment:
- `DATABASE_URL`: Your Prisma Accelerate connection string
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Your Google Maps API key

### Recommended Platforms

- **Vercel**: Optimized for Next.js (recommended)
- **Netlify**: Good Next.js support
- **AWS/Azure/GCP**: For custom deployment

## Prisma Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema changes to database
npm run prisma:push

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

## Troubleshooting

### Maps not loading?
- Check your Google Maps API key is correct
- Ensure Maps JavaScript API is enabled in Google Cloud Console
- Check browser console for API errors

### Location not working?
- Ensure you're using HTTPS (required for geolocation)
- Check browser permissions for location access
- Try clicking "Get My Location" again

### Database errors?
- Verify DATABASE_URL in `.env` is correct
- Run `npm run prisma:generate`
- Check Prisma Accelerate connection

## Future Enhancements

- User authentication and authorization
- Real-time updates using WebSockets
- Advanced search filters (by facilities, capacity)
- Directions to disaster centers
- Mobile app version
- Multi-language support
- Rating and review system
- Emergency notifications

## License

MIT License - Feel free to use this project for any purpose.

## Support

For issues and questions, please create an issue in the repository.

---

Built with ❤️ using Next.js, React, and Google Maps API
