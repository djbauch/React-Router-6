import * as React from 'react'

export async function loader({params})  {
  return getIcon(params.iconName)
}

export default function Icon() {
  const iconData = useLoaderData() as any
}