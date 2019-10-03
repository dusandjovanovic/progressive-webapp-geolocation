# Model komunikacije

## Socket.IO

Za komunikaciju se koristi **WebSocket** komunikacioni protokol koji obezbedjuje dvosmerne komunikacione kanale izmedju dve strane pomoću jedne TCP konekcije. Za implementaciju modela koristi se **Socket.IO** JavaScript biblioteka.

Ova biblioteka omogućava krajnje jednostavnu implementaciju komunikacije koja se realizuje pomoću dve komponente, serverske (izvršava se u Node.js okruženju) i klijentske (izvršava se u pregledaču). Biblioteka nameće upotrebu WebSocket protokola, koji omogućava interakciju između pregeldača i servera sa manjim opterećenjem. Ovo je omogućeno postojanjem standardizovanog načina preko koga server šalje podatke klijentu bez prosleđivanja zahteva od strane klijenta, kao i omogućavanjem da se poruke šalju bidirekciono bez zatvaranja konekcije. Iako se može koristiti i kao omotač za WebSocket protokol sa jednostavnim i intuitivnim API-jem, Socket.IO omogućava i veliki broj dodatnih funkcionalnosti koje olakšavaju implementaciju komunikacije.

## Model podataka poruka

Prilikom uspostavljanja komunikacije izmedju serverske i klijentske strane postoje različite rute za prosledjivanje konkretnih poruka.
Možemo razlikovati dve vrste poruka koje se prosleđuju, na osnovu toga čemu te poruke služe:

-   **Chat poruke**
-   **Meta poruke**

### Model podataka chat poruka

**`initWebsocket`**

```javascript
{
  room: String
}
```

Prosleđuje se u trenutku pristupanja sobi, neophodno za upostavljanje deljenih domena komunikacije.

**`newMessage`**

```javascript
{
  room: String,
  message: Object
}
```

Prosleđuje se kada korisnik pošalje chat poruku ostalim korisnicima.

### Model podataka graph poruka

**`initWebsocket`**

```javascript
{
  room: String
}
```

Identično kao u prethodnom slučaju, samo za svrhu drugih poruka.

**`changeMetadata`**

```javascript
{
  room: String,
  metadata: Object
}
```

Prosleđuje se kada korisnik menja celokupno stanje sobe.

**`addMetadata`**

```javascript
{
  room: String,
  sender: String,
  metadata: Object
}
```

Prosleđuje se kada korisnik dodaje nove kolaborativne podatke.

**`addLocationChange`**

```javascript
{
  room: String,
  sender: String,
  location: Object
}
```

Prosleđuje se kada je korisnikova lokacije promenjena, a korinik učestvuje u kolaboraciji.

**`joinRoom`**

```javascript
{
  room: String,
  message: String,
  username: String
}
```

Prosleđuje se kada korisnik pristupa sobi.

**`leaveRoom`**

```javascript
{
  room: String,
  message: String,
  username: String
}
```

Prosleđuje se kada korisnik napušta sobu.
