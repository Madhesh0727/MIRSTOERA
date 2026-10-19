import { DatabaseExecutor } from '../adapters/index.js';
import {
  ServiceEntity,
  EnquiryEntity,
  EnquiryNoteEntity,
  AdminUserEntity,
  PublicSettings,
  AdminSettings,
  NotificationOutboxEntity,
  AdminAuditLogEntity,
  DashboardMetrics,
  EnquiryStatus,
  NotificationStatus,
  BRAND_CONSTANTS,
} from '@momera/shared';

// Helper to map DB service row to ServiceEntity
function mapService(row: any): ServiceEntity {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    tagline: row.tagline,
    description: row.description,
    starting_price_paise: row.starting_price_paise,
    starting_price_inr: Math.round(row.starting_price_paise / 100),
    cover_image_url: row.cover_image_url || null,
    is_active: Boolean(row.is_active),
    display_order: row.display_order,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

// Helper to map DB enquiry row to EnquiryEntity
function mapEnquiry(row: any): EnquiryEntity {
  return {
    id: row.id,
    reference_code: row.reference_code,
    customer_name: row.customer_name,
    customer_phone: row.customer_phone,
    service_id: row.service_id,
    service_slug: row.service_slug,
    service_title: row.service_title,
    event_date: row.event_date,
    event_time: row.event_time,
    event_area: row.event_area,
    recipient_relationship: row.recipient_relationship,
    description: row.description,
    budget_paise: row.budget_paise ?? null,
    budget_inr: row.budget_paise ? Math.round(row.budget_paise / 100) : null,
    additional_preferences: row.additional_preferences ?? null,
    status: row.status as EnquiryStatus,
    quoted_price_paise: row.quoted_price_paise ?? null,
    quoted_price_inr: row.quoted_price_paise ? Math.round(row.quoted_price_paise / 100) : null,
    idempotency_key: row.idempotency_key,
    privacy_consent_at: row.privacy_consent_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export class ServiceRepository {
  constructor(private db: DatabaseExecutor) {}

  async getAllActive(): Promise<ServiceEntity[]> {
    const rows = await this.db.query(
      'SELECT * FROM services WHERE is_active = 1 ORDER BY display_order ASC, id ASC'
    );
    return rows.map(mapService);
  }

  async getAll(): Promise<ServiceEntity[]> {
    const rows = await this.db.query('SELECT * FROM services ORDER BY display_order ASC, id ASC');
    return rows.map(mapService);
  }

  async getBySlug(slug: string): Promise<ServiceEntity | null> {
    const row = await this.db.queryOne('SELECT * FROM services WHERE slug = ?', [slug]);
    return row ? mapService(row) : null;
  }

  async getById(id: number): Promise<ServiceEntity | null> {
    const row = await this.db.queryOne('SELECT * FROM services WHERE id = ?', [id]);
    return row ? mapService(row) : null;
  }

  async create(data: {
    slug: string;
    title: string;
    tagline?: string;
    description: string;
    starting_price_paise: number;
    cover_image_url?: string | null;
    is_active?: boolean;
    display_order?: number;
  }): Promise<ServiceEntity> {
    const res = await this.db.execute(
      `INSERT INTO services (slug, title, tagline, description, starting_price_paise, cover_image_url, is_active, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.slug,
        data.title,
        data.tagline || '',
        data.description,
        data.starting_price_paise,
        data.cover_image_url || null,
        data.is_active !== false ? 1 : 0,
        data.display_order ?? 0,
      ]
    );
    const createdId = Number(res.lastInsertRowId);
    const created = await this.getById(createdId);
    if (!created) throw new Error('Failed to retrieve newly created service');
    return created;
  }

  async update(id: number, data: Partial<ServiceEntity>): Promise<ServiceEntity | null> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.title !== undefined) {
      fields.push('title = ?');
      values.push(data.title);
    }
    if (data.tagline !== undefined) {
      fields.push('tagline = ?');
      values.push(data.tagline);
    }
    if (data.description !== undefined) {
      fields.push('description = ?');
      values.push(data.description);
    }
    if (data.starting_price_paise !== undefined) {
      fields.push('starting_price_paise = ?');
      values.push(data.starting_price_paise);
    }
    if (data.cover_image_url !== undefined) {
      fields.push('cover_image_url = ?');
      values.push(data.cover_image_url || null);
    }
    if (data.is_active !== undefined) {
      fields.push('is_active = ?');
      values.push(data.is_active ? 1 : 0);
    }
    if (data.display_order !== undefined) {
      fields.push('display_order = ?');
      values.push(data.display_order);
    }

    if (fields.length === 0) return this.getById(id);

    fields.push("updated_at = datetime('now')");
    values.push(id);

    await this.db.execute(`UPDATE services SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.getById(id);
  }
}

export class EnquiryRepository {
  constructor(private db: DatabaseExecutor) {}

  async generateNextReferenceCode(executor: DatabaseExecutor = this.db): Promise<string> {
    // Generate next sequence atomically
    const latest = await executor.queryOne<{ max_id: number | null }>(
      'SELECT MAX(id) as max_id FROM enquiries'
    );
    const nextSeq = (latest?.max_id ?? 0) + 1;
    return `MIR-${String(nextSeq).padStart(6, '0')}`;
  }

  async getByIdempotencyKey(key: string, executor: DatabaseExecutor = this.db): Promise<EnquiryEntity | null> {
    const row = await executor.queryOne(
      `SELECT e.*, s.slug as service_slug, s.title as service_title
       FROM enquiries e
       JOIN services s ON e.service_id = s.id
       WHERE e.idempotency_key = ?`,
      [key]
    );
    return row ? mapEnquiry(row) : null;
  }

  async getByReferenceCode(code: string): Promise<EnquiryEntity | null> {
    const row = await this.db.queryOne(
      `SELECT e.*, s.slug as service_slug, s.title as service_title
       FROM enquiries e
       JOIN services s ON e.service_id = s.id
       WHERE e.reference_code = ?`,
      [code]
    );
    return row ? mapEnquiry(row) : null;
  }

  async getById(id: number): Promise<EnquiryEntity | null> {
    const row = await this.db.queryOne(
      `SELECT e.*, s.slug as service_slug, s.title as service_title
       FROM enquiries e
       JOIN services s ON e.service_id = s.id
       WHERE e.id = ?`,
      [id]
    );
    return row ? mapEnquiry(row) : null;
  }

  async create(
    data: {
      customer_name: string;
      customer_phone: string;
      service_id: number;
      event_date: string;
      event_time: string;
      event_area: string;
      recipient_relationship: string;
      description: string;
      budget_paise?: number | null;
      additional_preferences?: string | null;
      idempotency_key: string;
      privacy_consent_at: string;
    },
    executor: DatabaseExecutor = this.db
  ): Promise<EnquiryEntity> {
    const referenceCode = await this.generateNextReferenceCode(executor);

    const res = await executor.execute(
      `INSERT INTO enquiries (
        reference_code, customer_name, customer_phone, service_id,
        event_date, event_time, event_area, recipient_relationship,
        description, budget_paise, additional_preferences, status,
        idempotency_key, privacy_consent_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'NEW', ?, ?)`,
      [
        referenceCode,
        data.customer_name,
        data.customer_phone,
        data.service_id,
        data.event_date,
        data.event_time,
        data.event_area,
        data.recipient_relationship,
        data.description,
        data.budget_paise ?? null,
        data.additional_preferences ?? null,
        data.idempotency_key,
        data.privacy_consent_at,
      ]
    );

    const createdId = Number(res.lastInsertRowId);
    const created = await this.getById(createdId);
    if (!created) {
      throw new Error(`Failed to retrieve newly inserted enquiry ID ${createdId}`);
    }
    return created;
  }

  async list(params: {
    status?: string;
    service_slug?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ items: EnquiryEntity[]; total: number }> {
    const conditions: string[] = [];
    const values: any[] = [];

    if (params.status) {
      conditions.push('e.status = ?');
      values.push(params.status);
    }
    if (params.service_slug) {
      conditions.push('s.slug = ?');
      values.push(params.service_slug);
    }
    if (params.search) {
      const q = `%${params.search}%`;
      conditions.push('(e.reference_code LIKE ? OR e.customer_name LIKE ? OR e.customer_phone LIKE ? OR e.event_area LIKE ?)');
      values.push(q, q, q, q);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countRow = await this.db.queryOne<{ count: number }>(
      `SELECT COUNT(*) as count
       FROM enquiries e
       JOIN services s ON e.service_id = s.id
       ${whereClause}`,
      values
    );
    const total = countRow?.count ?? 0;

    const limit = params.limit ?? 20;
    const offset = params.offset ?? 0;

    const rows = await this.db.query(
      `SELECT e.*, s.slug as service_slug, s.title as service_title
       FROM enquiries e
       JOIN services s ON e.service_id = s.id
       ${whereClause}
       ORDER BY e.created_at DESC
       LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );

    return {
      items: rows.map(mapEnquiry),
      total,
    };
  }

  async updateStatus(
    id: number,
    status: EnquiryStatus,
    quotedPricePaise?: number | null
  ): Promise<EnquiryEntity | null> {
    if (quotedPricePaise !== undefined) {
      await this.db.execute(
        `UPDATE enquiries SET status = ?, quoted_price_paise = ?, updated_at = datetime('now') WHERE id = ?`,
        [status, quotedPricePaise, id]
      );
    } else {
      await this.db.execute(
        `UPDATE enquiries SET status = ?, updated_at = datetime('now') WHERE id = ?`,
        [status, id]
      );
    }
    return this.getById(id);
  }
}

export class EnquiryNoteRepository {
  constructor(private db: DatabaseExecutor) {}

  async addNote(enquiryId: number, adminId: number, note: string): Promise<EnquiryNoteEntity> {
    const res = await this.db.execute(
      'INSERT INTO enquiry_notes (enquiry_id, admin_id, note) VALUES (?, ?, ?)',
      [enquiryId, adminId, note]
    );
    const id = Number(res.lastInsertRowId);
    const row = await this.db.queryOne(
      `SELECT n.*, u.email as admin_email, u.full_name as admin_name
       FROM enquiry_notes n
       JOIN admin_users u ON n.admin_id = u.id
       WHERE n.id = ?`,
      [id]
    );
    return {
      id: row.id,
      enquiry_id: row.enquiry_id,
      admin_id: row.admin_id,
      admin_email: row.admin_email,
      admin_name: row.admin_name,
      note: row.note,
      created_at: row.created_at,
    };
  }

  async getNotesByEnquiry(enquiryId: number): Promise<EnquiryNoteEntity[]> {
    const rows = await this.db.query(
      `SELECT n.*, u.email as admin_email, u.full_name as admin_name
       FROM enquiry_notes n
       JOIN admin_users u ON n.admin_id = u.id
       WHERE n.enquiry_id = ?
       ORDER BY n.created_at ASC`,
      [enquiryId]
    );
    return rows.map((r) => ({
      id: r.id,
      enquiry_id: r.enquiry_id,
      admin_id: r.admin_id,
      admin_email: r.admin_email,
      admin_name: r.admin_name,
      note: r.note,
      created_at: r.created_at,
    }));
  }
}

export class AdminRepository {
  constructor(private db: DatabaseExecutor) {}

  async findByEmail(email: string): Promise<(AdminUserEntity & { password_hash: string }) | null> {
    const row = await this.db.queryOne<any>(
      'SELECT * FROM admin_users WHERE email = ? AND is_active = 1',
      [email]
    );
    if (!row) return null;
    return {
      id: row.id,
      email: row.email,
      full_name: row.full_name,
      is_active: Boolean(row.is_active),
      created_at: row.created_at,
      updated_at: row.updated_at,
      password_hash: row.password_hash,
    };
  }

  async findById(id: number): Promise<AdminUserEntity | null> {
    const row = await this.db.queryOne<any>(
      'SELECT id, email, full_name, is_active, created_at, updated_at FROM admin_users WHERE id = ?',
      [id]
    );
    if (!row) return null;
    return {
      id: row.id,
      email: row.email,
      full_name: row.full_name,
      is_active: Boolean(row.is_active),
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }

  async createSession(id: string, adminId: number, sessionHash: string, expiresAt: string): Promise<void> {
    await this.db.execute(
      'INSERT INTO admin_sessions (id, admin_id, session_hash, expires_at) VALUES (?, ?, ?, ?)',
      [id, adminId, sessionHash, expiresAt]
    );
  }

  async findSession(sessionHash: string): Promise<{ admin: AdminUserEntity; expires_at: string } | null> {
    const row = await this.db.queryOne<any>(
      `SELECT s.expires_at, u.id, u.email, u.full_name, u.is_active, u.created_at, u.updated_at
       FROM admin_sessions s
       JOIN admin_users u ON s.admin_id = u.id
       WHERE s.session_hash = ? AND u.is_active = 1`,
      [sessionHash]
    );
    if (!row) return null;

    // Check expiration
    if (new Date(row.expires_at) < new Date()) {
      await this.deleteSession(sessionHash);
      return null;
    }

    return {
      admin: {
        id: row.id,
        email: row.email,
        full_name: row.full_name,
        is_active: Boolean(row.is_active),
        created_at: row.created_at,
        updated_at: row.updated_at,
      },
      expires_at: row.expires_at,
    };
  }

  async deleteSession(sessionHash: string): Promise<void> {
    await this.db.execute('DELETE FROM admin_sessions WHERE session_hash = ?', [sessionHash]);
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const rows = await this.db.query<{ status: string; count: number }>(
      'SELECT status, COUNT(*) as count FROM enquiries GROUP BY status'
    );
    const counts: Record<string, number> = {};
    for (const r of rows) {
      counts[r.status] = r.count;
    }
    const totalRow = await this.db.queryOne<{ total: number }>('SELECT COUNT(*) as total FROM enquiries');
    const total = totalRow?.total ?? 0;

    return {
      total,
      new: counts['NEW'] ?? 0,
      contacted: counts['CONTACTED'] ?? 0,
      quoted: counts['QUOTED'] ?? 0,
      confirmed: counts['CONFIRMED'] ?? 0,
      completed: counts['COMPLETED'] ?? 0,
      cancelled: counts['CANCELLED'] ?? 0,
    };
  }
}

export class SettingsRepository {
  constructor(private db: DatabaseExecutor) {}

  async getAll(): Promise<Record<string, string>> {
    const rows = await this.db.query<{ setting_key: string; setting_value: string }>(
      'SELECT setting_key, setting_value FROM business_settings'
    );
    const result: Record<string, string> = {};
    for (const r of rows) {
      result[r.setting_key] = r.setting_value;
    }
    return result;
  }

  async getPublic(): Promise<PublicSettings> {
    const all = await this.getAll();
    return {
      brand_name: all['brand_name'] || BRAND_CONSTANTS.NAME,
      tagline: all['tagline'] || BRAND_CONSTANTS.TAGLINE,
      phone: all['phone'] || BRAND_CONSTANTS.DEFAULT_PHONE,
      whatsapp: all['whatsapp'] || BRAND_CONSTANTS.DEFAULT_WHATSAPP,
      email: all['email'] || BRAND_CONSTANTS.DEFAULT_EMAIL,
      service_coverage: all['service_coverage'] || BRAND_CONSTANTS.LOCATION,
      business_hours: all['business_hours'] || BRAND_CONSTANTS.DEFAULT_BUSINESS_HOURS,
      instagram_url: all['instagram_url'] !== undefined ? all['instagram_url'] : BRAND_CONSTANTS.DEFAULT_INSTAGRAM,
      facebook_url: all['facebook_url'] !== undefined ? all['facebook_url'] : BRAND_CONSTANTS.DEFAULT_FACEBOOK,
      youtube_url: all['youtube_url'] !== undefined ? all['youtube_url'] : BRAND_CONSTANTS.DEFAULT_YOUTUBE,
      twitter_url: all['twitter_url'] !== undefined ? all['twitter_url'] : BRAND_CONSTANTS.DEFAULT_TWITTER,
    };
  }

  async getAdminSettings(): Promise<AdminSettings> {
    const publicSettings = await this.getPublic();
    const all = await this.getAll();
    return {
      ...publicSettings,
      notification_recipient: all['notification_recipient'] || BRAND_CONSTANTS.DEFAULT_PHONE,
      notification_provider_status: (process.env.WHATSAPP_API_TOKEN ? 'ready' : 'manual_only'),
    };
  }

  async updateSettings(entries: Record<string, string>): Promise<void> {
    for (const [key, value] of Object.entries(entries)) {
      const existing = await this.db.queryOne<{ id: number }>(
        'SELECT id FROM business_settings WHERE setting_key = ?',
        [key]
      );
      if (existing) {
        await this.db.execute(
          `UPDATE business_settings SET setting_value = ?, updated_at = datetime('now') WHERE setting_key = ?`,
          [value, key]
        );
      } else {
        await this.db.execute(
          'INSERT INTO business_settings (setting_key, setting_value) VALUES (?, ?)',
          [key, value]
        );
      }
    }
  }
}

export class NotificationRepository {
  constructor(private db: DatabaseExecutor) {}

  async createOutboxRecord(
    record: {
      enquiry_id: number;
      channel: string;
      recipient: string;
      template_key: string;
      payload_json: string;
      status?: NotificationStatus;
    },
    executor: DatabaseExecutor = this.db
  ): Promise<NotificationOutboxEntity> {
    const status = record.status || 'PENDING';
    const res = await executor.execute(
      `INSERT INTO notification_outbox (enquiry_id, channel, recipient, template_key, payload_json, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        record.enquiry_id,
        record.channel,
        record.recipient,
        record.template_key,
        record.payload_json,
        status,
      ]
    );

    const id = Number(res.lastInsertRowId);
    const row = await executor.queryOne<any>('SELECT * FROM notification_outbox WHERE id = ?', [id]);
    return row as NotificationOutboxEntity;
  }

  async updateStatus(
    id: number,
    status: NotificationStatus,
    lastError?: string | null
  ): Promise<void> {
    await this.db.execute(
      `UPDATE notification_outbox
       SET status = ?, attempt_count = attempt_count + 1, last_error = ?, updated_at = datetime('now')
       WHERE id = ?`,
      [status, lastError ?? null, id]
    );
  }

  async getAll(limit: number = 50): Promise<NotificationOutboxEntity[]> {
    const rows = await this.db.query<any>(
      'SELECT * FROM notification_outbox ORDER BY created_at DESC LIMIT ?',
      [limit]
    );
    return rows as NotificationOutboxEntity[];
  }
}

export class AuditRepository {
  constructor(private db: DatabaseExecutor) {}

  async log(
    action: string,
    entityType: string,
    entityId: string | null,
    adminId: number | null,
    metadata?: any
  ): Promise<void> {
    await this.db.execute(
      'INSERT INTO admin_audit_logs (action, entity_type, entity_id, admin_id, metadata_json) VALUES (?, ?, ?, ?, ?)',
      [
        action,
        entityType,
        entityId,
        adminId,
        metadata ? JSON.stringify(metadata) : null,
      ]
    );
  }

  async getLogs(limit: number = 100): Promise<AdminAuditLogEntity[]> {
    const rows = await this.db.query<any>(
      `SELECT a.*, u.email as admin_email
       FROM admin_audit_logs a
       LEFT JOIN admin_users u ON a.admin_id = u.id
       ORDER BY a.created_at DESC
       LIMIT ?`,
      [limit]
    );
    return rows.map((r) => ({
      id: r.id,
      admin_id: r.admin_id,
      admin_email: r.admin_email,
      action: r.action,
      entity_type: r.entity_type,
      entity_id: r.entity_id,
      metadata_json: r.metadata_json,
      created_at: r.created_at,
    }));
  }
}
