# Database_project3

Name: Tzu-I Yu

## Language and framework usage

### Frontend :

- ReactJS

### Backend :

- Flask(Python)
- venv

### Database:

- phpMyadmin

## Changes to the schema

#### Item:

Add an attribute `isOrdered` into the table `Item`. The purpose of this modification aims to remember whether this item is ordered. If it is ordered, it would not be display at the list when a staff is adding items into an order.

#### Person:

Add an attribute `salt` into the table `Person`. The purpose of this modification aims to record the salt of the encryption of the password. With the salt, the system can apply SHA256 hashing to keep the user-password safe.

## Main queries

I split them into four sections.

### auth

#### login

1. Fetch userData to verify

```
SELECT * FROM Person WHERE userName = {userName}
```

#### register

1. Check whether user is in the database

```
SELECT userName FROM Person WHERE userName = {userName}
```

2. Insert Person data

```
INSERT INTO Person (userName, password, fname, lname, email, salt)
VALUES ({userName}, {password(hashed)}, {firstName}, {lastName}, {email}, {salt})
```

3. Insert Person-Role relationship

```
INSERT INTO Act ( userName, roleID)
VALUES({userName}, {roleID})
```

### donations

#### accept

1. Check the user's role

```
SELECT R.rDescription
FROM Person P
LEFT JOIN Act A ON P.userName = A.userName
LEFT JOIN Role R ON A.roleID = R.roleID
WHERE P.userName = {userName}
```

2. Check the client's existence

```
SELECT * FROM Person WHERE userName = {client}
```

### items

#### find

1. Fecth data by ItemID

```
SELECT
    Piece.pieceNum,
    Piece.roomNum,
    Piece.shelfNum as shelfNum,
    Piece.pNotes AS notes
FROM Piece
WHERE Piece.itemID = {itemID}
```

### orders

#### start

1. Check the role of the user

```
SELECT R.rDescription
FROM Person P
LEFT JOIN Act A ON P.userName = A.userName
LEFT JOIN Role R ON A.roleID = R.roleID
WHERE P.userName = %s
```

2. Create a new order record

```
INSERT INTO Ordered (orderDate, orderNotes, supervisor, client)
 VALUES (NOW(), {notes}, {userName}, {client})
```

#### add-item

1. Check if the item added is ordered

```
SELECT isOrdered FROM Item WHERE itemID = %s
```

2. Insert the item into the order

```
INSERT INTO ItemIn (itemID, orderID, found)
    VALUES ({itemID}, {orderID}, FALSE)
```

3. Mark the item as ordered

```
UPDATE Item SET isOrdered = TRUE WHERE itemID = {itemID}
```

#### find

1. Fetch data by orderID

```
SELECT  *
FROM ItemIn
JOIN Piece On Piece.itemID = ItemIn.itemID
WHERE ItemIn.orderID = {orderID};
```

## Difficulties

Session Storage:
At first, I tried to use Flask.session functionality to store the user and order data when needed but all failed. After searching for the explanation, it may be resulted from the dev environment. Therefore, I decided to use JWT instead. Store the data into the payload, encrypt the payload at the backend, and return the encrypted data to the frontend. After receiving the data, frontend functions would store the token at the localstorage. For each API calling, we can use the token as the header of the request to ensure the safe interactions. What's more, to be more specific, I store the user data in the token generally. However, once the user starts a new order(one of the asked additional functionality), a backend function would push the orderID inside of the data, ensuring the following stages.
