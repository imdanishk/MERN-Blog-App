/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User account management
 */

/**
 * @swagger
 * /api/users/saved:
 *   get:
 *     summary: Get user's saved posts
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of saved post IDs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/users/save:
 *   patch:
 *     summary: Save or unsave a post
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *             properties:
 *               postId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Action result
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Post saved"
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */