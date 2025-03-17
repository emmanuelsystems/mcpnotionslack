import os
from dotenv import load_dotenv
from notion_client import Client

def test_notion_connection():
    # Load environment variables
    load_dotenv()
    
    # Get Notion API key
    notion_key = os.getenv('NOTION_API_KEY')
    if not notion_key:
        print("❌ Error: NOTION_API_KEY not found in .env file")
        return False
    
    try:
        # Initialize Notion client
        notion = Client(auth=notion_key)
        
        # Test the connection by trying to list users
        users = notion.users.list()
        print("✅ Successfully connected to Notion!")
        print(f"Found {len(users.get('results', []))} users in your workspace")
        return True
    except Exception as e:
        print(f"❌ Error connecting to Notion: {str(e)}")
        return False

if __name__ == "__main__":
    test_notion_connection()
