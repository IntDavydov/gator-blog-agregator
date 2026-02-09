# 🐊 Gator CLI

Gator is a high-performance feed aggregator and management tool built with **Node.js**, **TypeScript**, and **Drizzle ORM**. It allows you to manage RSS feeds and users directly from your terminal.

## 🛠️ Prerequisites

Before running the CLI, ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **PostgreSQL** (A running instance for your database)
- **npm** or **pnpm** for dependency management

## ⚙️ Configuration Setup

The CLI stores its configuration in a hidden file in your **home directory** named `.gatorconfig.json`.

> **Note:** While the TypeScript code uses camelCase, the JSON file requires **snake_case** keys to be parsed correctly.

1. Create the config file in your home directory:

   ```
   touch ~/.gatorconfig.json

   ```

2. Add the following structure to the file, replacing the values with your actual database credentials:
   {
   "db_url": "postgres://user:password@localhost:5432/gator_db",
   "current_user_name": "your_username"
   }

## 🗄️ Database Setup

Before running the CLI, you need to initialize your PostgreSQL database. Follow these steps to set up your schema and migrations:

### 1. Provision your Database

Ensure you have a **PostgreSQL** instance running. You can host this locally or use a provider like Supabase or Neon.

### 2. Configure Connection

Update your `~/.gatorconfig.json` with your connection string:

```json
{
  "db_url": "postgres://user:password@localhost:5432/gator_db"
}

### 3. Generate Migrations

Gator uses Drizzle ORM to manage the database structure.
Generate the necessary SQL migration files based on the TypeScript schema:

    ```npm run generate```

### 4. Push to Database

Apply the generated migrations to your live PostgreSQL instance:

    ```npm run migrate```

Once these steps are complete, your tables (users, feeds, posts) will be ready to store data!
