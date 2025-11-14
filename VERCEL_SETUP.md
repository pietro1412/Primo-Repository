# Vercel Deployment Guide

This guide explains how to deploy the Daily Todo application to Vercel with Postgres database.

## Prerequisites

- A Vercel account (free tier works fine)
- Git repository connected to Vercel

## Step 1: Create Vercel Postgres Database

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to the **Storage** tab
3. Click **Create Database**
4. Select **Postgres**
5. Choose a name for your database (e.g., "daily-todo-db")
6. Select a region close to your users
7. Click **Create**

## Step 2: Initialize Database Schema

Hai **due opzioni** per inizializzare il database:

### Opzione A: Automatica (Consigliata) ✅

Dopo il deploy (Step 4), visita semplicemente questo URL nel browser:
```
https://your-app-name.vercel.app/api/init-db
```

Vedrai un messaggio di successo JSON. Le tabelle verranno create automaticamente!

### Opzione B: Manuale

Se hai `psql` installato localmente, puoi eseguire:
```bash
psql "YOUR_POSTGRES_URL" < schema.sql
```

**Cosa viene creato:**
- Tabella `users` (per autenticazione)
- Tabella `tasks` (per i todo)
- Indici per performance
- Trigger per aggiornamenti automatici

## Step 3: Configure Environment Variables

1. In your Vercel project dashboard, go to **Settings** → **Environment Variables**
2. Add the following variables:

### `POSTGRES_URL`
- **Value**: Copy from the Vercel Postgres dashboard → **.env.local** tab
- **Environment**: Production, Preview, Development

### `JWT_SECRET`
- **Value**: Generate a secure random string:
  ```bash
  openssl rand -base64 32
  ```
- **Environment**: Production, Preview, Development

**Important**: Never commit your actual JWT_SECRET to git. The value in `.env.example` is just a placeholder.

## Step 4: Deploy

1. Push your code to your Git repository
2. Vercel will automatically deploy your application
3. Wait for the deployment to complete

## Step 5: Verify Deployment

1. Visit your deployed application URL
2. Try registering a new account
3. Create a task and verify it persists
4. Test drag-and-drop functionality

## API Routes

The application uses the following serverless API routes:

**Setup:**
- `GET /api/init-db` - Initialize database schema (call once after deploy)

**Authentication:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

**Tasks:**
- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/[id]` - Update a task
- `DELETE /api/tasks/[id]` - Delete a task

All task routes require authentication via JWT token in the `Authorization` header.

## Local Development

For local development:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Vercel Postgres credentials from the Vercel dashboard

3. Run the development server:
   ```bash
   npm run dev
   ```

4. The API routes will be proxied through Vite during development

## Troubleshooting

### Authentication errors
- Verify that `JWT_SECRET` is set in environment variables
- Check that the token is being sent in the Authorization header

### Database connection errors
- Verify `POSTGRES_URL` is correct
- Ensure the database schema has been initialized
- Check Vercel function logs for detailed error messages

### CORS issues
- The API routes include CORS headers for development
- In production, the frontend and API are on the same domain

## Security Notes

- Passwords are hashed using bcrypt before storage
- JWT tokens expire after 7 days
- All API routes verify user authentication
- Row-level security: Users can only access their own tasks
- Never expose `JWT_SECRET` or database credentials in client code
