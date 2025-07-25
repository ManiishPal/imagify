import React from 'react'
import { assets } from '../assets/assets'
import { motion } from "motion/react"


const Description = () => {
  return (
    <motion.div
    initial={{opacity:0.2, y:100}} transition={{duration:1}} whileInView={{opacity:1, y:0}} viewport={{once: true}}
    className='flex flex-col items-center justify-center py-24 p-6 md:px-28'>
      <h1 className='text-3xl md:text-4xl font-semibold mb-2'>Create AI Images</h1>
      <p className='text-gray-500 mb-8'>Turn your imagination into visuals</p>

      <div className='flex flex-col items-center gap-5 md:gap-14 md:flex-row'>
        <img src={assets.sample_img_1} className='w-80 xl:w-96 rounded-lg' alt="" />
        <div>
          <h2 className='text-3xl font-medium mb-4 max-w-lg'>Introducing the AI-Powered Text to Image Generator</h2>
          <p className='text-gray-600 mb-4'>Easily bring your ideas to life with our free AI Image Generator.
          Whether you need stunnig visuals or unique imaginary, our tool transform your text Into
          eye catching visuals with just a few clicks. Imagine it, describe it, and watch it to come to life instantly.
          </p>
          <p className='text-gray-600'>
            Simply type in a text prompt, and our cutting-edge AI will generate high-quality images in seconds.
            From product visuals to character design and portrait, even concepts that don't yet exist can be visualized effortlessly.
            Powered by AI technology, the creative posibilities are limitless!
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default Description