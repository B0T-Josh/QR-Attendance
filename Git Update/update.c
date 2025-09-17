#include <stdio.h>
#include <windows.h>
#include <stdbool.h>
#include <string.h>

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
    sprintf(command, "git merge origin/%s", branch);
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

bool updateAll(char *branch) {
    if(fetch(branch)) {
        if(merge(branch)) {
            if(addChange(".")) {
                if(commit("Update")) {
                    if(upload(branch)) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

void printError() {
    printf("Syntax:\n\tupdate [command] [option]\n"); 
    printf("Command\n\t['-a', '-c', '-p', '-f', '-m', '-A']\n");
    printf("Option\n\t- -a - type the name of the file that you wanted to add changes into.\n\t");
    printf("- -c - type the message for the commit.\n\t");
    printf("- -p - you need to type the branch to where you will push your work. This pushes your updates to the remote branch.\n\t");
    printf("- -f - you need to type the branch that you want to fetch. This fetches updates from the remote branch.\n\t");
    printf("- -m - you need to type the branch that you want to merge with. This merges your local repository with the updates from the remote branch.\n\t");
    printf("- -A - you don't need to type anything after it. This will fetch, merge, add changes, commit and push with one command.\n\t");
    printf("- -P - you need to type the branch that you want to fetch and merge. This fetches updates and merges it from the remote branch to your local repository.\n");
    printf("Usage:\n\tupdate -a <filename> / . (to add all changes)\n\t");
    printf("- update -a [filename] / . (to add all changes)\n\t");
    printf("- update -c [comment/message]\n\t");
    printf("- update -p [branch]\n\t");
    printf("- update -f [branch]\n\t");
    printf("- update -m [branch]\n\t");
    printf("- update -A [branch]\n\t");
    printf("- update -P [branch]\n");
    printf("Proper usage:\n\t");
    printf("- update -f [branch] -m [branch]\n\t");
    printf("- update -a [filename/.] -c [comment/message] -p [branch]\n\t");
    printf("- update -A [branch]\n\t");
    printf("- update -P [branch]\n");
    printf("\nImportant note:\nMake sure to fetch and merge before you work on any file.\n");
    printf("Push everytime you finish a file\n");
}

int start(int argc, char *argv[]) {
    if(argc > 1) {
        for(int i = 1; i < argc; i++) {
            if(strncmp(argv[i], "-a", 2) == 0) {
                if(argv[i+1] == NULL) return 0;
                if(addChange(argv[i+1])) {
                    printf("Change added\n");
                } else {
                    printf("Failed to add changes\n"); 
                    return 0;
                }
            } else if(strncmp(argv[i], "-c", 2) == 0) {
                if(argv[i+1] == NULL) return 0;
                if(commit(argv[i+1])) {
                    printf("Commit changes successful\n");
                } else {
                    printf("Failed to commit changes\n"); 
                    return 0;
                }
            } else if(strncmp(argv[i], "-p", 2) == 0) {
                if(argv[i+1] == NULL) return 0;
                if(upload(argv[i+1])) {
                    printf("Push successful\n");
                } else {
                    printf("Failed to push to origin %s\n", argv[i+1]); 
                    return 0;
                }
            } else if(strncmp(argv[i], "-f", 2) == 0) {
                if(argv[i+1] == NULL) return 0;
                if(fetch(argv[i+1])) {
                    printf("Fetch successful\n");
                } else {
                    printf("Failed to fetch origin \n"); 
                    return 0;
                }
            } else if(strncmp(argv[i], "-m", 2) == 0) {
                if(argv[i+1] == NULL) return 0;
                if(merge(argv[i+1])) {
                    printf("Merge successful\n");
                } else {
                    printf("Failed to merge %s \n", argv[i+1]); 
                    return 0;
                }
            } else if(strncmp(argv[i], "-A", 2) == 0) {
                if(updateAll(argv[i+1])) {
                    printf("Update all successful\n");
                } else {
                    printf("Failed to update all\n"); 
                    return 0;
                }
            } else if(strncmp(argv[i], "-P", 2) == 0) {
                if(argv[i+1] == NULL) return 0;
                if(fetch(argv[i+1])) {
                    printf("Fetch successful\n");
                    if(merge(argv[i+1])) {
                        printf("Merge successful\n");
                    }
                } else {
                    printf("Failed to update all\n"); 
                    return 0;
                }
            } 
        }
        return 1;
    } else {
        printError();
        return 0;
    }
}

int main(int argc, char *argv[]) {
    if(start(argc, argv)) {
        return 0;
    } else {
        printError();
        return 1;
    }
}

