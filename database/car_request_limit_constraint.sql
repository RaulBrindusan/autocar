-- Add constraint to limit registered users to 3 car requests
-- This applies only to member_car_requests table (registered users)

-- Function to check if user has reached the 3 car request limit
CREATE OR REPLACE FUNCTION check_user_car_request_limit()
RETURNS TRIGGER AS $$
BEGIN
  -- Only check limit for registered users (user_id is not null)
  IF NEW.user_id IS NOT NULL THEN
    -- Count existing requests for this user
    IF (SELECT COUNT(*) FROM member_car_requests WHERE user_id = NEW.user_id) >= 3 THEN
      RAISE EXCEPTION 'User has already reached the maximum limit of 3 car requests';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce the limit on INSERT
DROP TRIGGER IF EXISTS enforce_car_request_limit ON member_car_requests;
CREATE TRIGGER enforce_car_request_limit
  BEFORE INSERT ON member_car_requests
  FOR EACH ROW
  EXECUTE FUNCTION check_user_car_request_limit();

-- Add a function to get user's current request count
CREATE OR REPLACE FUNCTION get_user_request_count(p_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*)::INTEGER FROM member_car_requests WHERE user_id = p_user_id);
END;
$$ LANGUAGE plpgsql;

-- Add a function to check if user can make more requests
CREATE OR REPLACE FUNCTION can_user_make_request(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM member_car_requests WHERE user_id = p_user_id) < 3;
END;
$$ LANGUAGE plpgsql;

-- Create an index for better performance on user_id lookups
CREATE INDEX IF NOT EXISTS idx_member_car_requests_user_id ON member_car_requests(user_id);

-- Update RLS policies to support the new functions
CREATE POLICY "Users can check their own request count" ON member_car_requests
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Also apply similar constraint to regular car_requests table for consistency
-- But only if user_id is not null (registered users)
CREATE OR REPLACE FUNCTION check_car_request_limit()
RETURNS TRIGGER AS $$
BEGIN
  -- Only check limit for registered users (user_id is not null)
  IF NEW.user_id IS NOT NULL THEN
    -- Count existing requests for this user across both tables
    IF (
      (SELECT COALESCE(COUNT(*), 0) FROM member_car_requests WHERE user_id = NEW.user_id) +
      (SELECT COALESCE(COUNT(*), 0) FROM car_requests WHERE user_id = NEW.user_id)
    ) >= 3 THEN
      RAISE EXCEPTION 'User has already reached the maximum limit of 3 car requests';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for car_requests table as well
DROP TRIGGER IF EXISTS enforce_car_request_limit_regular ON car_requests;
CREATE TRIGGER enforce_car_request_limit_regular
  BEFORE INSERT ON car_requests  
  FOR EACH ROW
  EXECUTE FUNCTION check_car_request_limit();