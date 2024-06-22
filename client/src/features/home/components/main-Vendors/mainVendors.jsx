import React from 'react'
import MainHeaders from '../../../../components/mainHeaders/mainHeaders'
import bill from '../../../../assets/bill.png'
export default function MainVendors() {
  return (
    <div className='flex flex-col items-center pt-10  pb-10 mb-10'>
        <MainHeaders  Headers={"Our Vendors"}/>
        <div className='flex flex-wrap w-[48rem]  gap-10 pt-10'>
            <div className='w-[10rem]'>
                <img src={bill}></img>
            </div>
            <div className='w-[10rem]'>
                <img src={bill}></img>
            </div>
            <div className='w-[10rem]'>
                <img src={bill}></img>
            </div>
            <div className='w-[10rem]'>
                <img src={bill}></img>
            </div>
            <div className='w-[10rem]'>
                <img src={bill}></img>
            </div>
            <div className='w-[10rem]'>
                <img src={bill}></img>
            </div>
        </div>
    </div>
  )
}
