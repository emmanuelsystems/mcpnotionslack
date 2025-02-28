# Notion MCP Server

A Model Context Protocol (MCP) server for Notion integration, allowing AI assistants to interact with Notion databases, pages, and blocks.

## Features

- List and query Notion databases
- Create, retrieve, and update pages
- Create and update databases
- Manage blocks and their children
- Search Notion content

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example` and add your Notion API key:
   ```
   NOTION_API_KEY=your_notion_api_key_here
   ```
4. Start the server:
   ```
   npm start
   ```

## Using with Claude Desktop

To use this server with Claude Desktop:

1. Edit your Claude Desktop configuration file:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

2. Add the following configuration:
   ```json
   {
     "mcpServers": {
       "notion": {
         "command": "node",
         "args": [
           "/path/to/notion-mcp-server/server.js"
         ],
         "env": {
           "NOTION_API_KEY": "your_notion_api_key_here"
         }
       }
     }
   }
   ```

3. Restart Claude Desktop

## Available Tools

The server provides the following tools:

- `list-databases`: List all databases the integration has access to
- `query-database`: Query a database
- `create-page`: Create a new page in a database
- `update-page`: Update an existing page
- `create-database`: Create a new database
- `update-database`: Update an existing database
- `get-page`: Retrieve a page by its ID
- `get-block-children`: Retrieve the children blocks of a block
- `append-block-children`: Append blocks to a parent block
- `update-block`: Update a block's content or archive status
- `get-block`: Retrieve a block by its ID
- `search`: Search Notion for pages or databases

## Obtaining a Notion API Key

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Give your integration a name and select the workspace
4. Copy the "Internal Integration Token"
5. Add the integration to the pages/databases you want to access in Notion

## License

MIT
