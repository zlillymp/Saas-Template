// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://uhwromqzaqhyufuqtxjy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVod3JvbXF6YXFoeXVmdXF0eGp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY1MzY1MjksImV4cCI6MjA1MjExMjUyOX0.97pruVUGD9dn_D125UTVx_HJYs8HJKli8DJ_-U8SxJk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);