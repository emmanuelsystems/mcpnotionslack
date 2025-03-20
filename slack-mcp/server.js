import express from 'express';
import { SlackContextProvider } from './context-provider.js';
import { slackService } from './services/slack.js';
import { notionUpdates } from './services/notion-updates.js';
import { config } from './config.js';

async function startServer() {
    try {
        // Initialize services
        async function initializeServices() {
            try {
                await slackService.initialize();
                await notionUpdates.initialize();
            } catch (error) {
                console.error('❌ Error initializing services:', error.message);
                process.exit(1);
            }
        }

        await initializeServices();

        // Create Express server
        const app = express();
        app.use(express.json());

        // Create context provider
        const contextProvider = new SlackContextProvider();

        // MCP endpoint for context operations
        app.post('/context', async (req, res) => {
            const { operation, parameters } = req.body;

            try {
                let result;
                if (operation === 'get') {
                    result = await contextProvider.getContext({ parameters });
                } else if (operation === 'update') {
                    result = await contextProvider.updateContext({ parameters });
                } else {
                    return res.status(400).json({
                        error: 'Invalid operation',
                        supportedOperations: ['get', 'update']
                    });
                }

                res.json(result);
            } catch (error) {
                console.error('Error handling request:', error);
                res.status(500).json({
                    error: 'Internal server error',
                    details: error.message
                });
            }
        });

        // Start the server
        const port = process.env.PORT || 3001;
        app.listen(port, () => {
            console.log(`🚀 Slack MCP Server running on port ${port}`);
            
            // Log available channels
            if (config.SLACK_CHANNELS && config.SLACK_CHANNELS.length > 0) {
                console.log('📢 Monitoring channels:', config.SLACK_CHANNELS.join(', '));
            } else {
                console.log('📢 No specific channels configured, will respond to all channels');
            }
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
