import { SetMetadata } from '@nestjs/common';

export const API_RESPONSE_METADATA = 'api_response_metadata';

export interface ApiResponseMetaOptions {
  message?: string;
  statusCode?: number;
}

export const ApiResponseMetadata = (options: ApiResponseMetaOptions) =>
  SetMetadata(API_RESPONSE_METADATA, options);
