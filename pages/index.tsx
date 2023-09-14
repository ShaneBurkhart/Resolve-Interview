import { useEffect, useState, useRef } from 'react'
import { Inter } from 'next/font/google'
import { useRouter } from 'next/router'
import { EntityInfo } from '@/components/EntityInfo'
import Image from 'next/image'

const inter = Inter({ subsets: ['latin'] })

const loadEntity = async (entityId: string) => {
  const response = await fetch(`/api/entity/${entityId}`)
  const entity = await response.json()

  if (response.status === 404) {
    return null
  }

  return entity
}

export default function Home() {
  const [isDownloading, setIsDownloading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [entity, setEntity] = useState<any>(null)
  const [input, setInput] = useState('')
  const [recent, setRecent] = useState<string[]>([]);
  const _cache:any = useRef({}).current

  const onInput = (e:Event) => {
    const value = (e.target as HTMLInputElement)?.value;
    const onlyNums = value.replace(/[^0-9]/g, '');
    setInput(onlyNums);
  }

  const startPollingForDownload = (startTime:Date) => {
    // poll for 30 seconds
    const interval = setInterval(async () => {
      const response = await fetch(`/api/is_downloaded`)
      const entity = await response.json()
      
      if (entity.status === "downloaded") {
        setIsDownloading(false)
        clearInterval(interval)
        submit(input)
      } else if (new Date().getTime() - startTime.getTime() > 30000) {
        setIsDownloading(false)
        clearInterval(interval)
      }
    }, 1000)
  }

  const addToRecent = (entityId: string) => {
    setRecent((prev:string[]) => {
      for (let i=0; i<prev.length; i++) {
        if (prev[i] == entityId) {
          return prev
        }
      }

      const next = [entityId, ...prev]
      if (next.length > 10) next.pop()
      return next
    })
  }

  const submit = async (input: string) => {
    if (loading || isDownloading) return
    if (!input || input.length <= 0) return;

    setLoading(true)
    setEntity(null)
    setMessage(null)

    const entityId = input

    if (_cache[entityId]) {
      setEntity(_cache[entityId])
      setLoading(false)
      addToRecent(entityId)
      return
    }

    const entity = await loadEntity(entityId)
    if (!entity) {
      setMessage("Entity not found")
    } else if (entity.status === "downloading") {
      setLoading(false)
      setIsDownloading(true)
      startPollingForDownload(new Date())

      return
    } else {
      setEntity(entity.entity)
      _cache[entityId] = entity.entity
      addToRecent(entityId)
    }

    setLoading(false)
  }

  const deleteDB = async () => {
    setLoading(true)
    setEntity(null)

    // clear the cache
    for (let k in _cache) delete _cache[k]

    await fetch(`/api/delete_db`)
    setLoading(false)
  }

  const goToRecent = (entityId: string) => {
    setInput(entityId)
    submit(entityId)
  }

  return (
    <div className='max-w-2xl mx-auto pt-10 px-2 pb-40'>
      <div className='pb-20 px-4 max-w-sm mx-auto'>
        <Image src='/Logo_white-01.png' alt="Resolve" width={1004} height={154} />
      </div>

      <div className='flex justify-between sm:items-center pb-4 align-middle flex-col sm:flex-row'>
        <h1 className='text-4xl font-bold'>BIM Entity Search</h1>

        <button onClick={deleteDB} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4">Delete Database File</button>
      </div>

      <div className='pb-8 flex flex-col'>
        <label htmlFor="entitySearch" className='cursor-pointer'>Search for an entity by ID</label>
        <div className='flex pb-1'>
          <input 
            id="entitySearch"
            className='border border-gray-300 p-2 text-black'
            style={{ width: 200 }}
            value={input} 
            onChange={onInput as any}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                submit(input)
              }
            }}
          />
          <button onClick={_=>submit(input)} className={`font-bold py-2 px-4 ml-1 ${loading || isDownloading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white'}`} disabled={loading || isDownloading}>Search</button>
        </div>
        {!!recent.length && (
          <p>Recent: &nbsp;
            {recent.map((r, i) => (
              (entity && r==entity?.entityId) ? (
                <span key={r}>
                  <span className="text-gray-100 font-bold" key={r}>{r}</span>{i < recent.length-1 ? ', ' : ' '}
                </span>
              ) : (
                <span key={r}>
                  <span className="hover:underline cursor-pointer text-gray-400" key={r} onClick={_=>goToRecent(r)}>{r}</span>{i < recent.length-1 ? ', ' : ' '}
                </span>
              )
            ))}
          </p>
        )}
      </div>

      {!!message && <p className='text-red-500'>{message}</p>}

      {isDownloading && <p>Downloading...</p>}
      {loading && <p>Loading...</p>}
      {!!entity && <EntityInfo key={entity.entityId} entity={entity} goTo={goToRecent} />}

    </div>
  )
}

