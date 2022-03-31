import { useTheme } from 'next-themes'
import Head from 'next/head'
import {MoonIcon, SunIcon} from '@heroicons/react/outline'
import { useEffect, useState } from 'react';
import Link from 'next/link'


export default function NextPage(){
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

      <div className = 'h-screen w-screen  flex flex-col transition duration-300 ease-in-out  dark:transition dark:duration-300 dark:ease-in-out dark:bg-gray-900' >
        <nav className ='flex justify-between px-10 py-5'>
          <h1 className = 'font-jose text-2xl cursor-pointer'>Yoni APE Clube</h1>
          <div>
          {renderThemeChanger()}
          </div>
        </nav>
        <div className = 'w-screen flex justify-center items-center h-screen'>
          <div className = 'md:flex md:items-center md:justify-center text-center md:space-x-5 lg:w-[1400px] space-y-20 p-10'>
            <div className ='p-2 text-gray-800 '>
              <h1 className = 'font-bold font-jose text-3xl p-3 dark:text-gray-200'>Welcome to the yoni ape clube</h1>
              <p className ='dark:text-white text-lg'>The Ape Clube Collection is a collection of 10000 APE CLUBE. generation randomly from over 100+ assets. Each APE CLUBE is a unique creation with different traits. Ranging form accessories to facial hair. no two are the same. All live happily on the Ethereum Blockchain</p>
              <Link href = '/nft/yoniape'>
               <button className = 'bg-rose-400 px-4 py-2 mt-2 rounded-full text-white font-bold hover:shadow-md hover:scale-105 active:scale-95 active:bg-rose-600 transition saturate-150 ease-in-out '>Go To Yoni Ape</button>
              </Link>
            </div>
            <div>
              <img src="/nft.jpg" alt="" className ='rounded-xl'/>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}


