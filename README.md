# DietiEstates2025

> Progetto per l'esame di Ingegneria del software.
## 📋 Indice

- [Tecnologie](#tecnologie)
- [Prerequisiti](#prerequisiti)
- [Architettura](#architettura)
- [Installazione](#installazione)
    - [Clonazione del Repository](#clonazione-del-repository)
    - [Configurazione](#configurazione)
    - [Avvio con Docker Compose](#avvio-con-docker-compose)
    - [Avvio Manuale](#avvio-manuale)
- [Utilizzo](#utilizzo)
- [Struttura del Progetto](#struttura-del-progetto)
- [Variabili d'Ambiente](#variabili-dambiente)
- [Comandi Utili](#comandi-utili)
- [Troubleshooting](#troubleshooting)
- [Contribuire](#contribuire)
- [Licenza](#licenza)

## 🚀 Tecnologie

L'applicazione è costruita utilizzando le seguenti tecnologie:

**Backend:**
- **Spring Boot** - Framework Java per lo sviluppo del backend
- **PostgreSQL** - Database relazionale
- **MinIO** - Object storage per la gestione di file e media

**Frontend:**
- **React** - Libreria JavaScript per l'interfaccia utente

**Infrastruttura:**
- **Nginx** - Web server e reverse proxy
- **Cloudflared** - Tunnel sicuro per esporre l'applicazione
- **Docker & Docker Compose** - Containerizzazione e orchestrazione

## 📦 Prerequisiti

Prima di iniziare, assicurati di avere installato:

- **Docker** (versione 20.10 o superiore)
- **Docker Compose** (versione 2.0 o superiore)
- **Git**
- **Node.js** (versione 18 o superiore) - solo per sviluppo locale
- **Java JDK** (versione 17 o superiore) - solo per sviluppo locale
- **Maven** (versione 3.8 o superiore) - solo per sviluppo locale

### Verifica delle installazioni

```bash
# Verifica Docker
docker --version

# Verifica Docker Compose
docker compose version

# Verifica Git
git --version

# Verifica Node.js (opzionale)
node --version

# Verifica Java (opzionale)
java --version

# Verifica Maven (opzionale)
mvn --version
```

## 🏗️ Architettura

L'applicazione segue un'architettura a microservizi con i seguenti componenti:

```
┌─────────────┐
│  Cloudflare │ (Tunnel sicuro)
└──────┬──────┘
       │
┌──────▼──────┐
│    Nginx    │ (Reverse Proxy)
└──────┬──────┘
       │
   ┌───┴────┐
   │        │
┌──▼───┐ ┌─▼─────┐
│React │ │Spring │
│ SPA  │ │ Boot  │
└──────┘ └───┬───┘
             │
        ┌────┴────┐
        │         │
   ┌────▼───┐ ┌──▼───┐
   │PostgreS│ │MinIO │
   │   QL   │ │      │
   └────────┘ └──────┘
```

## 🔧 Installazione

### Clonazione del Repository

```bash
# Clona il repository
git clone https://github.com/AntonioLegnante/DietiEstates2025.git

# Entra nella directory del progetto
cd tua-app
```

### Configurazione

#### 1. File di Configurazione

Crea un file `.env` nella cartella del frontend:

```bash
cp .env.example .env
```

Modifica il file `.env` con le tue configurazioni (vedi sezione [Variabili d'Ambiente](#variabili-dambiente)).

#### 2. Configurazione PostgreSQL

Il database verrà inizializzato automaticamente al primo avvio. Se necessario, puoi personalizzare gli script di inizializzazione in:

```
./database/init/
```

#### 3. Configurazione MinIO

MinIO verrà configurato automaticamente. Per personalizzare bucket e policy, modifica:

```
./minio/init/
```

#### 4. Configurazione Nginx

Le configurazioni di Nginx si trovano in:

```
./nginx/nginx.conf
```

Personalizza le route e i proxy pass secondo le tue esigenze.

#### 5. Configurazione Cloudflared

Per configurare il tunnel Cloudflare:

1. Crea un tunnel su Cloudflare Dashboard
2. Ottieni il token del tunnel
3. Aggiungi il token nel file `.env`:

```env
CLOUDFLARED_TOKEN=your-tunnel-token-here
```

### Avvio con Docker Compose

#### Primo Avvio Completo

```bash
# Build e avvio di tutti i container
docker compose up --build -d

# Visualizza i log
docker compose logs -f

# Verifica lo stato dei container
docker compose ps
```

L'applicazione sarà disponibile su:
- **Frontend**: http://localhost (o tramite tunnel Cloudflare)
- **Backend API**: http://localhost/api
- **MinIO Console**: http://localhost:9001

Una volta avviata però al frontend (tramite il file .env) deve essere comunicato il nuovo link cloudflared
generato dal tunnel. Dopo, si può eseguire la build del frontend con il link aggiornato tramite
un comando specifico:
```bash
 docker compose build --no-cache frontend 
```
Una volta eseguito questo comando, tutte le funzionalità saranno pienamente operative.
#### Avvio Rapido (dopo il primo build)

```bash
# Avvia tutti i servizi
docker compose up -d cloudflared

# Oppure avvia servizi specifici
docker compose up -d postgres minio backend
```

#### Arresto dei Servizi

```bash
# Arresta tutti i container
docker compose down

# Arresta e rimuovi i volumi (ATTENZIONE: cancella i dati)
docker compose down -v
```

### Avvio Manuale

Se preferisci eseguire i servizi manualmente senza Docker:

#### 1. PostgreSQL

```bash
# Installa PostgreSQL (Ubuntu/Debian)
sudo apt install postgresql postgresql-contrib

# Crea database e utente
sudo -u postgres psql
CREATE DATABASE nome_database;
CREATE USER nome_utente WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE nome_database TO nome_utente;
\q
```

#### 2. MinIO

```bash
# Scarica e installa MinIO
wget https://dl.min.io/server/minio/release/linux-amd64/minio
chmod +x minio
sudo mv minio /usr/local/bin/

# Avvia MinIO
mkdir -p ~/minio/data
minio server ~/minio/data --console-address ":9001"
```

#### 3. Backend Spring Boot

```bash
# Vai nella directory backend
cd backend

# Installa le dipendenze e compila
mvn clean install

# Avvia l'applicazione
mvn spring-boot:run

# Oppure avvia il JAR compilato
java -jar target/nome-app-0.0.1-SNAPSHOT.jar
```

#### 4. Frontend React

```bash
# Vai nella directory frontend
cd frontend

# Installa le dipendenze
npm install

# Avvia in modalità sviluppo
npm start

# Oppure compila per la produzione
npm run build
```

#### 5. Nginx

```bash
# Installa Nginx (Ubuntu/Debian)
sudo apt install nginx

# Copia la configurazione
sudo cp nginx/nginx.conf /etc/nginx/sites-available/tua-app
sudo ln -s /etc/nginx/sites-available/tua-app /etc/nginx/sites-enabled/

# Testa la configurazione
sudo nginx -t

# Riavvia Nginx
sudo systemctl restart nginx
```

## 💡 Utilizzo

### Accesso all'Applicazione

Dopo l'avvio, puoi accedere a:

- **Frontend**: http://localhost o https://tuo-dominio.com (con Cloudflare)
- **API Backend**: http://localhost/api
- **MinIO Console**: http://localhost:9001
    - Username: `minio` (o come configurato)
    - Password: `minio123` (o come configurato)

### Primo Accesso

1. Accedi all'applicazione
2. Crea un account amministratore (se richiesto)
3. Configura le impostazioni iniziali

## 📁 Struttura del Progetto

```
tua-app/
├── backend/                    # Applicazione Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       └── application-prod.yml
│   │   └── test/
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/                   # Applicazione React
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── package.json
│   └── Dockerfile
│
├── nginx/                      # Configurazioni Nginx
│   ├── nginx.conf
│   └── Dockerfile
│
├── database/                   # Script database
│   └── init/
│       └── 01-init.sql
│
├── minio/                      # Configurazioni MinIO
│   └── init/
│
├── docker-compose.yml          # Orchestrazione container
├── .env.example               # Template variabili d'ambiente
├── .gitignore
└── README.md
```

## 🔐 Variabili d'Ambiente

Crea un file `.env` nella root del progetto con le seguenti variabili:

### Database PostgreSQL

```env
# PostgreSQL
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=nome_database
POSTGRES_USER=utente
POSTGRES_PASSWORD=password_sicura
```

### MinIO

```env
# MinIO
MINIO_ROOT_USER=minio
MINIO_ROOT_PASSWORD=minio123_password_sicura
MINIO_HOST=minio
MINIO_PORT=9000
MINIO_BUCKET_NAME=uploads
```

### Spring Boot

```env
# Spring Boot
SPRING_PROFILES_ACTIVE=prod
SERVER_PORT=8080
JWT_SECRET=tua_chiave_segreta_molto_lunga_e_sicura

# Connessione Database
SPRING_DATASOURCE_URL=jdbc:postgresql://${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}
SPRING_DATASOURCE_USERNAME=${POSTGRES_USER}
SPRING_DATASOURCE_PASSWORD=${POSTGRES_PASSWORD}

# MinIO
MINIO_URL=http://${MINIO_HOST}:${MINIO_PORT}
MINIO_ACCESS_KEY=${MINIO_ROOT_USER}
MINIO_SECRET_KEY=${MINIO_ROOT_PASSWORD}
```

### React

```env
# React
VITE_API_URL= link(generato da cloudflared e recuperato con docker logs -f cloudflared)
VITE_GOOGLE_CLIENT_ID=token google api per l'accesso con google
```

### Cloudflared

Nella cartella cloudflared abbiamo solo il dockerfile, che contiene tutto il necessario:
```env
# Cloudflare Tunnel
tunnel: codice del tunnel
credentials-file: /etc/cloudflared/4f5e6560-6987-42a3-9360-305457c21f71.json
```

## 🛠️ Comandi Utili

### Docker Compose

```bash
# Visualizza i log di tutti i servizi
docker compose logs -f

# Visualizza i log di un servizio specifico
docker compose logs -f backend

# Riavvia un servizio specifico
docker compose restart backend

# Ricompila e riavvia un servizio
docker compose up -d --build backend

# Entra in un container
docker compose exec backend bash
docker compose exec postgres psql -U utente -d nome_database

# Pulisci tutto (container, volumi, network)
docker compose down -v --remove-orphans
```

### Database

```bash
# Backup del database
docker compose exec postgres pg_dump -U utente nome_database > backup.sql

# Ripristina backup
docker compose exec -T postgres psql -U utente nome_database < backup.sql

# Accedi al database
docker compose exec postgres psql -U utente -d nome_database
```

### MinIO

```bash
# Accedi al container MinIO
docker compose exec minio bash

# Lista i bucket
docker compose exec minio mc ls local

# Crea un nuovo bucket
docker compose exec minio mc mb local/nuovo-bucket
```

### Build e Deployment

```bash
# Build solo backend
cd backend && mvn clean package
docker build -t tua-app-backend .

# Build solo frontend
cd frontend && npm run build
docker build -t tua-app-frontend .

# Build completo di tutti i servizi
docker compose build

# Deploy in produzione
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 🐛 Troubleshooting

### Problema: I container non si avviano

**Soluzione:**
```bash
# Controlla i log
docker compose logs

# Verifica le porte in uso
sudo netstat -tulpn | grep LISTEN

# Rimuovi container vecchi
docker compose down
docker system prune -a
```

### Problema: Errore di connessione al database

**Soluzione:**
```bash
# Verifica che PostgreSQL sia in esecuzione
docker compose ps postgres

# Verifica le credenziali nel file .env
cat .env | grep POSTGRES

# Controlla i log di PostgreSQL
docker compose logs postgres
```

### Problema: MinIO non è raggiungibile

**Soluzione:**
```bash
# Verifica lo stato di MinIO
docker compose ps minio

# Accedi alla console MinIO
# http://localhost:9001

# Verifica le credenziali
docker compose logs minio
```

### Problema: Nginx restituisce 502 Bad Gateway

**Soluzione:**
```bash
# Verifica che backend sia in esecuzione
docker compose ps backend

# Controlla la configurazione Nginx
docker compose exec nginx nginx -t

# Riavvia Nginx
docker compose restart nginx
```

### Problema: Frontend non carica correttamente

**Soluzione:**
```bash
# Pulisci la build
cd frontend
rm -rf node_modules build
npm install
npm run build

# Ricostruisci il container
docker compose up -d --build frontend
```

## 🤝 Contribuire

I contributi sono sempre benvenuti! Per contribuire:

1. Fai un fork del progetto
2. Crea un branch per la tua feature (`git checkout -b feature/NuovaFeature`)
3. Committa le tue modifiche (`git commit -m 'Aggiungi NuovaFeature'`)
4. Pusha il branch (`git push origin feature/NuovaFeature`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è distribuito sotto licenza [MIT](LICENSE).

---

## 📞 Contatti

- **Autore**: RootKing01
- **GitHub**: [@RootKing01](https://github.com/RootKing01)
