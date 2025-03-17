import { slackService } from './services/slack.js';

async function testSendMessage() {
    const CHANNEL = 'notion-page-updates';
    
    try {
        // Initialize Slack service
        await slackService.initialize();
        
        console.log(`📤 Sending message to #${CHANNEL}...`);
        const result = await slackService.sendMessage(
            CHANNEL,
            "👋 Hello! I'm the Windsurf MCP Bot. I'll be posting updates here whenever there are changes to your Notion pages!"
        );
        
        if (result.ok) {
            console.log('✅ Successfully sent message!');
        } else {
            console.log('❌ Failed to send message:', result.error);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testSendMessage();
