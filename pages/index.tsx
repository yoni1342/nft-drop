import { useTheme } from 'next-themes'
import Head from 'next/head'
import {MoonIcon, SunIcon} from '@heroicons/react/outline'
import { useEffect, useState } from 'react';
import Link from 'next/link'
import { GetServerSideProps } from 'next';
import {sanityClient} from '../lib/sanity.server'
import {urlFor} from '../lib/sanity'
import { Collection } from '../typings';

interface Props{
  collections: Collection[]
}

export default function NextPage({collections}:Props){
  console.log(collections)
  const {systemTheme, theme, setTheme} = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(()=>{
    setMounted(true)
  },[])
  const renderThemeChanger = ()=>{
    if(!mounted) return null
    const currentTheme = theme === 'system' ? systemTheme: theme;
    if(currentTheme === 'dark'){
        return (
            <SunIcon className = 'w-7 h-7' role = "button" onClick= {()=>setTheme('light')}/> 
        )
    }
    else{
        return (
            <MoonIcon className = 'w-7 h-7' role = "button" onClick= {()=>setTheme('dark')}/> 
        )
    }
}
  return (
    <div className="">
      <Head>
        <title>NFT Drop</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@500&display=swap" rel="stylesheet"/>
      </Head>

      <div className = 'snap-start h-screen w-screen  flex flex-col transition duration-300 ease-in-out  dark:transition dark:duration-300 dark:ease-in-out dark:bg-gray-900 ' >
        <nav className ='flex justify-between px-10 py-5'>
          <h1 className = 'font-jose text-2xl cursor-pointer'>Yoni APE Clube</h1>
          <div>
          {renderThemeChanger()}
          </div>
        </nav>
        <div className = 'w-screen flex justify-center items-center h-screen'>
          <div className = 'md:flex md:items-center md:justify-center text-center md:space-x-5 lg:w-[1400px] space-y-20 p-10'>
            <div className ='p-2 text-gray-800 '>
              <h1 className = 'font-bold font-jose text-3xl p-3 dark:text-gray-200'>Welcome to the yoni NFT Collection</h1>
              <p className ='dark:text-white text-lg'>The Yoni NFT Collection has a collection of 10000 NFT arts. generation randomly from over 100+ assets. Each NFT is a unique creation with different traits. Ranging form accessories to facial hair. no two are the same. All live happily on the Ethereum Blockchain</p>
              <Link href = '#collections'>
               <button className = 'bg-rose-400 px-4 py-2 mt-2 rounded-full text-white font-bold hover:shadow-md hover:scale-105 active:scale-95 active:bg-rose-600 transition saturate-150 ease-in-out '>Go To Collections</button>
              </Link>
            </div>
            <div>
              <img src="/nft.jpg" alt="" className ='rounded-xl'/>
            </div>
          </div>
        </div>
      </div>

      <div className = ' snap-start dark:bg-gray-900 h-screen flex justify-center items-center px-10 mt-20 md:mt-0' id='collections'>
        <div className = 'dark:bg-gradient-to-br dark:from-white/20  w-screen dark:to-gray-900 bg-opacity-10 rounded-3xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-10 bg-gradient-to-br from-gray-300/50 to-gray-50/50 shadow-sm space-y-10 md:space-y-0 items-center'>

          {collections.map(collection =>(
            <Link href = {`/nft/${collection.slug.current}`}>
              <div className ='flex cursor-pointer flex-col items-center hover:scale-105 transition-all duration-200'>
              {console.log(collection )}
                <img src={urlFor(collection.mainImage).url()} alt="" className ='h-96 w-60 rounded-2xl object-cover' />
                <div>
                  <h2 className = 'text-2xl md:text-3xl'>{collection.title}</h2>
                  <p className = 'mt-2 text-sm font-light text-gray-600'>{collection.description}</p>
                </div>
              </div>
            </Link>
            

          ))}
        </div>
      </div>

    </div>
  )
}


export const getServerSideProps: GetServerSideProps = async()=>{
    const query = `  *[_type == "collection"]{
      _id,
      title,
      address,
      description,
      nftCollectionName,
      mainImage{
      asset
    },
    slug {
      current
    },
    creator->{
      _id,
      name,
      address,
      slug{
      current
    },
    },
    }`

    const collections = await sanityClient.fetch(query);
    console.log(collections)
  return {
    props:{
      collections
    }
  }  
}