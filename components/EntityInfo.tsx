import { useState } from "react"
import CategorySection from "./CategorySection"

const Button = (props:any) => {
	const { text, onClick } = props
	return <span className="cursor-pointer hover:underline" onClick={onClick}>{text}</span>
}

export function EntityInfo(props: any) {
	const { entity, goTo } = props
	const [categoryStates, setCategoryStates] = useState<Record<string, boolean>>({})

	const toggleOpen = (e: Event, category: string) => {
		e.preventDefault()
		e.stopPropagation()
		setCategoryStates((prev: any) => {
			return {
				...prev,
				[category]: !prev[category]
			}
		})
	}

	const areAllOpen = Object.keys(entity.properties).every(category => !!categoryStates[category])

	const collapseAll = () => {
		setCategoryStates((prev:any) => {
			const newState:any = {}
			Object.keys(prev).forEach(category => {
				newState[category] = false
			})
			return newState
		})
	}

	const expandAll = () => {
		setCategoryStates((prev:any) => {
			const newState:any = {}
			Object.keys(entity.properties).forEach(category => {
				newState[category] = true
			})
			return newState
		})
	}

	const goToParent:any = (e:Event) => {
		e.preventDefault()
		e.stopPropagation()
		goTo(entity.parent)
	}

	return (
		<div>
			<h2 className="text-3xl font-bold">{entity.name}</h2>
			<p className="text-gray-400 pb-6">Entity ID: {entity.entityId}</p>

			<p className="text-gray-400">
				<span className="text-white font-bold">Parent ID: </span> 
				<Button onClick={goToParent} text={entity.parent} />
			</p>
			<p className="text-gray-400 pb-6 w-full">
				<span className="text-white font-bold">Child IDs: </span> 
				{entity.children.map((child:string, i:number) => {
					return (
						<span key={child}>
							<Button onClick={(_:any)=>goTo(child)} text={child} />
							{ i<entity.children.length-1 ? ", " : "" }
						</span>
					)
				})}
			</p>

			<div className="flex flex-row justify-between items-center border-b">
				<h3 className="text-2xl font-light pb-0.5">Properties</h3>
				{areAllOpen ? (
					<p className="text-sm hover:underline cursor-pointer py-1" onClick={collapseAll}>Collapse All</p>
				) : (
					<p className="text-sm hover:underline cursor-pointer py-1" onClick={expandAll}>Expand All</p>
				)}
			</div>

			{Object.keys(entity.properties).map(category => {
				const toggle = (e:Event) => toggleOpen(e, category)
				return (
					<CategorySection 
						key={category} 
						open={categoryStates[category]} 
						toggleOpen={toggle} 
						category={category} 
						properties={entity.properties[category]} 
					/>
				)
			})}
		</div>
	)
}