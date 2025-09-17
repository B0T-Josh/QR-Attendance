#include <stdio.h>
#include <windows.h>
#include <unistd.h>

void printErr() {
    printf("Syntax:\n\tserver [command] [domainname:port]\nCommand:\n\t- /online - Runs an online server\n\t- /offline - Runs a local server\nUsage:\n\t- server /online localhost:3000\n\t- server /offline\n\t- server /offline /online localhost:3000\n");
}

int printBool(char *msg, int ret) {
    printf("%s", msg);
    return ret;
} 

int console(char *program) {
    char command[256];
    sprintf(command, "powershell -Command \"Start-Process %s\"", program);
    if(system(command) == 0) {
        return 1;
    } else {
        return 0;
    }
}

int compare(char *str1, char *str2) {
    if(strcmp(str1, str2) == 0) {
        return 1;
    } else return 0;
}

int start(int length, char *args[]) {
    for(int i = 1; i < length; i++) {
        if(compare(args[i], "/online")) {
            char command[256];
            if(args[i+1] == NULL) return 0;
            sprintf(command, "ngrok.exe -ArgumentList 'http http://%s'", args[i+1]);
            if(console(command)) {
                printf("Online server is running\n");
            } else return printBool("Online server failed to initiate\n", 0);
        } else if(compare(args[i], "/offline")) {
            if(console("npm.cmd -ArgumentList 'run dev'")) {
                printf("Offline server is running\n");
            } else return printBool("Offline server failed to initiate\n", 0);
        }
    }
    return 1;
}

int main(int argc, char *argv[]) {
    if(argc >= 2) {
        if(start(argc, argv)) {
            return 0;
        } else {
            printf("Syntax error:\n");
            printErr();
            return 1;
        }
        
    } else {
        printErr();
        return 1;
    }
}