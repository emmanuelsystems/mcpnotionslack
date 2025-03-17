import os
from dotenv import load_dotenv
from notion_client import Client
from datetime import datetime

def create_test_entry():
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
        
        # Create a test entry
        new_page = notion.pages.create(
            parent={"database_id": database_id},
            properties={
                "Doc name": {
                    "title": [
                        {
                            "text": {
                                "content": "MCP Server Setup and Integration Guide"
                            }
                        }
                    ]
                },
                "Category": {
                    "multi_select": [
                        {"name": "Documentation"},
                        {"name": "Technical"},
                        {"name": "Setup"}
                    ]
                }
            },
            children=[
                {
                    "object": "block",
                    "type": "heading_1",
                    "heading_1": {
                        "rich_text": [{"type": "text", "text": {"content": "MCP Server Setup and Integration Guide"}}]
                    }
                },
                {
                    "object": "block",
                    "type": "paragraph",
                    "paragraph": {
                        "rich_text": [{"type": "text", "text": {"content": "This guide documents the setup and integration of our MCP (Model Context Protocol) server with Notion and Slack."}}]
                    }
                },
                {
                    "object": "block",
                    "type": "heading_2",
                    "heading_2": {
                        "rich_text": [{"type": "text", "text": {"content": "Components"}}]
                    }
                },
                {
                    "object": "block",
                    "type": "bulleted_list_item",
                    "bulleted_list_item": {
                        "rich_text": [{"type": "text", "text": {"content": "Notion Integration: Monitors Document Hub for updates"}}]
                    }
                },
                {
                    "object": "block",
                    "type": "bulleted_list_item",
                    "bulleted_list_item": {
                        "rich_text": [{"type": "text", "text": {"content": "Slack Bot: Posts notifications to #notion-page-updates channel"}}]
                    }
                },
                {
                    "object": "block",
                    "type": "heading_2",
                    "heading_2": {
                        "rich_text": [{"type": "text", "text": {"content": "Technical Details"}}]
                    }
                },
                {
                    "object": "block",
                    "type": "paragraph",
                    "paragraph": {
                        "rich_text": [{"type": "text", "text": {"content": "The integration uses Node.js with the following key features:"}}]
                    }
                },
                {
                    "object": "block",
                    "type": "bulleted_list_item",
                    "bulleted_list_item": {
                        "rich_text": [{"type": "text", "text": {"content": "Real-time monitoring (5-second intervals)"}}]
                    }
                },
                {
                    "object": "block",
                    "type": "bulleted_list_item",
                    "bulleted_list_item": {
                        "rich_text": [{"type": "text", "text": {"content": "Automatic notifications for new and updated documents"}}]
                    }
                },
                {
                    "object": "block",
                    "type": "bulleted_list_item",
                    "bulleted_list_item": {
                        "rich_text": [{"type": "text", "text": {"content": "Rich message formatting with document details and direct links"}}]
                    }
                }
            ]
        )
        
        print("✅ Successfully created new entry!")
        print(f"Page ID: {new_page['id']}")
        
        # Verify the entry by retrieving it
        retrieved_page = notion.pages.retrieve(page_id=new_page['id'])
        print("\n📄 Entry details:")
        print(f"Title: {retrieved_page['properties']['Doc name']['title'][0]['text']['content']}")
        print(f"Category: {[cat['name'] for cat in retrieved_page['properties']['Category']['multi_select']]}")
        print(f"Created by: {retrieved_page['created_by']['name']}")
        print(f"Created time: {retrieved_page['created_time']}")
        
        return True
    except Exception as e:
        print(f"❌ Error creating entry: {str(e)}")
        return False

if __name__ == "__main__":
    create_test_entry()
