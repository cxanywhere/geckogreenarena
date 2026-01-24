-- Manager accounts for production database
-- Run this SQL in the production database pane

INSERT INTO users (name, email, password, role, status, avatar_initials) VALUES ('Joshua Couch', 'jcouch@geckogreen.com', 'GammaTiger4508%#', 'manager', 'active', 'JC') ON CONFLICT (email) DO NOTHING;
INSERT INTO users (name, email, password, role, status, avatar_initials) VALUES ('Shawn Singleton', 'ssingleton@geckogreen.com', 'PrimeBlade7274!&', 'manager', 'active', 'SS') ON CONFLICT (email) DO NOTHING;
INSERT INTO users (name, email, password, role, status, avatar_initials) VALUES ('Thomas Adam', 'tadam@geckogreen.com', 'GreenTerra8625#*', 'manager', 'active', 'TA') ON CONFLICT (email) DO NOTHING;
INSERT INTO users (name, email, password, role, status, avatar_initials) VALUES ('Thomas Greer', 'tgreer@geckogreen.com', 'KiloIsle8926##', 'manager', 'active', 'TG') ON CONFLICT (email) DO NOTHING;
INSERT INTO users (name, email, password, role, status, avatar_initials) VALUES ('Thomas Adams', 'tadams@geckogreen.com', 'HyperWolf1603$!', 'manager', 'active', 'TA') ON CONFLICT (email) DO NOTHING;
INSERT INTO users (name, email, password, role, status, avatar_initials) VALUES ('Nick Lilljedahl', 'nlilljedahl@geckogreen.com', 'ZincAnchor7201#*', 'manager', 'active', 'NL') ON CONFLICT (email) DO NOTHING;
INSERT INTO users (name, email, password, role, status, avatar_initials) VALUES ('Clint Brown', 'cbrown@geckogreen.com', 'HappySpark1172@#', 'manager', 'active', 'CB') ON CONFLICT (email) DO NOTHING;
