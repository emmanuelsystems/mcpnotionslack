import { slackService } from './services/slack.js';

export class SlackContextProvider {
    async getContext(request) {
        const { channel } = request.parameters || {};
        
        if (!channel) {
            return {
                error: 'Channel parameter is required'
            };
        }

        try {
            // Get recent messages from the channel
            const messages = await slackService.getChannelHistory(channel);
            
            // Format messages for context
            const formattedMessages = messages.map(msg => ({
                text: msg.text,
                user: msg.user,
                timestamp: msg.ts,
                threadTs: msg.thread_ts
            }));

            return {
                channel,
                messages: formattedMessages,
                messageCount: formattedMessages.length
            };
        } catch (error) {
            console.error('Error getting Slack context:', error);
            return {
                error: 'Failed to get Slack context',
                details: error.message
            };
        }
    }

    async updateContext(request) {
        const { channel, message } = request.parameters || {};
        
        if (!channel || !message) {
            return {
                error: 'Both channel and message parameters are required'
            };
        }

        try {
            // Send message to channel
            await slackService.sendMessage(channel, message);
            
            return {
                success: true,
                channel,
                messageLength: message.length
            };
        } catch (error) {
            console.error('Error updating Slack context:', error);
            return {
                error: 'Failed to update Slack context',
                details: error.message
            };
        }
    }
}
