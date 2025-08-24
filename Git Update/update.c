#include <stdio.h>
#include <windows.h>
#include <unistd.h>
#include <stdbool.h>
#include <string.h>

bool addChange(char *file);
bool commit(char *comment);
bool pullOrigin();
bool merge();
bool upload();
void printError();
bool updateAll();

int main(int argc, char *argv[]) {
    if(argc > 1) {
        if(argc == 2) {
            if(strncmp(argv[1], "-f", 2) == 0) {
                if(pullOrigin()) {
                    printf("Fetch successful\n"); 
                } else {
                    printf("Failed to fetch");
                    return 1;
                }
            } else if(strncmp(argv[1], "-m", 2) == 0) {
                if(merge()) {
                    printf("Merge successful\n");
                } else {
                    printf("Failed to merge"); 
                    return 1;
                }
            } else if(strncmp(argv[1], "-p", 2) == 0) {
                if(upload()) {
                    printf("Published to remote repository\n");
                } else {
                    printf("Failed to push"); 
                    return 1;
                }
            } else if(strncmp(argv[1], "-A", 2) == 0) {
                if(updateAll()) {
                    printf("Published to remote repository\n");
                } else {
                    printf("Failed to push"); 
                    return 1;
                }
            } else {
                printError();
                return 1;
            }
        } else if(argc == 3) {
            if(strncmp(argv[1], "-f", 2) == 0) {
                if(pullOrigin()) {
                    printf("Fetch successful\n"); 
                    if(merge()) {
                        printf("Merge successful\n");
                    } else {
                        printf("Failed to merge"); 
                        return 1;
                    }
                } else {
                    printf("Failed to fetch");
                    return 1;
                }
            } else if(strncmp(argv[1], "-a", 2) == 0) {
                if(addChange(argv[2])) {
                    printf("Change added\n");
                } else {
                    printf("Failed to add changes\n"); 
                    return 1;
                }
            } else if(strncmp(argv[1], "-c", 2) == 0) {
                if(commit(argv[2])) {
                    printf("Commit changes successful\n");
                } else {
                    printf("Failed to commit changes\n"); 
                    return 1;
                }
            } else {
                printError();
                return 1;
            }
        } else {
            for(int i = 1; i < argc; i++) {
                if(i % 2 == 1) {
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
                        if(upload()) {
                            printf("Push successful\n");
                        } else {
                            printf("Failed to push to origin main\n"); 
                            return 1;
                        }
                    } else {
                        printError();
                        return 1;
                    }
                }
            }
        }
    } else {
        printError();
        return 1;
    }
}

bool updateAll() {
    if(pullOrigin()) {
        if(merge()) {
            if(addChange(".")) {
                if(commit("Update")) {
                    if(upload()) {
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
    printf("       - if -p is chosen, you don't need to type anything after it. This pushes your updates to the remote branch\n");
    printf("       - if -f is chosen, you don't need to type anything after it. This fetches updates from the remote branch\n");
    printf("       - if -m is chosen, you don't need to type anything after it. This merges your local repository with the updates from the remote branch\n");
    printf("       - if -A is chosen, you don't need to type anything after it. This will fetch, merge, add changes, commit and push with one command\n");
    printf("usage:\nupdate -a <filename> / . (to add all changes)\n");
    printf("update -a <filename> / . (to add all changes)\n");
    printf("update -c <comment/message>\n");
    printf("update -p\n");
    printf("update -f\n");
    printf("update -m\n");
    printf("proper usage:\n");
    printf("update -f -m\n");
    printf("update -a <filename/.> -c <comment/message> -p\n");
    printf("update -A\n");
    printf("\nImportant note:\nMake sure to fetch and merge before you work on any file.\n");
    printf("Push everytime you finish a file\n");
}

bool pullOrigin() {
    if(system("git fetch origin") == 0) {
        return true;
    }
    return false;
}

bool merge() {
    if(system("git merge origin/main") == 0) {
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

bool upload() {
    if(system("git push origin main") == 0) {
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