# Student Log Book

For first time users, run install.exe on terminal by typing "install" on terminal. If using Powershell as terminal instead of CMD, type "./install" instead.<br>

### Syntax:
        install [option]

### Options:
        - /modules - Install node_modules and dependencies      
        - /node - Install Node.js
        
### Usage:
        - install /modules
        - install /node

# GitUpdate

## Important note: Study git first

### Requirements:

* git https://github.com/git-for-windows/git/releases/download/v2.51.0.windows.1/Git-2.51.0-64-bit.exe
* Github Desktop https://central.github.com/deployments/desktop/desktop/latest/win32

### Git basic usage:

* git fetch origin //this connects your version to the online remote repository
* git merge main //this merges the repository version to your local repository
* git pull //is a command that fetches and merge with the online remote repository
* git add [file_name] //this loads the changes to be prepared to be committed
* git commit -m [comment] //this saves your changes on your local repository
* git push origin main //this uploads your changes to the online remote repository
* git checkout [branch] //use the branch that was indicated

### Syntax
        update [command] [option]

### Command 
        ['-a', '-c', '-p', '-f', '-m', '-A', '-P', '-u']

### Option 
        - -a - type the name of the file that you wanted to add changes into.
        - -c - type the message for the commit.
        - -p - you need to type the branch to where you will push your work. This pushes your updates to the remote branch.
        - -f - you need to type the branch that you want to fetch. This fetches updates from the remote branch.
        - -m - you need to type the branch that you want to merge with. This merges your local repository with the updates from the remote branch.
        - -A - you don't need to type anything after it. This will fetch, merge, add changes, commit and push with one command.
        - -P - you need to type the branch that you want to fetch and merge. This fetches updates and merges it from the remote branch to your local repository.
        - -u - you need to type the branch that you want to use. This uses the branch version and makes you edit the content of that branch without harming or editing the other branches.

### Usage:
        - update -a [filename] / . (to add all changes)
        - update -c [comment/message]
        - update -p [branch]
        - update -f [branch]
        - update -m [branch]
        - update -A [branch]
        - update -P [branch]
        - update -u [branch]

### Proper usage:
        - update -f [branch] -m [branch]
        - update -a [filename/.] -c [comment/message] -p [branch]
        - update -A [branch]
        - update -P [branch]
        - update -u [branch]

#### Important note:
Make sure to fetch and merge before you work on any file.<br>
Push everytime you finish a file<br>

### Use usage:

This is a shortcut for "git checkout [branch]" to use your own branch.

### Syntax:
        use [branch]

### Installation guide:

1. Download the zip file to your desired path.
2. Unzip the zip file.
3. Copy the folder path.
4. Open Edit the system environment variable.
5. Click Environment Variables.
6. Click the path on the upper side, and click edit.
7. Click new and paste the file path that you have copied.
8. Click Ok and do the same on the path on the bottom side.
9. Click Ok until all apps is closed.
10. Open your CMD and type update. A guide should output when you type it.

---------------------------------------------------------------------------------------------------------------------------------- 

1. Download the zip file to your desired path.
2. Unzip the zip file.
3. Copy the update.exe and paste it on C:/Windows path.

### Running server

To run the node server use npm run dev or use the run.bat inside the attendance folder.<br>
To run a live server, you just need to navigate inside attendance and type "npm run dev" or just type "run".<br>

## Reminder!

Add the package or application that you will use on making the project in requirements.txt.<br>

# Ngrok

To use ngrok, install ngrok here https://ngrok.com/download and follow the steps to setup. 

### Description: 

Ngrok is an online hosting website. You just need to pass the hostname and port to the command and you can use it freely<br>
Example: 

### Usage 
        
        ngrok http http://localhost:3000


# Server 

This is a command to run server via online or offline. 

### Requirements 

Ngrok

### Syntax:
        server [command] [domainname:port]

### Command:
        - /online - Runs an online server
        - /offline - Runs a local server

### Usage:
        - server /online localhost:3000
        - server /offline
        - server /offline /online localhost:3000
