"use client"

import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          {/* Success Message */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Email Confirmat cu Succes!
          </h2>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 text-sm font-medium">
              ✓ Contul tău a fost confirmat cu succes. Acum te poți conecta la platforma Automode.
            </p>
          </div>
          
          <p className="text-gray-600 text-sm mb-8">
            Bine ai venit la Automode! Contul tău este acum activ și poți accesa toate funcționalitățile platformei noastre pentru importul de mașini din Europa.
          </p>
          
          {/* Action Button */}
          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
            <Link href="/login">
              Mergi la Login
            </Link>
          </Button>
          
          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Dacă întâmpini probleme, contactează echipa noastră de suport.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}