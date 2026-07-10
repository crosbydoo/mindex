# Setup Postgres Lokal & VPS — Mindex

Panduan ini memakai **Docker Compose** supaya setup di Mac/laptop sama dengan di VPS nanti.

---

## Lokal (Mac / laptop)

### 1. Prasyarat

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) sudah terinstall & jalan
- Node.js 18+

### 2. Environment

```bash
cp .env.example .env
```

Pastikan `.env` berisi:

```env
ADMIN_PASSWORD=password-admin-anda
POSTGRES_URL=postgresql://mindex:mindex_local_dev@localhost:5432/mindex
```

Kredensial Postgres harus sama dengan `docker-compose.yml`:
- user: `mindex`
- password: `mindex_local_dev`
- database: `mindex`

### 3. Jalankan Postgres

```bash
npm run db:up
```

Cek status:

```bash
npm run db:logs
# atau
docker compose ps
```

Tunggu sampai status **healthy**.

### 4. Jalankan app (frontend + API)

```bash
npm install
npm run dev:full
```

Buka http://localhost:3005

### 5. Verifikasi

```bash
curl http://localhost:3005/api/entries
```

Response JSON array → DB + API OK. Tabel `entries` dan 18 seed record dibuat otomatis saat request pertama.

### 6. Stop / reset

```bash
# Stop container (data tetap ada)
npm run db:down

# Stop + hapus semua data
docker compose down -v
```

---

## VPS (production / staging)

Arsitektur yang disarankan:

```
[VPS]
  ├── Postgres (Docker, port 5432 hanya localhost)
  └── Go API (nanti) — port 8080, expose ke internet via Nginx/Caddy
```

Frontend bisa tetap di Vercel; API di VPS pakai `POSTGRES_URL` ke `127.0.0.1`.

### 1. Install Docker di VPS

Ubuntu/Debian:

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# logout & login lagi
```

### 2. Upload `docker-compose.yml`

Buat folder di VPS, misalnya `/opt/mindex`, lalu salin `docker-compose.yml`.

**Penting untuk VPS:** jangan expose Postgres ke internet. Ubah `ports` jadi:

```yaml
ports:
  - "127.0.0.1:5432:5432"
```

Dan ganti password di `environment`:

```yaml
environment:
  POSTGRES_USER: mindex
  POSTGRES_PASSWORD: GANTI_DENGAN_PASSWORD_KUAT
  POSTGRES_DB: mindex
```

### 3. Jalankan Postgres di VPS

```bash
cd /opt/mindex
docker compose up -d
docker compose ps
```

### 4. Env untuk API di VPS

```env
ADMIN_PASSWORD=password-admin-kuat
POSTGRES_URL=postgresql://mindex:GANTI_DENGAN_PASSWORD_KUAT@127.0.0.1:5432/mindex
PORT=8080
CORS_ORIGIN=https://domain-frontend-anda.com
```

### 5. Keamanan VPS

| Item | Rekomendasi |
|------|-------------|
| Postgres port | Hanya `127.0.0.1:5432`, jangan `0.0.0.0` |
| Firewall | `ufw allow 22,80,443` — **jangan** buka 5432 |
| Password | Password kuat, beda dari lokal |
| Backup | `docker exec mindex-postgres pg_dump -U mindex mindex > backup.sql` |

### 6. Backup & restore

**Backup:**

```bash
docker exec mindex-postgres pg_dump -U mindex mindex > backup-$(date +%F).sql
```

**Restore:**

```bash
cat backup.sql | docker exec -i mindex-postgres psql -U mindex -d mindex
```

---

## Koneksi manual (psql / GUI)

| Field | Lokal |
|-------|-------|
| Host | `localhost` |
| Port | `5432` |
| User | `mindex` |
| Password | `mindex_local_dev` |
| Database | `mindex` |

```bash
docker exec -it mindex-postgres psql -U mindex -d mindex
```

Contoh query:

```sql
SELECT id, title, year FROM entries ORDER BY year DESC LIMIT 5;
```

---

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Port 5432 sudah dipakai | Stop Postgres lain: `brew services stop postgresql` atau ubah port di compose ke `5433:5432` dan sesuaikan `POSTGRES_URL` |
| `connection refused` | `npm run db:up` dan tunggu healthy |
| Data kosong setelah up | Normal jika DB baru — hit `GET /api/entries` sekali untuk trigger seed |
| `POSTGRES_URL is not configured` | Cek `.env`, restart `npm run dev:full` |

---

## Scripts npm

| Command | Fungsi |
|---------|--------|
| `npm run db:up` | Start Postgres |
| `npm run db:down` | Stop Postgres |
| `npm run db:logs` | Lihat log Postgres |
| `npm run dev:full` | Frontend + API |
| `npm run dev` | Frontend saja (tanpa DB) |
