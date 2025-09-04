#include <stdio.h>
#include <windows.h>
#include <unistd.h>
#include <string.h>


int install(char *program) {
    char buffer[255];
    sprintf(buffer, "npm install %s\n", program);
    if(system(buffer) == 0) return 1;
    else return 0;
}

int printInt(char *msg, char *program, int ret) {
    char buffer[255];
    sprintf(buffer, "%s %s\n", msg, program);
    printf("%s", buffer);
    return ret;
}

int messageInt(char *msg, int ret) {
    printf("%s", msg);
    return ret;
}

int readFile() {
    FILE *fp;
    char line[256];

    fp = fopen("requirements.txt", "r");

    if(fp == NULL) {
       return messageInt("There is an error reading the file.\n", 0);
    }  

    while(fgets(line, 256, fp)) {
        line[strcspn(line, "\n")] = '\0';
        printf("Installing %s", line);
        if(!install(line)) return printInt("Failed on installing ", line, 0);
    }   

    fclose(fp);

    return 1;
}

int start(char *method) {
    int i;
    if(strcmp(method, "/modules") == 0) {
        if(chdir("attendance") == 0) {
            if(readFile()) return messageInt("Installed successfully\n", 1);
            else return messageInt("Installation failed\n", 0);
        } return messageInt("Failed to change directory to attendance", 0);
    } else if(strcmp(method, "/node") == 0) {
        if(chdir("Node") == 0) {
            if(system("node-v22.17.0-x64.msi") == 0) {
                printf("Restart your VS Code and run \"install /modules\" on terminal\n");
                printf("Press enter to continue.\n");
                getchar();
                return 1;
            } else return messageInt("Failed to install node", 0);
        } else return messageInt("Failed to change directory to node", 0);
    } else return printErr();
}   

int printErr() {
    printf("Syntax:\n");
    printf("\tinstall [option]\n");
    printf("Options:\n");
    printf("\t- /modules - Install node_modules and dependencies\n");
    printf("\t- /node - Install Node.js\n");
    printf("Usage:\n");
    printf("\t- install /modules\n");
    printf("\t- install /node\n");
    return 0;
}

int main(int argc, char *argv[]) {
    if(argc > 1) {
        if(start(argv[1])) return 0;
        return 1;
    } else return printErr()+1;
}