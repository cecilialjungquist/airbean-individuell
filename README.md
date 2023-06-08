# Airbean - Individuell examination

I den individuella delen av Airbean så ska du skapa ett admin-gränssnitt för att hantera menyn. Det ska gå och lägga till, ta bort och modifiera produkter samt lägga till kampanjerbjudanden.
Dessa endpoints ska vara skyddade med en jwt token som valideras vid anrop.

## Fördefinierade konton att testa i req.body

Admin
`{
	"username": "gunther",
	"password": "iHateThisJob"
}`

User
`{
	"username": "rachel",
	"password": "imAShoe"
}`

## API Documentation

### Hämta menyn
` GET /api/beans `

### Lägg order
` POST /api/beans/order `

Exempel på request body:
`{
	"userID": "S436xNtMYygWkBPM",
	"order": [
		{
			"id": "coffee-m2h37k2mnh"
		},
		{
			"id": "coffee-220dodpzmg"
		}
	]
}`

### Skapa konto
` POST /api/user/signup `

Exempel på request body:
`{
	"username": "ross",
	"password": "rachel4ever"
}`

### Logga in
` POST /api/user/login `

Exempel på request body:
`{
	"username": "rachel",
	"password": "imAShoe"
}`

### Hämta orderhistorik
` GET /api/user/history `

Exempel på request body:
`{
	"userID": "S436xNtMYygWkBPM"
}`

### Hämta orderstatus
` GET /api/beans/order/status `

Exempel på request body:
`{
	"userID": "S436xNtMYygWkBPM",
	"orderNumber": "orderNumberXXXX"
}`

### Logga in admin
` POST /api/admin/login `

Exempel på request body:
`{
	"username": "gunther",
	"password": "iHateThisJob"
	"role": "admin"
}`

### Addera produkt till menyn
` POST /api/admin/addProduct `
` HEADERS Authorization, Bearer token `

Exempel på request body:
`{
	"id": "idXXXXXXXXXX",
	"title": "New Product",
	"desc": "Lorem ipsum dolor.",
	"price": 20
}`

### Ta bort produkt från menyn
` DELETE /api/admin/deleteProduct `
` HEADERS Authorization, Bearer token `

Exempel på request body:
`{
	"id": "idXXXXXXXXXX"
}`

### Uppdatera befintlig produkt i menyn
` PUT /api/admin/updateProduct `
` HEADERS Authorization, Bearer token `

Exempel på request body:
`{
	"id": "idXXXXXXXXXX",
	"update": {
		"title": "New Title",
		"price": 34
	}
}`

### Lägg till kampanj 
` POST /api/admin/addCampaign `
` HEADERS Authorization, Bearer token `

Exempel på request body:
`{
	"products": [
		{"id": "coffee-4pdksmrkfa"},
		{"id": "coffee-4pdksmrkfa"}
	],
	"campaignPrice": 30
}`

## Uppgiftens krav på funktionalitet:
* Kunna lägga till en ny produkt i menyn. Man ska enbart kunna skicka med de egenskaper som finns på en produkt (id, title, desc, price) i bodyn. Alla egenskaper ska också finnas med. Det ska även läggas på en createdAt med datum och tid när den skapades.
* Kunna modifiera en produkt, om en produkt modifieras så ska en egenskap (modifiedAt) läggas till med datum och tid.
* Kunna ta bort en produkt. Det ska enbart gå att ta bort en produkt som finns.
Uppnås inte kraven ovan ska ett passande felmeddelande skickas tillbaka.

* Alla tre endpoints:en ska vara skyddade med att användaren som loggar in ska ha en roll som heter admin (som finns sparad i databasen) som kontrolleras via en middleware. Användaren kan ni manuellt lägga till i databasen men det ska gå och kunna logga in d.v.s. ni behöver en endpoint för att logga in men det är inget krav för skapa konto.
* Menyn är sparad i en NeDB-databas.
* Det ska finnas en endpoint för att kunna lägga till kampanjerbjudanden som ska sparas i databasen enligt följande modell:
	- Vilka produkter som ingår (ex. bryggkaffe och Gustav Adolfsbakelse, ska valideras att dessa produkter finns)
	- Kampanjpris för denna kombination (ex. 40 kr totalt)

## För Godkänt:
* Uppnår alla krav på funktionalitet.

## För Väl Godkänt:
* Använder sig av JSON web token för att returnera en token som innehåller användarens roll och som används för att sedan kontrollera access till routes enligt ovan.
* Använder sig av Bcrypt.js för att kryptera lösenord vid skapandet av konto. Här är det fördelaktigt att lägga till funktionalitet för att skapa konto.
