import { registerAs } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';

const regex = /^(?:https?:\/\/)?([^:/?#]+)(?::(\d+))?/i;

export default registerAs<SequelizeModuleOptions>('sequelize', () => ({
  dialect: 'snowflake',
  pool: {
    autostart: true,
    min: 10,
    max: 50,
    fifo: true,
    idle: 86400000,
    idleTimeoutMillis: 86400000,
  },
  dialectOptions: {
    account: process.env.SNOWFLAKE_ACCOUNT,
    role: process.env.SNOWFLAKE_ROLE,
    warehouse: process.env.SNOWFLAKE_WAREHOUSE,
    schema: process.env.SNOWFLAKE_SCHEMA,
    clientSessionKeepAlive: true,
    clientSessionKeepAliveHeartbeatFrequency: 900,
    timeout: 86400000,
    proxyHost: process.env.HTTP_PROXY ? process.env.HTTP_PROXY.match(regex)[1] : undefined,
    proxyPort: process.env.HTTP_PROXY ? Number(process.env.HTTP_PROXY.match(regex)[2]) : undefined,
  },
  username: process.env.SNOWFLAKE_USER,
  password: process.env.SNOWFLAKE_PASSWORD,
  database: process.env.SNOWFLAKE_DATABASE,
}));
