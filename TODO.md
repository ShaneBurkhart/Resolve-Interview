- [x] create the dockerfile, next.js, tailwind
- [x] download sqlite file and successfully create a client
- [] create the api endpoint that takes entity_id
	- [] create a check to download the database file if it doesn't exist
	- [] create a query to get entity 
	- [] paginate query if needed
	- [] figure out the types that are possible for val
- [] add param for pagination
- [] create the frontend
- [] use css perspective to create a 3d mock view


- [] go through the requirements thoroughly and add missing todos
- [] consider what needs tested
- [] create a punch list for the final demo



when we submit a request, we want to check if the db exists
- if it doesn't, then we return a response saying we are downloading
	- poll for the status of the database, then resubmit the request
- if it does, then we return the entity values
