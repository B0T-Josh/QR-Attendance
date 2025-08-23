# Student Log Book

## Important Note: 

if you are new, execute install.exe first to install the start up dependencies<br>
put this inside your settings.json in your vscode settings "python.terminal.activateEnvironment": false, <br>

# GitUpdate

## Important note: Study git first

### Requirements:

* git https://github.com/git-for-windows/git/releases/download/v2.51.0.windows.1/Git-2.51.0-64-bit.exe
* Github Desktop https://central.github.com/deployments/desktop/desktop/latest/win32

### Git basic usage:

* git fetch origin //this connects your version to the online remote repository
* git merge origin/main //this merges the repository version to your local repository
* git pull //is a command that fetches and merge with the online remote repository
* git add [file_name] //this loads the changes to be prepared to be committed
* git commit -m [comment] //this saves your changes on your local repository
* git push origin main //this uploads your changes to the online remote repository

### Update usage:
<pre>
update [command] [option] 
command - ['-a', '-c', '-p', '-f', '-m', '-A']
option  - if -a is chosen, type the name of the file that you wanted to add changes into.
        - if -c is chosen, type the message for the commit.
        - if -p is chosen, you don't need to type anything after it. This pushes your updates to the remote branch
        - if -f is chosen, you don't need to type anything after it. This fetches updates from the remote branch
        - if -m is chosen, you don't need to type anything after it. This merges your local repository with the updates from the remote branch
        - if -A is chosen, you don't need to type anything after it. This will fetch, merge, add changes, commit and push with one command
usage:
* update -a [filename] / . (to add all changes)
* update -a [filename] / . (to add all changes)
* update -c [comment/message]
* update -p
* update -f
* update -m
proper usage:
* update -f -m
* update -a [filename/.] -c [comment/message] -p
* update -A

Important note:
Make sure to fetch and merge before you work on any file.
Push everytime you finish a file
</pre>

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

# Backend 

## env.bat

This is a .bat file that will run your virtual environment automatically.

## manage.c/manage.exe

This is a shortcut program to execute manage.py

### Usage:
<pre>
manage [command] 

Command:
manage -r //Start a local server
manage -M //Make changes available for migration
manage -M [app_name]//Make specific changes available for migration
manage -m //Execute migration
manage -f //Deletes all data from all tables
</pre>