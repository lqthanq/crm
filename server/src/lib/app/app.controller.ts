import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Public } from 'src/common';
import moment from 'moment';
import * as timezone from 'moment-timezone';

@Controller()
@Public()
export class AppController {
    constructor(private readonly _configService: ConfigService) {}

    @HttpCode(HttpStatus.OK)
    @Get('/')
    async getAppStatus() {
        const app_name = this._configService.get('app.app_name');

        return {
            status: HttpStatus.OK,
            message: `${app_name} API`,
        };
    }

    @HttpCode(HttpStatus.OK)
    @Get('/configs')
    async getConfigs(): Promise<object> {
        return {
            timezone: timezone.tz.guess(),

            date: moment().format(),
        };
    }
}
