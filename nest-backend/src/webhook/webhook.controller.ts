import { Controller, Post, Req, RawBodyRequest, HttpStatus, HttpCode } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { ApiTags, ApiOperation, ApiResponse, ApiExcludeEndpoint } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('clerk')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle Clerk webhook events' })
  @ApiResponse({ status: 200, description: 'Webhook received and processed' })
  @ApiResponse({ status: 400, description: 'Webhook verification failed' })
  async handleClerkWebhook(@Req() req: RawBodyRequest<Request>) {
    return this.webhookService.handleClerkWebhook(
      req.rawBody as Buffer,
      req.headers,
    );
  }
}
