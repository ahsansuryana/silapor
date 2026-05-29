-- Migration: Add fcm_tokens table for Firebase Cloud Messaging
CREATE TABLE IF NOT EXISTS public.fcm_tokens (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    token text NOT NULL UNIQUE,
    device_type varchar(50) DEFAULT 'web',
    device_name varchar(255),
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now()
);
