# MIRSTOERA — Backup & Disaster Recovery Architecture
**Auditor**: NILA (Database Guardian) & ADITYA (DevOps Engineer)  
**Status**: APPROVED  

---

## 1. SQLite Backup Mechanism
- **Automated Backup Script**: `npm run db:backup` runs `scripts/backup.js`.
- **Online Hot Backup Protocol**:
  - Uses `better-sqlite3`'s native `.backup()` API.
  - Safely copies active WAL pages without interrupting ongoing client write operations.
  - Generates timestamped snapshots: `backups/momera-backup-YYYY-MM-DDTHH-mm-ss.sqlite`.
- **Integrity Verification**:
  - Every backup execution runs `PRAGMA integrity_check;` against the resulting snapshot to guarantee zero corrupt data blocks before archiving.

---

## 2. Recovery Time & Point Objectives
- **RPO (Recovery Point Objective)**: < 1 hour (Periodic cron backup schedule).
- **RTO (Recovery Time Objective)**: < 2 minutes (Hot swap of single `.sqlite` file into active data directory).
