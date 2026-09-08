import type { NextConfig } from 'next';
import type { RuleSetRule } from 'webpack';
import { withPayload } from '@payloadcms/next/withPayload';

const nextConfig: NextConfig = {
  sassOptions: {
    // Scoped to first-party styles: Payload ships its own .scss inside node_modules, and
    // blanket-prepending this import made those files fail to resolve `@/styles/breakpoints`.
    additionalData: (content: string, loaderContext: { resourcePath: string }) =>
      loaderContext.resourcePath.includes('node_modules') ? content : `@use "@/styles/breakpoints" as *;\n${content}`,
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

export default withPayload(nextConfig);
