/**
 * @swagger
 * tags:
 *   name: Webhooks
 *   description: Webhooks for external services
 */

/**
 * @swagger
 * /webhooks/clerk:
 *   post:
 *     summary: Clerk webhook endpoint
 *     tags: [Webhooks]
 *     description: Handles user creation and deletion events from Clerk
 *     responses:
 *       200:
 *         description: Webhook received
 *       400:
 *         description: Webhook verification failed
 */