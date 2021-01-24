# TypeScript Next.js **(and greenlock-express)** example

This is a really simple project that shows the usage of Next.js with TypeScript. **(template with greenlock-express custom server added)**

When you can not use Vercel or just want to control your own server. Here's how to add greenlock-express to your project.

I used the starter "create-next-app -e with-typescript nextjs-greenlock", then added the server.js file.

Check `server.js` and the package.json scripts for all the details.

You will still need to run `npx greenlock add --subject yourdomain.com --altnames yourdomain.com,www.yourdomain.com`, check the greenlock-express documentation

