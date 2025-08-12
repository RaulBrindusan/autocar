-- Fix admin_get_users function to count from member_car_requests table
-- This fixes the discrepancy where the grid shows 0 requests but modal shows actual requests

CREATE OR REPLACE FUNCTION public.admin_get_users()
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  car_requests_count BIGINT,
  cost_estimates_count BIGINT,
  openlane_submissions_count BIGINT
) AS $$
BEGIN
  -- Check if the requesting user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.full_name,
    u.phone,
    u.role,
    u.created_at,
    u.updated_at,
    COALESCE(mcr.count, 0) as car_requests_count,
    COALESCE(ce.count, 0) as cost_estimates_count,
    COALESCE(os.count, 0) as openlane_submissions_count
  FROM public.users u
  LEFT JOIN (
    SELECT user_id, COUNT(*) as count 
    FROM public.member_car_requests 
    GROUP BY user_id
  ) mcr ON u.id = mcr.user_id
  LEFT JOIN (
    SELECT user_id, COUNT(*) as count 
    FROM public.cost_estimates 
    GROUP BY user_id
  ) ce ON u.id = ce.user_id
  LEFT JOIN (
    SELECT user_id, COUNT(*) as count 
    FROM public.openlane_submissions 
    GROUP BY user_id
  ) os ON u.id = os.user_id
  ORDER BY u.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;