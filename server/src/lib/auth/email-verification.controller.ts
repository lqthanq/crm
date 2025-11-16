import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FeatureFlagGuard } from '../shared/guards';
import { FeatureFlag, Public } from 'src/common';
import { EFeatures } from 'src/contracts';
import { EmailConfirmationService } from './email-confirmation.service';
import { ApiOperation } from '@nestjs/swagger';
import { UseValidationPipe } from '../shared';
import { ConfirmEmailByTokenDTO } from './dto';

@UseGuards(FeatureFlagGuard)
@FeatureFlag(EFeatures.FEATURE_EMAIL_VERIFICATION)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('/auth/email/verify')
export class EmailVerificationController {
    constructor(private readonly emailConfirmationService: EmailConfirmationService) {}

    @ApiOperation({ summary: 'Email verification by token' })
    @HttpCode(HttpStatus.OK)
    @Public()
    @Post()
    @UseValidationPipe({ whitelist: true })
    public async confirmEmail(@Body() body: ConfirmEmailByTokenDTO): Promise<Object | void> {
        const user = await this.emailConfirmationService.decodeConfirmationToken(body.token);
        if (!!user) {
            return await this.emailConfirmationService.confirmEmail(user);
        }
    }
}
