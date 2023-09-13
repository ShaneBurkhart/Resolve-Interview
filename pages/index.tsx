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
  const [isDownloading, setIsDownloading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [entity, setEntity] = useState(null)
  const [input, setInput] = useState('')

  const onInput = (e) => {
    const value = e.target.value;
    const onlyNums = value.replace(/[^0-9]/g, '');
    setInput(onlyNums);
  }

  const startPollingForDownload = (startTime) => {
    // poll for 30 seconds
    const interval = setInterval(async () => {
      const response = await fetch(`/api/is_downloaded`)
      const entity = await response.json()
      
      if (entity.status === "downloaded") {
        setIsDownloading(false)
        clearInterval(interval)
        submit()
      } else if (new Date().getTime() - startTime.getTime() > 30000) {
        setIsDownloading(false)
        clearInterval(interval)
      }
    }, 1000)
  }

  const submit = async () => {
    setLoading(true)
    setEntity(null)

    const entityId = input
    const entity = await loadEntity(entityId)
    if (entity.status === "downloading") {
      setLoading(false)
      setIsDownloading(true)
      startPollingForDownload(new Date())
      return
    } else {
      setEntity(entity.entity)
    }

    setLoading(false)
  }

  const deleteDB = async () => {
    setLoading(true)
    setEntity(null)
    const response = await fetch(`/api/delete_db`)
    const entity = await response.json()
    setLoading(false)
  }

  console.log(entity)

  return (
    <div className='max-w-2xl mx-auto'>
      <h1>Hello World</h1>

      <button onClick={deleteDB}>Delete DB</button>

      <div className='pb-8'>
        <h3>Search for an entity</h3>
        <input 
          className='border border-gray-300 rounded-md p-2 text-black'
          value={input} 
          onChange={onInput}
        />
        <button onClick={submit}>Submit</button>
      </div>
      {isDownloading && <p>Downloading...</p>}
      {loading && <p>Loading...</p>}
      {!!entity && <EntityInfo entity={entity} />}

    </div>
  )
}

