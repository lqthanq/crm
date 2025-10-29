import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { PUBLIC_METHOD_METADATA } from 'src/constants';

export const Public = (): CustomDecorator => SetMetadata(PUBLIC_METHOD_METADATA, true);
