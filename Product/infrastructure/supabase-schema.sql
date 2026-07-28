# SkillCo Database Schema

## Supabase Tables

### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'visitor' CHECK (role IN ('visitor', 'member', 'creator', 'admin')),
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### skills
```sql
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  source TEXT NOT NULL CHECK (source IN ('github', 'clawdbot', 'manual', 'pal')),
  source_url TEXT,
  author_id UUID REFERENCES users(id),
  vendor TEXT NOT NULL,
  security_scan_id UUID,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('safe', 'low', 'medium', 'high', 'critical')),
  vulnerabilities JSONB DEFAULT '[]',
  price INTEGER NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'usd',
  is_published BOOLEAN DEFAULT FALSE,
  download_count INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0,
  download_url TEXT,
  readme_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_skills_risk_level ON skills(risk_level);
CREATE INDEX idx_skills_category ON skills USING GIN(category);
CREATE INDEX idx_skills_tags ON skills USING GIN(tags);
CREATE INDEX idx_skills_price ON skills(price);
CREATE INDEX idx_skills_is_published ON skills(is_published);
CREATE INDEX idx_skills_vendor ON skills(vendor);
```

### security_scans
```sql
CREATE TABLE security_scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  findings JSONB DEFAULT '[]',
  summary JSONB DEFAULT '{"critical": 0, "high": 0, "medium": 0, "low": 0, "info": 0}',
  codeguru_arn TEXT,
  inspector_arn TEXT,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_security_scans_skill_id ON security_scans(skill_id);
CREATE INDEX idx_security_scans_status ON security_scans(status);
```

### purchases
```sql
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  skill_id UUID NOT NULL REFERENCES skills(id),
  stripe_payment_intent_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  platform_fee INTEGER NOT NULL,
  creator_payout INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'refunded')),
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_purchases_skill_id ON purchases(skill_id);
```

### user_skills (downloaded/purchased skills)
```sql
CREATE TABLE user_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  skill_id UUID NOT NULL REFERENCES skills(id),
  purchase_id UUID REFERENCES purchases(id),
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
```

### reviews
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  skill_id UUID NOT NULL REFERENCES skills(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

CREATE INDEX idx_reviews_skill_id ON reviews(skill_id);
```

### categories
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

-- Seed categories
INSERT INTO categories (name, slug, description) VALUES
('Development', 'development', 'Code, frameworks, and developer tools'),
('Design', 'design', 'UI/UX, graphics, and design resources'),
('Marketing', 'marketing', 'Growth, analytics, and marketing automation'),
('Sales', 'sales', 'CRM, prospecting, and sales tools'),
('Productivity', 'productivity', 'Workflow, automation, and efficiency'),
('Data', 'data', 'ETL, analytics, and data processing'),
('Security', 'security', 'Security scanning, auth, and protection'),
('AI/ML', 'ai-ml', 'Machine learning and AI tools');
```

### skill_sources (tracking scraped/manual uploads)
```sql
CREATE TABLE skill_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL CHECK (source_type IN ('github', 'clawdbot', 'manual', 'pal')),
  source_url TEXT,
  source_metadata JSONB DEFAULT '{}',
  scraped_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Row Level Security (RLS) Policies

```sql
-- Enable RLS
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Skills: Everyone can view published skills
CREATE POLICY "Published skills are viewable by everyone"
ON skills FOR SELECT
TO PUBLIC
USING (is_published = TRUE);

-- Skills: Creators can manage their own skills
CREATE POLICY "Creators can manage their own skills"
ON skills FOR ALL
TO PUBLIC
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- Security scans: Everyone can view completed scans for published skills
CREATE POLICY "Security scans are viewable for published skills"
ON security_scans FOR SELECT
TO PUBLIC
USING (
  EXISTS (
    SELECT 1 FROM skills 
    WHERE skills.id = security_scans.skill_id 
    AND skills.is_published = TRUE
  )
);

-- Purchases: Users can view their own purchases
CREATE POLICY "Users can view their own purchases"
ON purchases FOR SELECT
TO PUBLIC
USING (auth.uid() = user_id);

-- User skills: Users can view their downloaded skills
CREATE POLICY "Users can view their downloaded skills"
ON user_skills FOR SELECT
TO PUBLIC
USING (auth.uid() = user_id);

-- Reviews: Everyone can view reviews
CREATE POLICY "Reviews are viewable by everyone"
ON reviews FOR SELECT
TO PUBLIC
USING (TRUE);

-- Reviews: Users can manage their own reviews
CREATE POLICY "Users can manage their own reviews"
ON reviews FOR ALL
TO PUBLIC
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

## Functions

```sql
-- Update skill rating when review is added/updated
CREATE OR REPLACE FUNCTION update_skill_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE skills
  SET rating = (
    SELECT AVG(rating)::DECIMAL(2,1)
    FROM reviews
    WHERE skill_id = NEW.skill_id
  ),
  review_count = (
    SELECT COUNT(*)
    FROM reviews
    WHERE skill_id = NEW.skill_id
  )
  WHERE id = NEW.skill_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_skill_rating_on_review
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_skill_rating();

-- Increment download count
CREATE OR REPLACE FUNCTION increment_download_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE skills
  SET download_count = download_count + 1
  WHERE id = NEW.skill_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_download_on_user_skill
AFTER INSERT ON user_skills
FOR EACH ROW
EXECUTE FUNCTION increment_download_count();
```

## Storage Buckets

```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
('skill-sources', 'skill-sources', false),
('skill-readmes', 'skill-readmes', true),
('user-avatars', 'user-avatars', true);

-- Storage policies for skill-sources
CREATE POLICY "Skill sources are accessible to authenticated users"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'skill-sources');

CREATE POLICY "Creators can upload skill sources"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'skill-sources' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Storage policies for skill-readmes (public)
CREATE POLICY "Skill readmes are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'skill-readmes');
```

## Full Text Search

```sql
-- Enable pg_trgm extension
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create search index
CREATE INDEX idx_skills_search ON skills 
USING gin((name || ' ' || description || ' ' || array_to_string(tags, ' ')) gin_trgm_ops);

-- Search function
CREATE OR REPLACE FUNCTION search_skills(search_query TEXT)
RETURNS SETOF skills AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM skills
  WHERE 
    is_published = TRUE
    AND (
      name % search_query
      OR description % search_query
      OR EXISTS (
        SELECT 1 FROM unnest(tags) AS tag
        WHERE tag % search_query
      )
    )
  ORDER BY 
    similarity(name, search_query) DESC,
    download_count DESC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql;
```
