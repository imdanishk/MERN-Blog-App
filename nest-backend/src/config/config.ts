export default () => ({
  port: parseInt(process.env.PORT || '', 10) || 3000,
  database: {
    uri: process.env.MONGO_CONNECTION_URL,
  },
  clerk: {
    webhookSecret: process.env.CLERK_WEBHOOK_SECRET,
    clerkSecretKey: process.env.CLERK_SECRET_KEY,
    clerkFrontendUrl: process.env.CLERK_FRONTEND_API_URL,
  },
  imageKit: {
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  },
  clientUrl: process.env.CLIENT_URL || '*',
});
