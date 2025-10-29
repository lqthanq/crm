import * as fs from 'fs';
import * as dotenv from 'dotenv';
import * as path from 'path';

export function loadEnvFile(envPath: string, options: { override?: boolean } = {}) {
    if (fs.existsSync(envPath)) {
        dotenv.config({ path: envPath, ...options });
    }
}

export function loadEnv() {
    const currentDir = process.cwd();

    loadEnvFile(path.resolve(currentDir, '.env'));
}
