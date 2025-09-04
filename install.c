#include <stdio.h>
#include <windows.h>
#include <unistd.h>
#include <string.h>

char *programs[] = {"html5-qrcode", "qrcode.react"};

int install(int index) {
    char buffer[255];
    sprintf(buffer, "npm install %s\n", programs[index]);
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

int start(char *method) {
    int i;
    int length = sizeof(programs) / sizeof(programs[0]);
    if(strcmp(method, "/modules")) {
        if(chdir("attendance") == 0) {
            for(i = 0; i < length; i++) {
                printf("Installing %s", programs[i]);
                usleep(1000);
                if(!install(i)) return printInt("Installing Error: ", programs[i], 0);
            }
            if(system("npm run dev") == 0) return messageInt("Installation complete\n", 1);
        } return messageInt("Failed to change directory to attendance", 0);
    } else if(strcmp(method, "/node")) {
        if(chdir("Node") == 0) {
            if(system("node-v22.17.0-x64.msi") == 0) {
                if(chdir("../attendance") == 0) {
                    for(i = 0; i < length; i++) {
                        printf("Installing %s", programs[i]);
                        usleep(1000);
                        if(!install(i)) return printInt("Installing Error: ", programs[i], 0);
                    }
                    if(system("npm run dev") == 0) return messageInt("Installation complete\n", 1);
                } return messageInt("Failed to change directory to attendance", 0);
            } else return messageInt("Failed to install node", 0);
        } else return messageInt("Failed to change directory to node", 0);
    } else return printErr();
}   

int printErr() {
    printf("Syntax:\n");
    printf("\tinstall [option]\n");
    printf("Options:\n");
    printf("\t- /modules - Install node_modules and dependencies\n");
    printf("\t- /node - Install Node.js and the node _modules included it's dependencies\n");
    printf("Usage:\n");
    printf("\t- install /modules\n");
    printf("\t- install /node\n");
    return 0;
}

int main(int argc, char *argv[]) {
    if(argc > 1) {
        if(start(argv[1])) return messageInt("Installation successful", 0);;
        return messageInt("Installation failed", 1);
    } else return printErr()+1;
}