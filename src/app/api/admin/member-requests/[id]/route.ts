// import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

async function verifyAdminAccess() {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: "Unauthorized", status: 401 }
  }

  const { data: userProfile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single()

  if (userProfile?.role !== "admin") {
    return { error: "Forbidden - Admin access required", status: 403 }
  }

  return { supabase, user }
}

// GET - Fetch single member request
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await verifyAdminAccess()
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const { supabase } = adminCheck
    const { id } = await params
    const { data: memberRequest, error } = await supabase
      .from("member_car_requests")
      .select(`
        *,
        users!member_car_requests_user_id_fkey (
          phone,
          full_name,
          email
        )
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching member request:", error)
      return NextResponse.json({ error: "Member request not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: memberRequest })

  } catch (error) {
    console.error("Error in member-request GET:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH - Update member request
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await verifyAdminAccess()
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const { supabase } = adminCheck
    const { id } = await params
    const updates = await request.json()

    // Allowed fields for update
    const allowedFields = [
      'status',
      'admin_notes',
      'fuel_type',
      'transmission',
      'max_mileage_km',
      'max_budget',
      'required_features',
      'additional_notes'
    ]

    // Filter updates to only allowed fields
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key]
        return obj
      }, {} as any)

    // Add updated timestamp
    filteredUpdates.updated_at = new Date().toISOString()

    const { data: updatedRequest, error } = await supabase
      .from("member_car_requests")
      .update(filteredUpdates)
      .eq("id", id)
      .select("*")
      .single()

    if (error) {
      console.error("Error updating member request:", error)
      return NextResponse.json({ error: "Failed to update member request" }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      data: updatedRequest,
      message: "Member request updated successfully"
    })

  } catch (error) {
    console.error("Error in member-request PATCH:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete member request  
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await verifyAdminAccess()
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const { supabase } = adminCheck
    const { id } = await params

    // First check if the request exists
    const { data: existingRequest, error: fetchError } = await supabase
      .from("member_car_requests")
      .select("id, brand, model, contact_name")
      .eq("id", id)
      .single()

    if (fetchError || !existingRequest) {
      return NextResponse.json({ error: "Member request not found" }, { status: 404 })
    }

    // Delete the request
    const { error: deleteError } = await supabase
      .from("member_car_requests")
      .delete()
      .eq("id", id)

    if (deleteError) {
      console.error("Error deleting member request:", deleteError)
      return NextResponse.json({ error: "Failed to delete member request" }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: `Member request for ${existingRequest.brand} ${existingRequest.model} by ${existingRequest.contact_name} deleted successfully`
    })

  } catch (error) {
    console.error("Error in member-request DELETE:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}