import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// GET - Fetch all member requests (admin only)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verify admin access
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: userProfile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()

    if (userProfile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    // Get query parameters for filtering/search
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status') 
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from("member_car_requests")
      .select("*")
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false })

    // Apply filters
    if (search) {
      query = query.or(`brand.ilike.%${search}%,model.ilike.%${search}%,contact_name.ilike.%${search}%,contact_email.ilike.%${search}%`)
    }
    
    if (status) {
      query = query.eq('status', status)
    }

    const { data: memberRequests, error } = await query

    if (error) {
      console.error("Error fetching member requests:", error)
      return NextResponse.json({ error: "Failed to fetch member requests" }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      data: memberRequests,
      pagination: {
        limit,
        offset,
        total: memberRequests?.length || 0
      }
    })

  } catch (error) {
    console.error("Error in member-requests GET:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}