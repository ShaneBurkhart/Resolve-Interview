

export function EntityInfo({ entity }) {
	return (
		<div>
			<h1>{entity.name}</h1>
			<h3>Entity ID: {entity.entityId}</h3>
			<h3 className="pt-4">Properties</h3>
			<hr/>

			{Object.keys(entity.properties).map(category => {
				return (
					<div>
						<h4 className="pt-8">{category}</h4>
						<span>{JSON.stringify(entity.properties[category])}</span>
						<br/>
						<br/>

						{Object.keys(entity.properties[category]).map(prop => {
							return (
								<div>
									<span>{prop}: {entity.properties[category][prop]}</span>
								</div>
							)
						})}
					</div>
				)
			})}
		</div>
	)
}