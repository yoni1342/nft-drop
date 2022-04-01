import React from 'react'
import { useEffect, useState } from 'react';
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import {useTheme} from 'next-themes';
import {MoonIcon, SunIcon} from '@heroicons/react/outline'
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { sanityClient } from '../../lib/sanity.server';
import { id } from '@ethersproject/hash';
import {urlFor} from '../../lib/sanity'
import { Collection } from '../../typings';

interface Props{
    collection: Collection
}

function NFTDropPage({collection}:Props) {
    console.log(collection);    
    const {systemTheme, theme, setTheme} = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(()=>{
        setMounted(true)
    },[])
    //AUTH
    const connectWithMetamask = useMetamask();
    const address = useAddress();
    const  disconnect = useDisconnect();

    //------
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
    <div className = 'flex h-screen flex-col lg:grid lg:grid-cols-10 relative'>
        {/* Left */}
        <div className = 'bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4 dark:bg-gradient-to-br dark:from-cyan-900 dark:to-rose-900 transition duration-700 ease-in-out lg:h-screen'>
        <div className ='flex flex-col items-center justify-center py-2 lg:min-h-screen'>
            <div className ='bg-gradient-to-br from-yellow-400 to-purple-600 p-1 rounded-xl dark:bg-gradient-to-br dark:from-yellow-700 dark:to-green-400' >
                <img src={urlFor(collection.previewImage).url()} alt=""  className ='w-44 rounded-xl object-cover lg:h-96 lg:w-72'/>
            </div>
        <div className = 'space-y-2 p-5 text-center'>
            <h1 className ='text-4xl font-bold text-white dark:text-gray-200' >{collection.nftCollectionName}</h1>
            <h2 className = 'text-xl text-gray-300'>{collection.description} 🥳 ! </h2>
        </div>
        </div>
        </div>
        {/* Right */}
        <div className = 'flex flex-1 flex-col p-12 lg:col-span-6 dark:bg-gray-900 transition duration-700 ease-in-out dark:transition dark:duration-700 dark:ease-in-out lg:h-screen'>
            {/* Header */}
        <header className = 'flex items-center justify-between'>
            <h1 className = 'cursor-pointer w-52 text-xl font-extralight sm:w-80'>
                The <Link href = '/'><span className ='font-extrabold underline decoration-pink-600/50 hover:bg-slate-200 dark:hover:bg-gray-800 hover:p-2 rounded-full'> YONI</span></Link>  NFT Market Place
            </h1>
            <div className = 'flex items-center space-x-5'>
                <button className ='rounded-full bg-rose-400 dark:bg-rose-700 text-white px-4 py-2 text-xs font-bold lg:px-5 lg:py-3 lg:text-base hover:shadow-lg dark:hover:shadow-gray-700 hover:scale-105 active:scale-95 active:bg-rose-500 dark:active:bg-rose-800 transtion duration-150 ease-in-out' onClick = {()=>(address? disconnect(): connectWithMetamask())}>{address ? 'Sign Out': 'Sign In'}</button>
                {renderThemeChanger()}
            </div>
        </header>
        <hr className = 'my-2 border'/>
        {address && (
            <p className = 'text-center text-sm text-rose-400'>You are logged in with wallet {address.substring(0,5)}...{address.substring(address.length-5)}</p>
        )}
            {/* Contente */}
        <div className = 'mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0 '>
            <img src={urlFor(collection.mainImage).url()} alt="" className = 'w-80 object-cover pb-10 lg:h-40 ' />
            <h1 className = 'text-3xl font-bold lg:text-5xl lg:font-extrabold'>
                {collection.title}
            </h1>
            <p className ='pt-2 text-xl text-green-500'>13 /21 NFT's Claimed</p>
        </div>
            {/* Mint */}
        <button className = 'h-16 w-full bg-red-600 text-white rounded-full cursor-pointer mt-10 font-bold transtion duration-150 ease-in-out hover:shadow-lg dark:hover:shadow-gray-800 hover:scale-[1.01] active:scale-100'>Mint NFT (0.01 ETH)</button>
        </div>
    </div>
  )
}

export default NFTDropPage;



export const getServerSideProps: GetServerSideProps = async ({params})=>{
    const query = `*[_type == "collection" && slug.current == $id][0]{
        _id,
        title,
        address,
        description,
        nftCollectionName,
        mainImage{
            asset
        },
        previewImage{
            asset
        },
        slug{
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
    }
    
    `
    const collection = await sanityClient.fetch(query, {
        id: params?.id
    })

    if(!collection){
        return{
            notFound: true
        }
    }

    return{
        props: {
            collection
        }
    }


}