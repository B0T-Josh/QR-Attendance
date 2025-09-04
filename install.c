#include <stdio.h>
#include <windows.h>
#include <unistd.h>

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

int start() {
    int i;
    int length = sizeof(programs) / sizeof(programs[0]);
    if(chdir("attendance") == 0) {
        for(i = 0; i < length; i++) {
            printf("Installing %s", programs[i]);
            usleep(1000);
            if(!install(i)) return printInt("Installing Error: ", programs[i], 0);
        }
        if(system("npm run dev") == 0) return messageInt("Installation complete\n", 1);
    } return messageInt("Failed to change directory to attendance", 0);
}   

int main() {
    if(start()) return 0;
    return 1;
}