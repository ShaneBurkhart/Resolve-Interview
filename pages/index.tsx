import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useRouter } from 'next/router'
import { EntityInfo } from '@/components/EntityInfo'

const inter = Inter({ subsets: ['latin'] })

const loadEntity = async (entityId: string) => {
  const response = await fetch(`/api/entity/${entityId}`)
  const entity = await response.json()

  // todo handle 404

  return entity
}

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [entity, setEntity] = useState(null)
  const [input, setInput] = useState('')

  const onInput = (e) => {
    const value = e.target.value;
    const onlyNums = value.replace(/[^0-9]/g, '');
    setInput(onlyNums);
  }

  const submit = async () => {
    setLoading(true)

    const entityId = input
    const entity = await loadEntity(entityId)
    setEntity(entity)

    setLoading(false)
  }

  console.log(input, entity)


  return (
    <div className='max-w-2xl mx-auto'>
      <h1>Hello World</h1>
      <div className='pb-8'>
        <h3>Search for an entity</h3>
        <input 
          className='border border-gray-300 rounded-md p-2 text-black'
          value={input} 
          onChange={onInput}
        />
        <button onClick={submit}>Submit</button>
      </div>
      {!!entity && <EntityInfo entity={entity} />}
    </div>
  )
}

