import express from 'express';
import * as OpenApiValidator from 'express-openapi-validator';
import swaggerUI from 'swagger-ui-express';
import SwaggerParser from '@apidevtools/swagger-parser';
import { connector } from 'swagger-routes-express';
import helmet from 'helmet';
import * as api from './api';
import { rateLimitMiddleware } from './middleware/rate-limit.middleware';

const createApp = async () => {
  const app = express();

  // Middleware
  app.use(rateLimitMiddleware(100, 15 * 60 * 1000)); // 100 Requests per IP every 15 minutes
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Open API
  const apiSpec = './src/docs/open-api.yaml';
  const parser = new SwaggerParser();
  const apiDefinition = await parser.validate(apiSpec);
  const connect = connector(api, apiDefinition);

  app.use(
    OpenApiValidator.middleware({
      apiSpec,
      validateRequests: true,
      validateResponses: false,
    }),
  );
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(apiDefinition));

  connect(app);

  return app;
};

export default createApp;