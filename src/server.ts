// api/src/server.ts
import app from './app';

const PORT = process.env.PORT || 8080;

async function startServer() {
  try {
    // Initialize secrets in production
    // if (process.env.NODE_ENV === 'production') {
    //   await initializeSecrets();
    // }
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
