import { Router } from 'express';
import { PublicController } from '../controllers/publicController.js';
import { enquiryRateLimiter } from '../middleware/rateLimit.js';

export function createPublicRoutes(controller: PublicController): Router {
  const router = Router();

  router.get('/health', controller.getHealth);
  router.get('/services', controller.getServices);
  router.get('/services/:slug', controller.getServiceBySlug);
  router.post('/enquiries', enquiryRateLimiter, controller.submitEnquiry);
  router.get('/public-settings', controller.getPublicSettings);

  return router;
}
