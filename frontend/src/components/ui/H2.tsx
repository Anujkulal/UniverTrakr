import React from 'react'

// type H2Props  = {
//     title: string;
// }

type H2Props = React.HTMLAttributes<HTMLHeadingElement>
// Extend HTML attributes to allow for more flexibility

const H2 = ({className='', children, ...props}: H2Props ) => {
  return (
    <h2 className={`text-2xl font-bold text-center mb-6 ${className}`} {...props}>
        {children}
    </h2>
  )
}

export default H2