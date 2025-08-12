-- Admin Functions Migration
-- Fixes discrepancy between car request counts in grid vs modal
-- by counting from both car_requests and member_car_requests tables

-- Create admin_get_users function to return users with combined request counts
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
  -- Check if the current user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- Return all users with combined counts from both car request tables
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.full_name,
    u.phone,
    u.role,
    u.created_at,
    u.updated_at,
    -- Combined car requests count from both tables
    (
      COALESCE(
        (SELECT COUNT(*) FROM public.car_requests cr WHERE cr.user_id = u.id), 
        0
      ) + 
      COALESCE(
        (SELECT COUNT(*) FROM public.member_car_requests mcr WHERE mcr.user_id = u.id), 
        0
      )
    ) as car_requests_count,
    -- Cost estimates count
    COALESCE(
      (SELECT COUNT(*) FROM public.cost_estimates ce WHERE ce.user_id = u.id),
      0
    ) as cost_estimates_count,
    -- OpenLane submissions count
    COALESCE(
      (SELECT COUNT(*) FROM public.openlane_submissions os WHERE os.user_id = u.id),
      0
    ) as openlane_submissions_count
  FROM public.users u
  ORDER BY u.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create admin_get_user_stats function for dashboard statistics
CREATE OR REPLACE FUNCTION public.admin_get_user_stats()
RETURNS TABLE (
  total_users BIGINT,
  admin_users BIGINT,
  regular_users BIGINT,
  users_this_month BIGINT,
  users_this_week BIGINT
) AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- Return user statistics
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.users) as total_users,
    (SELECT COUNT(*) FROM public.users WHERE role = 'admin') as admin_users,
    (SELECT COUNT(*) FROM public.users WHERE role = 'user') as regular_users,
    (SELECT COUNT(*) FROM public.users WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)) as users_this_month,
    (SELECT COUNT(*) FROM public.users WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE)) as users_this_week;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create admin functions for user CRUD operations
CREATE OR REPLACE FUNCTION public.admin_create_user(
  user_id_param UUID,
  email_param TEXT,
  full_name_param TEXT,
  phone_param TEXT,
  role_param TEXT
)
RETURNS VOID AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- Insert new user
  INSERT INTO public.users (id, email, full_name, phone, role)
  VALUES (user_id_param, email_param, full_name_param, phone_param, role_param);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create admin_update_user function
CREATE OR REPLACE FUNCTION public.admin_update_user(
  user_id_param UUID,
  new_email TEXT DEFAULT NULL,
  new_full_name TEXT DEFAULT NULL,
  new_phone TEXT DEFAULT NULL,
  new_role TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- Update user with provided non-null values
  UPDATE public.users
  SET 
    email = COALESCE(new_email, email),
    full_name = COALESCE(new_full_name, full_name),
    phone = COALESCE(new_phone, phone),
    role = COALESCE(new_role, role),
    updated_at = NOW()
  WHERE id = user_id_param;

  -- Check if user was found and updated
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found with ID: %', user_id_param;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create admin_delete_user function
CREATE OR REPLACE FUNCTION public.admin_delete_user(user_id_param UUID)
RETURNS VOID AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- Prevent deleting the last admin user
  IF (SELECT role FROM public.users WHERE id = user_id_param) = 'admin' THEN
    IF (SELECT COUNT(*) FROM public.users WHERE role = 'admin') <= 1 THEN
      RAISE EXCEPTION 'Cannot delete the last admin user.';
    END IF;
  END IF;

  -- Delete the user (ON DELETE CASCADE will handle related records)
  DELETE FROM public.users WHERE id = user_id_param;

  -- Check if user was found and deleted
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found with ID: %', user_id_param;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;