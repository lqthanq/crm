import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
    app_name: process.env.APP_NAME,
}));
