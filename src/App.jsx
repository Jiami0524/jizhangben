import { supabase } from './lib/supabaseClient'
import { useEffect } from 'react'

export default function App() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      console.log('Supabase connected, session:', data.session)
    })
  }, [])
  return <div className="p-8 text-2xl">记账本</div>
}
