import { z } from 'zod';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get directory name for ES module
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables from parent directory's .env file
dotenv.config({ path: resolve(__dirname, '../.env') });

// Define schema for environment variables
const configSchema = z.object({
    SLACK_BOT_TOKEN: z.string().startsWith('xoxb-'),
    SLACK_APP_TOKEN: z.string().startsWith('xapp-'),
    SLACK_CHANNELS: z.string().optional(),
    NOTION_API_KEY: z.string(),
    NOTION_DATABASE_ID: z.string()
});

// Parse and validate environment variables
const parsedConfig = configSchema.safeParse({
    SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN,
    SLACK_APP_TOKEN: process.env.SLACK_APP_TOKEN,
    SLACK_CHANNELS: process.env.SLACK_CHANNELS,
    NOTION_API_KEY: process.env.NOTION_API_KEY,
    NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID
});

if (!parsedConfig.success) {
    console.error('❌ Invalid configuration:', parsedConfig.error.errors);
    process.exit(1);
}

export const config = parsedConfig.data;
