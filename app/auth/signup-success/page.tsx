'use client'

import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function SignupSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h1>
        <p className="text-gray-600 mb-6">
          Please check your email to confirm your account before logging in.
        </p>
        
        <Link href="/auth/login" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition">
          Return to Login
        </Link>
      </div>
    </div>
  )
}
