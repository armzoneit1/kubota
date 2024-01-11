module.exports = {
  reactStrictMode: true,
  images: {
    loader: "imgix",
    path: "https://nextjs-kubota.web.app/",
  },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  trailingSlash: true,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
}
