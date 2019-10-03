# Model perzistencije i podataka

## Model perzistencije

Zbog kompatibilnosti unutar MERN stack-a kao i pogodnosti koje pruža zahvaljujući svojoj asinhronoj prirodi koristi se baza podataka MongoDB. Ne-striktno struktuirana priroda podataka zahtevala je implementaciju noSQL baze podataka, a MongoDB se pozicionirala kao standard na ovom polju.

Šema baze mapirana je pomoću Mongoose biblioteke za objektno modeliranje.

**UserSchema**

```javascript
{
  about: {
		type: String,
		required: false,
		default: ""
	},
	history: [
		{
			date: {
				type: Date,
				default: Date.now
			},
			score: {
				type: Number,
				required: false,
				default: 0
			}
		}
	],
	friends: [
		{
			type: String
		}
	]
}
```

**RoomSchema**

```javascript
{
  name: {
		type: String,
		required: true,
		unique: true
	},
	users: [
		{
			username: {
				type: String,
				required: true
			},
			location: {
				latitude: {
					type: Number,
					required: true
				},
				longitude: {
					type: Number,
					required: true
				}
			}
		}
	],
	time: {
		type: Date,
		required: false,
		default: Date.now
	},
	roomType: {
		type: String,
		required: true
	},
	roomData: [
		{
			properties: {
				time: {
					type: Date,
					required: true
				},
				name: {
					type: String,
					required: true
				},
				value: {
					type: String,
					required: false
				},
				amenity: {
					type: String,
					required: false
				},
				author: {
					type: String,
					required: true
				}
			},
			geometry: {
				type: {
					type: String,
					required: true
				},
				coordinates: [Number]
			}
		}
	],
	roomMessages: [
		{
			message: {
				type: String,
				required: true
			},
			sender: {
				type: String,
				required: true
			},
			time: {
				type: Date,
				required: false,
				default: Date.now
			}
		}
	]
}
```

**FriendRequest**

```javascript
{
  sender: {
		type: String,
		required: true
	},
	receiver: {
		type: String,
		required: true
	},
	time: {
		type: Date,
		required: false,
		default: Date.now
	}
}
```

## Model podataka

Za pribavljanje perzistiranih podataka i njihovo transformisanje u odgovarajući model podataka definisan je RESTful API. Većina API ruta doprima kao reyultat model podataka na način na koji je on sačuvan u bazi, dok samo nekoliko ruta vrši transformaciju u odgovarajući oblik koji se očekuje na klijentskoj strani.

Svaki zahtev odgovara teretom u obliku:

```javascript
{
  success: Boolean,
  token | msg | data: SomeType
}
```

### Auth

-   **URI**: /api/auth

| Call          | Type | Params | Body                               | Data       |
| ------------- | ---- | ------ | ---------------------------------- | ---------- |
| /api/register | POST | /      | username: String, password: String | data: User |
| /api/login    | POST | /      | username: String, password: String | data: User |
| /api/logout   | POST | /      | /                                  | data: none |

### User

-   **URI**: /api/user

| Call                        | Type | Params           | Body | Data         |
| --------------------------- | ---- | ---------------- | ---- | ------------ |
| /api/user/:username         | GET  | username: String | /    | data: User   |
| /api/user/:username/history | GET  | username: String | /    | data: Object |

### Friend request

-   **URI**: /api/friend-request

| Call                          | Type   | Params           | Body                             | Data                  |
| ----------------------------- | ------ | ---------------- | -------------------------------- | --------------------- |
| /api/friend-request/:username | GET    | username: String | /                                | data: FriendRequest[] |
| /api/friend-request/check     | POST   | /                | sender: String, receiver: String | data: none            |
| /api/friend-request/add       | POST   | /                | sender: String, receiver: String | data: none            |
| /api/friend-request/confirm   | POST   | id: String       | /                                | data: none            |
| /api/friend-request/:id       | DELETE | id: String       | /                                | data: none            |

### Room

-   **URI**: /api/room

| Call                   | Type   | Params       | Body                                                                    | Data         |
| ---------------------- | ------ | ------------ | ----------------------------------------------------------------------- | ------------ |
| /api/room/:mode        | GET    | mode: String | /                                                                       | data: Room[] |
| /api/room/get/:id      | GET    | id: String   | /                                                                       | data: Room   |
| /api/room/:id          | PUT    | id: String   | roomData: Room                                                          | data: Room   |
| /api/room/metadata/:id | GET    | id: String   | /                                                                       | data: Object |
| /api/room/metadata/:id | PUT    | id: String   | metaobject: Object                                                      | data: Object |
| /api/room/messages/:id | PUT    | id: String   | sender: String, message: String                                         | data: none   |
| /api/room/create       | POST   | /            | name:String, roomType: String                                           | data: none   |
| /api/room/join         | POST   | /            | username: String, roomName: String, latitude: Number, longitude: Number | data: none   |
| /api/room/leave        | POST   | /            | username: String, roomName: String                                      | data: Room[] |
| /api/room/:id          | DELETE | id: String   | /                                                                       | data: none   |
