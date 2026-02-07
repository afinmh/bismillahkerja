-- Create the comments table
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  id_user TEXT NOT NULL,
  nama TEXT NOT NULL,
  message TEXT NOT NULL,
  avatar TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read comments
CREATE POLICY "Allow public read access" ON comments
  FOR SELECT USING (true);

-- Create a policy that allows anyone to insert comments
CREATE POLICY "Allow public insert access" ON comments
  FOR INSERT WITH CHECK (true);
