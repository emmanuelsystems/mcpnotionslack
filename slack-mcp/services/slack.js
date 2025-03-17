import { WebClient } from '@slack/web-api';
import { config } from '../config.js';

class SlackService {
    constructor() {
        this.client = new WebClient(config.SLACK_BOT_TOKEN);
        this.channelCache = new Map();
    }

    async initialize() {
        try {
            // Verify auth
            const auth = await this.client.auth.test();
            console.log(`✅ Connected to Slack as ${auth.user} in team ${auth.team}`);
            
            // Cache channel information
            await this.updateChannelCache();
            
            return true;
        } catch (error) {
            console.error('❌ Error initializing Slack service:', error.message);
            throw error;
        }
    }

    async updateChannelCache() {
        try {
            const result = await this.client.conversations.list({
                types: 'public_channel', // Only public channels for now
                exclude_archived: true
            });
            
            result.channels.forEach(channel => {
                this.channelCache.set(channel.name, channel.id);
                // Also cache by ID for reverse lookup
                this.channelCache.set(channel.id, channel.id);
            });
            
            console.log(`📚 Cached ${result.channels.length} channels`);
            console.log('Available channels:');
            result.channels.forEach(channel => {
                console.log(`- ${channel.name} (${channel.id})`);
            });
            
            return result.channels;
        } catch (error) {
            console.error('❌ Error updating channel cache:', error.message);
            throw error;
        }
    }

    async sendMessage(channel, text, threadTs = null) {
        try {
            const channelId = this.channelCache.get(channel) || channel;
            const message = {
                channel: channelId,
                text,
            };
            
            if (threadTs) {
                message.thread_ts = threadTs;
            }
            
            const result = await this.client.chat.postMessage(message);
            return result;
        } catch (error) {
            console.error(`❌ Error sending message to ${channel}:`, error.message);
            throw error;
        }
    }

    async findMessage(channel, searchText) {
        try {
            const channelId = this.channelCache.get(channel) || channel;
            console.log(`🔍 Searching in channel ID: ${channelId}`);
            
            const result = await this.client.conversations.history({
                channel: channelId,
                limit: 100
            });
            
            console.log(`📝 Found ${result.messages.length} messages`);
            
            const message = result.messages.find(msg => msg.text.toLowerCase().includes(searchText.toLowerCase()));
            if (message) {
                console.log('✅ Found matching message:', message.text);
            } else {
                console.log('❌ No message found containing:', searchText);
            }
            
            return message;
        } catch (error) {
            console.error(`❌ Error finding message in ${channel}:`, error.message);
            throw error;
        }
    }

    async getChannelHistory(channel, limit = 10) {
        try {
            const channelId = this.channelCache.get(channel) || channel;
            const result = await this.client.conversations.history({
                channel: channelId,
                limit,
            });
            return result.messages;
        } catch (error) {
            console.error(`❌ Error getting history for ${channel}:`, error.message);
            return [];
        }
    }
}

export const slackService = new SlackService();
