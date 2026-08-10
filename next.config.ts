import type { NextConfig } from 'next';
import type { RuleSetRule } from 'webpack';

const nextConfig: NextConfig = {
  sassOptions: {
    additionalData: `@use "@/styles/variables.scss" as *;`,
  },
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule: RuleSetRule) => {
      return rule && rule.test instanceof RegExp && rule.test.test('.svg');
    });

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: /url/ },
        use: ['@svgr/webpack'],
      }
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default nextConfig;
