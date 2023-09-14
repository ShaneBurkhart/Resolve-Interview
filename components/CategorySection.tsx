import { useState } from 'react'

export default function CategorySection(props: any) {
	const { open, toggleOpen, category, properties } = props

	return (
		<div className="border-b border-b-gray-600">
			<div className="flex justify-between items-center px-3 border-b border-b-gray-600 cursor-pointer hover:bg-gray-900" onClick={toggleOpen}>
				<h4 className="p-2 px-0 cursor-pointer font-xl">
					<span className="text-gray-500">Category:</span>
					&nbsp;
					<span className="font-bold">{category}</span>
					&nbsp;
					<span className="text-gray-500">({Object.keys(properties).length} attributes)</span>
				</h4>
				{open ? (
					<span className="font-bold text-2xl">-</span>
				) : (
					<span className="font-bold text-xl">+</span>
				)}
			</div>

			{open && (
				<div className='pt-2 pb-1 bg-gray-800'>
					{Object.keys(properties).map((prop:any) => {
						const value = properties[prop]

						return (
							<div key={prop} className="pb-1 px-6 flex flex-row">
								<div className="w-full">{prop}</div>
								<div className="w-full text-gray-400">{value}</div>
							</div>
						)
					})}
				</div>
			)}
		</div>
	)
}