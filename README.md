# Express.js Quotes REST API

Inspired by <a href="https://github.com/AndrejWeb/laravel10-vue3-quotes" target="_blank">Laravel - Vue Quotes</a> repository, I created Express.js API for managing quotes. This is a standalone project and is not related to the mentioned repository. Here are the things you need to know:

- Bearer tokens can be created via `GET /api/tokens`
- Bearer token can be deleted via `DELETE /api/tokens/:token` where `:token` is the token value
- Quotes can be managed only with a valid token which is set in `Authorization` headers as `Bearer :token` where `:token` is the token value
- The project uses SQLite database. The database filename is `quotes.sqlite`. You should create this file in the project root directory.

### Full list of routes (I hope I didn't miss any :)
- `GET /api/tokens` - Create a new token
- `DELETE /api/tokens/:delete` - Delete token (soft delete)
- `GET /api/quotes` - Get all quotes
- `GET /api/quotes/:id` - Get the quote with the given id
- `POST /api/quotes` - Create a new quote (data is sent as JSON body)
- `PUT /api/quotes/:id` - Update the quote with the given id (data is sent as JSON body)
- `DELETE /api/quotes/:id` - Delete the quote with the given id (hard delete)
- `DELETE /api/quotes/all` - Delete all quotes

### Screenshots
<img src="https://i.imgur.com/XIpMH5f.jpg" alt="Screenshot 1" title="Screenshot 1">
<img src="https://i.imgur.com/HNSuJAy.jpg" alt="Screenshot 2" title="Screenshot 2" />
<img src="https://i.imgur.com/B8dSKGJ.jpg" alt="Screenshot 3" title="Screenshot 3" />
<img src="https://i.imgur.com/CiwUkeq.jpg" alt="Screenshot 4" title="Screenshot 4" />

### Installation & Usage
<img src="https://i.imgur.com/mbgW65A.jpg" alt="quotes.sqlite" title="quotes.sqlite" />

- Create file `quotes.sqlite` in the root directory
- Run `npm install` in terminal in the root directory
- Run `node index.js` in terminal in the root directory
- The API is now running at `localhost:3000` unless you changed the port in `index.js`
- You can use Postman or any other REST API tool of your choice to run API requests
- If you want to use other database like MySQL, PostgreSQL or MongoDB, you'd need to modify the code in `db.js` and potentially in `quoteRouter.js` and `tokenRouter.js`

### Homework
I have an assignment aka challenge for you if you want to solidify i.e. confirm your Node.js / Express.js skills

- Implement soft deletes on quote(s) deletion
- Don't show `created_at` and `updated_at` in quotes info when they're retrieved
- Implement searching of quotes by both quote text and author name, pagination and sorting ASC / DESC. For example `GET /api/quotes?search=dream&page=2&sort_by=author&sort=asc` would check if the quote text or author contain the word `dream`, you would be on page 2 of results (you can define the number of quotes per page in `quoteRouter.js`) and the sorting will be in ascending order by author name.
- Any other ideas that come to your mind
 
If there are any bugs / issues you can report them to me via <a href="https://aaweb.tech" target="_blank">AAWeb.tech</a>. Thanks.