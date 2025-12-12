# Portfolio Website - Frontend

A modern, responsive portfolio website built with Next.js 14, TypeScript, and Tailwind CSS.

## 🌐 Live Demo

- **Frontend**: [Your Vercel URL]
- **Backend API**: [Your Backend URL]

## ✨ Features

### Public Features
- 🏠 **Home Page**: Attractive landing page with hero section
- 📝 **Blog System**: 
  - View all blogs with ISR (Incremental Static Regeneration)
  - Individual blog pages with dynamic routing
  - Tag filtering and search functionality
- 🚀 **Projects Showcase**: Display personal projects with ISR
- 👨‍💻 **About Me**: Static personal information page (SSG)
- 📱 **Responsive Design**: Works seamlessly on all devices

### Protected Features (Admin Only)
- 🔐 **Secure Authentication**: JWT-based login system
- 📊 **Dashboard**: Overview of statistics and quick actions
- ✍️ **Blog Management**: 
  - Create new blog posts
  - Edit existing blogs
  - Delete blogs
  - Publish/unpublish functionality
- 🔔 **Toast Notifications**: Real-time feedback for all actions

### Technical Features
- ⚡ **ISR**: Incremental Static Regeneration for blogs and projects
- 🎯 **SSG**: Static Site Generation for about page
- 🛡️ **Route Protection**: Middleware-based authentication
- 📱 **Progressive Enhancement**: Loading states and skeletons
- ♿ **Accessibility**: Semantic HTML and ARIA labels
- 🎨 **Modern UI**: Clean, professional design with Tailwind CSS

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Notifications**: react-hot-toast
- **Date Formatting**: date-fns
- **Deployment**: Vercel

## 📁 Project Structure

```
portfolio-frontend/
├── app/
│   ├── (public)/           # Public routes
│   │   ├── page.tsx        # Home
│   │   ├── about/          # About (SSG)
│   │   ├── blogs/          # Blogs (ISR)
│   │   └── projects/       # Projects (ISR)
│   ├── (auth)/             # Auth routes
│   │   └── login/          # Login page
│   ├── dashboard/          # Protected routes
│   │   ├── layout.tsx      # Dashboard layout
│   │   ├── page.tsx        # Dashboard home
│   │   └── blogs/          # Blog management
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── blog/               # Blog components
│   ├── project/            # Project components
│   └── forms/              # Form components
├── context/
│   └── AuthContext.tsx     # Authentication context
├── lib/
│   ├── api.ts              # API functions
│   └── utils.ts            # Utility functions
├── types/
│   └── index.ts            # TypeScript types
└── middleware.ts           # Route protection
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running (see backend README)

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd portfolio-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `NEXT_PUBLIC_APP_URL` | Frontend base URL | `http://localhost:3000` |

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## 🔐 Authentication

The application uses JWT-based authentication:

1. User logs in with email and password
2. Server returns JWT token
3. Token stored in localStorage
4. Token sent with every API request via Axios interceptor
5. Protected routes check token validity via middleware

### Demo Credentials

```
Email: admin@example.com
Password: admin123
```

## 🎨 UI Components

### Reusable Components

- **Button**: Multiple variants (primary, secondary, danger, outline)
- **Input**: Text input with label and error handling
- **Textarea**: Multi-line input with validation
- **Card**: Container with shadow and hover effects
- **LoadingSkeleton**: Loading placeholders

### Page-Specific Components

- **BlogCard**: Display blog preview
- **ProjectCard**: Display project information
- **Navbar**: Navigation with auth state
- **Footer**: Site footer with links

## 📊 Rendering Strategies

### SSG (Static Site Generation)
- **About Page**: Pre-rendered at build time
- Best for: Static content that rarely changes

### ISR (Incremental Static Regeneration)
- **Blogs Page**: Revalidates every 60 seconds
- **Individual Blog**: Revalidates every 60 seconds
- **Projects Page**: Revalidates every 120 seconds
- Best for: Content that updates occasionally

### CSR (Client-Side Rendering)
- **Dashboard**: Protected, user-specific content
- **Login**: Authentication forms
- Best for: Dynamic, user-specific data

## 🛡️ Error Handling

The application implements comprehensive error handling:

1. **Form Validation**: Client-side validation with error messages
2. **API Errors**: Axios interceptor catches and displays errors
3. **Network Errors**: User-friendly messages for connection issues
4. **404 Handling**: Custom not-found pages
5. **Protected Routes**: Automatic redirect to login

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

```bash
# Or use Vercel CLI
npm install -g vercel
vercel
```

### Build for Production

```bash
npm run build
npm run start
```

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## ♿ Accessibility

- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation support
- Focus visible styles
- Screen reader friendly

## 🧪 Testing

```bash
# Add testing commands when implemented
npm run test
npm run test:e2e
```

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Your Name**
- GitHub: [@yourusername]
- Email: your.email@example.com

## 🙏 Acknowledgments

- Next.js Team
- Vercel
- Tailwind CSS
- Open source community

---

**Note**: This is the frontend portion of the portfolio project. For backend setup, see the backend repository.