import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common';
import { UseValidationPipe } from '../shared';
import { ValidateInviteByCodeQueryDTO } from './dto';
import { Invite } from './invite.entity';
import { FindInviteByEmailCodeQuery } from './queries';

@ApiTags('Invite')
@Controller('/invite')
export class InviteController {
    constructor(private readonly queryBus: QueryBus) {}

    @ApiOperation({ summary: 'Validate invite by code and email.' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Found Invite', type: Invite })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Record not found' })
    @Public()
    @Post('/validate-by-code')
    @UseValidationPipe({ whitelist: true })
    async validateInviteByCode(@Body() body: ValidateInviteByCodeQueryDTO) {
        return await this.queryBus.execute(new FindInviteByEmailCodeQuery({ email: body.email, code: body.code }));
    }
}
