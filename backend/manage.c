#include <windows.h>
#include <stdio.h>
#include <stdbool.h>
#include <stdlib.h>

bool runDirect(char *option);
bool run(char *option[], int args);
void printError();

int main(int argc, char *argv[]) {
    if (argc < 3 && argc > 1) {
        if(strncmp(argv[1], "-m", 2) == 0) {
            runDirect("migrate");
        } else if(strncmp(argv[1], "-f", 2) == 0) {
            runDirect("flush");
        } else if(strncmp(argv[1], "-r", 2) == 0) {
            runDirect("runserver");
        } else if(strncmp(argv[1], "-M", 2) == 0) {
            runDirect("makemigrations");
        }
    } else if(argc > 2) {
        if(run(argv, argc)) {
            printf("Command executed successfully");
        } else {
            printf("an error has occured\n");
            printf("Review usage\n\n");
            printError(); 
            return 1;
        }
    } else {
        printError();
        return 1;   
    }
    return 0;
}

void printError() {
    printf("Syntax error.\nmanage <command>\n\n");
    printf("Command:\n");
    printf("manage -r //Start a local server\n");
    printf("manage -M //Make changes available for migration\n");
    printf("manage -M <app_name>//Make specific changes available for migration\n");
    printf("manage -m //Execute migration\n");
    printf("manage -f //Deletes all data from all tables\n");
}

bool runDirect(char *option) {
    char command[256]; 
    snprintf(command, sizeof(command), "python manage.py %s", option);
    if(system(command) == 0) {
        return true;
    } else return false;
}

bool run(char *option[], int args) {
    char command[256] = "python manage.py makemigrations"; 
    for(int i = 2; i < args; i++) {
        snprintf(command + strlen(command), sizeof(command) - strlen(command), " %s", option[i]);
    }
    if(system(command) == 0) {
        return true;
    } else return false;
}