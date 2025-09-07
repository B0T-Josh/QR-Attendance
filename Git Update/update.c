#include <stdio.h>
#include <windows.h>
#include <stdbool.h>
#include <string.h>

bool addChange(char *file);
bool commit(char *comment);
bool fetch(char *branch);
bool merge(char *branch);
bool upload(char *branch);
void printError();
bool updateAll();

int main(int argc, char *argv[]) {
    if(argc > 1) {
        for(int i = 1; i < argc; i++) {
            if(strncmp(argv[i], "-a", 2) == 0) {
                if(addChange(argv[i+1])) {
                    printf("Change added\n");
                } else {
                    printf("Failed to add changes\n"); 
                    return 1;
                }
            } else if(strncmp(argv[i], "-c", 2) == 0) {
                if(commit(argv[i+1])) {
                    printf("Commit changes successful\n");
                } else {
                    printf("Failed to commit changes\n"); 
                    return 1;
                }
            } else if(strncmp(argv[i], "-p", 2) == 0) {
                if(upload(argv[i+1])) {
                    printf("Push successful\n");
                } else {
                    printf("Failed to push to origin %s\n", argv[i+1]); 
                    return 1;
                }
            } else if(strncmp(argv[i], "-f", 2) == 0) {
                if(fetch(argv[i+1])) {
                    printf("Fetch successful\n");
                } else {
                    printf("Failed to fetch origin \n"); 
                    return 1;
                }
            } else if(strncmp(argv[i], "-m", 2) == 0) {
                if(merge(argv[i+1])) {
                    printf("Merge successful\n");
                } else {
                    printf("Failed to merge %s \n", argv[i+1]); 
                    return 1;
                }
            } else if(strncmp(argv[i], "-A", 2) == 0) {
                if(updateAll()) {
                    printf("Update all successful\n");
                } else {
                    printf("Failed to update all\n"); 
                    return 1;
                }
            }
        }
    } else {
        printError();
        return 1;
    }
}

bool updateAll() {
    if(fetch("main")) {
        if(merge("main")) {
            if(addChange(".")) {
                if(commit("Update")) {
                    if(upload("main")) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

void printError() {
    printf("Syntax:\nupdate <command> <option>\n"); 
    printf("command - ['-a', '-c', '-p', '-f', '-m', '-A']\n");
    printf("option - if -a is chosen, type the name of the file that you wanted to add changes into.\n");
    printf("       - if -c is chosen, type the message for the commit.\n");
    printf("       - if -p is chosen, you need to type the branch to where you will push your work. This pushes your updates to the remote branch\n");
    printf("       - if -f is chosen, you don't need to type anything after it. This fetches updates from the remote branch\n");
    printf("       - if -m is chosen, you need to type the branch that you want to merge with. This merges your local repository with the updates from the remote branch\n");
    printf("       - if -A is chosen, you don't need to type anything after it. This will fetch, merge, add changes, commit and push with one command\n");
    printf("usage:\nupdate -a <filename> / . (to add all changes)\n");
    printf("update -a <filename> / . (to add all changes)\n");
    printf("update -c <comment/message>\n");
    printf("update -p <branch>\n");
    printf("update -f <branch>\n");
    printf("update -m <branch>\n");
    printf("proper usage:\n");
    printf("update -f <branch> -m <branch>\n");
    printf("update -a <filename/.> -c <comment/message> -p <branch>\n");
    printf("update -A\n");
    printf("\nImportant note:\nMake sure to fetch and merge before you work on any file.\n");
    printf("Push everytime you finish a file\n");
}

bool fetch(char *branch) {
    char command[256];
    sprintf(command, "git fetch origin %s", branch);
    if(system(command) == 0) {
        return true;
    }
    return false;
}

bool merge(char *branch) {
    char command[256];
    sprintf(command, "git merge %s", branch);
    if(system(command) == 0) {
        return true;
    }
    return false;
}

bool addChange(char *file) {
    char command[256];
    snprintf(command, 256, "git add \"%s\"", file);
    if(system(command) == 0) {
        return true;
    } else return false;
}

bool upload(char *branch) {
    char command[256];
    sprintf(command, "git push -u origin %s", branch);
    if(system(command) == 0) {
        return true;
    } else return false;
}

bool commit(char *comment) {
    char command[256];
    snprintf(command, 256, "git commit -m \"%s\"", comment);
    if(system(command) == 0) {
        return true;
    } else return false;
}