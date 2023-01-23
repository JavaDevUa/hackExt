# hackExt

## How to use:
- It's tested on chromium
- Download files, it all as is, is a chrome extension itself
- Go to: chrome://extensions/
- Install chrome extension (by choosing manifest.json or the whole folder, I don't remember)
- Copy id of extension (it appears on the link above) paste it to /home/pros/.config/chromium/NativeMessagingHosts/ping.json, at 'allowed_origin' field.
- create directory: /home/pros/.1_Programming/JavaProjectTemplate
- run the following command at above path: 
- `gradle init --type java-application --test-framework junit-jupiter --dsl kotlin --project-name demo --package head --incubating`
- How does it work:
- Go to hackmd, open some note (there is Example folder, which contains what copy of hackmd note text example; may copy this)

- it automatically parses the page, searches for patterns like 'Snippet 1', parses it, gets all code blocks. When you click a button an extension button, it will suggest a drop down list, which snippet to download. Choose it. Then press button 'Click me'. Then extension will download files to the specified path. And ideally, example should be good enough to run with `./gradlew run` at main directory.

