'use client'

import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { CacheProvider } from '@chakra-ui/next-js'

export default function ChakraProv({ children }: {
    children: React.ReactNode
}) {
  return (
    <CacheProvider>
        <ChakraProvider>
            {children}
        </ChakraProvider>
    </CacheProvider>
  )
}
