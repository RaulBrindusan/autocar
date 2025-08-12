-- Progress Tracking Schema for AutoMode Import System
-- This extends the existing car_requests table with timeline tracking

-- Add timeline fields to car_requests table
ALTER TABLE public.car_requests ADD COLUMN IF NOT EXISTS timeline_stage TEXT NOT NULL DEFAULT 'requested' CHECK (timeline_stage IN ('requested', 'searching', 'found', 'auction_time', 'auction_won', 'auction_lost', 'purchased', 'purchase_failed', 'in_transit', 'delivered'));
ALTER TABLE public.car_requests ADD COLUMN IF NOT EXISTS timeline_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.car_requests ADD COLUMN IF NOT EXISTS timeline_updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL;
ALTER TABLE public.car_requests ADD COLUMN IF NOT EXISTS auction_result TEXT CHECK (auction_result IN ('win', 'lose', NULL));
ALTER TABLE public.car_requests ADD COLUMN IF NOT EXISTS auction_decided_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.car_requests ADD COLUMN IF NOT EXISTS auto_reset_scheduled BOOLEAN DEFAULT FALSE;
ALTER TABLE public.car_requests ADD COLUMN IF NOT EXISTS reset_scheduled_at TIMESTAMP WITH TIME ZONE;

-- Create index for timeline queries
CREATE INDEX IF NOT EXISTS idx_car_requests_timeline_stage ON public.car_requests(timeline_stage);
CREATE INDEX IF NOT EXISTS idx_car_requests_timeline_updated_at ON public.car_requests(timeline_updated_at);
CREATE INDEX IF NOT EXISTS idx_car_requests_auto_reset ON public.car_requests(auto_reset_scheduled, reset_scheduled_at) WHERE auto_reset_scheduled = true;

-- RLS policies for timeline fields
CREATE POLICY "Users can view their own car requests timeline" ON public.car_requests
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can update car request timeline" ON public.car_requests
FOR UPDATE  
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.users 
  WHERE users.id = auth.uid() 
  AND users.role = 'admin'
));

-- Function to handle auto-reset for failed auctions
CREATE OR REPLACE FUNCTION auto_reset_failed_auctions()
RETURNS void AS $$
BEGIN
  -- Reset timeline_stage to 'searching' for requests that had failed auctions 5+ minutes ago
  UPDATE public.car_requests 
  SET 
    timeline_stage = 'searching',
    auto_reset_scheduled = FALSE,
    reset_scheduled_at = NULL,
    auction_result = NULL,
    auction_decided_at = NULL,
    timeline_updated_at = NOW()
  WHERE 
    timeline_stage = 'purchase_failed' 
    AND auto_reset_scheduled = TRUE 
    AND reset_scheduled_at <= NOW() - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql;