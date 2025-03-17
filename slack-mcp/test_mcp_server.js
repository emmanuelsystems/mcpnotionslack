import fetch from 'node-fetch';

async function testMcpServer() {
    const BASE_URL = 'http://localhost:3001';
    const TEST_CHANNEL = 'notion-page-updates';

    try {
        console.log('🧪 Testing Slack MCP Server');
        
        // Test 1: Send a message
        console.log('\n📤 Testing message sending to notion-page-updates...');
        const updateResponse = await fetch(`${BASE_URL}/context`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                operation: 'update',
                parameters: {
                    channel: TEST_CHANNEL,
                    message: '🔔 Test Update: A new page was created in Notion\n• Title: Test Document\n• Category: Documentation\n• Last Updated: ' + new Date().toLocaleString()
                }
            })
        });
        
        const updateResult = await updateResponse.json();
        console.log('Update response:', updateResult);
        
        // Wait a moment for the message to be processed
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Test 2: Get channel context
        console.log('\n📥 Testing context retrieval...');
        const getResponse = await fetch(`${BASE_URL}/context`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                operation: 'get',
                parameters: {
                    channel: TEST_CHANNEL
                }
            })
        });
        
        const getResult = await getResponse.json();
        console.log('Get response:', JSON.stringify(getResult, null, 2));
        
        console.log('\n✅ Tests completed!');
    } catch (error) {
        console.error('❌ Error during tests:', error);
    }
}

// Add fetch for Node.js < 18
if (!globalThis.fetch) {
    globalThis.fetch = fetch;
}

testMcpServer();
