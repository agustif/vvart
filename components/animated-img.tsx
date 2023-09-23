"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { AnimatedIcon } from "./animated-icon"
import { Icons } from "./icons"

interface AnimatedImageProps {
  alt?: string
  className?: string
  icon?: string
  children?: React.ReactNode
  src?: string
  title?: string
}

export function AnimatedImage({
  children,
  icon,
  ...props
}: AnimatedImageProps) {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <AnimatedIcon>
      <div className="relative">
      <AnimatedIcon x={3} y={2} duration={0.1} delay={0.4}>

        <Icons.logo className="z-100 absolute -right-2 -top-2  fill-black text-white"/>
        </AnimatedIcon>

        <motion.img
          src={props.src}
          alt={props.title}
          className="z-1 mb-6 h-96 w-full rounded-lg object-cover"
          variants={variants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </div>
    </AnimatedIcon>
  )
}