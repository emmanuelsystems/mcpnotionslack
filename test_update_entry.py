import os
from dotenv import load_dotenv
from notion_client import Client

def update_mcp_guide():
    # Load environment variables
    load_dotenv()
    
    notion_key = os.getenv('NOTION_API_KEY')
    database_id = os.getenv('NOTION_DATABASE_ID')
    
    if not notion_key or not database_id:
        print("❌ Error: Missing required environment variables")
        return False
    
    try:
        # Initialize Notion client
        notion = Client(auth=notion_key)
        
        # Query for the MCP guide
        response = notion.databases.query(
            database_id=database_id,
            filter={
                "property": "Doc name",
                "title": {
                    "equals": "MCP Server Setup and Integration Guide"
                }
            }
        )
        
        if not response['results']:
            print("❌ Error: MCP guide not found")
            return False
            
        page_id = response['results'][0]['id']
        
        # Update the page content
        notion.blocks.children.append(
            block_id=page_id,
            children=[
                {
                    "object": "block",
                    "type": "heading_2",
                    "heading_2": {
                        "rich_text": [{"type": "text", "text": {"content": "Notion MCP Server Setup"}}]
                    }
                },
                {
                    "object": "block",
                    "type": "numbered_list_item",
                    "numbered_list_item": {
                        "rich_text": [{"type": "text", "text": {"content": "Clone the repository and navigate into the directory."}}]
                    }
                },
                {
                    "object": "block",
                    "type": "numbered_list_item",
                    "numbered_list_item": {
                        "rich_text": [{"type": "text", "text": {"content": "Install dependencies using npm install."}}]
                    }
                },
                {
                    "object": "block",
                    "type": "numbered_list_item",
                    "numbered_list_item": {
                        "rich_text": [{"type": "text", "text": {"content": "Configure environment variables in a .env file."}}]
                    }
                },
                {
                    "object": "block",
                    "type": "numbered_list_item",
                    "numbered_list_item": {
                        "rich_text": [{"type": "text", "text": {"content": "Run the server using node server.js."}}]
                    }
                },
                {
                    "object": "block",
                    "type": "heading_2",
                    "heading_2": {
                        "rich_text": [{"type": "text", "text": {"content": "Slack MCP Server Setup"}}]
                    }
                },
                {
                    "object": "block",
                    "type": "numbered_list_item",
                    "numbered_list_item": {
                        "rich_text": [{"type": "text", "text": {"content": "Clone the repository and navigate into the directory."}}]
                    }
                },
                {
                    "object": "block",
                    "type": "numbered_list_item",
                    "numbered_list_item": {
                        "rich_text": [{"type": "text", "text": {"content": "Install dependencies using npm install."}}]
                    }
                },
                {
                    "object": "block",
                    "type": "numbered_list_item",
                    "numbered_list_item": {
                        "rich_text": [{"type": "text", "text": {"content": "Configure environment variables in a .env file."}}]
                    }
                },
                {
                    "object": "block",
                    "type": "numbered_list_item",
                    "numbered_list_item": {
                        "rich_text": [{"type": "text", "text": {"content": "Run the server using node server.js."}}]
                    }
                }
            ]
        )
        
        print("✅ Successfully updated MCP guide!")
        return True
        
    except Exception as e:
        print(f"❌ Error updating MCP guide: {str(e)}")
        return False

if __name__ == "__main__":
    update_mcp_guide()
