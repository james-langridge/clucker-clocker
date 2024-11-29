<p align="center">
<br />
<img src="public/logo.png" width="100" height="auto">
</p>

## Clock in, cluck out.

A minimal time tracker for when you have to track time but don't want all the
bells and whistles. Built with Next.js 14 (App router), React Query, Auth.js,
Prisma, PostgreSQL, Tailwind CSS, shadcn/ui.

## To Do

- [ ] Add tests
- [ ] Add Bruno API collections

## Roadmap

- [ ] Functionality for non-registered users
- [ ] Offline functionality
- [ ] Import project names from Clockify
- [ ] Sync time entries to Clockify
  - [ ] Manually?
  - [ ] Cron job daily?
  - [ ] On save?

## Run it locally

### Prerequisites

- Create a Google API client ID and secret in the
  [Google Developers Console](https://developers.google.com/identity/oauth2/web/guides/get-google-api-clientid).
- You will need a PostgreSQL database.
  - With Railway go to https://railway.app/new and click `Deploy PostgreSQL`,
    then click on the Variables tab and grab the `DATABASE_URL`.
  - Or, assuming you have
    [PostgreSQL installed](https://www.postgresql.org/download/), you could
    instead create a local database for development with this command:
    - ```sh
      createdb mydatabase
      ```
    - Then you can connect to it:
      `DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@localhost:5432/mydatabase`
  - Or, assuming you have
    [Docker installed](https://docs.docker.com/get-docker/), you could
    [run Postgres in a Docker container](https://hub.docker.com/_/postgres):
    - ```sh
      docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_DB=mydatabase -p 5432:5432 -d postgres
      ```
    - Then you can connect to it:
      `DATABASE_URL=postgresql://postgres:mysecretpassword@localhost:5432/mydatabase`

### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/james-langridge/clucker-clocker.git
   ```

2. Install NPM packages

   ```sh
   npm install
   ```

3. Copy `.env.local.example` to `.env.local` and add your API key.
   ```sh
   cp .env.local.example .env.local
   ```
4. Once you have a Postgres DB running somewhere, and the `DATABASE_URL` env var
   set, run the
   [Prisma Migrate command](https://www.prisma.io/docs/reference/api-reference/command-reference#migrate-dev):

   ```sh
   npx prisma migrate dev
   ```

5. Start the development server:
   ```sh
   npm run dev
   ```

## Deploy your own

If you cloned the repo, deploying to Vercel is simple: https://vercel.com/new

You can also clone and deploy this project on Vercel using the button below.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjames-langridge%2Fclucker-clocker&env=DATABASE_URL,AUTH_SECRET,AUTH_GOOGLE_SECRET,AUTH_GOOGLE_ID,NEXTAUTH_URL)

See the [Next.js deployment documentation](https://nextjs.org/docs/deployment)
for more details.

## License

Code distributed under the
[MIT License](https://github.com/james-langridge/clucker-clocker/blob/main/LICENSE).
