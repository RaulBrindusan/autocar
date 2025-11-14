// import { createClient } from "@/lib/supabase/server"
// import { createAdminClient } from "@/lib/supabase/admin"
import { NextRequest, NextResponse } from "next/server"

// DELETE - Delete a member and their requests (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verify admin access using regular client
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

    // Get member ID from request body
    const { memberId } = await request.json()
    
    if (!memberId) {
      return NextResponse.json({ error: "Member ID is required" }, { status: 400 })
    }

    // Validate memberId format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(memberId)) {
      return NextResponse.json({ error: "Invalid member ID format" }, { status: 400 })
    }

    // Check if the member exists before attempting deletion
    const { data: memberExists } = await supabase
      .from("users")
      .select("id, email")
      .eq("id", memberId)
      .single()

    if (!memberExists) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    // Prevent admin from deleting themselves
    if (memberId === user.id) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 })
    }

    try {
      // Create admin client with service role key for user deletion
      const adminClient = createAdminClient()
      
      // Delete the user using admin privileges
      // This will cascade and delete related records due to database constraints
      const { error: deleteError } = await adminClient.auth.admin.deleteUser(memberId)

      if (deleteError) {
        console.error("Error deleting member:", deleteError)
        return NextResponse.json({ 
          error: "Failed to delete member", 
          details: deleteError.message 
        }, { status: 500 })
      }

      return NextResponse.json({ 
        success: true, 
        message: `Member ${memberExists.email} deleted successfully` 
      })

    } catch (adminError) {
      console.error("Admin client error:", adminError)
      
      // Check if this is a service role key issue
      if (adminError instanceof Error && adminError.message.includes('SUPABASE_SERVICE_ROLE_KEY')) {
        return NextResponse.json({ 
          error: "Server configuration error", 
          details: "Service role key not configured. Please add SUPABASE_SERVICE_ROLE_KEY to environment variables." 
        }, { status: 500 })
      }
      
      return NextResponse.json({ 
        error: "Failed to initialize admin client", 
        details: adminError instanceof Error ? adminError.message : "Unknown error" 
      }, { status: 500 })
    }

  } catch (error) {
    console.error("Error in delete-member DELETE:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}