import os
from dotenv import load_dotenv
from notion_client import Client

def add_test_content():
    # Load environment variables
    load_dotenv()
    
    notion_key = os.getenv('NOTION_API_KEY')
    page_id = "1b996e44-1742-81a5-baa8-e2b58af1533b"
    
    try:
        # Initialize Notion client
        notion = Client(auth=notion_key)
        
        # Add various types of content
        notion.blocks.children.append(
            block_id=page_id,
            children=[
                {
                    "object": "block",
                    "type": "heading_1",
                    "heading_1": {
                        "rich_text": [{"type": "text", "text": {"content": "Test Document Content"}}]
                    }
                },
                {
                    "object": "block",
                    "type": "paragraph",
                    "paragraph": {
                        "rich_text": [{"type": "text", "text": {"content": "This is a test document to demonstrate content extraction from Notion pages."}}]
                    }
                },
                {
                    "object": "block",
                    "type": "heading_2",
                    "heading_2": {
                        "rich_text": [{"type": "text", "text": {"content": "Features"}}]
                    }
                },
                {
                    "object": "block",
                    "type": "bulleted_list_item",
                    "bulleted_list_item": {
                        "rich_text": [{"type": "text", "text": {"content": "Support for different block types"}}]
                    }
                },
                {
                    "object": "block",
                    "type": "bulleted_list_item",
                    "bulleted_list_item": {
                        "rich_text": [{"type": "text", "text": {"content": "Rich text formatting"}}]
                    }
                },
                {
                    "object": "block",
                    "type": "heading_2",
                    "heading_2": {
                        "rich_text": [{"type": "text", "text": {"content": "Code Example"}}]
                    }
                },
                {
                    "object": "block",
                    "type": "code",
                    "code": {
                        "rich_text": [{"type": "text", "text": {"content": "def hello_world():\n    print('Hello from Notion!')"}}],
                        "language": "python"
                    }
                },
                {
                    "object": "block",
                    "type": "heading_2",
                    "heading_2": {
                        "rich_text": [{"type": "text", "text": {"content": "Todo List"}}]
                    }
                },
                {
                    "object": "block",
                    "type": "to_do",
                    "to_do": {
                        "rich_text": [{"type": "text", "text": {"content": "Create test document"}}],
                        "checked": True
                    }
                },
                {
                    "object": "block",
                    "type": "to_do",
                    "to_do": {
                        "rich_text": [{"type": "text", "text": {"content": "Test content extraction"}}],
                        "checked": False
                    }
                }
            ]
        )
        
        print("✅ Successfully added test content to the page!")
        return True
    except Exception as e:
        print(f"❌ Error adding content: {str(e)}")
        return False

if __name__ == "__main__":
    add_test_content()
