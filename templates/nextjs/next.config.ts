import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const config: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
};

export default withNextIntl(config);
