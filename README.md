## Social cross post

Cross post your tweets from Twitter to Farcaster.

Duplicate `.env.sample` and rename it `.env.local`. Then fill in the env vars.

```bash
npm i
npm run dev
```

Get `FC_SECRET` and `FC_SECRET_EXPIRES` by visiting: [http://localhost:3000/api/fc-secret](http://localhost:3000/api/fc-secret)
Visit API route [http://localhost:3000/api/cast](http://localhost:3000/api/cast) to cast.
