import os
from dotenv import load_dotenv
from notion_client import Client
from datetime import datetime

def test_database_access():
    # Load environment variables
    load_dotenv()
    
    # Get Notion credentials
    notion_key = os.getenv('NOTION_API_KEY')
    database_id = os.getenv('NOTION_DATABASE_ID')
    
    if not notion_key or not database_id:
        print("❌ Error: Missing required environment variables")
        print("Please ensure both NOTION_API_KEY and NOTION_DATABASE_ID are set in .env file")
        return False
    
    try:
        # Initialize Notion client
        notion = Client(auth=notion_key)
        
        # Try to query the database
        print(f"📚 Attempting to access database: {database_id}")
        response = notion.databases.retrieve(database_id=database_id)
        
        print("✅ Successfully connected to database!")
        print(f"Database title: {response['title'][0]['plain_text']}")
        
        # List database properties
        print("\n📋 Database properties:")
        for prop_name, prop_data in response['properties'].items():
            print(f"- {prop_name} ({prop_data['type']})")
        
        # Try to query some items
        pages = notion.databases.query(
            database_id=database_id,
            page_size=5
        )
        
        print(f"\n📝 Found {len(pages['results'])} items in database")
        
        return True
    except Exception as e:
        print(f"❌ Error accessing database: {str(e)}")
        return False

if __name__ == "__main__":
    test_database_access()
