import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

async function testSlackConnection() {
    // Load environment variables
    dotenv.config();
    
    const botToken = process.env.SLACK_BOT_TOKEN;
    if (!botToken) {
        console.error('❌ Error: SLACK_BOT_TOKEN not found in .env file');
        return false;
    }
    
    try {
        // Initialize Slack client
        const client = new WebClient(botToken);
        
        // Test auth
        const auth = await client.auth.test();
        console.log('✅ Successfully connected to Slack!');
        console.log(`Bot User: ${auth.user}`);
        console.log(`Team: ${auth.team}`);
        
        // List channels
        const result = await client.conversations.list({
            types: 'public_channel'
        });
        
        console.log('\n📚 Available channels:');
        result.channels.forEach(channel => {
            console.log(`- #${channel.name}`);
        });
        
        return true;
    } catch (error) {
        console.error('❌ Error connecting to Slack:', error.message);
        return false;
    }
}

testSlackConnection();
