'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import React, { FC, useEffect, useState } from 'react'
import Select, { MultiValue } from 'react-select'
import { MAX_FILE_SIZE } from '../../constants/config'
import { Categories } from '@/utils/types'
import useSWR from 'swr'
import { fetcher, selectOptions } from '@/utils/helpers'

const DynamicSelect = dynamic(() => import('react-select'), { ssr: false})

type MenuProps = {}

type Input = {
    name: string
    price: number 
    categories: MultiValue<{ value: string, label: string }>
    file: undefined | File
}

const initialInput = {
    name: '',
    price: 0,
    categories: [],
    file: undefined

}


const Menu: FC<MenuProps> = ({}) => {

    const [input, setInput ] = useState<Input>(initialInput)

    const [preview, setPreview ] = useState<string>('')

    const [error, setError ] = useState<string>('')

    const { data: menuItems, isLoading, mutate } = useSWR('/api/menu', fetcher)


    useEffect(() => {
    
    if(!input.file) return

    const objectUrl = URL.createObjectURL(input.file)

    setPreview(objectUrl)


    return () => URL.revokeObjectURL(objectUrl)

    }, [input.file])

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!e.target.files?.[0]) return setError('No file selected')

        if(e.target.files[0].size > MAX_FILE_SIZE) return setError('File size too big')

        setInput((prev) => ({ ...prev, file: e.target.files![0]}))
    }  

    const handleImageUpload = async () => {
      const file = input.file

      if (!file) return

      const s3Bucket = await fetch('/api/s3', {
        method: "POST",
        body: JSON.stringify({fileType: file.type})
      })

      const s3Json = await s3Bucket.json()

      const {fields, key, url } = await s3Json

      const data = {
        ...fields,
        "Content-type": file.type,
        file
      }

      const formData = new FormData()

      Object.entries(data).forEach(([key, value]: any) => {
        formData.append(key, value as any)
      })

      
        await fetch(url, {
            method: 'POST', 
            body: formData,
          })

        // await fetch(url, file, {
        //   headers: {
        //   }
        // })

      return key

    }

    async function addMenuItem() {
      const key = await handleImageUpload()

      if(!key) throw new Error('no key was found')

    await fetch('/api/menuitem', {
      method: 'POST',
      body: JSON.stringify({name: input.name, price: input.price, imageKey: key, categories: input.categories.map((c: any) => c.value as Exclude<Categories, 'all'>)})
    })
    
    
    

    setInput(initialInput)
    setPreview('')
    mutate()
    
    }

    async function handleDelete(imageKey: string, id: string) {
      await fetch('/api/menuitem', {
        method: 'DELETE',
        body: JSON.stringify({imageKey, id})
      })

      mutate()

    }

    // console.log(menuItems)


    return (
        <>
        <div className=''>
          <div className='mx-auto flex max-w-xl flex-col gap-2'>
            <input
              name='name'
              className='h-12 rounded-sm border-none bg-gray-200'
              type='text'
              placeholder='name'
              onChange={(e) => setInput((prev) => ({...prev, name: e.target.value}))}
              value={input.name}
            />
  
            <input
              name='price'
              className='h-12 rounded-sm border-none bg-gray-200'
              type='number'
              placeholder='price'
              onChange={(e) => setInput((prev) => ({ ...prev, price: Number(e.target.value) }))}
              value={input.price}
            />
  
            <DynamicSelect
              value={input.categories}
              // @ts-ignore - when using dynamic import, typescript doesn't know about the onChange prop
              onChange={(e) => setInput((prev) => ({ ...prev, categories: e }))}
              isMulti
              className='h-12'
              options={selectOptions}
            />
  
            <label
              htmlFor='file'
              className='relative h-12 cursor-pointer rounded-sm bg-gray-200 font-medium text-indigo-600 focus-within:outline-none'>
              <span className='sr-only'>File input</span>
              <div className='flex h-full items-center justify-center'>
                {preview ? (
                  <div className='relative h-3/4 w-full'>
                    <Image alt='preview' style={{ objectFit: 'contain' }} fill src={preview} />
                  </div>
                ) : (
                  <span>Select image</span>
                )}
              </div>
              <input
                name='file'
                id='file'
                onChange={handleFileSelect}
                accept='image/jpeg image/png image/jpg'
                type='file'
                className='sr-only'
              />
            </label>
  
            <button
              className='h-12 rounded-sm bg-gray-200 disabled:cursor-not-allowed'
              disabled={!input.file || !input.name}
              onClick={addMenuItem}>
              Add menu item
            </button>
          </div>
          {error && <p className='text-xs text-red-600'>{error}</p>}
  
          <div className='mx-auto mt-12 max-w-7xl bg-gray-300'>
            <p className='text-lg font-medium'>Your menu items:</p>
            <div className='mt-6 mb-12 grid grid-cols-4 gap-8'>
              {menuItems?.map((menuItem: any) => (
                <div key={menuItem._doc.id}>
                  <p className='text-black'>{menuItem._doc.name}</p>
                  <div className='relative h-40 w-40'>
                    <Image priority fill alt='' src={menuItem.url} />
                  </div>
                  <button
                    onClick={() => handleDelete(menuItem._doc.imageKey, menuItem._doc._id)}
                    className='text-xs text-red-500'>
                    delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
        )
}


export default Menu