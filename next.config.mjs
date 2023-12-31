import { withContentlayer } from "next-contentlayer"

import "./env.mjs"

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["avatars.githubusercontent.com","s3-us-west-2.amazonaws.com","twitter.com","pbs.twimg.com"],
  }
}

export default withContentlayer(nextConfig)
