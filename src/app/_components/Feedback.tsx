import React from 'react'

async function myAction(formData: FormData) {
  'use server'
  console.log('formData', formData)
}

export const Feedback: React.FC = async () => {
  return (
    <form action={myAction}>
      <textarea />
      <button type="submit">submit</button>
    </form>
  )
}
