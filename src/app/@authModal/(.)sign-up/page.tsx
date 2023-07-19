import CloseModal from '@/components/close-modal'
import SignUp from '@/components/sign-up'
import React from 'react'

export default function Page() {
  return (
    <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-10">
      <div className="container flex items-center max-w-lg h-full mx-auto">
        <div className="relative bg-secondary shadow-md w-full h-fit py-20 px-2 rounded-lg">
          <div className="absolute top-4 right-4">
            <CloseModal />
          </div>
          <SignUp />
        </div>
      </div>
    </div>
  )
}
