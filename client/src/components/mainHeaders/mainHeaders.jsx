import React from 'react'

export default function MainHeaders(props) {
  return (
    <div className="w-full ">
          <div className="flex items-center justify-center gap-8">
          <div className="flex-1 border-t border-violet-950 border-t-1"></div>
            <h1 className="text-violet-950 text-3xl font-bold">
              {props.Headers}
            </h1>
            <div className="flex-1 border-t border-violet-950  border-t-1"></div>
          </div>
        </div>
  )
}
