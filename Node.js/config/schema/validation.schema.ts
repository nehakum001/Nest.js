import Joi from 'joi';

export default Joi.object({
  // API_PREFIX: Joi.string().default('/'),
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string()
    .valid('dev', 'development', 'integration', 'prod', 'production', 'test', 'uat', 'local')
    .default('local'),
  API_VERSION: Joi.string().default('v1'),

  // TERMINUS / HEALTH ENDPOINT
  TERMINUS_HEAP_THRESHOLD: Joi.number().default(4294967296),
  TERMINUS_RSS_THRESHOLD: Joi.number().default(4294967296),
  // COGNITO
  COGNITO_DOMAIN: Joi.string().default(''),
  // Shadow Wolf
  SHADOW_WOLF_GAMS_URL: Joi.string().default(''),
  SHADOW_WOLF_API_KEY: Joi.string().default(''),
  SHADOW_WOLF_USERNAME: Joi.string().default(''),
  SHADOW_WOLF_PASSWORD: Joi.string().default(''),
});
