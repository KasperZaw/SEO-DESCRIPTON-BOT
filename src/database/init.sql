CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    shop_id TEXT NOT NULL,
    wp_product_id INTEGER NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    short_description TEXT,

    generated_description TEXT,
    generated_short_description TEXT,

    ai_status TEXT NOT NULL DEFAULT 'queued'
        CHECK (ai_status IN ('queued', 'processing', 'generated', 'failed')),

    publish_status TEXT NOT NULL DEFAULT 'draft'
        CHECK (publish_status IN ('draft', 'queued', 'publishing', 'published', 'failed')),

    retry_count INTEGER NOT NULL DEFAULT 0,
    last_error TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);