import { McpServer } from "@modelcontextprotocol/sdk/dist/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/dist/server/stdio.js";
import { z } from "zod";
import { Client } from "@notionhq/client";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Create MCP server
const server = new McpServer({
  name: "notion-mcp",
  version: "1.0.0",
});

// List databases tool
server.tool(
  "list-databases",
  "List all databases the integration has access to",
  {},
  async () => {
    try {
      const response = await notion.search({
        filter: {
          property: "object",
          value: "database",
        },
        page_size: 100,
        sort: {
          direction: "descending",
          timestamp: "last_edited_time",
        },
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.results, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error listing databases: ${error.message}`,
          },
        ],
      };
    }
  }
);

// Query database tool
server.tool(
  "query-database",
  "Query a database",
  {
    database_id: z.string().describe("ID of the database to query"),
    filter: z.optional(z.any()).describe("Optional filter criteria"),
    sorts: z.optional(z.array(z.any())).describe("Optional sort criteria"),
    start_cursor: z.optional(z.string()).describe("Optional cursor for pagination"),
    page_size: z.optional(z.number().default(100)).describe("Number of results per page"),
  },
  async ({ database_id, filter, sorts, start_cursor, page_size }) => {
    try {
      const queryParams = {
        database_id,
        page_size: page_size || 100,
      };

      if (filter) queryParams.filter = filter;
      if (sorts) queryParams.sorts = sorts;
      if (start_cursor) queryParams.start_cursor = start_cursor;

      const response = await notion.databases.query(queryParams);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error querying database: ${error.message}`,
          },
        ],
      };
    }
  }
);

// Create page tool
server.tool(
  "create-page",
  "Create a new page in a database",
  {
    parent_id: z.string().describe("ID of the parent database"),
    properties: z.record(z.any()).describe("Page properties"),
    children: z.optional(z.array(z.any())).describe("Optional content blocks"),
  },
  async ({ parent_id, properties, children }) => {
    try {
      const pageParams = {
        parent: { database_id: parent_id },
        properties,
      };

      if (children) {
        pageParams.children = children;
      }

      const response = await notion.pages.create(pageParams);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error creating page: ${error.message}`,
          },
        ],
      };
    }
  }
);

// Update page tool
server.tool(
  "update-page",
  "Update an existing page",
  {
    page_id: z.string().describe("ID of the page to update"),
    properties: z.record(z.any()).describe("Updated page properties"),
    archived: z.optional(z.boolean()).describe("Whether to archive the page"),
  },
  async ({ page_id, properties, archived }) => {
    try {
      const updateParams = {
        page_id,
        properties,
      };

      if (archived !== undefined) {
        updateParams.archived = archived;
      }

      const response = await notion.pages.update(updateParams);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error updating page: ${error.message}`,
          },
        ],
      };
    }
  }
);

// Create database tool
server.tool(
  "create-database",
  "Create a new database",
  {
    parent_id: z.string().describe("ID of the parent page"),
    title: z.array(z.any()).describe("Database title as rich text array"),
    properties: z.record(z.any()).describe("Database properties schema"),
    icon: z.optional(z.any()).describe("Optional icon for the database"),
    cover: z.optional(z.any()).describe("Optional cover for the database"),
  },
  async ({ parent_id, title, properties, icon, cover }) => {
    try {
      // Remove dashes if present in parent_id
      parent_id = parent_id.replace(/-/g, "");

      const databaseParams = {
        parent: {
          type: "page_id",
          page_id: parent_id,
        },
        title,
        properties,
      };

      // Set default emoji if icon is specified but emoji is empty
      if (icon && icon.type === "emoji" && !icon.emoji) {
        icon.emoji = "📄"; // Default document emoji
        databaseParams.icon = icon;
      } else if (icon) {
        databaseParams.icon = icon;
      }

      if (cover) {
        databaseParams.cover = cover;
      }

      const response = await notion.databases.create(databaseParams);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error creating database: ${error.message}`,
          },
        ],
      };
    }
  }
);

// Update database tool
server.tool(
  "update-database",
  "Update an existing database",
  {
    database_id: z.string().describe("ID of the database to update"),
    title: z.optional(z.array(z.any())).describe("Optional new title as rich text array"),
    description: z.optional(z.array(z.any())).describe("Optional new description as rich text array"),
    properties: z.optional(z.record(z.any())).describe("Optional updated properties schema"),
  },
  async ({ database_id, title, description, properties }) => {
    try {
      const updateParams = {
        database_id,
      };

      if (title !== undefined) {
        updateParams.title = title;
      }

      if (description !== undefined) {
        updateParams.description = description;
      }

      if (properties !== undefined) {
        updateParams.properties = properties;
      }

      const response = await notion.databases.update(updateParams);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error updating database: ${error.message}`,
          },
        ],
      };
    }
  }
);

// Get page tool
server.tool(
  "get-page",
  "Retrieve a page by its ID",
  {
    page_id: z.string().describe("ID of the page to retrieve"),
  },
  async ({ page_id }) => {
    try {
      // Remove dashes if present in page_id
      page_id = page_id.replace(/-/g, "");

      const response = await notion.pages.retrieve({ page_id });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error retrieving page: ${error.message}`,
          },
        ],
      };
    }
  }
);

// Get block children tool
server.tool(
  "get-block-children",
  "Retrieve the children blocks of a block",
  {
    block_id: z.string().describe("ID of the block (page or block)"),
    start_cursor: z.optional(z.string()).describe("Cursor for pagination"),
    page_size: z.optional(z.number().default(100)).describe("Number of results per page"),
  },
  async ({ block_id, start_cursor, page_size }) => {
    try {
      // Remove dashes if present in block_id
      block_id = block_id.replace(/-/g, "");

      const params = {
        block_id,
        page_size: page_size || 100,
      };

      if (start_cursor) {
        params.start_cursor = start_cursor;
      }

      const response = await notion.blocks.children.list(params);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error retrieving block children: ${error.message}`,
          },
        ],
      };
    }
  }
);

// Append block children tool
server.tool(
  "append-block-children",
  "Append blocks to a parent block",
  {
    block_id: z.string().describe("ID of the parent block (page or block)"),
    children: z.array(z.any()).describe("List of block objects to append"),
    after: z.optional(z.string()).describe("Optional ID of an existing block to append after"),
  },
  async ({ block_id, children, after }) => {
    try {
      // Remove dashes if present in block_id
      block_id = block_id.replace(/-/g, "");

      const params = {
        block_id,
        children,
      };

      if (after) {
        params.after = after.replace(/-/g, ""); // Ensure after ID is properly formatted
      }

      const response = await notion.blocks.children.append(params);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error appending block children: ${error.message}`,
          },
        ],
      };
    }
  }
);

// Update block tool
server.tool(
  "update-block",
  "Update a block's content or archive status",
  {
    block_id: z.string().describe("ID of the block to update"),
    block_type: z.string().describe("The type of block (paragraph, heading_1, to_do, etc.)"),
    content: z.record(z.any()).describe("The content for the block based on its type"),
    archived: z.optional(z.boolean()).describe("Whether to archive (true) or restore (false) the block"),
  },
  async ({ block_id, block_type, content, archived }) => {
    try {
      // Remove dashes if present in block_id
      block_id = block_id.replace(/-/g, "");

      const updateParams = {
        block_id,
        [block_type]: content,
      };

      if (archived !== undefined) {
        updateParams.archived = archived;
      }

      const response = await notion.blocks.update(updateParams);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error updating block: ${error.message}`,
          },
        ],
      };
    }
  }
);

// Get block tool
server.tool(
  "get-block",
  "Retrieve a block by its ID",
  {
    block_id: z.string().describe("ID of the block to retrieve"),
  },
  async ({ block_id }) => {
    try {
      // Remove dashes if present in block_id
      block_id = block_id.replace(/-/g, "");

      const response = await notion.blocks.retrieve({ block_id });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error retrieving block: ${error.message}`,
          },
        ],
      };
    }
  }
);

// Search tool
server.tool(
  "search",
  "Search Notion for pages or databases",
  {
    query: z.optional(z.string().default("")).describe("Search query string"),
    filter: z.optional(z.any()).describe("Optional filter criteria"),
    sort: z.optional(z.any()).describe("Optional sort criteria"),
    start_cursor: z.optional(z.string()).describe("Cursor for pagination"),
    page_size: z.optional(z.number().default(100)).describe("Number of results per page"),
  },
  async ({ query, filter, sort, start_cursor, page_size }) => {
    try {
      const searchParams = {
        query: query || "",
        page_size: page_size || 100,
      };

      if (filter) {
        searchParams.filter = filter;
      }

      if (sort) {
        searchParams.sort = sort;
      }

      if (start_cursor) {
        searchParams.start_cursor = start_cursor;
      }

      const response = await notion.search(searchParams);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error searching Notion: ${error.message}`,
          },
        ],
      };
    }
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Notion MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
