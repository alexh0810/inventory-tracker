# Food & Drinks Stock Tracker

A modern stock management system built with Next.js, GraphQL, and MongoDB.

## Live Demo

🚀 Check out the live application: [Stock Tracker](https://inventory-tracker-coral.vercel.app/)

## Prerequisites

- Node.js 16+
- MongoDB Database (Atlas or self-hosted)
- Vercel account (for deployment)

## Environment Setup

1. Clone the repository

```bash
git clone [your-repo-url]
cd food-drinks-stock-tracker
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Update `MONGODB_URI` with your MongoDB connection string

```bash
cp .env.example .env.local
```

## MongoDB Setup

1. Create a MongoDB Atlas account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier is sufficient)
3. Click "Connect" and choose "Connect your application"
4. Copy the connection string and replace the placeholder in `.env.local`
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with your desired database name

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment to Vercel

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com) and sign in with GitHub
3. Click "New Project" and import your repository
4. Configure environment variables:
   - Add `MONGODB_URI` with your production MongoDB connection string
5. Click "Deploy"

### Important Deployment Notes

- Ensure your MongoDB Atlas cluster allows connections from Vercel's IP addresses
- In MongoDB Atlas:
  1. Go to Network Access
  2. Click "Add IP Address"
  3. Click "Allow Access from Anywhere" (or add Vercel's IP range)
  4. Confirm changes

## Features

- 📦 Real-time stock tracking
- 🔔 Low stock notifications
- 📊 Stock analytics
- 🌓 Dark/Light mode
- 📱 Responsive design
- 🔄 Quick stock updates
- 📈 Stock history
- 📋 CSV export

## Testing

Run the test suite:

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
