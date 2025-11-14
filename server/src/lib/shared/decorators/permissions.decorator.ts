import { SetMetadata } from '@nestjs/common';
import { PERMISSIONS_METADATA } from 'src/constants';
import { EPermissions } from 'src/contracts';

export const Permissions = (...permissions: EPermissions[]) => SetMetadata(PERMISSIONS_METADATA, permissions);
