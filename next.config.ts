import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // webpack(config) {

  //   const fileLoaderRule = config.module.rules.find(
  //     (rule: any) => rule.test?.test?.(".svg")
  //   );

  //   if (fileLoaderRule) {
  //     fileLoaderRule.exclude = /\.svg$/i;
  //   }

  //   config.module.rules.push({
  //     test: /\.svg$/i,
  //     use: ["@svgr/webpack"],
  //   });

  //   return config;
  // },
};

export default nextConfig;