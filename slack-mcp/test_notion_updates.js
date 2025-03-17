import { notionUpdates } from './services/notion-updates.js';

async function testNotionUpdates() {
    try {
        console.log('🔄 Starting Notion updates service...');
        await notionUpdates.initialize();
        
        console.log('👀 Now monitoring Notion database for changes.');
        console.log('✨ Try creating or updating a page in your Notion database!');
        console.log('🛑 Press Ctrl+C to stop monitoring.');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testNotionUpdates();
