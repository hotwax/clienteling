# Clienteling component depends on

| Component Name    | Release            |
|:-----------------:|:------------------:|
| clienteling-api   |    v1.3.5         |

# Build Notes

### Clone the repository (code)

- Open a Terminal window
- Clone Clienteling

Directly with Submodules  
Git 2.13  
git clone  -b develop --recurse-submodules https://git.hotwax.co/plugins/mobile-sdk/ionic/Clienteling.git  

Git Pre 2.13  
git clone  -b develop --recursive https://git.hotwax.co/plugins/mobile-sdk/ionic/Clienteling.git  

OR

git clone -b develop
https://git.hotwax.co/plugins/mobile-sdk/ionic/Clienteling.git

Go to Clienteling directory
    `cd Clienteling`
Init submodule
    `git submodule update --init --recursive`  


- Run following command to download dependencies 
    `npm i`

### Start App

- To add the platform: `ionic cordova platform add <android / ios>`
- To test the app on device: `ionic cordova run <android / ios>`
- To test the app on emulator: `ionic cordova emulate <android / ios>`
- To test the app in browser: `ionic serve`

### ios test flight
We are maintaining following 3 builds for ios app

- Clienteling Dev - App pointing to [Dev](https://dev-dc.hotwax.io) instance, bundle id - `co.hotwax.clienteling-dev`
- Clienteling QA - App pointing to [QA](https://qa-dc.hotwax.io) instance, bundle id - `co.hotwax.clienteling-qa`
- Clienteling - App pointing to [Prod](https://demo-dc.hotwax.io) instance, bundle id - `co.hotwax.clienteling`

#### Upload instance specific build

- While adding new configuration, make sure to add them in all of three environments file otherwise it will be missing while building the app for prod or qa instance.
- Improve the environment variables as per the instance before building the app.
- Version must be updated before building the app.
- For dev build, improve the environment variables in environment.ts file and for prod build, improve the environment variables in environment.prod.ts file.
- Run the command `gulp config --channelTag=<dev/prod/qa>`
- After running this command we will have updated environment.ts file and config.xml file as per the updated variables.
- Next we can build the app using `ionic cordova build <android/ios>`
- Upload app on test flight, mention the app release version and what to test under Test Details.

#### Generating artefact documentation

Following command generates the documentation:  
`npm run compodoc`  
Documentation is available in the documentation folder and can be viewed by opening the index.html.  

### Firebase hosting deployment for browser platform
- Setup firebase hosting at mentioned [here](https://firebase.google.com/docs/hosting)
- Goto your project directly on terminal
- Initialilze firebae
    `firebase init`
- Select hosting from options
- Select Use existing project 
- Select prject from list
- It will ask some question, plesae go with default option
- Configure hosting in case of [multiple site deployed](https://firebase.google.com/docs/hosting/multisites#define_hosting_config) for same project
- Add target to with respect to site 
    `firebase target:apply hosting TARGET_NAME RESOURCE_NAME`
- Update your firebase.json file for target
- firebase deploy --only hosting:TARGET_NAME
- [Deploying to multiple environments](https://firebase.googleblog.com/2016/07/deploy-to-multiple-environments-with.html)
    `$ firebase use default # sets environment to the default alias`
    `$ firebase use production # sets environment to the production alias`
    OR
    `firebase deploy -P production # deploy to production alias`
- Deploy app
    `ionic build [--prod]`
    `firebase use production` (In case of production)
    `firebase deploy --only hosting:clienteling `

### Shopify app configuration and installation
- Add API Key, Redirect URI and Scopes to environment.
- For development store, navigate to /shopify page and input shopify store URL
- For demo store, Generate custom link and install 


### UI/UX Source
- Figma file : [
https://www.figma.com/community/file/885791511781717756/Ionic-5-Material-UI-Kit-(Community)](
https://www.figma.com/community/file/885791511781717756/Ionic-5-Material-UI-Kit-(Community))


## Build Issues
### If you face any error while running the app on a local machine, please refer [this](https://stackoverflow.com/questions/58973192/uncaught-typeerror-object-is-not-a-function-when-using-angular-google-maps).
- Run following commands to fix the issue
    `npm uninstall @agm/core`
    `npm i @agm/core@1.0.0-beta.7 --save`

### UIWebView Issue while uploading App on testflight:
- Remove the ios platform using command 
    `ionic cordova platform rm ios`
- Check plugin cordova-plugin-ionic-webview in package.json file, If not included then add plugin using command
    `ionic cordova plugin add cordova-plugin-ionic-webview`
- Add the ios platform with version 5.1.0 using command
    `ionic cordova platform add ios@~5.1.0`
- Check following preference in config file . if not present then add it.
    `<preference name="WKWebViewOnly" value="true" />`
- Run following command
    `npm i`
- Build application for IOS 
    `ionic cordova build ios`

### moment-timezone and Truncate
- If you are getting error `Property 'tz' does not exist on type 'typeof moment'`
    `npm i moment-timezone@0.5.28`
- If you are getting error `A rest parameter must be of an array type.`
    `npm i @yellowspot/ng-truncate@1.5.0`

### Submodule - Theme 
- If you are getting `Sass Error` like `Undefined variable` 
   `git submodule update --recursive --remote`

### Contribution Guideline

`Please do all changes and in your local systems branch and make a pull request to remote branch not in master branch of remote repo`


