# Contact Book
------
keep personal contact information after user authentication using JWT token.

## Usage

Install dependencies

```bash
npm install  
npm client-install # Client side install
```

### Mongo connection setup

Edit /config/default.json file to include the correct MongoDB URI
```json
{
  "mongoURI": "mongodb+srv://<username>:<password>@<mongoatlascluster>",
  "jwtSecret": "your-secrect-string",
  "jwtLife": 3600
}
```

### Run Server

```bash
npm run dev     # Express & React :3000 & :5000
npm run server  # Express API Only :5000
npm run client  # React Client Only :3000
```

## API end point
/api/auth GET # return a token if logged in already  
/api/auth POST # login a user, if success, return a token  
/api/user POST # register a user   
/api/contacts GET # all contacts. valid token required  
/api/contacts POST # new contact. valid token required  
/api/contacts/:id PUT # update contact. valid token required  
/api/contacts/:id DELETE # delete contact. valid token required  