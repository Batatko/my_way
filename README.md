# MyWay

MyWay is a todo app integrated with user authenticaton.
It's written in TypeScript language with React framework and Next.js, using Firebase as a cloud hosted-database and deployment server.

Installation:
1. Clone project with git.
3. Create Firebase account.
3. Create new project on Firebase along with its services (Auth, Firestore Database, Realtime Database, Storage).
4. Create Web app in project settings, copy/paste firebase config in my_way project "firebaseClientConfig.tsx" and export as default.

```javascript
type data = {
    [key:string]: string;
}

const config: data =  { 
    apiKey: ...,
    authDomain: ...,
    projectId: ...,
    storageBucket: ...,
    messagingSenderId: ...,
    appId: ...
}

export default config;

}
```

5. Install npm package dependencies.
6. Host app with:
```bash
npm run dev
```

Sign up with dummy email and password.  
Login into account.  

Available features:
* Add tasks
* Delete tasks
* View added tasks chronologically
* View added tasks via Calendar interface
* Delete account

Enjoy.
