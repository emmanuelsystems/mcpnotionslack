import { slackService } from './services/slack.js';

async function testThreadReply() {
    const CHANNEL = 'C046GJZFH41'; // Using general channel ID directly
    const SEARCH_TEXT = 'windsurf';
    
    try {
        // Initialize Slack service
        await slackService.initialize();
        
        console.log('🔍 Finding message containing "windsurf"...');
        const message = await slackService.findMessage(CHANNEL, SEARCH_TEXT);
        
        if (!message) {
            console.log('❌ Message not found. Make sure the message exists in the channel.');
            return;
        }
        
        console.log('✅ Found message! Sending reply...');
        console.log('Message:', message.text);
        
        // Send reply in thread
        const reply = await slackService.sendMessage(
            CHANNEL,
            "👋 Hello! I'm the Windsurf MCP Bot. I can help you manage and interact with your Notion pages. Let me know if you need any assistance!",
            message.ts
        );
        
        if (reply.ok) {
            console.log('✅ Successfully sent reply in thread!');
        } else {
            console.log('❌ Failed to send reply:', reply.error);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testThreadReply();
