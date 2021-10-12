module.exports ={
  async redirects() {
    return [
      {
        "source": "/",
        "destination": "/dashboard",
        "permanent": true,
      },
    ];
  },
  images: {
    disableStaticImages: true,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  webpack: (config, options) => {
    return config;
  },
};
