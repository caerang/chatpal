# ChatPal 🤖💬

**An AI-powered English conversation tutor that helps you practice and improve your English skills through natural conversations.**

[![React](https://img.shields.io/badge/React-19.1.0-61dafb?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178c6?style=flat&logo=typescript)](https://typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646cff?style=flat&logo=vite)](https://vitejs.dev/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI-4285f4?style=flat&logo=google)](https://ai.google.dev/)

---

## ✨ Features

- 🧠 **AI-Powered Conversations**: Engage with Google Gemini AI for natural English practice
- 🔍 **Real-time Corrections**: Get instant feedback and suggestions for better English expressions
- 🔐 **Social Authentication**: Sign in with Google or Kakao accounts
- 📱 **Responsive Design**: Modern UI that works on desktop and mobile devices
- ⚡ **Fast & Lightweight**: Built with Vite for optimal performance
- 🎨 **Beautiful Interface**: Clean, dark-themed design for comfortable chatting

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Google Gemini API Key**
- **Google OAuth Client ID** (optional, for Google login)
- **Kakao App Key** (optional, for Kakao login)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/chatpal.git
   cd chatpal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Required: Gemini AI API Key
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   
   # Optional: Google OAuth (for Google login)
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   
   # Optional: Kakao OAuth (for Kakao login)
   VITE_KAKAO_APP_KEY=your_kakao_app_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

---

## 🔧 Configuration

### Google OAuth Setup

For detailed Google OAuth configuration, see [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)

**Quick steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Identity API
4. Create OAuth 2.0 credentials
5. Add authorized origins: `http://localhost:5173`

### Kakao OAuth Setup

For detailed Kakao OAuth configuration, see [KAKAO_SETUP.md](./KAKAO_SETUP.md)

**Quick steps:**
1. Visit [Kakao Developers](https://developers.kakao.com/)
2. Create a new application
3. Set platform domain: `http://localhost:5173`
4. Enable Kakao Login
5. Copy JavaScript App Key

### Gemini AI Setup

1. Visit [Google AI Studio](https://ai.google.dev/)
2. Create a new API key
3. Add the key to your `.env` file as `VITE_GEMINI_API_KEY`

---

## 📁 Project Structure

```
chatpal/
├── src/
│   ├── components/           # React components
│   │   ├── ChatInterface.tsx # Main chat interface
│   │   ├── Login.tsx         # Authentication component
│   │   ├── Message.tsx       # Chat message component
│   │   └── Icons.tsx         # SVG icon components
│   ├── services/             # Business logic
│   │   ├── authService.ts    # Authentication management
│   │   ├── geminiService.ts  # AI service integration
│   │   └── providers/        # Auth provider implementations
│   │       ├── AbstractAuthProvider.ts
│   │       ├── GoogleAuthProvider.ts
│   │       └── KakaoAuthProvider.ts
│   ├── App.tsx              # Main application component
│   ├── types.ts             # TypeScript type definitions
│   └── constants.ts         # Application constants
├── docs/                    # Documentation
├── public/                  # Static assets
└── package.json
```

---

## 🎯 How It Works

1. **Authentication**: Users can sign in using Google or Kakao accounts
2. **Chat Interface**: Clean, modern chat interface for natural conversations
3. **AI Responses**: Google Gemini AI provides contextual responses and corrections
4. **Real-time Feedback**: AI suggests better ways to express ideas
5. **Persistent Sessions**: Login state is maintained across browser sessions

---

## 🛠️ Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check
```

---

## 🌐 Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Environment Variables for Production

Make sure to set these environment variables in your production environment:

- `VITE_GEMINI_API_KEY`: Your Gemini API key
- `VITE_GOOGLE_CLIENT_ID`: Google OAuth client ID (optional)
- `VITE_KAKAO_APP_KEY`: Kakao app key (optional)

### Deployment Platforms

This app can be deployed to:
- **Vercel**: Zero-config deployment
- **Netlify**: Automatic builds from Git
- **GitHub Pages**: Free hosting for static sites
- **AWS S3 + CloudFront**: Scalable hosting solution

---

## 🔒 Security Considerations

- **API Keys**: Never commit API keys to version control
- **HTTPS**: Always use HTTPS in production
- **CORS**: Configure proper CORS settings for your domain
- **OAuth**: Ensure redirect URIs are properly configured

---

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini AI** for providing powerful language models
- **React Team** for the excellent frontend framework
- **Vite** for the blazing fast build tool
- **Tailwind CSS** for utility-first styling

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [documentation](./docs/)
2. Search existing [issues](https://github.com/yourusername/chatpal/issues)
3. Create a new issue with detailed information
4. Contact us at: support@chatpal.app

---

## 🔮 Roadmap

- [ ] Voice conversation support
- [ ] Progress tracking and analytics
- [ ] Custom learning topics
- [ ] Conversation history export
- [ ] Multi-language support
- [ ] Mobile app development

---

**Happy Learning! 🎓**