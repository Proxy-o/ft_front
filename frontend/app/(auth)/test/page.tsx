'use client'
import useGetUser from '@/app/(chor)/profile/hooks/useGetUser'
import React from 'react'

export default function Page() {
    const {data} = useGetUser("1");
    console.log(data);
  return (
    <div>Page</div>
  )
}
