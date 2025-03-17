import { slackService } from './slack.js';
import { Client } from '@notionhq/client';
import { config } from '../config.js';

class NotionUpdatesService {
    constructor() {
        this.notion = new Client({ auth: config.NOTION_API_KEY });
        this.databaseId = config.NOTION_DATABASE_ID;
        this.lastChecked = new Date();
        this.UPDATES_CHANNEL = 'notion-page-updates';
    }

    async initialize() {
        try {
            // Test Notion connection
            const database = await this.notion.databases.retrieve({ database_id: this.databaseId });
            console.log('✅ Connected to Document Hub database');
            console.log(`📚 Database name: ${database.title[0].plain_text}`);
            
            // Start monitoring for updates
            this.startMonitoring();
            return true;
        } catch (error) {
            console.error('❌ Error initializing Notion Updates service:', error.message);
            throw error;
        }
    }

    async startMonitoring() {
        // Check for updates every 5 seconds
        setInterval(async () => {
            await this.checkForUpdates();
        }, 5 * 1000);
        
        // Do an initial check
        await this.checkForUpdates();
    }

    async checkForUpdates() {
        try {
            const response = await this.notion.databases.query({
                database_id: this.databaseId,
                filter: {
                    timestamp: 'last_edited_time',
                    last_edited_time: {
                        after: this.lastChecked.toISOString()
                    }
                },
                sorts: [
                    {
                        timestamp: 'last_edited_time',
                        direction: 'descending'
                    }
                ]
            });

            // Update lastChecked timestamp
            const now = new Date();

            // Process any updates
            for (const page of response.results) {
                await this.notifySlack(page);
            }

            this.lastChecked = now;
        } catch (error) {
            console.error('❌ Error checking for updates:', error.message);
        }
    }

    async notifySlack(page) {
        try {
            // Get document name (title)
            const docName = page.properties['Doc name']?.title[0]?.plain_text || 'Untitled Document';
            const lastEditedTime = new Date(page.last_edited_time).toLocaleString();
            const pageUrl = page.url;
            const isNewPage = new Date(page.created_time).getTime() === new Date(page.last_edited_time).getTime();

            // Get document properties
            const category = page.properties['Category']?.multi_select?.map(item => item.name).join(', ') || 'Uncategorized';
            const status = page.properties['Status']?.status?.name || 'No status';
            const author = page.properties['Author']?.rich_text[0]?.plain_text || 'Unknown';
            const lastEditor = page.last_edited_by.name || 'Unknown';

            // Create message
            const message = [
                `${isNewPage ? '🆕' : '📝'} ${isNewPage ? 'New document created' : 'Document updated'}: *${docName}*`,
                `🔗 <${pageUrl}|View in Notion>`,
                '',
                '📋 *Details:*',
                `• Category: ${category}`,
                `• Status: ${status}`,
                `• Author: ${author}`,
                `• Last edited by: ${lastEditor}`,
                `• Last edited: ${lastEditedTime}`
            ].join('\n');

            // Send to Slack
            await slackService.sendMessage(this.UPDATES_CHANNEL, message);
            console.log(`✅ Notified Slack about ${isNewPage ? 'new' : 'updated'} document: ${docName}`);
        } catch (error) {
            console.error('❌ Error sending notification to Slack:', error.message);
        }
    }
}

export const notionUpdates = new NotionUpdatesService();
