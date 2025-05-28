'use client'                              // ①

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'  // ②

export default function Home() {
  const [rows, setRows] = useState([])

  useEffect(() => {
    supabase
      .from('employees')      // ← your table name
      .select('*')
      .then(({ data, error }) => {
        if (error) {
          console.error('Supabase error:', error)
        } else {
          console.log('Supabase data:', data)
          setRows(data)
        }
      })
  }, [])

  return (
    <main style={{ padding: 20 }}>
      <h1>Welcome to BIMstream Management</h1>
      
     
    </main>
  )
}