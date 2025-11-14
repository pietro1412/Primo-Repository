# Supabase Setup Guide

Questa guida ti aiuterà a configurare Supabase per Daily Todo in pochi minuti.

## 1. Crea un Account Supabase

1. Vai su [https://supabase.com](https://supabase.com)
2. Clicca su "Start your project"
3. Registrati con GitHub, Google o email

## 2. Crea un Nuovo Progetto

1. Dalla dashboard, clicca su "New Project"
2. Scegli un nome per il progetto (es: "daily-todo")
3. Genera una password sicura per il database (salvala!)
4. Seleziona una regione vicina a te
5. Clicca su "Create new project"
6. Attendi 1-2 minuti mentre Supabase configura il database

## 3. Esegui lo Schema SQL

1. Nel menu laterale, vai su **SQL Editor**
2. Clicca su "New query"
3. Copia tutto il contenuto del file `supabase-schema.sql` dalla root del progetto
4. Incolla il contenuto nell'editor SQL
5. Clicca su "Run" o premi `Ctrl+Enter`
6. Dovresti vedere "Success. No rows returned" - questo è normale!

**Cosa fa questo script:**
- Crea la tabella `tasks` con tutti i campi necessari
- Imposta Row Level Security (RLS) per proteggere i dati
- Configura le policies in modo che ogni utente veda solo i propri task
- Crea indici per query veloci
- Aggiunge trigger per aggiornare automaticamente `updated_at`

## 4. Ottieni le Credenziali

1. Nel menu laterale, vai su **Project Settings** (icona ingranaggio)
2. Clicca su **API**
3. Copia i seguenti valori:
   - **Project URL** (nella sezione "Config")
   - **anon public** key (nella sezione "Project API keys")

## 5. Configura le Variabili d'Ambiente

### Sviluppo Locale

1. Copia il file `.env.example` e rinominalo in `.env`:
   ```bash
   cp .env.example .env
   ```

2. Apri il file `.env` e inserisci le tue credenziali:
   ```
   VITE_SUPABASE_URL=https://xyzcompany.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Deploy su Vercel

1. Vai sul tuo progetto Vercel
2. Clicca su **Settings** → **Environment Variables**
3. Aggiungi le seguenti variabili:
   - Nome: `VITE_SUPABASE_URL`, Valore: il tuo Project URL
   - Nome: `VITE_SUPABASE_ANON_KEY`, Valore: la tua anon key
4. Clicca su "Save"
5. Fai un nuovo deploy (o Vercel rifarà automaticamente il deploy)

## 6. Testa l'Autenticazione

1. Avvia l'app in locale: `npm run dev`
2. Dovresti vedere la schermata di login/registrazione
3. Crea un account con una email valida
4. Controlla la tua email per il link di conferma
5. Clicca sul link per confermare
6. Fai login!

**Nota:** In sviluppo, Supabase invia email reali. Se vuoi, puoi configurare un servizio SMTP personalizzato nelle impostazioni di Supabase.

## 7. Verifica che Funzioni

Dopo il login:
1. Crea alcuni task
2. Apri la dashboard Supabase
3. Vai su **Table Editor** → **tasks**
4. Dovresti vedere i tuoi task nel database!

## Troubleshooting

### "Invalid API key" o errori di connessione
- Verifica che le variabili d'ambiente siano corrette
- Assicurati di aver riavviato il server dopo aver modificato `.env`
- Controlla che l'URL Supabase sia corretto (deve includere `https://`)

### "Row Level Security policy violation"
- Assicurati di aver eseguito tutto lo script SQL
- Verifica che le policies siano state create: vai su **Authentication** → **Policies** nella dashboard

### Email di conferma non arriva
- Controlla la cartella spam
- Nelle impostazioni di Supabase, puoi disabilitare la conferma email per test
- Vai su **Authentication** → **Settings** → **Email Auth** → disabilita "Enable email confirmations"

### "User already registered"
- Se hai già creato un utente, puoi eliminarlo dalla dashboard:
- Vai su **Authentication** → **Users** → trova l'utente → "..." → "Delete user"

## Funzionalità Bonus di Supabase

### Real-time Updates
La tua app è già configurata per ricevere aggiornamenti in tempo reale! Se apri l'app in due browser diversi con lo stesso account, le modifiche si sincronizzeranno automaticamente.

### Dashboard Database
Puoi gestire i dati manualmente dalla dashboard:
- **Table Editor**: visualizza e modifica i dati
- **SQL Editor**: esegui query personalizzate
- **Database**: gestisci tabelle, funzioni, trigger

### Sicurezza
Row Level Security (RLS) è già attivo e configurato:
- Ogni utente può vedere/modificare solo i propri task
- Nessuno può vedere i task di altri utenti
- Tutto è gestito automaticamente da Supabase

## Prossimi Passi

Ora che hai configurato Supabase:
- ✅ Gli utenti possono registrarsi e fare login
- ✅ Ogni utente ha i propri task privati
- ✅ I dati persistono nel database PostgreSQL
- ✅ Real-time sync automatico
- ✅ Sicurezza con RLS attiva

Buon lavoro con Daily Todo! 🎉
